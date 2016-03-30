/**
 * Ratings are user chosen numerical feedback to contributions
 *
 * @namespace Ratings
 * @memberOf Collection
 */
Ratings = new Mongo.Collection('ratings');

// Add indices
if (Meteor.isServer) {
    Ratings._ensureIndex('rating');
    Ratings._ensureIndex('partup_id');
    Ratings._ensureIndex('activity_id');
    Ratings._ensureIndex('contribution_id');
    Ratings._ensureIndex('upper_id');
    Ratings._ensureIndex('rated_upper_id');
}

/**
 * Find ratings for contribution
 *
 * @memberOf Ratings
 * @param {Contributions} contribution
 * @return {Mongo.Cursor}
 */
Ratings.findForContribution = function(contribution) {
    return Ratings.find({contribution_id: contribution._id});
};
