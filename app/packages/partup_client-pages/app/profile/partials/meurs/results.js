Template.ResultTile.onCreated(function() {
    this.reset = new ReactiveVar(false);
    this.loading = new ReactiveVar(false);
});

Template.ResultTile.helpers({
    data: function() {
        var template = Template.instance();
        var user = Meteor.users.findOne({_id: template.data.profileId});
        return {
            profile: function() {
                return user.profile;
            },
            results: function() {
                var reset = template.reset.get();
                if (!user.profile.meurs) return false;
                if (!user.profile.meurs.fetched_results) return false;
                return reset ? false : user.profile.meurs.results;
            },
            profileIsCurrentUser: function() {
                return user._id === Meteor.userId();
            }

        };
    },
    state: function() {
        var template = Template.instance();
        return {
            loading: function() {
                return template.loading.get();
            }
        };
    },
    translations: function() {
        var template = Template.instance();
        var user = Meteor.users.findOne({_id: template.data.profileId});
        return {
            title: function(code) {
                return TAPi18n.__('pages-app-profile-about-result-' + code + '-title');
            },
            description: function(code) {
                return TAPi18n.__('pages-app-profile-about-result-' + code + '-description', {name: user.profile.name});
            }
        };
    },
    isCurrentusersResultTile: function() {
        return this.user._id === Meteor.userId();
    }
});

Template.ResultTile.events({
    'click [data-info]': function(event, template) {
        event.preventDefault();
        Partup.client.popup.open({
            id: 'info'
        });
    },
    'click [data-start-test]': function(event, template) {
        event.preventDefault();
        template.loading.set(true);
        Meteor.call('meurs.create_test', function(error, url) {
            if (url) document.location.href = url;
        });
    },
    'click [data-reset]': function(event, template) {
        event.preventDefault();
        Partup.client.prompt.confirm({
            title: TAPi18n.__('pages-app-profile-about-result-reset-title'),
            message: TAPi18n.__('pages-app-profile-about-result-reset-description'),
            onConfirm: function() {
                Meteor.call('meurs.reset', function(error) {
                    if (error) {
                        Partup.client.notify.error(error.reason);
                        return;
                    }
                    Partup.client.notify.success('profile reset');
                    template.reset.set(true);
                });
            }
        });
    }
});
