var pluralize = Npm.require('pluralize');

/**
 * Find one document, throw an error if it doesn't exist.
 *
 * @method findOneOrFail
 * @return {mixed}
 * @memberof Mongo.Collection
 */
Mongo.Collection.prototype.findOneOrFail = function(selector, options) {
    var partup = this.findOne(selector, options);

    if (!partup) {
        var singular = pluralize.singular(this._name);
        var name = singular.charAt(0).toUpperCase() + singular.slice(1);
        throw new Meteor.Error(404, name + '_could_not_be_found');
    }

    return partup;
};
