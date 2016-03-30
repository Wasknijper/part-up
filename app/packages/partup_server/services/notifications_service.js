var d = Debug('services:notifications');

// Check notifications.md for all active notifications

/**
 @namespace Partup server notifications service
 @name Partup.server.services.notifications
 @memberof Partup.server.services
 */
Partup.server.services.notifications = {
    /**
     * Make a new notification
     *
     * @param  {object} options
     */
    send: function(options) {
        options = options || {};
        var notification = {};

        if (!options.userId) throw new Meteor.Error('Required argument [options.userId] is missing for method [Partup.server.services.notifications::send]');
        if (!options.type) throw new Meteor.Error('Required argument [options.type] is missing for method [Partup.server.services.notifications::send]');
        if (!options.typeData) throw new Meteor.Error('Required argument [options.typeData] is missing for method [Partup.server.services.notifications::send]');

        // If conversation notification, check if there is already an unread notification from the same user on this topic
        if (options.type === 'partups_new_comment_in_involved_conversation') {
            var isAlreadyNotified = Notifications.findOne({
                for_upper_id: options.userId,
                new: true,
                'type_data.update._id': options.typeData.update._id,
                'type_data.commenter._id': options.typeData.commenter._id
            });
            // Nothing else to do here
            if (isAlreadyNotified) return;
        }

        notification.for_upper_id = options.userId;
        notification.type = options.type;
        notification.type_data = options.typeData;
        notification.created_at = new Date();
        notification.new = true;
        notification.clicked = false;

        d('Notification created for user [' + notification.for_upper_id + '] with type [' + notification.type + ']');

        Notifications.insert(notification);
    }
};
