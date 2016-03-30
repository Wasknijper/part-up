/**
 * Swarm model
 *
 * @memberOf Swarms
 */
var Swarm = function(document) {
    _.extend(this, document);
};

/**
 * Check if given user is admin of this swarm
 *
 * @memberOf Swarms
 * @param {String} userId the user id of the user to be checked
 * @return {Boolean}
 */
Swarm.prototype.isSwarmAdmin = function(userId) {
    if (!userId) return false;
    return mout.lang.isString(userId) && (userId === this.admin_id);
};

/**
 * Check if given user is the super admin or admin of this swarm
 *
 * @memberOf Swarms
 * @param {String} userId the user id of the user to be checked
 * @return {Boolean}
 */
Swarm.prototype.isAdmin = function(userId) {
    if (!userId) return false;
    var user = Meteor.users.findOne({_id: userId});
    if (!user) return false;
    return this.isSwarmAdmin(userId) || User(user).isAdmin();
};

/**
 * Add network to swarm
 *
 * @memberOf Swarms
 * @param {String} networkId the id of the network to be added to the swarm
 */
Swarm.prototype.addNetwork = function(networkId) {
    Swarms.update(this._id, {$addToSet: {networks: networkId}});
    Networks.update(networkId, {$addToSet: {swarms: this._id}});
};

/**
 * Remove network from swarm
 *
 * @memberOf Swarms
 * @param {String} networkId the id of the network that is being removed from the swarm
 */
Swarm.prototype.removeNetwork = function(networkId) {
    Swarms.update(this._id, {$pull: {networks: networkId}});
    Networks.update(networkId, {$pull: {swarms: this._id}});
};

/**
 * Increase email share count
 *
 * @memberOf Swarms
 */
Swarm.prototype.increaseEmailShareCount = function() {
    Swarms.update({_id: this._id}, {$inc: {'shared_count.email': 1}});
};

/**
 Swarms are entities that group networks (also known as tribes)
 @namespace Swarms
 */
Swarms = new Mongo.Collection('swarms', {
    transform: function(document) {
        return new Swarm(document);
    }
});

// Add indices
if (Meteor.isServer) {
    Swarms._ensureIndex('slug');
    Swarms._ensureIndex('admin_id');
}

/**
 * Modified version of Collection.find that makes
 * sure the user (or guest) can only retrieve
 * fields that are publicly available
 *
 * @memberOf Swarms
 * @param {Object} selector
 * @param {Object} options
 * @return {Cursor}
 */
Swarms.guardedMetaFind = function(selector, options) {
    selector = selector || {};
    options = options || {};

    // Make sure that if the callee doesn't pass the fields
    // key used in the options parameter, we set it with
    // the _id fields, so we do not publish all fields
    // by default, which would be a security issue
    options.fields = {_id: 1};

    // The fields that should be available on each swarm
    var unguardedFields = ['name', 'title', 'introduction', 'description', 'slug', 'image', 'networks', 'quotes'];

    unguardedFields.forEach(function(unguardedField) {
        options.fields[unguardedField] = 1;
    });

    return this.find(selector, options);
};

/**
 * Swarms collection helpers
 *
 * @memberOf Swarms
 * @param {String} userId the user id of the current user
 * @param {Object} selector the requested selector
 * @param {Object} options options object to be passed to mongo find (limit etc.)
 * @return {Mongo.Cursor}
 */
Swarms.guardedFind = function(userId, selector, options) {
    if (Meteor.isClient) return this.find(selector, options);

    selector = selector || {};
    options = options || {};

    // The fields that should never be exposed
    var guardedFields = [
        //
    ];
    options.fields = options.fields || {};

    guardedFields.forEach(function(guardedField) {
        options.fields[guardedField] = 0;
    });

    return this.find(selector, options);
};
