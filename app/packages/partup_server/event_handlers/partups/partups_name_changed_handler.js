Event.on('partups.name.changed', function(userId, partup, value) {
    if (!userId) return;

    var updateType = 'partups_name_changed';
    var updateTypeData = {
        old_name: value.old,
        new_name: value.new
    };

    var update = Partup.factories.updatesFactory.make(userId, partup._id, updateType, updateTypeData);

    Updates.insert(update);
});
