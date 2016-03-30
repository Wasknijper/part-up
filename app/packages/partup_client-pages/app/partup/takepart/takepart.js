Template.app_partup_takepart.helpers({
    partup: function() {
        return Partups.findOne({_id: this.partupId});
    }
});

Template.app_partup_takepart.events({
    'click [data-newmessage]': function(event) {
        event.preventDefault();
        Partup.client.popup.close();

        var href = event.currentTarget.getAttribute('href');
        var userId = Meteor.userId();
        var proceed = function() {
            Router.go(href);
            Meteor.defer(function() {
                if (Router.current().route.getName() === 'partup') {
                    Partup.client.popup.open({
                        id: 'new-message'
                    });
                }
            });
        };

        if (!userId) {
            Intent.go({route: 'login'}, function(user) {
                if (user) proceed();
            });
        } else {
            proceed();
        }
    }
});
