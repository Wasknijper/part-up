Template.modal_profile_settings_details.onCreated(function() {
    this.submitting = new ReactiveVar(false);
});

Template.modal_profile_settings_details.helpers({
    submitting: function() {
        return Template.instance().submitting.get();
    }
});

AutoForm.hooks({
    pagesModalProfileSettingsForm: {
        onSubmit: function(insertDoc, updateDoc, currentDoc) {
            var self = this;

            self.event.preventDefault();
            var template = self.template.parent().parent();

            if (template.submitting.get()) return;

            template.submitting.set(true);
            Meteor.call('users.update', insertDoc, function(error, res) {
                if (error && error.message) {
                    Partup.client.notify.error(error.reason);
                    AutoForm.validateForm(self.formId);
                    self.done(new Error(error.message));
                    return;
                }

                Partup.client.notify.success(TAPi18n.__('modal-profilesettings-button-save_success'));
                self.done();

                analytics.track('User details updated', {
                    userId: Meteor.user()._id,
                });

                template.submitting.set(false);
            });

            return false;
        }
    }
});
