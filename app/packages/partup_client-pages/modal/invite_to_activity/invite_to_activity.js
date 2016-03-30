Template.modal_invite_to_activity.onCreated(function() {
    var self = this;
    self.userIds = new ReactiveVar([]);
    self.subscription = new ReactiveVar();
    self.suggestionsOptions = new ReactiveVar({});

    self.inviting = new ReactiveDict(); // loading boolean for each individual invite button

    self.loading = new ReactiveVar();

    self.subscribe('partups.one', self.data.partupId);
    self.subscribe('activities.from_partup', self.data.partupId);

    // Submit filter form
    self.submitFilterForm = function() {
        Meteor.defer(function() {
            var form = self.find('form#suggestionsQuery');
            $(form).submit();
        });
    };

    // Location filter datamodel
    self.location = {
        value: new ReactiveVar(),
        selectorState: new ReactiveVar(false, function(a, b) {
            if (!b) return;

            // Focus the searchfield
            Meteor.defer(function() {
                var searchfield = self.find('form#locationSelector').elements.search;
                if (searchfield) searchfield.focus();
            });
        }),
        selectorData: function() {
            var DROPDOWN_ANIMATION_DURATION = 200;

            return {
                onSelect: function(location) {
                    self.location.selectorState.set(false);

                    Meteor.setTimeout(function() {
                        self.location.value.set(location);
                        self.submitFilterForm();
                    }, DROPDOWN_ANIMATION_DURATION);
                }
            };
        }
    };

    self.autorun(function() {
        self.loading.set(true);
        var activityId = self.data.activityId;
        var activity = Activities.findOne(activityId);
        if (!activity) return;

        var options = self.suggestionsOptions.get();

        Meteor.call('activities.user_suggestions', activityId, options, function(error, userIds) {
            if (error) {
                return Partup.client.notify.error(TAPi18n.__('base-errors-' + error.reason));
            }

            // Sort users by invited first
            userIds.sort(function(userId) {
                return activity.isUpperInvited(userId) ? 1 : -1;
            });

            self.userIds.set(userIds);
            self.subscription.set(self.subscribe('users.by_ids', userIds));

            self.loading.set(false);
        });
    });
});

Template.modal_invite_to_activity.helpers({
    inviteLoadingForUser: function(userId) {
        return Template.instance().inviting.get(userId);
    },
    loading: function() {
        return Template.instance().loading.get();
    },
    suggestions: function() {
        var sub = Template.instance().subscription.get();
        if (!sub || !sub.ready()) return;

        var suggestions = [];
        var userIds = Template.instance().userIds.get();
        for (var i = 0; i < userIds.length; i++) {
            suggestions.push(Meteor.users.findOne({_id: userIds[i]}));
        }

        return suggestions;
    },
    inviteSent: function() {
        var activityId = Template.instance().data.activityId;
        var activity = Activities.findOne(activityId);

        return activity.isUpperInvited(this._id);
    },
    alreadyPartner: function() {
        var partupId = Template.instance().data.partupId;
        return User(this).isPartnerInPartup(partupId);
    },
    participation: function() {
        return User(this).getReadableScore();
    },

    // Location
    locationValue: function() {
        return Template.instance().location.value.get();
    },
    locationSelectorState: function() {
        return Template.instance().location.selectorState;
    },
    locationSelectorData: function() {
        return Template.instance().location.selectorData;
    },
    // Query
    textsearchData: function() {
        return Template.instance().suggestionsOptions.get().query || '';
    },
});

/*************************************************************/
/* Page events */
/*************************************************************/
Template.modal_invite_to_activity.events({
    'click [data-closepage]': function(event, template) {
        event.preventDefault();
        var partupId = template.data.partupId;
        var partup = Partups.findOne({_id: partupId});

        Intent.return('partup-activity-invite', {
            fallback_route: {
                name: 'partup',
                params: {
                    slug: partup.slug
                }
            }
        });
    },
    'click [data-invite-id]': function(event, template) {
        var activityId = template.data.activityId;
        var activity = Activities.findOne(activityId);

        var invitingUserId = $(event.currentTarget).data('invite-id');
        var invitingUser = Meteor.users.findOne(invitingUserId);

        if (User(invitingUser).isPartnerInPartup(template.data.partupId) || activity.isUpperInvited(invitingUserId)) return;

        template.inviting.set(invitingUserId, true);
        Meteor.call('activities.invite_existing_upper', activityId, invitingUserId, function(err) {
            template.inviting.set(invitingUserId, false);

            if (err) {
                Partup.client.notify.error(err.reason);
                return;
            }
        });
    },

    'submit form#suggestionsQuery': function(event, template) {
        event.preventDefault();

        var form = event.currentTarget;

        template.suggestionsOptions.set({
            query: form.elements.search_query.value || undefined,
            locationId: form.elements.location_id.value || undefined
        });

        window.scrollTo(0, 0);
    },
    'blur [data-search-query-input]': function(e, template) {
        // template.submitFilterForm();
    },
    'click [data-reset-search-query-input]': function(event, template) {
        event.preventDefault();
        $('[data-search-query-input]').val('');
        template.submitFilterForm();
    },

    'keyup [data-search-query-input]': function(e, template) {
        template.submitFilterForm();
    },

    // Location selector events
    'click [data-open-locationselector]': function(event, template) {
        event.preventDefault();
        var current = template.location.selectorState.get();
        template.location.selectorState.set(!current);
    },
    'click [data-reset-selected-location]': function(event, template) {
        event.preventDefault();
        template.location.value.set('');
        template.submitFilterForm();
    }
});
