Template.modal_partup_settings.onCreated(function() {
    var tpl = this;
    tpl.subscribe('partups.one', tpl.data.partupId, function() {
        var partup = Partups.findOne(tpl.data.partupId);
        if (!partup) return Router.pageNotFound('partup');
        var user = Meteor.user();
        if (!partup.hasUpper(user._id) && !User(user).isAdmin()) return Router.pageNotFound('partup-not-allowed');
    });
    tpl.submitting = new ReactiveVar(false);
});

Template.modal_partup_settings.helpers({
    partup: function() {
        return Partups.findOne({_id: this.partupId});
    },
    submitting: function() {
        return Template.instance().submitting.get();
    }
});

Template.modal_partup_settings.events({
    'click [data-closepage]': function eventClickClosePage (event, template) {
        event.preventDefault();

        var partup = Partups.findOne(template.data.partupId);

        Intent.return('partup-settings', {
            fallback_route: {
                name: 'partup',
                params: {
                    slug: partup.slug
                }
            }
        });
    },
    'click [data-remove]': function(event, template) {
        event.preventDefault();
        Partup.client.prompt.confirm({
            title: TAPi18n.__('pages-modal-partup_settings-remove-confirmation-title'),
            message: TAPi18n.__('pages-modal-partup_settings-remove-confirmation-message'),
            confirmButton: TAPi18n.__('pages-modal-partup_settings-remove-confirmation-confirm-button'),
            cancelButton: TAPi18n.__('pages-modal-partup_settings-remove-confirmation-cancel-button'),
            onConfirm: function() {
                Meteor.call('partups.remove', template.data.partupId, function(error) {
                    if (error) {
                        Partup.client.notify.error(error.reason);
                    } else {
                        Router.go('discover');
                    }
                });
            }
        });
    },
    'click [data-archive]': function(event, template) {
        event.preventDefault();
        var partup = Partups.findOne(template.data.partupId);
        Partup.client.prompt.confirm({
            title: TAPi18n.__('pages-modal-partup_settings-archive-confirmation-title'),
            message: TAPi18n.__('pages-modal-partup_settings-archive-confirmation-message'),
            confirmButton: TAPi18n.__('pages-modal-partup_settings-archive-confirmation-confirm-button'),
            cancelButton: TAPi18n.__('pages-modal-partup_settings-archive-confirmation-cancel-button'),
            onConfirm: function() {
                Meteor.call('partups.archive', template.data.partupId, function(error) {
                    if (error) {
                        Partup.client.notify.error(error.reason);
                    } else {
                        Intent.return('partup-settings', {
                            fallback_route: {
                                name: 'partup',
                                params: {
                                    slug: partup.slug
                                }
                            }
                        });
                    }
                });
            }
        });
    },
    'click [data-unarchive]': function(event, template) {
        event.preventDefault();
        var partup = Partups.findOne(template.data.partupId);
        Meteor.call('partups.unarchive', template.data.partupId, function(error) {
            if (error) {
                Partup.client.notify.error(error.reason);
            } else {
                Intent.return('partup-settings', {
                    fallback_route: {
                        name: 'partup',
                        params: {
                            slug: partup.slug
                        }
                    }
                });
            }
        });
    }
});

var updatePartup = function(partupId, insertDoc, callback) {
    Meteor.call('partups.update', partupId, insertDoc, function(error, res) {
        if (error && error.reason) {
            Partup.client.notify.error(error.reason);
            AutoForm.validateForm(self.formId);
            self.done(new Error(error.message));
            return;
        }

        callback(partupId);
    });
};

AutoForm.hooks({
    editPartupForm: {
        onSubmit: function(insertDoc) {
            var self = this;

            self.event.preventDefault();
            var template = self.template.parent().parent();

            if (template.submitting.get()) return;

            var partup = this.template.parent().data.currentPartup;
            var submitBtn = template.find('[type=submit]');
            template.submitting.set(true);

            Meteor.call('partups.update', partup._id, insertDoc, function(error, res) {
                if (error && error.reason) {
                    Partup.client.notify.error(error.reason);
                    AutoForm.validateForm(self.formId);
                    self.done(new Error(error.message));
                    return;
                }

                template.submitting.set(false);
                Intent.return('partup-settings', {
                    fallback_route: {
                        name: 'partup',
                        params: {
                            slug: partup.slug
                        }
                    }
                });
            });

            return false;
        }
    }
});
