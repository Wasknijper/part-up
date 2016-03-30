var unsubscribeOneEmail = function(token, subscriptionKey) {
    Meteor.call('settings.email_unsubscribe_one', token, subscriptionKey, function(error, result) {
        if (error) {
            Partup.client.notify.error(TAPi18n.__('modal-profilesettings-email-updateerror-disabled'));
            return;
        }
        Partup.client.notify.success(TAPi18n.__('modal-profilesettings-email-updatesuccess-disabled-one'));
        Meteor.defer(function() {
            Router.go('home');
        });
    });
};
Template.modal_profile_settings_email_unsubscribe_one.onRendered(function() {
    var template = this;

    Partup.client.prompt.confirm({
        title: TAPi18n.__('pages-app-emailsettings-confirmation-title-one'),
        message: TAPi18n.__('pages-app-emailsettings-confirmation-message'),
        confirmButton: TAPi18n.__('pages-app-emailsettings-confirmation-confirm-button-one'),
        cancelButton: TAPi18n.__('pages-app-emailsettings-confirmation-cancel-button'),
        onConfirm: function() {
            var subscriptionKey = template.data.subscriptionKey;
            var token = template.data.token;
            unsubscribeOneEmail(token, subscriptionKey);
        },
        onCancel: function() {
            Router.go('home');
        }
    });
});

Template.modal_profile_settings_email_unsubscribe_one.events({
    'click [data-closepage]': function(event, template) {
        event.preventDefault();
        Router.go('home');
    }
});

