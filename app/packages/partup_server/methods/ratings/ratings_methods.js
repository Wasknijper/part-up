Meteor.methods({
    /**
     * Insert a rating for a specific contribution
     *
     * @param {string} contributionId
     * @param {mixed[]} fields
     */
    'ratings.insert': function(contributionId, fields) {
        check(contributionId, String);
        check(fields, Partup.schemas.forms.rating);

        var upper = Meteor.user();

        if (!upper) throw new Meteor.Error(401, 'unauthorized');

        var contribution = Contributions.findOneOrFail(contributionId);
        var activity = Activities.findOneOrFail(contribution.activity_id);

        if (!User(upper).isPartnerInPartup(contribution.partup_id)) throw new Meteor.Error(401, 'unauthorized');

        try {
            // Insert rating
            var newRating = {
                _id: Random.id(),
                created_at: new Date(),
                partup_id: contribution.partup_id,
                activity_id: contribution.activity_id,
                contribution_id: contributionId,
                rating: fields.rating,
                feedback: fields.feedback,
                upper_id: upper._id,
                rated_upper_id: contribution.upper_id
            };

            newRating = Ratings.insert(newRating);

            // Post system message
            Partup.server.services.system_messages.send(upper, activity.update_id, 'system_ratings_inserted', {update_timestamp: false});

            return newRating;
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'rating_could_not_be_inserted');
        }
    },

    /**
     * Update a rating
     *
     * @param {string} ratingId
     * @param {mixed[]} fields
     */
    'ratings.update': function(ratingId, fields) {
        check(ratingId, String);
        check(fields, Partup.schemas.forms.rating);

        var upper = Meteor.user();
        var rating = Ratings.findOneOrFail(ratingId);

        if (!upper || upper._id !== rating.upper_id) throw new Meteor.Error(401, 'unauthorized');

        try {
            var newRating = {};

            if (rating) {
                // Update rating
                newRating.rating = fields.rating;
                newRating.feedback = fields.feedback;
                newRating.updated_at = new Date();

                Ratings.update(rating, {$set: newRating});

                //NOTE: no system message is being sent to reduce number of system messages
            }

            return newRating;
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'rating_could_not_be_updated');
        }
    }
});
