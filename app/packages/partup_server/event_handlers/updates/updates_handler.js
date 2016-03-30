var d = Debug('event_handlers:updates_handler');

/**
 * Generate a notification for the partners and supporters in a partup when a message is created
 */
Event.on('partups.updates.inserted', function(userId, update) {
    var partup = Partups.findOneOrFail(update.partup_id);
    update = new Update(update);

    // Update the new_updates list for all users of this partup
    partup.addNewUpdateToUpperData(update, userId);

    // Create a clean set of new_comments list for the update
    var updateUpperData = [];
    partup.getUsers().forEach(function(upperId) {
        updateUpperData.push({
            _id: upperId,
            new_comments:[]
        });
    });
    Updates.update({_id:update._id}, {$set: {upper_data: updateUpperData}});

    if (update.type === 'partups_message_added' && !update.system) {
        var creator = Meteor.users.findOneOrFail(update.upper_id);

        var mentions = Partup.helpers.mentions.extract(update.type_data.new_value);
        var mentionedUsersIds = lodash.union(lodash.flatten(mentions.map(function(mention) {
            if (mention.type === 'group') return mention.users;
            if (mention.type === 'single') return [mention._id];
            return [];
        })));

        var notificationOptions = {
            type: 'partups_messages_inserted',
            typeData: {
                creator: {
                    _id: creator._id,
                    name: creator.profile.name,
                    image: creator.profile.image
                },
                partup: {
                    _id: partup._id,
                    name: partup.name,
                    slug: partup.slug
                },
                update: {
                    _id: update._id
                }
            }
        };

        // Send a notification to each partner of the partup
        var uppers = partup.uppers || [];
        uppers.forEach(function(partnerId) {
            if (userId === partnerId || mentionedUsersIds.indexOf(partnerId) > -1) return;
            notificationOptions.userId = partnerId;
            Partup.server.services.notifications.send(notificationOptions);
        });

        // Send a notification to each supporter of the partup
        var supporters = partup.supporters || [];
        supporters.forEach(function(supporterId) {
            if (userId === supporterId || mentionedUsersIds.indexOf(supporterId) > -1) return;
            notificationOptions.userId = supporterId;
            Partup.server.services.notifications.send(notificationOptions);
        });
    }
});
