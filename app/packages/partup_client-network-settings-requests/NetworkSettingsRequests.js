/**
 * Render a widget to view/edit a single network's requests
 *
 * @param {Number} networkSlug
 */
Template.NetworkSettingsRequests.onCreated(function() {
    var template = this;
    var userId = Meteor.userId();

    template.subscribe('networks.one', template.data.networkSlug, {
        onReady: function() {
            var network = Networks.findOne({slug: template.data.networkSlug});
            if (!network) Router.pageNotFound('network');
            if (network.isClosedForUpper(userId)) Router.pageNotFound('network');
        }
    });
    template.subscribe('networks.one.pending_uppers', template.data.networkSlug);
});

Template.NetworkSettingsRequests.helpers({
    userRequests: function() {
        // var requests = [];
        var network = Networks.findOne({slug: this.networkSlug});
        if (!network) return;
        var pending = network.pending_uppers || [];
        return Meteor.users.find({_id: {$in: pending}}).fetch();
    }
});

Template.NetworkSettingsRequests.events({
    'click [data-request-accept]': function(e, template) {
        var userId = $(e.currentTarget).data('user-id');
        var network = Networks.findOne({slug: template.data.networkSlug});
        Meteor.call('networks.accept', network._id, userId, function(err) {
            if (err) {
                Partup.client.notify.error(err.reason);
                return;
            }

            Partup.client.notify.success(TAPi18n.__('network-settings-requests-accepted'));
        });
    },
    'click [data-request-reject]': function(e, template) {
        var userId = $(e.target).closest('[data-request-reject]').data('user-id');
        var network = Networks.findOne({slug: template.data.networkSlug});
        Meteor.call('networks.reject', network._id, userId, function(err) {
            if (err) {
                Partup.client.notify.error(err.reason);
                return;
            }

            Partup.client.notify.success(TAPi18n.__('network-settings-requests-rejected'));
        });
    }
});
