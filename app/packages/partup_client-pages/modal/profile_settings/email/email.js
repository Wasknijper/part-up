/**
 * Render profile email settings
 */
Template.modal_profile_settings_email.onCreated(function() {
});

Template.modal_profile_settings_email.helpers({
    'email': function() {
        var user = Meteor.user();
        return mout.object.get(user, 'profile.settings.email');
    },
    'isSomeNetworkAdmin': function() {
        var user = Meteor.user();
        return User(user).isSomeNetworkAdmin();
    }
});

function saveEmailSettings(settingName, settingValue) {
    Meteor.call('settings.update_email_notifications', settingName, settingValue, function(error) {
        if (error) {
            Partup.client.notify.error(error.reason);
            return;
        }
        if (settingValue) Partup.client.notify.success(TAPi18n.__('modal-profilesettings-email-updatesuccess-enabled-' + settingName));
        if (!settingValue) Partup.client.notify.warning(TAPi18n.__('modal-profilesettings-email-updatesuccess-disabled-' + settingName));
    });
}

Template.modal_profile_settings_email.events({
    'click [data-enable]': function(e, template) {
        var settingName = $(e.currentTarget).data('enable');
        saveEmailSettings(settingName, true);
    },
    'click [data-disable]': function(e, template) {
        var settingName = $(e.currentTarget).data('disable');
        saveEmailSettings(settingName, false);
    }
});
