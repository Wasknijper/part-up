Meteor.methods({
    /**
     * Insert an Activity
     *
     * @param {string} partupId
     * @param {mixed[]} fields
     */
    'activities.insert': function(partupId, fields) {
        check(partupId, String);
        check(fields, Partup.schemas.forms.startActivities);
        var upper = Meteor.user();
        var partup = Partups.findOneOrFail({_id: partupId});

        if (!upper || !partup.hasUpper(upper._id)) throw new Meteor.Error(401, 'unauthorized');

        try {
            var activity = Partup.transformers.activity.fromForm(fields, upper._id, partupId);

            activity._id = Activities.insert(activity);

            // Update the activity count of the Partup
            Partups.update(partupId, {
                $inc: {
                    activity_count: 1
                }
            });

            return {
                _id: activity._id
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'activity_could_not_be_inserted');
        }
    },

    /**
     * Update an Activity
     *
     * @param {string} activityId
     * @param {mixed[]} fields
     */
    'activities.update': function(activityId, fields) {
        check(activityId, String);
        check(fields, Partup.schemas.forms.startActivities);
        var upper = Meteor.user();
        var activity = Activities.findOneOrFail(activityId);

        if (activity.isRemoved()) throw new Meteor.Error(404, 'activity_could_not_be_found');

        var partup = Partups.findOneOrFail(activity.partup_id);

        if (!upper || !partup.hasUpper(upper._id)) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            var updatedActivity = Partup.transformers.activity.fromForm(fields, activity.creator_id, activity.partup_id);
            updatedActivity.updated_at = new Date();

            Activities.update(activityId, {$set: updatedActivity});

            // Post system message
            Partup.server.services.system_messages.send(upper, activity.update_id, 'system_activities_updated');

            return {
                _id: activity._id
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(500, 'activity_could_not_be_updated');
        }
    },

    /**
     * Remove an Activity
     *
     * @param {string} activityId
     */
    'activities.remove': function(activityId) {
        check(activityId, String);

        var upper = Meteor.user();
        var activity = Activities.findOneOrFail(activityId);

        if (activity.isRemoved()) throw new Meteor.Error(404, 'activity_could_not_be_found');

        var partup = Partups.findOneOrFail({_id: activity.partup_id});

        if (!upper || !partup.hasUpper(upper._id)) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            activity.remove();

            // Post system message
            Partup.server.services.system_messages.send(upper, activity.update_id, 'system_activities_removed');

            return {
                _id: activity._id
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(500, 'activity_could_not_be_removed');
        }
    },

    /**
     * Unarchive an Activity
     *
     * @param  {string} activityId
     */
    'activities.unarchive': function(activityId) {
        check(activityId, String);

        var upper = Meteor.user();
        var activity = Activities.findOneOrFail(activityId);

        if (activity.isRemoved()) throw new Meteor.Error(404, 'activity_could_not_be_found');

        var partup = Partups.findOneOrFail({_id: activity.partup_id});

        if (!upper || !partup.hasUpper(upper._id)) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            Activities.update(activityId, {$set: {archived: false}});
            Partups.update(partup._id, {$inc: {activity_count: 1}});

            // Post system message
            Partup.server.services.system_messages.send(upper, activity.update_id, 'system_activities_unarchived');

            Event.emit('partups.activities.unarchived', upper._id, activity);

            return {
                _id: activity._id
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(500, 'activity_could_not_be_unarchived');
        }
    },

    /**
     * Archive an Activity
     *
     * @param  {string} activityId
     */
    'activities.archive': function(activityId) {
        check(activityId, String);

        var upper = Meteor.user();
        var activity = Activities.findOneOrFail(activityId);

        if (activity.isRemoved()) throw new Meteor.Error(404, 'activity_could_not_be_found');

        var partup = Partups.findOneOrFail({_id: activity.partup_id});

        if (!upper || !partup.hasUpper(upper._id)) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            Activities.update(activityId, {$set: {archived: true}});
            Partups.update(partup._id, {$inc: {activity_count: -1}});

            // Post system message
            Partup.server.services.system_messages.send(upper, activity.update_id, 'system_activities_archived');

            Event.emit('partups.activities.archived', upper._id, activity);

            return {
                _id: activity._id
            };
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(500, 'activity_could_not_be_archived');
        }
    },

    /**
     * Copy activities from one Partup to another
     *
     * @param  {String} fromPartupId
     * @param  {String} toPartupId
     */
    'activities.copy': function(fromPartupId, toPartupId) {
        check(fromPartupId, String);
        check(toPartupId, String);

        var upper = Meteor.user();
        if (!upper) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        // Check if both Partup IDs are valid
        Partups.findOneOrFail(fromPartupId);
        Partups.findOneOrFail(toPartupId);

        try {
            var existingActivities = Activities.find({partup_id: fromPartupId}).fetch();
            existingActivities.forEach(function(activity) {
                var newActivity = {
                    name: activity.name,
                    description: activity.description,
                    end_date: activity.end_date,
                    created_at: new Date(),
                    updated_at: new Date(),
                    creator_id: upper._id,
                    partup_id: toPartupId,
                    archived: false
                };

                Activities.insert(newActivity);
            });

            // Add number of activities to the Part-up's activity_count
            var activityCount = existingActivities.length;
            Partups.update(toPartupId, {$inc: {activity_count: activityCount}});

            return true;
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(500, 'activities_could_not_be_copied_from_partup');
        }
    },

    /**
     * Get user suggestions for a given activity
     *
     * @param {string} activityId
     * @param {Object} options
     * @param {string} options.locationId
     * @param {string} options.query
     *
     * @return {[string]}
     */
    'activities.user_suggestions': function(activityId, options) {
        check(activityId, String);
        check(options, {
            locationId: Match.Optional(String),
            query: Match.Optional(String)
        });

        this.unblock();

        var upper = Meteor.user();

        if (!upper) {
            throw new Meteor.Error(401, 'Unauthorized');
        }

        var users = Partup.server.services.matching.matchUppersForActivity(activityId, options);

        // We are returning an array of IDs instead of an object
        return users.map(function(user) {
            return user._id;
        });
    },

    /**
     * Invite someone to an activity
     *
     * @param {string} activityId
     * @param {string} email
     * @param {string} name
     */
    'activities.invite_by_email': function(activityId, fields) {
        check(fields, Partup.schemas.forms.inviteUpper);

        var inviter = Meteor.user();

        if (!inviter) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        var activity = Activities.findOneOrFail(activityId);

        if (activity.isRemoved()) throw new Meteor.Error(404, 'activity_could_not_be_found');

        var partup = Partups.findOneOrFail(activity.partup_id);

        var isAllowedToAccessPartup = !!Partups.guardedFind(inviter._id, {_id: activity.partup_id}).count() > 0;
        if (!isAllowedToAccessPartup) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        var isAlreadyInvited = !!Invites.findOne({
            activity_id: activityId,
            invitee_email: fields.email,
            type: Invites.INVITE_TYPE_ACTIVITY_EMAIL
        });

        if (isAlreadyInvited) {
            throw new Meteor.Error(403, 'email_is_already_invited_to_activity');
        }

        var accessToken = Random.secret();

        var invite = {
            type: Invites.INVITE_TYPE_ACTIVITY_EMAIL,
            activity_id: activity._id,
            inviter_id: inviter._id,
            invitee_name: fields.name,
            invitee_email: fields.email,
            message: fields.message,
            access_token: accessToken,
            created_at: new Date
        };

        Invites.insert(invite);

        Event.emit('invites.inserted.activity.by_email', inviter, partup, activity, fields.email, fields.name, fields.message, accessToken);
    },

    /**
     * Invite an existing upper to an activity
     *
     * @param {string} activityId
     * @param {string} inviteeId
     */
    'activities.invite_existing_upper': function(activityId, inviteeId) {
        check(activityId, String);
        check(inviteeId, String);

        var inviter = Meteor.user();
        if (!inviter) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        var activity = Activities.findOneOrFail(activityId);

        if (activity.isRemoved()) throw new Meteor.Error(404, 'activity_could_not_be_found');

        var invitee = Meteor.users.findOneOrFail(inviteeId);

        var isAllowedToAccessPartup = !!Partups.guardedFind(inviter._id, {_id: activity.partup_id}).count() > 0;
        if (!isAllowedToAccessPartup) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        var isAlreadyInvited = !!Invites.findOne({
            activity_id: activityId,
            invitee_id: invitee._id,
            inviter_id: inviter._id,
            type: Invites.INVITE_TYPE_ACTIVITY_EXISTING_UPPER
        });
        if (isAlreadyInvited) {
            throw new Meteor.Error(403, 'user_is_already_invited_to_activity');
        }

        var invite = {
            type: Invites.INVITE_TYPE_ACTIVITY_EXISTING_UPPER,
            activity_id: activity._id,
            inviter_id: inviter._id,
            invitee_id: invitee._id,
            created_at: new Date
        };

        Invites.insert(invite);

        // Add to the invite list of the partup
        var partup = Partups.findOneOrFail(activity.partup_id);
        if (!partup.hasInvitedUpper(invitee._id)) {
            Partups.update(partup._id, {$addToSet: {invites: invitee._id}});
        }

        Event.emit('invites.inserted.activity', inviter, partup, activity, invitee);
    }
});
