Template.app_partup_activities_newactivity_restricted.helpers({
    partup: function() {
        return Partups.findOne(this.partupId);
    }
});

Template.app_partup_activities_newactivity_restricted.events({
    'click [data-newmessage]': function() {
        Partup.client.popup.close();

        // Use a defer to execute code after the route has changed
        Meteor.defer(function() {
            if (Router.current().route.getName() === 'partup') {
                Partup.client.popup.open({
                    id: 'new-message'
                });
            }
        });
    }
});
