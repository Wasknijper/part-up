Event.on('partups.location.changed', function(userId, partup, value) {
    if (!userId) return;

    var updateType = 'partups_location_changed';
    var updateTypeData = {
        old_location: value.old,
        new_location: value.new
    };

    var update = Partup.factories.updatesFactory.make(userId, partup._id, updateType, updateTypeData);

    Updates.insert(update);
});
