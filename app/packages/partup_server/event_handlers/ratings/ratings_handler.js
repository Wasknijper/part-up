function updateUserAverageRating(rating) {
    // TODO: Aggregation for improved speed
    var ratings = Ratings.find({rated_upper_id: rating.rated_upper_id}).fetch();
    var sumRating = ratings.reduce(function(sum, rating) { return sum + rating.rating; }, 0);
    var averageRating = sumRating / ratings.length;

    Meteor.users.update({_id: rating.rated_upper_id}, {$set: {'average_rating': averageRating}});
}

/**
 * Set the average rating when rating is inserted
 */
Event.on('partups.contributions.ratings.inserted', function(userId, rating) {
    if (!userId) return;
    updateUserAverageRating(rating);

    var contribution = Contributions.findOne(rating.contribution_id);
    if (!contribution) return Log.error('Contribution [' + rating.contribution_id + '] for Rating [' + rating._id + '] could not be found?');

    var contributionUpper = Meteor.users.findOne(contribution.upper_id);
    if (!contributionUpper) return Log.error('User [' + contribution.upper_id + '] for Contribution [' + contribution._id + '] could not be found?');

    var rater = Meteor.users.findOne(userId);
    if (!rater) return Log.error('Rater [' + userId + '] for Contribution [' + contribution._id + '] could not be found?');

    var partup = Partups.findOne(contribution.partup_id);
    if (!partup) return Log.error('Partup [' + contribution.partup_id + '] for Contribution [' + contribution._id + '] could not be found?');

    var notificationOptions = {
        userId: contributionUpper._id,
        type: 'contributions_ratings_inserted',
        typeData: {
            rater: {
                _id: rater._id,
                name: rater.profile.name,
                image: rater.profile.image
            },
            partup: {
                _id: partup._id,
                name: partup.name,
                slug: partup.slug
            },
            update: {
                _id: contribution.update_id
            }
        }
    };

    Partup.server.services.notifications.send(notificationOptions);
});

/**
 * Set the average rating when rating is updated
 */
Event.on('partups.contributions.ratings.updated', function(userId, rating) {
    if (!userId) return;
    updateUserAverageRating(rating);
});

/**
 * Update the contribution update with the new rating
 */
Event.on('partups.contributions.ratings.inserted', function(userId, rating) {
    if (!userId) return;

    var contribution = Contributions.findOne(rating.contribution_id);
    if (!contribution) return;

    var set = {
        upper_id: userId,
        type: 'partups_ratings_inserted',
        type_data: {
            activity_id: rating.activity_id,
            contribution_id: rating.contribution_id,
            rating_id: rating._id
        },
        updated_at: new Date()
    };

    Updates.update({_id: contribution.update_id}, {$set: set});
});

/**
 * Update the contribution update with the updated rating
 */
Event.on('partups.contributions.ratings.updated', function(userId, rating, oldRating) {
    if (!userId) return;

    var contribution = Contributions.findOne(rating.contribution_id);
    if (!contribution) return;

    var set = {
        upper_id: userId,
        type: 'partups_ratings_changed',
        type_data: {
            activity_id: rating.activity_id,
            contribution_id: rating.contribution_id,
            rating_id: rating._id
        },
        updated_at: new Date()
    };

    Updates.update({_id: contribution.update_id}, {$set: set});
});
