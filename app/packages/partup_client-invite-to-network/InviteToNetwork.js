/**
 * Render invite to network functionality
 *
 * @module client-invite-to-network
 *
 */
Template.InviteToNetwork.onCreated(function() {
    var template = this;
    template.submitting = new ReactiveVar(false);
});

Template.InviteToNetwork.helpers({
    formSchema: Partup.schemas.forms.inviteUpper,
    submitting: function() {
        return Template.instance().submitting.get();
    },
    defaultDoc: function() {
        var network = Networks.findOne(this.networkId);

        return {
            message: TAPi18n.__('invite-to-network-popup-message-prefill', {
                networkName: network.name,
                networkDescription: network.description,
                inviterName: Meteor.user().profile.name
            })
        };
    }
});

AutoForm.hooks({
    inviteToNetworkForm: {
        onSubmit: function(insertDoc, updateDoc, currentDoc) {
            var self = this;
            var template = self.template.parent();

            var parent = Template.instance().parent();
            parent.submitting.set(true);

            Meteor.call('networks.invite_by_email', template.data.networkId, insertDoc,
                function(error, result) {
                    parent.submitting.set(false);
                    if (error) {
                        return Partup.client.notify.error(TAPi18n.__('base-errors-' + error.reason));
                    }
                    Partup.client.notify.success(TAPi18n.__('invite-to-network-popup-success'));
                    Partup.client.popup.close();
                });

            return false;
        }
    }
});
