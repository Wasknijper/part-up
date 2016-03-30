Template.modal_network_settings.onCreated(function() {
    var template = this;

    template.autorun(function() {
        var network = Networks.findOne({slug: template.data.networkSlug});
        if (!network) return;

        if (!network.isAdmin(Meteor.userId())) {
            Router.pageNotFound('network-settings', template.data.networkSlug);
        }
    });
});

Template.modal_network_settings.helpers({
    network: function() {
        return Networks.findOne({slug: this.networkSlug});
    }
});

Template.modal_network_settings.events({
    'click [data-closepage]': function(event, template) {
        event.preventDefault();
        Intent.return('network-settings', {
            fallback_route: {
                name: 'network-detail',
                params: {
                    slug: template.data.networkSlug
                }
            }
        });
    }
});
