Template.modal_profile_settings.onCreated(function() {
    var tpl = this;
    var userId = Meteor.userId();
    if (userId !== tpl.data.profileId) return Router.pageNotFound('profile-not-allowed');
});
Template.modal_profile_settings.events({
    'click [data-closepage]': function(event, template) {
        event.preventDefault();

        var return_route = 'profile-settings';

        if (Intent.exists('profile-settings-account')) {
            return_route = 'profile-settings-account';
        } else if (Intent.exists('profile-settings-email')) {
            return_route = 'profile-settings-email';
        }

        Intent.return(return_route, {
            fallback_route: {
                name: 'profile',
                params: {
                    _id: Meteor.userId()
                }
            }
        });
    }
});
