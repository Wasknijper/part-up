/**
 @namespace Partup updates factory
 @name Partup.factories.updatesFactory
 @memberof Partup.factories
 */
Partup.factories.updatesFactory = {

    /**
     * Make a new update
     *
     * @param  {int} userId
     * @param  {int} partupId
     * @param  {string} updateType
     * @param  {mixed} updateTypeData
     *
     * @return {Update}
     */
    make: function(userId, partupId, updateType, updateTypeData) {
        var update = {};

        if (!userId) throw new Meteor.Error(500, 'Required argument [userId] is missing for method [Partup.factories.updatesFactory::make]');
        if (!partupId) throw new Meteor.Error(500, 'Required argument [partupId] is missing for method [Partup.factories.updatesFactory::make]');
        if (!updateType) throw new Meteor.Error(500, 'Required argument [updateType] is missing for method [Partup.factories.updatesFactory::make]');
        if (!updateTypeData) throw new Meteor.Error(500, 'Required argument [updateTypeData] is missing for method [Partup.factories.updatesFactory::make]');

        update.upper_id = userId;
        update.partup_id = partupId;
        update.type = updateType;
        update.type_data = updateTypeData;
        update.comments_count = 0;
        update.created_at = new Date();
        update.updated_at = new Date();
        update.upper_data = [];

        return update;
    },

    /**
     * Make a new update made by the system
     *
     * @param  {int} partupId
     * @param  {string} updateType
     * @param  {mixed} updateTypeData
     *
     * @return {Update}
     */
    makeSystem: function(partupId, updateType, updateTypeData) {
        var update = {};

        if (!partupId) throw new Meteor.Error(500, 'Required argument [partupId] is missing for method [Partup.factories.updatesFactory::make]');
        if (!updateType) throw new Meteor.Error(500, 'Required argument [updateType] is missing for method [Partup.factories.updatesFactory::make]');
        if (!updateTypeData) throw new Meteor.Error(500, 'Required argument [updateTypeData] is missing for method [Partup.factories.updatesFactory::make]');

        update.upper_id = null;
        update.partup_id = partupId;
        update.system = true;
        update.type = updateType;
        update.type_data = updateTypeData;
        update.comments_count = 0;
        update.created_at = new Date();
        update.updated_at = new Date();

        return update;
    }
};
