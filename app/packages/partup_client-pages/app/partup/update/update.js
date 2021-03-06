var Subs = new SubsManager({
    cacheLimit: 1,
    expireIn: 10
});

Template.app_partup_update.onCreated(function() {
    var template = this;
    template.rerenderHack = new ReactiveVar(true);
    template.autorun(function(computation) {
        var data = Template.currentData();
        if (data.updateId && data.partupId) {
            computation.stop();
            Subs.subscribe('partups.one', data.partupId);
            Subs.subscribe('updates.one', data.updateId);
        }
    });
    var updateId;
    template.autorun(function(computation) {
        var data = Template.currentData();
        if (updateId !== data.updateId) {
            template.rerenderHack.set(false);
            Meteor.defer(function() {
                template.rerenderHack.set(true);
            });
        }
        updateId = data.updateId;
    });

    if (typeof template.data.updateId === 'string') {
        // Reset new comments for current user
        Meteor.call('updates.reset_new_comments', template.data.updateId);
    }
});

Template.app_partup_update.helpers({
    partup: function() {
        return Partups.findOne(Template.instance().data.partupId);
    },
    rerenderHack: function() {
        return Template.instance().rerenderHack.get();
    },
    metaDataForUpdate: function() {
        var update = Updates.findOne(this.updateId);
        if (!update) return {};

        var partup = Partups.findOne(update.partup_id);
        if (!partup) return {};

        var updateUpper = Meteor.users.findOne({_id: update.upper_id});

        var is_contribution = update.type.indexOf('partups_contributions_') > -1;
        var is_rating = update.type.indexOf('partups_ratings_') > -1;

        var is_newuser = update.type.indexOf('partups_newuser') > -1;
        var path = '';
        if (is_newuser) {
            path = Router.path('profile', {_id: update.upper_id});
        } else if (is_contribution) {
            var activity = Activities.findOne({_id: update.type_data.activity_id});
            if (!activity) return {};

            path = Router.path('partup-update', {slug: partup.slug, update_id: activity.update_id});
        } else {
            path = Router.path('partup-update', {slug: partup.slug, update_id: update._id});
        }

        return {
            updateUpper: updateUpper,
            updated_at: update.updated_at,
            path: path,
            update_type: update.type,
            is_contribution: is_contribution,
            is_rating: is_rating,
            invitee_names: update.type_data.invitee_names,
            is_system: !!update.system
        };
    },
    isAnotherDay: function(date) {
        return Partup.client.moment.isAnotherDay(moment(), moment(date));
    }
});
