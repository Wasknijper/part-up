Meteor.methods({
    /**
     * Update a user's settings
     *
     * @param {object} data
     */
    'settings.update': function(data) {
        check(data, Partup.schemas.entities.settings);

        var upper = Meteor.user();
        if (!upper) {
            throw new Meteor.Error(401, 'unauthorized');
        }

        try {
            var settings = _.extend(upper.profile.settings, data);

            Meteor.users.update(upper._id, {$set: {'profile.settings': settings}});
            Event.emit('settings.updated', upper._id, settings);

            return {_id: upper._id};
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'settings_could_not_be_updated');
        }
    },

    /**
     * (Un)subscribe user from/to subscriptions
     *
     * @param {String} subscriptionKey The name of the subscription/notification type
     * @param {Boolean} newValue To set the notification on or off
     */
    'settings.update_email_notifications': function(subscriptionKey, newValue) {
        var user = Meteor.user();
        if (!user) throw new Meteor.Error(401, 'unauthorized');

        var emailSubscriptions = user.profile.settings.email;
        if (!emailSubscriptions.hasOwnProperty(subscriptionKey)) throw new Meteor.Error(400, 'invalid_subscription');

        // Set the new value
        emailSubscriptions[subscriptionKey] = newValue;

        Meteor.users.update(user._id, {$set:{'profile.settings.email': emailSubscriptions}});
    },

    /**
     * Unsubscribe user from one email type
     *
     * @param {String} token The authentication
     * @param {String} subscriptionKey The name of the subscription/notification type
     */
    'settings.email_unsubscribe_one': function(token, subscriptionKey) {
        var user = Meteor.users.findByUnsubscribeEmailToken(token).fetch()[0];
        if (!user) throw new Meteor.Error(401, 'unauthorized');

        var emailSubscriptions = user.profile.settings.email;
        if (!emailSubscriptions) Log.debug('No subscriptions for user ' + user._id);
        if (!emailSubscriptions.hasOwnProperty(subscriptionKey)) throw new Meteor.Error(400, 'invalid_subscription');

        // Disable the requested notification
        emailSubscriptions[subscriptionKey] = false;

        Meteor.users.update(user._id, {$set:{'profile.settings.email': emailSubscriptions}});
    },

    /**
     * Unsubscribe user from all email types
     *
     * @param {String} token The authentication
     */
    'settings.email_unsubscribe_all': function(token) {
        var user = Meteor.users.findByUnsubscribeEmailToken(token).fetch()[0];
        if (!user) throw new Meteor.Error(401, 'unauthorized');

        var emailSubscriptions = user.profile.settings.email;
        if (!emailSubscriptions) Log.debug('No subscriptions for user ' + user._id);

        // Just disable all the existing notification types
        for (var key in emailSubscriptions) {
            emailSubscriptions[key] = false;
        }

        Meteor.users.update(user._id, {$set:{'profile.settings.email': emailSubscriptions}});
    }
});
