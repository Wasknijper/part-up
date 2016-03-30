Partup.client.notifications = {
    createTitle: function(string) {
        var user = Meteor.user();
        if (!user) return string;
        var unreadNotifications = Notifications.findForUser(user, {'new': true}).count();
        if (!unreadNotifications) return string;
        return '(' + unreadNotifications + ') ' + string;
    }
};
