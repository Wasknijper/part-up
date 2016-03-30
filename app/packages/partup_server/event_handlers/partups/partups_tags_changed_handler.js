Event.on('partups.tags.changed', function(userId, partup, value) {
    if (!userId) return;

    var changes = Partup.services.tags.calculateChanges(value.old, value.new);

    changes.forEach(function(change) {
        var updateType = false;
        var updateTypeData = {};

        if (change.type === 'changed') {
            updateType = 'partups_tags_changed';
            updateTypeData = {
                old_tag: change.old_tag,
                new_tag: change.new_tag
            }
        }

        if (change.type === 'added') {
            updateType = 'partups_tags_added';
            updateTypeData = {
                new_tag: change.new_tag
            }
        }

        if (change.type === 'removed') {
            updateType = 'partups_tags_removed';
            updateTypeData = {
                old_tag: change.old_tag
            }
        }

        if (updateType) {
            var update = Partup.factories.updatesFactory.make(userId, partup._id, updateType, updateTypeData);
            Updates.insert(update);

            Log.debug('Update generated for Partup [' + partup._id + '] with type [' + updateType + '].');
        }
    });
});
