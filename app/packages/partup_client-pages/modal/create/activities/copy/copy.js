Template.modal_create_activities_copy.onCreated(function() {
    this.partupSelection = new ReactiveVar();
    this.submitting = new ReactiveVar(false);
});

/*************************************************************/
/* Widget helpers */
/*************************************************************/
Template.modal_create_activities_copy.helpers({
    submitting: function() {
        return Template.instance().submitting.get();
    },

    // Autocomplete field
    partupSelectionReactiveVar: function() {
        return Template.instance().partupSelection;
    },
    partupFieldPlaceholder: function() {
        return TAPi18n.__('pages-modal-create-activities-copy-form-copy-placeholder');
    },
    partupLabel: function() {
        return function(partup) {
            return partup.name;
        };
    },
    partupFormvalue: function() {
        return function(partup) {
            return partup._id;
        };
    },
    partupQuery: function() {
        var exceptPartupId = Template.instance().data.partupId;
        return function(query, sync, async) {
            Meteor.call('partups.autocomplete', query, exceptPartupId, function(error, partups) {
                lodash.each(partups, function(p) {
                    p.value = p.name; // what to show in the autocomplete list
                });
                async(partups);
            });
        };
    },
});

/*************************************************************/
/* Widget events */
/*************************************************************/
Template.modal_create_activities_copy.events({
    'click [data-dismiss]': function(event, template) {
        event.preventDefault();
        var form = template.find('form');
        form.reset();
        template.partupSelection.set(undefined);
    },
    'submit form': function(event, template) {
        event.preventDefault();

        if (template.submitting.get()) return;

        var form = event.currentTarget;
        var partupId = form.elements.partup.value;

        if (!partupId) return;

        var submitting = template.submitting.set(true);
        var currentPartupId = template.data.partupId;

        Meteor.call('activities.copy', partupId, currentPartupId, function(error, result) {
            template.submitting.set(false);

            if (error) {
                return Partup.client.notify.error(TAPi18n.__('pages-modal-create-activities-error-method-' + error.error));
            }

            form.reset();
            template.partupSelection.set(undefined);
            Partup.client.popup.close();
        });

        return false;
    }
});
