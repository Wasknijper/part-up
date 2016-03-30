Event.on('partups.image.changed', function(userId, partup, value) {
    if (!userId) return;

    var updateType = 'partups_image_changed';
    var updateTypeData = {
        old_image: value.old,
        new_image: value.new
    };

    var update = Partup.factories.updatesFactory.make(userId, partup._id, updateType, updateTypeData);

    Updates.insert(update);
});
