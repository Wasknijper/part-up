/**
 @namespace Partup server matching service
 @name Partup.server.services.matching
 @memberof Partup.server.services
 */
Partup.server.services.matching = {
    /**
     * Match uppers for a given activity
     *
     * @param {String} activityId
     * @param {Object} searchOptions
     * @param {String} searchOptions.locationId
     * @param {String} searchOptions.query
     *
     * @return {[String]}
     */
    matchUppersForActivity: function(activityId, searchOptions) {
        var activity = Activities.findOneOrFail(activityId);
        var partup = Partups.findOneOrFail(activity.partup_id);

        var selector = {};
        var options = {};
        var searchOptionsProvided = searchOptions.locationId || searchOptions.query;
        var limit = searchOptionsProvided ? 30 : 10;

        if (searchOptionsProvided) {
            if (searchOptions.locationId) {
                selector['profile.location.place_id'] = searchOptions.locationId;
            }
            if (searchOptions.query) {
                // Remove accents that might have been added to the query
                searchOptions.query = mout.string.replaceAccents(searchOptions.query.toLowerCase());
                selector['profile.normalized_name'] = new RegExp('.*' + searchOptions.query + '.*', 'i');
            }
        } else {
            // Match the uppers on the tags used in the partup
            var tags = partup.tags || [];
            selector['profile.tags'] = {'$in': tags};
        }

        // Exclude the current logged in user from the results
        selector['_id'] = {'$nin': [Meteor.userId()]};

        // Exclude existing partners from result, unless a search is happening
        if (!searchOptionsProvided) {
            selector['_id'] = {'$nin': partup.uppers};
        }

        // Sort the uppers on participation_score
        options['sort'] = {'participation_score': -1};

        // Only return the IDs
        options['fields'] = {'_id': 1};

        // Limit results
        options['limit'] = limit;

        var results = Meteor.users.findActiveUsers(selector, options).fetch();

        // If there are no results, we remove some matching steps (only when no search options were provided)
        if (!searchOptionsProvided) {
            var iteration = 0;
            while (results.length === 0) {
                if (iteration === 0) delete selector['profile.tags'];

                results = Meteor.users.findActiveUsers(selector, options).fetch();
                iteration++;
            }
        }

        return results;
    },

    /**
     * Match uppers for a given network
     *
     * @param {String} networkId
     * @param {Object} searchOptions
     * @param {String} searchOptions.locationId
     * @param {String} searchOptions.query
     *
     * @return {[String]}
     */
    matchUppersForNetwork: function(networkId, searchOptions) {
        var network = Networks.findOneOrFail(networkId);

        var selector = {};
        var options = {};
        var searchOptionsProvided = searchOptions.locationId || searchOptions.query;
        var limit = searchOptionsProvided ? 30 : 10;

        if (searchOptionsProvided) {
            if (searchOptions.locationId) {
                selector['profile.location.place_id'] = searchOptions.locationId;
            }
            if (searchOptions.query) {
                // Remove accents that might have been added to the query
                searchOptions.query = mout.string.replaceAccents(searchOptions.query.toLowerCase());
                selector['profile.normalized_name'] = new RegExp('.*' + searchOptions.query + '.*', 'i');
            }
        } else {
            // Match the uppers on the tags used in the network
            var tags = network.tags || [];
            selector['profile.tags'] = {'$in': tags};
        }

        // Exclude the current logged in user from the results
        selector['_id'] = {'$nin': [Meteor.userId()]};

        // Exclude existing partners from result, unless a search is happening
        if (!searchOptionsProvided) {
            selector['_id'] = {'$nin': network.uppers};
        }

        // Sort the uppers on participation_score
        options['sort'] = {'participation_score': -1};

        // Only return the IDs
        options['fields'] = {'_id': 1};

        // Limit results
        options['limit'] = limit;

        var results = Meteor.users.findActiveUsers(selector, options).fetch();

        // If there are no results, we remove some matching steps (only when no search options were provided)
        if (!searchOptionsProvided) {
            var iteration = 0;
            while (results.length === 0) {
                if (iteration === 0) delete selector['profile.tags'];

                results = Meteor.users.findActiveUsers(selector, options).fetch();
                iteration++;
            }
        }

        return results;
    },

    /**
     * Match uppers for a given partup
     *
     * @param {String} partupId
     * @param {Object} searchOptions
     * @param {String} searchOptions.locationId
     * @param {String} searchOptions.query
     *
     * @return {[String]}
     */
    matchUppersForPartup: function(partupId, searchOptions) {
        var partup = Partups.findOneOrFail(partupId);

        var selector = {};
        var options = {};
        var searchOptionsProvided = searchOptions.locationId || searchOptions.query;
        var limit = searchOptionsProvided ? 30 : 10;

        if (searchOptionsProvided) {
            if (searchOptions.locationId) {
                selector['profile.location.place_id'] = searchOptions.locationId;
            }
            if (searchOptions.query) {
                // Remove accents that might have been added to the query
                searchOptions.query = mout.string.replaceAccents(searchOptions.query.toLowerCase());
                selector['profile.normalized_name'] = new RegExp('.*' + searchOptions.query + '.*', 'i');
            }
        } else {
            // Match the uppers on the tags used in the partup
            var tags = partup.tags || [];
            selector['profile.tags'] = {'$in': tags};
        }

        // Exclude the current logged in user from the results
        selector['_id'] = {'$nin': [Meteor.userId()]};

        // Exclude existing partners from result, unless a search is happening
        if (!searchOptionsProvided) {
            selector['_id'] = {'$nin': partup.uppers};
        }

        // Sort the uppers on participation_score
        options['sort'] = {'participation_score': -1};

        // Only return the IDs
        options['fields'] = {'_id': 1};

        // Limit results
        options['limit'] = limit;

        var results = Meteor.users.findActiveUsers(selector, options).fetch();

        // If there are no results, we remove some matching steps (only when no search options were provided)
        if (!searchOptionsProvided) {
            var iteration = 0;
            while (results.length === 0) {
                if (iteration === 0) delete selector['profile.tags'];

                results = Meteor.users.findActiveUsers(selector, options).fetch();
                iteration++;
            }
        }

        return results;
    }
};
