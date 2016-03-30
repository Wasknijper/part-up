Template.app_network_start.onCreated(function() {
    var template = this;
    var networkSlug = template.data.networkSlug;
    template.loaded = new ReactiveVar(false);
    template.subscribe('networks.one', networkSlug, {
        onReady: function() {
            var network = Networks.findOne({slug: networkSlug});
            if (!network) Router.pageNotFound('network');
            template.loaded.set(true);
        }
    });
    template.subscribe('networks.one.partups', {slug: networkSlug});
    template.maxTags = 5;
});

Template.app_network_start.helpers({
    data: function() {
        var template = Template.instance();
        var self = this;
        var network = Networks.findOne({slug: self.networkSlug});
        if (!network) return;
        return {
            network: function() {
                return network;
            },
            partups: function() {
                return Partups.findForNetwork(network);
            },
            activeUppers: function() {
                return {
                    uppers: network.most_active_uppers,
                    totalUppers: network.stats.upper_count,
                    networkSlug: self.networkSlug,
                    networkId: network._id
                };
            },
            activePartups: function() {
                return {
                    partups: network.most_active_partups,
                    totalPartups: network.stats.partup_count,
                    networkSlug: self.networkSlug,
                    networkId: network._id
                };
            }
        };
    },
    state: function() {
        var template = Template.instance();
        return {
            loaded: function() {
                return template.loaded.get();
            }
        };
    }
});
Template.app_network_start.events({
    'click [data-open-networksettings]': function(event, template) {
        event.preventDefault();
        var networkSlug = template.data.networkSlug;
        Intent.go({
            route: 'network-settings',
            params: {
                slug: networkSlug
            }
        });
    },
    'click [data-openchat]': function(event, template) {
        event.preventDefault();

        Partup.client.prompt.confirm({
            title: TAPi18n.__('pages-app-network-start-message-title'),
            message: TAPi18n.__('pages-app-network-start-message-description'),
            confirmButton: TAPi18n.__('pages-app-network-start-message-confirmbutton'),
            onConfirm: function() {

            }
        });
    }
});
