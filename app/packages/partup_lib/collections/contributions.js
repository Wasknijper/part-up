/**
 * Contributions are added to Activities and indicate a users involvement in an Activity
 * @namespace Contributions
 * @memberOf Collection
 */
Contributions = new Meteor.Collection('contributions');

// Add indices
if (Meteor.isServer) {
    Contributions._ensureIndex('activity_id');
    Contributions._ensureIndex('upper_id');
    Contributions._ensureIndex('partup_id');
    Contributions._ensureIndex('update_id');
}

/**
 * Find contributions for an update
 *
 * @memberOf Contributions
 * @param {Update} update
 * @return {Mongo.Cursor|Void}
 */
Contributions.findForUpdate = function(update) {
    if (!update.isContributionUpdate()) return;

    return Contributions.find({_id: update.type_data.contribution_id}, {limit: 1});
};

/**
 * Find contributions for an activity
 *
 * @memberOf Contributions
 * @param {Activity} activity
 * @param {Object} parameters
 * @return {Mongo.Cursor}
 */
Contributions.findForActivity = function(activity, parameters) {
    parameters = parameters || {};

    var selector = {activity_id: activity._id};

    if (parameters.archived !== undefined) {
        selector.archived = parameters.archived ? true : {$ne: true};
    }

    return Contributions.find(selector);
};
