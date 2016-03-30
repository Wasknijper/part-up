/**
 * Render invite to part-up functionality
 *
 * @module client-invite-to-partup
 *
 */
Template.InviteToPartup.onCreated(function() {
    var template = this;
    template.submitting = new ReactiveVar(false);
});

Template.InviteToPartup.helpers({
    formSchema: Partup.schemas.forms.inviteUpper,
    submitting: function() {
        return Template.instance().submitting.get();
    },
    defaultDoc: function() {
        var partup = Partups.findOne(this.partupId);

        return {
            message: TAPi18n.__('invite-to-partup-popup-message-prefill', {
                partupName: partup.name,
                inviterName: Meteor.user().profile.name
            })
        };
    }
});

AutoForm.hooks({
    inviteToPartupForm: {
        onSubmit: function(insertDoc, updateDoc, currentDoc) {
            var self = this;
            var template = self.template.parent();

            var parent = Template.instance().parent();
            parent.submitting.set(true);

            var partupId = template.data.partupId;

            Meteor.call('partups.invite_by_email', partupId, insertDoc,
                function(error, result) {
                    parent.submitting.set(false);
                    if (error) {
                        return Partup.client.notify.error(TAPi18n.__('base-errors-' + error.reason));
                    }
                    Partup.client.notify.success(TAPi18n.__('invite-to-partup-popup-success'));
                    Partup.client.popup.close();
                });

            return false;
        }
    }
});
