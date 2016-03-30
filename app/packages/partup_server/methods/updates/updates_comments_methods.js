Meteor.methods({
    /**
     * Insert a Comment on an Update
     *
     * @param {string} updateId
     * @param {mixed[]} fields
     */
    'updates.comments.insert': function(updateId, fields) {
        check(updateId, String);
        check(fields, Partup.schemas.forms.updateComment);

        this.unblock();

        var upper = Meteor.user();
        if (!upper) throw new Meteor.Error(401, 'unauthorized');

        var update = Updates.findOneOrFail(updateId);

        if (!!update.system) throw new Meteor.Error(403, 'comment_is_not_allowed_on_a_system_update');

        var comment = {
            _id: Random.id(),
            content: fields.content,
            type: fields.type,
            creator: {
                _id: upper._id,
                name: upper.profile.name,
                image: upper.profile.image
            },
            created_at: new Date(),
            updated_at: new Date()
        };

        check(comment, Partup.schemas.entities.updateComment);

        var comments = update.comments || [];

        try {
            // Check if the comment is made on an activity or contribution to change update title,
            // or leave it as it is. Also leave the upper_id to the original user if it's not
            var updateFields = {
                updated_at: new Date(),
                type: update.type
            };

            if (update.type_data.activity_id && update.type_data.contribution_id) {
                updateFields.type = 'partups_contributions_comments_added';
                updateFields.upper_id = upper._id;
            } else if (update.type_data.activity_id) {
                updateFields.type = 'partups_activities_comments_added';
                updateFields.upper_id = upper._id;
            }

            Updates.update(updateId, {
                $set: updateFields,
                $push: {
                    comments: comment
                },
                $inc: {
                    comments_count: 1
                }
            });

            // Make user Supporter if its not yet an Upper or Supporter of the Partup
            var partup = Partups.findOneOrFail(update.partup_id);
            if (!partup.hasUpper(upper._id) && !partup.hasSupporter(upper._id)) {
                partup.makeSupporter(upper._id);

                Event.emit('partups.supporters.inserted', partup, upper);
            }

            // Update the new update status for all uppers
            partup.addNewUpdateToUpperData(update, Meteor.userId());

            Event.emit('updates.comments.inserted', upper, partup, update, comment);
            var mentionsWarning = Partup.helpers.mentions.exceedsLimit(fields.content);
            return {
                _id: comment._id,
                warning: mentionsWarning || undefined
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'comment_could_not_be_inserted');
        }
    },

    /**
     * Edit a comment
     *
     * @param {string} updateId
     * @param {string} commentId
     * @param {mixed[]} fields
     */
    'updates.comments.update': function(updateId, commentId, fields) {
        check(updateId, String);
        check(commentId, String);
        check(fields, Partup.schemas.forms.updateComment);

        this.unblock();

        var upper = Meteor.user();
        if (!upper) throw new Meteor.Error(401, 'unauthorized');

        try {
            var comment = Updates.findOne({
                _id: updateId,
                'comments._id': commentId,
                'comments.creator._id': upper._id
            });
            if (comment) {
                Updates.update({_id: updateId, 'comments._id': commentId}, {
                    $set: {
                        'comments.$.content': fields.content,
                        'comments.$.updated_at': new Date()
                    }
                });
            }
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'partup_comment_could_not_be_updated');
        }
    },

    /**
     * Remove a comment
     *
     * @param {string} updateId
     * @param {string} commentId
     */
    'updates.comments.remove': function(updateId, commentId) {
        check(updateId, String);
        check(commentId, String);

        this.unblock();

        var upper = Meteor.user();
        if (!upper) throw new Meteor.Error(401, 'unauthorized');

        try {
            var update = Updates.findOne({_id: updateId, 'comments._id': commentId, 'comments.creator._id': upper._id});
            if (update) {
                Updates.update({
                    _id: updateId, 'comments._id': commentId
                }, {
                    $pull: {comments: {_id: commentId}},
                    $inc: {comments_count: -1}
                });
            }
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'partup_comment_could_not_be_removed');
        }
    },

    /**
     * Reset new comments
     *
     * @param {String} updateId
     */
    'updates.reset_new_comments': function(updateId) {
        check(updateId, String);

        try {
            var update = Updates.findOne({_id: updateId, 'upper_data._id': Meteor.userId()});
            if (update && update._id) {
                Updates.update({
                    _id: updateId,
                    'upper_data._id': Meteor.userId()
                }, {$set: {'upper_data.$.new_comments': []}});
            }
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'partup_new_comments_could_not_be_reset');
        }
    }
});
