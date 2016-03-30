var maxLength = {
    name: Partup.schemas.forms.startActivities._schema.name.max,
    description: Partup.schemas.forms.startActivities._schema.description.max
};

/*************************************************************/
/* Widget initial */
/*************************************************************/
Template.ActivityForm.onCreated(function() {
    var template = this;

    this.showExtraFields = new ReactiveVar(!this.data.CREATE);

    this.charactersLeft = new ReactiveDict();
    this.charactersLeft.set('name', maxLength.name);
    this.charactersLeft.set('description', maxLength.description);

    this.submitting = new ReactiveVar(false);

    if (this.data.activity) {
        var ac = this.data.activity;
        var nameLength = maxLength.name - (ac.name ? ac.name.length : 0);
        var descLength = maxLength.description - (ac.description ? ac.description.length : 0);
        this.charactersLeft.set('name', nameLength);
        this.charactersLeft.set('description', descLength);
    }
});

/*************************************************************/
/* Widget helpers */
/*************************************************************/
Template.ActivityForm.helpers({
    charactersLeftName: function() {
        return Template.instance().charactersLeft.get('name');
    },
    charactersLeftDescription: function() {
        return Template.instance().charactersLeft.get('description');
    },
    generateFormId: function() {
        if (this.CREATE) {
            return 'activityCreateForm';
        }
        return 'activityEditForm-' + this.activity._id;
    },
    placeholders: Partup.services.placeholders.activity,
    schema: Partup.schemas.forms.startActivities,
    datePicker: function() {
        var template = Template.instance();
        return {
            input: 'data-bootstrap-datepicker',
            autoFormInput: 'data-autoform-input',
            prefillValueKey: 'end_date', // autoform key
        };
    },
    showExtraFields: function() {
        var template = Template.instance();
        var showExtraFields = template.showExtraFields.get();

        return showExtraFields;
    },
    submitting: function() {
        return Template.instance().submitting.get();
    }
});

/*************************************************************/
/* Widget events */
/*************************************************************/
Template.ActivityForm.events({
    'click [data-activity-extra-fields]': function(event, template) {
        event.preventDefault();
        template.showExtraFields.set(true);
    },
    'click [data-activity-archive]': function(event, template) {
        template.data.edit.set(false);
        Meteor.call('activities.archive', template.data.activity._id, function(error) {
            if (error) {
                Partup.client.notify.error(error.reason);
            }
        });
    },
    'click [data-activity-unarchive]': function(event, template) {
        Meteor.call('activities.unarchive', template.data.activity._id, function(error) {
            if (error) {
                Partup.client.notify.error(error.reason);
            }
        });
    },
    'click [data-activity-remove]': function(event, template) {
        template.data.edit.set(false);
        Meteor.call('activities.remove', template.data.activity._id, function(error) {
            if (error) {
                Partup.client.notify.error(error.reason);
            }
        });
    },
    'input [maxlength]': function(event, template) {
        var target = event.target;
        template.charactersLeft.set(target.name, maxLength[target.name] - target.value.length);
    },
    'click [data-activity-close]': function(event, template) {
        template.data.edit.set(false);
    }
});

/*************************************************************/
/* Widget form hooks */
/*************************************************************/
AutoForm.addHooks(null, {
    onSubmit: function(doc) {
        if (!/^activity(Create|Edit)Form/.test(this.formId)) return;

        var self = this;
        var template = self.template.parent();

        var submitBtn = template.find('[type=submit]');
        template.submitting.set(true);

        var done = function() {
            template.submitting.set(false);
            self.done.apply(arguments);
        };

        if (template.data && template.data.activity) {
            Meteor.call('activities.update', template.data.activity._id, doc, function(error) {
                if (error && error.message) {
                    Partup.client.notify.error(error.reason);

                    AutoForm.validateForm(self.formId);
                    done(new Error(error.message));
                    return;
                }

                template.data.edit.set(false);
                AutoForm.resetForm(self.formId);
                done();
            });
        } else if (template.data && template.data.partupId) {
            Meteor.call('activities.insert', template.data.partupId, doc, function(error, output) {
                if (error && error.message) {
                    Partup.client.notify.error(error.reason);

                    AutoForm.validateForm(self.formId);
                    done(new Error(error.message));
                    return;
                }

                template.charactersLeft.set('name', maxLength.name);
                template.charactersLeft.set('description', maxLength.description);
                template.showExtraFields.set(false);
                AutoForm.resetForm(self.formId);

                if (template.data.POPUP) {
                    Partup.client.popup.close();
                } else {
                    $('input[name="name"]').focus();
                }

                if (mout.lang.isFunction(template.data.createCallback)) {
                    template.data.createCallback(output._id);
                }

                done();

                analytics.track('activity inserted', {
                    partupId: template.data.partupId
                });
            });
        }

        return false;
    }
});
