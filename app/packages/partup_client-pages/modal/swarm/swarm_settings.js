Template.modal_swarm_settings.onCreated(function() {
    var template = this;
    template.subscription = template.subscribe('swarms.one', template.data.slug);
    template.networkSubscription = template.subscribe('swarms.one.networks', template.data.slug);

    template.autorun(function(c) {
        var swarm = Swarms.findOne({slug: template.data.slug});
        if (!swarm) return;
        c.stop();
        if (!swarm.isSwarmAdmin(Meteor.userId())) {
            Router.pageNotFound('swarm-settings', template.data.slug);
        }
    });
});
Template.modal_swarm_settings.events({
    'click [data-closepage]': function(event, template) {
        event.preventDefault();

        var return_route = 'swarm-settings-details';

        if (Intent.exists('swarm-settings-tribes')) {
            return_route = 'swarm-settings-tribes';
        } else if (Intent.exists('swarm-settings-quotes')) {
            return_route = 'swarm-settings-quotes';
        }

        Intent.return(return_route, {
            fallback_route: {
                name: 'swarm',
                params: {
                    slug: template.data.slug
                }
            }
        });
    }
})
