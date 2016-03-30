Template.HoverContainer_upperList.onCreated(function() {
    this.userIds = this.data.split(',') || [];
    this.subscribe('users.by_ids', this.userIds);
});

Template.HoverContainer_upperList.helpers({
    users: function() {
        var userIds = Template.instance().userIds;
        var users = Meteor.users.find({_id: {$in: userIds}}).fetch() || [];
        return lodash.chain(users)
            .map(function(user) {
                var image = Images.findOne(user.profile.image);
                if (!image) return false;

                Partup.client.embed.user(user, [image]);
                return user;
            })
            .compact()
            .value();
    },
    slice: function(arr, amount) {
        return arr.slice(0, amount);
    },
    restAmount: function(amountOfUsers, max) {
        return amountOfUsers > max ? amountOfUsers - max : amountOfUsers;
    }
});
