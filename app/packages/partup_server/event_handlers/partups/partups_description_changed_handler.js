Event.on('partups.description.changed', function(userId, partup, value) {
    if (!userId) return;

    var updateType = 'partups_description_changed';
    var updateTypeData = {
        old_description: value.old,
        new_description: value.new
    };

    var update = Partup.factories.updatesFactory.make(userId, partup._id, updateType, updateTypeData);

    Updates.insert(update);
});
