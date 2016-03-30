Template.app_network_joinbutton.onCreated(function() {
    var template = this;
    template.joinToggle = new ReactiveVar(false);
});

Template.app_network_joinbutton.helpers({
    joinToggle: function() {
        return Template.instance().joinToggle.get();
    }
});

// The 'networks.joins' method handles the different possible states (uninvited or invited)
var joinNetworkOrAcceptInvitation = function(slug) {
    var network = Networks.findOne({slug: slug});
    Meteor.call('networks.join', network._id, function(error) {
        if (error) {
            Partup.client.notify.error(error.reason);
        } else {
            Partup.client.notify.success('Joined network');

            analytics.track('joined network', {
                networkId: network._id
            });
        }
    });
};

var leaveNetwork = function(template, network) {
    Meteor.call('networks.leave', network._id, function(error) {
        if (error) {
            Partup.client.notify.error(error.reason);
            return;
        }
        template.joinToggle.set(!template.joinToggle.get());

        Partup.client.notify.success(TAPi18n.__('pages-app-network-notification-left'));
        Subs.reset();
        if (network.isClosedForUpper(Meteor.user())) {
            Router.go('discover');
        }
        analytics.track('left network', {
            networkId: network._id
        });
    });
};

Template.app_network_joinbutton.events({
    'click [data-join]': function(event, template) {
        event.preventDefault();
        var user = Meteor.user();

        var proceed = function() {
            var network = template.data.network;
            Meteor.call('networks.join', network._id, function(error) {
                if (error) return Partup.client.notify.error(error.reason);
                template.joinToggle.set(!template.joinToggle.get());

                if (network.isClosed()) {
                    Partup.client.notify.success(TAPi18n.__('pages-app-network-notification-accepted_waitingforapproval'));
                } else {
                    Partup.client.notify.success(TAPi18n.__('pages-app-network-notification-joined'));
                    analytics.track('joined network', {
                        networkId: network._id
                    });
                }
            });
        };

        if (user) {
            proceed();
        } else {
            Intent.go({route: 'login'}, function(loggedInUser) {
                if (loggedInUser) proceed();
                else Partup.client.notify.error(TAPi18n.__('pages-app-network-notification-failed'));
            });
        }
    },
    'click [data-accept]': function(event, template) {
        event.preventDefault();
        var proceedAccept = function(user) {
            var network = template.data.network;
            Meteor.call('networks.join', network._id, function(error) {
                if (error) return Partup.client.notify.error(error.reason);
                template.joinToggle.set(!template.joinToggle.get());
                if (!network.isClosed()) {
                    Partup.client.notify.success(TAPi18n.__('pages-app-network-notification-joined'));
                }
            });
        }
        var user = Meteor.user();
        if (!user) {
            Intent.go({route: 'login'}, function(loggedInUser) {
                if (loggedInUser) proceedAccept(loggedInUser);
                else Partup.client.notify.error(TAPi18n.__('pages-app-network-notification-failed'));
            });
            return
        }
        proceedAccept(user);
    },
    'click [data-leave]': function(event, template) {
        event.preventDefault();
        var network = template.data.network;

        Partup.client.prompt.confirm({
            title: TAPi18n.__('pages-app-network-confirmation-title', {
                tribe: network.name
            }),
            message: TAPi18n.__('pages-app-network-confirmation-message'),
            confirmButton: TAPi18n.__('pages-app-network-confirmation-confirm-button'),
            cancelButton: TAPi18n.__('pages-app-network-confirmation-cancel-button'),
            onConfirm: function() {
                leaveNetwork(template, network);
            }
        });

    },
    'click [data-request-invite]': function(event, template) {
        event.preventDefault();

        var requestInvite = function() {
            var network = template.data.network;
            Meteor.call('networks.join', network._id, function(err) {
                if (err) {
                    console.error(err);
                    Partup.client.notify.error(TAPi18n.__(err));
                }
            });
        };

        if (Meteor.user()) {
            requestInvite();
        } else {
            Intent.go({route: 'login'}, function() {
                requestInvite();
            });
        }
    }
});
