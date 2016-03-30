// jscs:disable
/**
 * Render a widget to view/edit a single network's uppers
 *
 * @module client-network-settings-uppers
 * @param {Number} networkSlug    the slug of the network whose uppers are rendered
 */
// jscs:enable
Template.NetworkSettingsUppers.onCreated(function() {
    var template = this;
    var userId = Meteor.userId();

    template.subscription = template.subscribe('networks.one', template.data.networkSlug, {
        onReady: function() {
            var network = Networks.findOne({slug: template.data.networkSlug});
            if (!network) Router.pageNotFound('network');
            if (network.isClosedForUpper(userId)) Router.pageNotFound('network');
        }
    });
    template.subscribe('networks.one.uppers', {slug: template.data.networkSlug});
});

Template.NetworkSettingsUppers.helpers({
    data: function() {
        var template = Template.instance();
        var network = Networks.findOne({slug: template.data.networkSlug});
        var self = this;
        return {
            network: function() {
                return network;
            },
            upper: function() {
                var upperId = self.toString();
                return Meteor.users.findOne(upperId);
            }
        };
    }
});

Template.NetworkSettingsUppers.events({
    'click [data-upper-remove]': function(e, template) {
        var btn = $(e.target).closest('[data-upper-remove]');
        var upperId = btn.data('upper-remove');
        var network = Networks.findOne({slug: template.data.networkSlug});

        Meteor.call('networks.remove_upper', network._id, upperId, function(err) {
            if (err && err.reason) {
                Partup.client.notify.error(err.reason);
                return;
            }

            Partup.client.notify.success(TAPi18n.__('network-settings-uppers-upper-removed'));
        });
    }
});
