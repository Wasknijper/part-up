var placeholders = {
    'text': function() {
        return TAPi18n.__('pages-app-partup-updates-newmessage-placeholder');
    }
};

Template.app_partup_updates_newmessage.onCreated(function() {
    var template = this;

    template.uploadingPhotos = new ReactiveVar(false);
    var images = this.data._id ? this.data.type_data.images : [];
    template.uploadedPhotos = new ReactiveVar(images);
    template.totalPhotos = new ReactiveVar(0);
    template.maxPhotos = 4;
    template.submitting = new ReactiveVar(false);
    template.partupId = this.data.partup_id || this.data.partupId;
});

Template.afFieldInput.onRendered(function() {
    // makes sure it only goes on if it's a mentions input
    if (!this.data.hasOwnProperty('data-message-input')) return;

    // comment template
    var template = this.parent();
    var currentValue = template.data._id ? template.data.type_data.new_value : undefined;

    // destroy other edit mentionsinputs to prevent conflicts
    if (template.mentionsInput) template.mentionsInput.destroy();

    var input = template.find('[data-message-input]');
    template.mentionsInput = Partup.client.forms.MentionsInput(input, template.partupId, {
        autoFocus: true,
        autoAjustHeight: true,
        prefillValue: currentValue
    });
});

Template.app_partup_updates_newmessage.onDestroyed(function() {
    var tpl = this;
    if (tpl.mentionsInput) tpl.mentionsInput.destroy();
});

// helpers
Template.app_partup_updates_newmessage.helpers({
    formSchema: Partup.schemas.forms.newMessage,
    placeholders: placeholders,
    data: function() {
        var self = this;
        var template = Template.instance();
        return {
            submitting: function() {
                return template.submitting.get();
            },
            uploadedPhotos: function() {
                return template.uploadedPhotos.get();
            }
        };
    },
    state: function() {
        var self = this;
        var template = Template.instance();
        return {
            edit: function() {
                return self._id ? true : false;
            },
            formId: function() {
                return self._id ? 'editMessageForm' : 'newMessageForm';
            },
            uploadingPhotos: function() {
                return template.uploadingPhotos.get();
            },
            photoLimitReached: function() {
                return template.totalPhotos.get() >= 4 || template.uploadedPhotos.get().length >= 4;
            }
        };
    },
    formDoc: function() {
        if (!this._id) return;
        return {
            text: this.type_data.new_value,
            images: this.type_data.images || []
        };
    },
    imageInput: function() {
        var template = Template.instance();
        return {
            button: 'data-browse-photos',
            input: 'data-photo-input',
            multiple: true,
            onFileChange: function(event) {
                template.uploadingPhotos.set(true);
                var total = Math.max(template.totalPhotos.get(), template.uploadedPhotos.get().length);
                Partup.client.uploader.eachFile(event, function(file) {
                    if (total === template.maxPhotos) return;

                    Partup.client.uploader.uploadImage(file, function(error, image) {
                        template.uploadingPhotos.set(false);
                        if (error) {
                            Partup.client.notify.error(TAPi18n.__(error.reason));
                            return;
                        }
                        var uploaded = template.uploadedPhotos.get();
                        uploaded.push(image._id);
                        template.uploadedPhotos.set(uploaded);
                    });
                    total++;
                    template.totalPhotos.set(total);
                });
            }
        };
    }
});

// events
Template.app_partup_updates_newmessage.events({
    'click [data-dismiss]': function clearForm(event, template) {
        template.uploadedPhotos.set([]);
    },
    'click [data-remove-upload]': function removeUpload(event, template) {
        var imageId = $(event.currentTarget).data('remove-upload');
        // template.uploadedPhotos.set([]);
        var uploadedPhotos = template.uploadedPhotos.get();
        mout.array.remove(uploadedPhotos, imageId);
        template.uploadedPhotos.set(uploadedPhotos);
        var total = Template.instance().totalPhotos.get();
        total--;
        Template.instance().totalPhotos.set(total);
    }
});

/*************************************************************/
/* Widget form hooks */
/*************************************************************/
AutoForm.hooks({
    editMessageForm: {
        onSubmit: function(insertDoc, updateDoc, currentDoc) {
            var self = this;
            var parent = Template.instance().parent();
            var template = self.template.parent();

            parent.submitting.set(true);

            var updateId = parent.data._id;

            var uploadedPhotos = parent.uploadedPhotos.get();
            insertDoc.images = uploadedPhotos;
            insertDoc.text = parent.mentionsInput.getValue();

            // close popup before call is made, an error notifier
            // will be the feedback when it fails
            Partup.client.popup.close();

            Meteor.call('updates.messages.update', updateId, insertDoc, function(error, result) {
                parent.submitting.set(false);

                // Error
                if (error) {
                    Partup.client.notify.error(error.reason);
                    self.done(new Error(error.message));
                    return;
                }

                try {
                    AutoForm.resetForm('editMessageForm');
                } catch (err) {}
                template.mentionsInput.reset();
                self.done();
                parent.uploadedPhotos.set([]);
            });

            return false;
        }
    },
    newMessageForm: {
        onSubmit: function(insertDoc, updateDoc, currentDoc) {
            var self = this;
            var parent = Template.instance().parent();
            var template = self.template.parent();

            parent.submitting.set(true);

            var partupId = parent.data.partupId;
            var uploadedPhotos = parent.uploadedPhotos.get();
            insertDoc.images = uploadedPhotos;
            insertDoc.text = parent.mentionsInput.getValue();

            // close popup before call is made, an error notifier
            // will be the feedback when it fails
            Partup.client.popup.close();
            Partup.client.updates.setWaitForUpdate(true);

            Meteor.call('updates.messages.insert', partupId, insertDoc, function(error, result) {
                parent.submitting.set(false);
                Partup.client.updates.addUpdateToUpdatesCausedByCurrentuser(result._id);
                Partup.client.updates.setWaitForUpdate(false);

                // Error
                if (error) {
                    Partup.client.notify.error(error.reason);
                    self.done(new Error(error.message));

                    return;
                }
                if (result.warning) {
                    Partup.client.notify.warning(TAPi18n.__('warning-' + result.warning));
                }

                // Success
                analytics.track('new message created', {
                    partupId: partupId
                });
                try {
                    AutoForm.resetForm('newMessageForm');
                } catch (err) {}
                template.mentionsInput.reset();
                self.done();
                parent.uploadedPhotos.set([]);
                Partup.client.events.emit('partup:updates:message_added');
            });

            return false;
        }
    }
});
