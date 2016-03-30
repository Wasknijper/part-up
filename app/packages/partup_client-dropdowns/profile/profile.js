Template.DropdownProfile.onCreated(function() {
    var template = this;
    template.windowHeight = new ReactiveVar($(window).height());
    template.resizeHandler = function(e) {
        var windowHeight = $(window).height();
        template.windowHeight.set(windowHeight);
    };
    $(window).on('resize', template.resizeHandler);
    template.currentNetwork = new ReactiveVar();
    template.disableUp = new ReactiveVar(true);
    template.disableDown = new ReactiveVar(false);

    // Current user
    var user = Meteor.user();

    // Placeholder for states (such as loading states)
    template.states = {
        loadingUpperpartups: new ReactiveVar(false),
        loadingSupporterpartups: new ReactiveVar(false),
        loadingNetworks: new ReactiveVar(false)
    };

    // Placeholder for results
    template.results = {
        upperpartups: new ReactiveVar([]),
        supporterpartups: new ReactiveVar([]),
        networks: new ReactiveVar([])
    };

    // Partups headers for http calls
    var query = {
        token: Accounts._storedLoginToken(),
        archived: false
    };

    // Dropdown opened state + callback
    template.dropdownOpen = new ReactiveVar(false, function(a, hasBeenOpened) {
        if (!hasBeenOpened) return;

        // (Re)load upper partups
        template.states.loadingUpperpartups.set(true);
        HTTP.get('/users/' + user._id + '/upperpartups' + mout.queryString.encode(query), function(error, response) {
            if (error || !response.data.partups || response.data.partups.length === 0) {
                template.states.loadingUpperpartups.set(false);
                return;
            }

            var result = response.data;

            template.results.upperpartups.set(result.partups.map(function(partup) {
                Partup.client.embed.partup(partup, result['cfs.images.filerecord'], result.networks, result.users);

                return partup;
            }));
        });

        // (Re)load supporter partups
        template.states.loadingSupporterpartups.set(true);
        HTTP.get('/users/' + user._id + '/supporterpartups' + mout.queryString.encode(query), function(error, response) {
            if (error || !response.data.partups || response.data.partups.length === 0) {
                template.states.loadingSupporterpartups.set(false);
                return;
            }

            var result = response.data;

            template.results.supporterpartups.set(result.partups.map(function(partup) {
                Partup.client.embed.partup(partup, result['cfs.images.filerecord'], result.networks, result.users);

                return partup;
            }));
        });

        // (Re)load networks
        template.states.loadingNetworks.set(true);
        HTTP.get('/users/' + user._id + '/networks' + mout.queryString.encode(query), function(error, response) {
            if (error || !response.data.networks || response.data.networks.length === 0) {
                template.states.loadingNetworks.set(false);
                return;
            }

            var result = response.data;

            template.results.networks.set(result.networks.map(function(network) {
                Partup.client.embed.network(network, result['cfs.images.filerecord'], result.users);

                return network;
            }));
        });
    });

    var oldJoinedNetworks;
    template.autorun(function() {
        var joinedNetworks = user.networks || false;
        if (!joinedNetworks) return;

        Tracker.nonreactive(function() {
            if (joinedNetworks !== oldJoinedNetworks) {
                template.currentNetwork.set(undefined);
                oldJoinedNetworks = joinedNetworks;
            }
        });

    });

});

Template.DropdownProfile.onRendered(function() {
    var template = this;
    ClientDropdowns.addOutsideDropdownClickHandler(template, '[data-clickoutside-close]', '[data-toggle-menu=profile]');
    Router.onBeforeAction(function(req, res, next) {
        template.dropdownOpen.set(false);
        next();
    });
});

Template.DropdownProfile.onDestroyed(function() {
    var template = this;
    $(window).off('resize', template.resizeHandler);
    ClientDropdowns.removeOutsideDropdownClickHandler(template);
});

var sortPartups = function(partups, user) {
    return lodash.sortByOrder(partups, function(partup) {
        var upper_data = lodash.find(partup.upper_data, '_id', user._id);
        if (upper_data && upper_data.new_updates) {
            return upper_data.new_updates.length;
        } else {
            return 0;
        }
    }, ['desc']);
};

Template.DropdownProfile.events({
    'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler,
    'click [data-logout]': function eventClickLogout (event, template) {
        event.preventDefault();
        Meteor.logout();
    },
    'click [data-select-network]': function changeNetwork (event, template) {
        event.preventDefault();
        var networkId = $(event.currentTarget).data('select-network') || undefined;
        template.currentNetwork.set(networkId);
    },
    'click [data-settings]': function openSettings (event, template) {
        event.preventDefault();
        Intent.go({route: 'profile-settings', params:{_id: Meteor.userId()}});
    },
    'click [data-down]': function(event, template) {
        event.preventDefault();
        var list = $(template.find('[data-list]'));
        list.scrollTop(list.scrollTop() + 200);
        template.disableUp.set(false);
        if (list[0].scrollHeight - list.height() === list.scrollTop()) {
            template.disableDown.set(true);
        }
    },
    'click [data-up]': function(event, template) {
        event.preventDefault();
        var list = $(template.find('[data-list]'));
        list.scrollTop(list.scrollTop() - 200);
        template.disableDown.set(false);
        if (list.scrollTop() === 0) {
            template.disableUp.set(true);
        }
    }
});

Template.DropdownProfile.helpers({
    notifications: function() {
        return Notifications.findForUser(Meteor.user());
    },

    menuOpen: function() {
        return Template.instance().dropdownOpen.get();
    },

    upperPartups: function() {
        var user = Meteor.user();
        if (!user) return [];

        var networkId = Template.instance().currentNetwork.get() || undefined;
        var allPartups = Template.instance().results.upperpartups.get();

        if (!networkId) return sortPartups(allPartups, user);

        var partupsInNetwork = lodash.filter(allPartups, function(partup) {
            return partup.network_id === networkId;
        });

        return sortPartups(partupsInNetwork, user);
    },

    supporterPartups: function() {
        var user = Meteor.user();
        if (!user) return [];

        var networkId = Template.instance().currentNetwork.get() || undefined;
        var allPartups = Template.instance().results.supporterpartups.get();

        if (!networkId) return sortPartups(allPartups, user);

        var partupsInNetwork = lodash.filter(allPartups, function(partup) {
            return partup.network_id === networkId;
        });

        return sortPartups(partupsInNetwork, user);
    },

    newUpdates: function() {
        if (!this.upper_data) return;
        var count = null;
        this.upper_data.forEach(function(upperData) {
            if (upperData._id === Meteor.userId()) {
                count = upperData.new_updates.length;
            }
        });
        return count;
    },

    user: function() {
        return Meteor.user();
    },

    networkId: function() {
        return Template.instance().currentNetwork.get();
    },

    networks: function() {
        return Template.instance().results.networks.get();
    },

    maxTabs: function() {
        var number = 8;
        var windowHeight = Template.instance().windowHeight.get();
        if (windowHeight < 610) {
            number = 5;
        }
        return number;
    },

    selectedNetwork: function() {
        var networkId = Template.instance().currentNetwork.get();

        var network = lodash.find(Template.instance().results.networks.get(), {_id: networkId});
        return network;
    },
    disableUp: function() {
        return Template.instance().disableUp.get();
    },
    disableDown: function() {
        return Template.instance().disableDown.get();
    }
});
