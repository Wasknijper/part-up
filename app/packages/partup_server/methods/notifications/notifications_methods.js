Meteor.methods({

    /**
     * Mark a notification as read
     *
     * @param {String} notificationId
     */
    'notifications.read': function(notificationId) {
        check(notificationId, String);

        this.unblock();

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(401, 'unauthorized');

        Notifications.update({'_id': notificationId, 'for_upper_id': user._id}, {'$set': {'new': false}});
    },

    /**
     * Mark all notifications as read
     */
    'notifications.all_read': function() {
        this.unblock();

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(401, 'unauthorized');

        Notifications.update({'for_upper_id': user._id}, {'$set': {'new': false}}, {'multi':true});
        Meteor.users.update(user._id, {'$set': {'flags.dailyDigestEmailHasBeenSent': false}});
    },

    /**
     * Mark a notification as clicked
     *
     * @param {String} notificationId
     */
    'notifications.clicked': function(notificationId) {
        check(notificationId, String);

        this.unblock();

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(401, 'unauthorized');

        Notifications.update({'_id': notificationId, 'for_upper_id': user._id}, {'$set': {'clicked': true}});
    }

});
