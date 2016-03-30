Meteor.publishComposite('notifications.for_upper', function(limit) {
    check(limit, Number);
    this.unblock();

    var user = Meteor.users.findOne(this.userId);
    if (!user) return;

    return {
        find: function() {
            return Notifications.findForUser(user, {}, {limit: limit});
        },
        children: [
            {find: Images.findForNotification}
        ]
    };
});
