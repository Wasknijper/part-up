/**
 * @namespace Users
 * @name Users
 */

//N.B.: Meteor.users is already defined by meteor

// Deny updating the profile object from client
Meteor.users.deny({
    update: function() {
        return true;
    }
});

//user fields to all users
var publicUserFields = {
    'profile.description': 1,
    'profile.facebook_url': 1,
    'profile.image': 1,
    'profile.instagram_url': 1,
    'profile.linkedin_url': 1,
    'profile.location': 1,
    'profile.name': 1,
    'profile.skype': 1,
    'profile.tags': 1,
    'profile.twitter_url': 1,
    'profile.website': 1,
    'profile.meurs.results': 1,
    'profile.meurs.fetched_results': 1,
    'profile.tiles': 1,
    'status.online': 1,
    'partups': 1,
    'upperOf': 1,
    'supporterOf': 1,
    'average_rating': 1,
    'networks': 1,
    'completeness': 1,
    'participation_score': 1
};

//user fields exposed to logged in user
var privateUserFields = mout.object.merge({
    'emails': 1,
    'profile.phonenumber': 1,
    'profile.settings': 1,
    'pending_networks': 1,
    'roles': 1
}, publicUserFields);

// Add indices
if (Meteor.isServer) {
    Meteor.users._ensureIndex('participation_score');
}

/**
 * Find a user and expose it's private fields
 *
 * @memberOf Meteor.users
 * @param {String} userId
 * @return {Mongo.Cursor}
 */
Meteor.users.findSinglePrivateProfile = function(userId) {
    return Meteor.users.find({_id: userId}, {fields: privateUserFields});
};

/**
 * Find a user and expose it's public fields
 *
 * @memberOf Meteor.users
 * @param {String} userId
 * @return {Mongo.Cursor}
 */
Meteor.users.findSinglePublicProfile = function(userId) {
    return Meteor.users.find({_id: userId}, {fields: publicUserFields});
};

/**
 * Find users and expose their public fields
 *
 * @memberOf Meteor.users
 * @param {[String]} userIds
 * @param {Object} options
 * @param {Object} parameters
 * @return {Mongo.Cursor}
 */
Meteor.users.findMultiplePublicProfiles = function(userIds, options, parameters) {
    var options = options || {};
    var parameters = parameters || {};
    var selector = {_id: {$in: userIds}};

    if (parameters.onlyActive) selector.deactivatedAt = {$exists: false};

    options.fields = publicUserFields;

    options.limit = parameters.count ? undefined : parseInt(options.limit) || undefined;
    options.sort = parameters.count ? undefined : options.sort || undefined;

    return Meteor.users.find(selector, options);
};

/**
 * Find the uppers in a network
 *
 * @memberOf Meteor.users
 * @param {Network} network
 * @return {Mongo.Cursor}
 */
Meteor.users.findUppersForNetwork = function(network, options, parameters) {
    var uppers = network.uppers || [];

    var parameters = parameters || {};
    parameters.onlyActive = true;

    return this.findMultiplePublicProfiles(uppers, options, parameters);
};

/**
 * Find the uppers of a partup
 *
 * @memberOf Meteor.users
 * @param {Partup} partup
 * @return {Mongo.Cursor}
 */
Meteor.users.findUppersForPartup = function(partup) {
    var uppers = partup.uppers || [];
    return Meteor.users.findMultiplePublicProfiles(uppers);
};

/**
 * Find the supporters of a partup
 *
 * @memberOf Meteor.users
 * @param {Partup} partup
 * @return {Mongo.Cursor}
 */
Meteor.users.findSupportersForPartup = function(partup) {
    var supporters = partup.supporters || [];
    return Meteor.users.findMultiplePublicProfiles(supporters);
};

/**
 * Find the user of an update
 *
 * @memberOf Meteor.users
 * @param {Update} update
 * @return {Mongo.Cursor}
 */
Meteor.users.findUserForUpdate = function(update) {
    return Meteor.users.findSinglePublicProfile(update.upper_id);
};

/**
 * Find the user of a rating
 *
 * @memberOf Meteor.users
 * @param {Ratings} rating
 * @return {Mongo.Cursor}
 */
Meteor.users.findForRating = function(rating) {
    return Meteor.users.findSinglePublicProfile(rating.upper_id);
};

/**
 * Find the user of a contribution
 *
 * @memberOf Meteor.users
 * @param {Contributions} contribution
 * @return {Mongo.Cursor}
 */
Meteor.users.findForContribution = function(contribution) {
    return Meteor.users.findSinglePublicProfile(contribution.upper_id);
};

/**
 * Safely find users that are not disabled
 *
 * @memberOf Meteor.users
 * @param {Contributions} contribution
 * @return {Mongo.Cursor}
 */
