/**
 * Generate a Partup update when an activity is inserted
 */
Event.on('partups.activities.inserted', function(userId, activity) {
    if (!userId) return;

    var updateType = 'partups_activities_added';
    var updateTypeData = {
        activity_id: activity._id
    };

    var update = Partup.factories.updatesFactory.make(userId, activity.partup_id, updateType, updateTypeData);
    var updateId = Updates.insert(update);

    Activities.update({_id: activity._id}, {$set: {update_id: updateId}});

    var partup = Partups.findOneOrFail(activity.partup_id);
    var creator = Meteor.users.findOneOrFail(activity.creator_id);

    var notificationOptions = {
        type: 'partups_activities_inserted',
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
                _id: updateId
            }
        }
    };

    // Send a notification to each partner of the partup
    var uppers = partup.uppers || [];
    uppers.forEach(function(partnerId) {
        if (userId === partnerId) return;
        notificationOptions.userId = partnerId;
        Partup.server.services.notifications.send(notificationOptions);
    });

    // Send a notification to each supporter of the partup
    var supporters = partup.supporters || [];
    supporters.forEach(function(supporterId) {
        if (userId === supporterId) return;
        notificationOptions.userId = supporterId;
        Partup.server.services.notifications.send(notificationOptions);
    });
});

/**
 * Generate a Partup update when an activity is updated
 */
Event.on('partups.activities.updated', function(userId, activity, oldActivity) {
    if (!userId) return;
    if (!oldActivity.update_id) return;

    var set = {
        upper_id: userId,
        type: 'partups_activities_changed',
        updated_at: new Date()
    };

    Updates.update({_id: activity.update_id}, {$set: set});
});

/**
 * Generate a Partup update when an activity is removed
 */
Event.on('partups.activities.removed', function(userId, activity) {
    if (!userId) return;
    if (!activity.update_id) return;

    var set = {
        upper_id: userId,
        type: 'partups_activities_removed',
        updated_at: new Date()
    };

    Updates.update({_id: activity.update_id}, {$set: set});
});

/**
 * Generate a Partup update when an activity is archived
 */
Event.on('partups.activities.archived', function(userId, activity) {
    if (!userId) return;
    if (!activity.update_id) return;

    var set = {
        upper_id: userId,
        type: 'partups_activities_archived',
        updated_at: new Date()
    };

    Updates.update({_id: activity.update_id}, {$set: set});
});

/**
 * Generate a Partup update when an activity is unarchived
 */
Event.on('partups.activities.unarchived', function(userId, activity) {
    if (!userId) return;
    if (!activity.update_id) return;

    var set = {
        upper_id: userId,
        type: 'partups_activities_unarchived',
        updated_at: new Date()
    };

    Updates.update({_id: activity.update_id}, {$set: set});
});
