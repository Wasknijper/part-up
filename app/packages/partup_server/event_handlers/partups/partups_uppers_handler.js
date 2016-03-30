/**
 * Generate an Update in a Partup when there is a new Upper.
 */
Event.on('partups.uppers.inserted', function(partupId, upperId) {
    var updateType = 'partups_uppers_added';
    var updateTypeData = {};

    var update = Partup.factories.updatesFactory.make(upperId, partupId, updateType, updateTypeData);

    // TODO: Validation

    Updates.insert(update);
});
