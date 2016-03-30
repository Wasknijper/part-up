Template.AdminCreateTribe.onCreated(function() {
    this.subscribe('networks.admin_all');
    this.currentNetwork = new ReactiveVar('');
});

var placeholders = {
    'name': function() {
        return TAPi18n.__('pages-modal-create-details-form-name-placeholder');
    }
};

var privacyTypeOptions = [
    {
        label: 'Public',
        value: 1
    },
    {
        label: 'Invite',
        value: 2
    },
    {
        label: 'Closed',
        value: 3
    },
];

Template.AdminCreateTribe.helpers({
    privacyTypeOptions: function() {
        return privacyTypeOptions;
    },
    networks: function() {
        return Networks.find();
    },
    privacyType: function(type) {
        return _.findWhere(privacyTypeOptions, {value: type}).label;
    },
    upperCount: function(network) {
        return network.uppers.length;
    },
    currentNetwork: function() {
        return Template.instance().currentNetwork;
    },
    getNetworkAdmin: function() {
        var user = Meteor.users.findOne(this.admin_id);
        return user;
    }
});

/*************************************************************/
/* Widget events */
/*************************************************************/
Template.AdminCreateTribe.events({
    'click [data-closepage]': function eventClickClosePage (event, template) {
        event.preventDefault();
        Intent.return('create-network');
    },
    'click [data-network-edit]': function(event, template) {
        var networkSlug = $(event.currentTarget).data('network-edit');
        template.currentNetwork.set(networkSlug);
        Partup.client.popup.open({
            id: 'popup.admin-edit-tribe'
        });
    },
    'click [data-network-remove]': function(event, template) {
        var networkId = $(event.currentTarget).data('network-remove');
        Meteor.call('networks.remove', networkId, function(error) {
            if (error) {
                Partup.client.notify.error(TAPi18n.__('pages-modal-admin-createtribe-error-' + error.reason));
                return;
            }
            Partup.client.notify.success('Tribe removed correctly');
        });
    }
});

/*************************************************************/
/* Widget form hooks */
/*************************************************************/
AutoForm.hooks({
    createNetworkForm: {
        onSubmit: function(insertDoc, updateDoc, currentDoc) {
            var self = this;

            Meteor.call('networks.insert', insertDoc, function(error, networkId) {
                if (error) {
                    Partup.client.notify.error(TAPi18n.__('pages-modal-admin-createtribe-error-' + error.reason));
                    return;
                }
                Partup.client.notify.success('Tribe inserted correctly');
            });

            return false;
        }
    }
});

