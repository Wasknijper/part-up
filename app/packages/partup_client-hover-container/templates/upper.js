Template.HoverContainer_upper.onCreated(function() {
    var userId = this.data;
    this.subscribe('users.one', userId);
});

Template.HoverContainer_upper.helpers({
    user: function() {
        var userId = Template.instance().data;
        var user = Meteor.users.findOne(userId) || null;
        if (!user) return;

        var image = Images.findOne(user.profile.image);
        if (!image) return;

        Partup.client.embed.user(user, [image]);

        return user;
    }
});
