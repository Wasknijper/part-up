var unsubscribeAllEmails = function(token) {
    Meteor.call('settings.email_unsubscribe_all', token, function(error, result) {
        if (error) {
            Partup.client.notify.error(TAPi18n.__('modal-profilesettings-email-updateerror-disabled'));
            return;
        }
        Partup.client.notify.success(TAPi18n.__('modal-profilesettings-email-updatesuccess-disabled-all'));
        Meteor.defer(function() {
            Router.go('home');
        });
    });
};
Template.modal_profile_settings_email_unsubscribe_all.onRendered(function() {
    var template = this;

    Partup.client.prompt.confirm({
        title: TAPi18n.__('pages-app-emailsettings-confirmation-title-all'),
        message: TAPi18n.__('pages-app-emailsettings-confirmation-message'),
        confirmButton: TAPi18n.__('pages-app-emailsettings-confirmation-confirm-button-all'),
        cancelButton: TAPi18n.__('pages-app-emailsettings-confirmation-cancel-button'),
        onConfirm: function() {
            var token = template.data.token;
            unsubscribeAllEmails(token);
        },
        onCancel: function() {
            Router.go('home');
        }
    });
});

Template.modal_profile_settings_email_unsubscribe_all.events({
    'click [data-closepage]': function(event, template) {
        event.preventDefault();
        Router.go('home');
    }
});