Meteor.users.findActiveUsers = function(selector, options) {
    selector = selector || {};
    options = options || {};
    if (!options.fields) {
        options.fields = publicUserFields;
    }

    selector.deactivatedAt = {$exists: false};
    options.fields = publicUserFields;
    return Meteor.users.find(selector, options);
};

/**
 * Find for admin list
 *
 * @memberOf Meteor.users
 * @param {Contributions} contribution
 * @return {Mongo.Cursor}
 */
Meteor.users.findForAdminList = function(selector, options) {
    selector = selector || {};

    var limit = options.limit;
    var page = options.page;

    return Meteor.users.find(selector, {
        fields:{'_id':1, 'profile.name':1, 'profile.phonenumber':1, 'registered_emails':1, 'createdAt':1, 'deactivatedAt':1},
        sort: {'createdAt': -1},
        limit: limit,
        skip: limit * page
    });
};

Meteor.users.findStatsForAdmin = function() {
    var results = {
        'servicecounts': {
            'password': Meteor.users.find({'services.password':{'$exists':true}}).count(),
            'linkedin': Meteor.users.find({'services.linkedin':{'$exists':true}}).count(),
            'facebook': Meteor.users.find({'services.facebook':{'$exists':true}}).count()
        },
        'counts': {
            'users': Meteor.users.find({}).count(),
            'notifications': Notifications.find({}).count(),
            'activities': Activities.find({}).count(),
            'contributions': Contributions.find({}).count(),
            'ratings': Ratings.find({}).count()
        }
    };
    return results;
};

/**
 * Find by token
 *
 * @memberOf Meteor.users
 * @param {String} token
 * @return {Mongo.Cursor}
 */
Meteor.users.findByUnsubscribeEmailToken = function(token) {
    return Meteor.users.find({'profile.settings.unsubscribe_email_token': token}, {'_id': 1, 'profile.settings.email': 1}, {});
};

/**
 * User model (not a constructor, unlike all other entity models)
 * @ignore
 */
User = function(user) {

    return {

        /**
         * Get the first name of a user
         *
         * @return {String}
         */
        getFirstname: function() {
            if (!user) return;
            if (!user.profile) return;

            var name = user.profile.name || user.name;
            if (!name) return;

            if (name.match(/.*\s.*/)) {
                return name.split(' ')[0];
            } else {
                return name;
            }
        },

        isPartnerInPartup: function(partupId) {
            var upperOf = user.upperOf || [];
            return upperOf.indexOf(partupId) > -1;
        },

        /**
         * Get user's locale code
         */
        getLocale: function() {
            if (!user) return 'nl';

            var locale = mout.object.get(user, 'profile.settings.locale') || 'nl';

            if (!mout.object.has(TAPi18n.getLanguages(), locale)) {
                locale = 'nl';
            }

            return locale;
        },

        /**
         * Get users email address
         *
         * @return {String}
         */
        getEmail: function() {
            if (!user) return undefined;
            if (user.emails && user.emails.length > 0) {
                return user.emails[0].address;
            }
            if (user.registered_emails && user.registered_emails.length > 0) {
                return user.registered_emails[0].address;
            }
        },

        /**
         * Check if user is active
         *
         * @return {Boolean}
         */
        isActive: function() {
            if (!user) return false;
            if (user.deactivatedAt) {
                return false;
            } else {
                return true;
            }
        },

        /**
         * Check if user is admin
         *
         * @return {Boolean}
         */
        isAdmin: function() {
            if (!user) return false;
            if (!user.roles) return false;
            return user.roles.indexOf('admin') > -1;
        },

        /**
         * Check if user is admin of some tribe
         *
         * @return {Boolean}
         */
        isSomeNetworkAdmin: function() {
            if (!user) return false;
            return !!Networks.findOne({admin_id: user._id});
        },

        /**
         * Check if user is admin of a swarm
         *
         * @return {Boolean}
         */
        isSwarmAdmin: function(swarmId) {
            if (!user) return false;
            return !!Swarms.findOne({_id: swarmId, admin_id: user._id});
        },

        /**
         * Get the user score
         *
         * @return {Number} participation score rounded
         */
        getReadableScore: function() {
            if (!user) return undefined;

            var score = user.participation_score ? user.participation_score : 0;

            // For design purposes, we only want to display
            // a max value of 99 and a min value of 10,
            // every number should be a natural one
            score = Math.min(99, score);
            score = Math.max(10, score);
            score = Math.round(score);

            return score;
        },
        /**
         * Check if user profile is filled enough to view the about page
         *
         * @return {Boolean}
         */
        aboutPageIsViewable: function() {
            var currentUserId = Meteor.userId();

            if (user._id === currentUserId) return true;

            if (user.profile.meurs && user.profile.meurs.results && user.profile.meurs.fetched_results) return true;

            if (user.profile.tiles && user.profile.tiles.length > 0) return true;

            return false;
        }
    };
};
