var Subs = new SubsManager({
    cacheLimit: 1,
    expireIn: 10
});

/**
 * Updates created
 */
Template.app_partup_updates.onCreated(function() {
    var tpl = this;

    tpl.partup = Partups.findOne(tpl.data.partupId);

    // Updates model
    tpl.updates = {

        // Constants
        STARTING_LIMIT: 5,
        INCREMENT: 15,

        // States
        loading: new ReactiveVar(false),
        infinite_scroll_loading: new ReactiveVar(false),
        end_reached: new ReactiveVar(false),

        // Date of the last refresh
        refreshDate: new ReactiveVar(new Date()),
        refreshDate_remembered: new ReactiveVar(),

        // The data model
        model: Updates.findForPartup(tpl.partup),
        updateModel: function() {
            if (!tpl.partup) return;
            Tracker.nonreactive(function() {
                var options = tpl.updates.options.get();
                tpl.updates.model = Updates.findForPartup(tpl.partup, options);
            });
            return tpl.updates.model.fetch();
        },

        // The view model
        view: new ReactiveVar([]),
        updateView: function() {
            Tracker.nonreactive(function() {
                var updates = tpl.updates.model.fetch();
                tpl.updates.view.set(updates);
                tpl.updates.refreshDate.set(new Date());
                Partup.client.updates.resetUpdatesCausedByCurrentuser();
            });
        },
        addToView: function(updates) {
            var self = this;
            Tracker.nonreactive(function() {
                var current_updates = self.view.get();
                self.view.set(current_updates.concat(updates));
            });
        },

        // Options reactive variable (on change, update the whole view model)
        options: new ReactiveVar({}, function(a, b) {
            tpl.updates.resetLimit();

            var options = b;
            options.limit = tpl.updates.limit.get();

            tpl.updates.loading.set(true);

            var sub = tpl.subscribe('updates.from_partup', tpl.partup._id, options, function() {
                tpl.updates.updateModel();
                tpl.updates.updateView();
            });

            tpl.autorun(function(c) {
                if (sub.ready()) {
                    c.stop();
                    tpl.updates.loading.set(false);
                }
            });
        }),

        // Filter reactive variable (on change, set value to the tpl.options reactive var)
        filter: new ReactiveVar('default', function(oldFilter, newFilter) {
            var options = tpl.updates.options.get();
            options.filter = newFilter;
            tpl.updates.options.set(options);
        }),

        // The reactive limit variable (on change, add updates to the view)
        limit: new ReactiveVar(this.STARTING_LIMIT, function(a, b) {
            var first = b === tpl.updates.STARTING_LIMIT;
            if (first) return;

            var options = tpl.updates.options.get();
            options.limit = b;

            tpl.updates.infinite_scroll_loading.set(true);
            var sub = tpl.subscribe('updates.from_partup', tpl.partup._id, options, function() {
                var modelUpdates = tpl.updates.updateModel();
                var viewUpdates = tpl.updates.view.get();

                var difference = modelUpdates.length - viewUpdates.length;
                var end_reached = difference < tpl.updates.INCREMENT;
                tpl.updates.end_reached.set(end_reached);

                var addedUpdates = mout.array.filter(modelUpdates, function(update) {
                    return !mout.array.find(viewUpdates, function(_update) {
                        return update._id === _update._id;
                    });
                });

                tpl.updates.addToView(addedUpdates);
            });

            tpl.autorun(function(c) {
                if (sub.ready()) {
                    c.stop();
                    tpl.updates.infinite_scroll_loading.set(false);
                }
            });
        }),

        increaseLimit: function() {
            tpl.updates.limit.set(tpl.updates.limit.get() + tpl.updates.INCREMENT);
        },

        resetLimit: function() {
            tpl.updates.limit.set(tpl.updates.STARTING_LIMIT);
            tpl.updates.end_reached.set(false);
        }
    };

    Partup.client.events.on('partup:updates:message_added', tpl.updates.updateView);

    // When the model changes and the view is empty, update the view with the model
    tpl.autorun(function() {
        var updates = tpl.updates.model.fetch();

        if (updates.length && !tpl.updates.view.get().length) {
            tpl.updates.view.set(updates);
            tpl.updates.refreshDate.set(new Date());
        }
    });

    // First run
    tpl.updates.options.set({});
});

/**
 * Updates rendered
 */
Template.app_partup_updates.onRendered(function() {
    var tpl = this;

    /**
     * Infinite scroll
     */
    Partup.client.scroll.infinite({
        template: tpl,
        element: tpl.find('[data-infinitescroll-container]'),
        offset: 200
    }, function() {
        if (tpl.updates.loading.get() || tpl.updates.infinite_scroll_loading.get() || tpl.updates.end_reached.get()) return;
        tpl.updates.increaseLimit();
    });

});

/**
 * Updates destroyed
 */
Template.app_partup_updates.onDestroyed(function() {
    var tpl = this;

    Partup.client.events.off('partup:updates:message_added', tpl.updates.updateView);
});

/**
 * Updates helpers
 */
