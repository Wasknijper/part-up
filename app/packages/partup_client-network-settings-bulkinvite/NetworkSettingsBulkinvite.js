/**
 * Invite multiple uppers to a network at once, using a CSV file
 *
 * @module client-network-settings-bulkinvite
 * @param {Number} networkSlug    the slug of the network
 */

 Template.NetworkSettingsBulkinvite.onCreated(function() {
     var template = this;
     var userId = Meteor.userId();

     template.subscribe('networks.one', template.data.networkSlug, {
         onReady: function() {
             var network = Networks.findOne({slug: template.data.networkSlug});
             if (!network) Router.pageNotFound('network');
             if (network.isClosedForUpper(userId)) Router.pageNotFound('network');
         }
     });

     template.submitting = new ReactiveVar(false);
     template.csv_invalid = new ReactiveVar(false);
     template.csv_too_many_addresses = new ReactiveVar(false);
     template.parsing = new ReactiveVar(false);
     template.invitees = new ReactiveVar([]);

 });

Template.NetworkSettingsBulkinvite.helpers({
    data: function() {
        var template = Template.instance();
        var network = Networks.findOne({slug: template.data.networkSlug});
        return {
            network: function() {
                return network;
            },
            currentCsvInvitees: function() {
                return template.invitees.get();
            }
        };
    },
    form: function() {
        var template = Template.instance();
        var network = Networks.findOne({slug: template.data.networkSlug});
        return {
            schema: function() {
                return Partup.schemas.forms.networkBulkinvite;
            },
            defaultDoc: function() {
                if (!network) return false;
                return {
                    message: TAPi18n.__('network-settings-bulkinvite-message_prefill', {
                        networkName: network.name,
                        networkDescription: network.description,
                        inviterName: Meteor.user().profile.name
                    })
                };
            },
        };
    },
    state: function() {
        var template = Template.instance();
        return {
            submitting: function() {
                return template.submitting.get();
            },
            parsing: function() {
                return template.parsing.get();
            },
            csvInvalid: function() {
                return template.csv_invalid.get();
            },
            csvTooManyAddresses: function() {
                return template.csv_too_many_addresses.get();
            }
        };
    }
});

Template.NetworkSettingsBulkinvite.events({
    'change [data-csv-file]': function(event, template) {
        event.preventDefault();
        if (!event.currentTarget.value) return;

        template.parsing.set(true);
        template.csv_invalid.set(false);
        template.csv_too_many_addresses.set(false);

        var file = event.currentTarget.files[0];

        var token = Accounts._storedLoginToken();
        var xhr = new XMLHttpRequest();
        xhr.open('POST', Meteor.absoluteUrl() + 'csv/parse?token=' + token, false);

        var formData = new FormData();
        formData.append('file', file);
        xhr.send(formData);

        var data = JSON.parse(xhr.responseText);

        if (data.error) {
            Partup.client.notify.error(TAPi18n.__(data.error.reason));
            console.error('Result from uploading & parsing CSV:', TAPi18n.__(data.error.reason));
            template.csv_invalid.set(true);

            if (error.reason == 'too_many_email_addresses') {
                template.csv_too_many_addresses.set(true);
            }

            return;
        }

        template.invitees.set(data.result);
        template.parsing.set(false);

        var jqInput = $(event.currentTarget.value);
        jqInput.replaceWith(jqInput.val('').clone(true));
    }
});

AutoForm.hooks({
    bulkInviteToNetworkForm: {
        onSubmit: function(insertDoc, updateDoc, currentDoc) {
            var self = this;
            self.event.preventDefault();
            var template = self.template.parent();

            var parent = Template.instance().parent();
            parent.submitting.set(true);

            var invitees = parent.invitees.get();

            var network = Networks.findOne({slug: template.data.networkSlug});

            Meteor.call('networks.invite_by_email_bulk', network._id, insertDoc, invitees,
                function(error, result) {

                    parent.submitting.set(false);
                    if (error) {
                        return Partup.client.notify.error(TAPi18n.__('base-errors-' + error.reason));
                    }
                    Partup.client.notify.success(TAPi18n.__('network-settings-bulkinvite-success'));
                });

            return false;
        }
    }
});
