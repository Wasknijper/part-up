Event.on('partups.end_date.changed', function(userId, partup, value) {
    if (!userId) return;

    var updateType = 'partups_end_date_changed';
    var updateTypeData = {
        old_end_date: value.old,
        new_end_date: value.new
    };

    var update = Partup.factories.updatesFactory.make(userId, partup._id, updateType, updateTypeData);

    Updates.insert(update);
});