Template.app_partup_updates.helpers({
    updates: function() {
        return Template.instance().updates.view.get();
    },

    newUpdatesCount: function() {
        var template = Template.instance();
        if (!template.updates.model) return 0;

        var refreshDate = template.updates.refreshDate.get();

        var wait = Partup.client.updates.waitForUpdateBool.get();
        if (wait) return 0;

        var updates_causedby_currentuser = Partup.client.updates.updates_causedby_currentuser.get();

        return lodash.filter(template.updates.model.fetch(), function(update) {
            var isNewer = moment(update.updated_at).diff(refreshDate) > 0;
            var isCausedByCurrentuser = lodash.contains(updates_causedby_currentuser, update._id);
            return isNewer && !isCausedByCurrentuser;
        }).length;
    },

    isAnotherDay: function() {
        var update = this;

        // WARNING: this helper assumes that the list is always sorted by TIME_FIELD
        var TIME_FIELD = 'updated_at';

        // Find previous update
        var updates = Template.instance().updates.view.get();
        var currentIndex = lodash.findIndex(updates, update);
        var previousUpdate = updates[currentIndex - 1];

        // Moments
        var previousMoment = moment(previousUpdate ? previousUpdate[TIME_FIELD] : undefined);
        var currentMoment = moment(update[TIME_FIELD]);

        // Determine whether this update is another day
        return Partup.client.moment.isAnotherDay(previousMoment, currentMoment);
    },
    isLoggedIn: function() {
        var user = Meteor.user();
        return !!user;
    },
    isUpper: function() {
        var template = Template.instance();
        if (!template.partup || !template.partup.uppers) return false;

        var user = Meteor.user();
        if (!user) return false;

        return template.partup.uppers.indexOf(user._id) > -1;
    },

    metaDataForUpdate: function() {

        var update = this;
        var updateUpper = Meteor.users.findOne({_id: update.upper_id});

        var partup = Partups.findOne(update.partup_id);

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
            invitee_names: update.type_data.invitee_names,
            is_contribution: is_contribution,
            is_rating: is_rating,
            is_system: !!update.system
        };
    },

    filterReactiveVar: function() {
        return Template.instance().updates.filter;
    },

    updatesEndReached: function() {
        return Template.instance().updates.end_reached.get();
    },

    // New updates separator
    showNewUpdatesSeparator: function() {
        var update = this;
        var tpl = Template.instance();
        var firstUnseenUpdate = Partup.client.updates.firstUnseenUpdate(update.partup_id).get();
        var showNewUpdatesSeparator = false;

        if (firstUnseenUpdate === this._id) {
            showNewUpdatesSeparator = 'bottom';
        } else {
            // WARNING: this helper assumes that the list is always sorted by TIME_FIELD
            var TIME_FIELD = 'updated_at';

            // Find remembered refreshDate
            var rememberedRefreshDate = tpl.updates.refreshDate_remembered.get();
            if (!rememberedRefreshDate) return false;
            var rememberedRefreshMoment = moment(rememberedRefreshDate);

            // Find previous update
            var updates = tpl.updates.view.get();
            var currentIndex = lodash.findIndex(updates, update);
            var previousUpdate = updates[currentIndex - 1];
            if (!previousUpdate) return false;

            // Date comparisons
            var previousUpdateIsNewer = moment(previousUpdate[TIME_FIELD]).diff(rememberedRefreshMoment) > 0;
            var currentUpdateIsOlder = moment(update[TIME_FIELD]).diff(rememberedRefreshMoment) < 0;
            // Return true when the previous update is newer
            // and the current update older than the remember refresh date
            showNewUpdatesSeparator = previousUpdateIsNewer && currentUpdateIsOlder ? 'top' : false;
        }

        // Unset the rememberedRefreshDate after a few seconds when the line is in view
        var HIDE_LINE_TIMEOUT = 8000;
        var HIDE_LINE_ANIMATION_DURATION = 800;
        Meteor.defer(function() {
            var element = tpl.find('.pu-sub-newupdatesseparator');
            Meteor.autorun(function(computation) {
                if (Partup.client.scroll.inView(element)) {
                    computation.stop();
                    Meteor.setTimeout(function() {
                        $(element).removeClass('pu-state-active');

                        Meteor.setTimeout(function() {
                            Partup.client.updates.firstUnseenUpdate(update.partup_id).reset();
                            tpl.updates.refreshDate_remembered.set(undefined);
                        }, HIDE_LINE_ANIMATION_DURATION);
                    }, HIDE_LINE_TIMEOUT);
                }
            });
        });

        // Return whether to show the newUpdatesSeparator
        return showNewUpdatesSeparator;
    },

    // Loading states
    updatesLoading: function() {
        return Template.instance().updates.loading.get();
    },
    updatesLoadingMore: function() {
        return Template.instance().updates.infinite_scroll_loading.get();
    },
});

/**
 * Updates events
 */
Template.app_partup_updates.events({
    'click [data-newmessage-popup]': function(event, template) {
        event.preventDefault();

        var proceed = function() {
            Partup.client.popup.open({
                id: 'new-message'
            });
        };

        if (Meteor.userId()) {
            proceed();
        } else {
            Intent.go({route: 'login'}, function(user) {
                if (user) Meteor.setTimeout(proceed, 500); // improve the experience with a timeout
            });
        }
    },
    'click [data-reveal-new-updates]': function(event, template) {
        event.preventDefault();
        template.updates.refreshDate_remembered.set(template.updates.refreshDate.get());
        template.updates.updateView();

        // Reset new updates for current user
        Meteor.call('partups.reset_new_updates', template.partup._id);
    }
});
