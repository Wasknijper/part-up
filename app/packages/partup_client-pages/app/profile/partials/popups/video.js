var placeholders = {
    'video_url': function() {
        return TAPi18n.__('pages-app-profile-video_url-placeholder');
    }
};
Template.NewVideoTile.onCreated(function() {
    var template = this;
    template.uploadingVideo = new ReactiveVar(false);
    template.imageId = new ReactiveVar();
    template.submitting = new ReactiveVar(false);
});

Template.NewVideoTile.helpers({
    formSchema: Partup.schemas.forms.tile,
    placeholders: placeholders,
    uploadingVideo: function() {
        return Template.instance().uploadingVideo.get();
    }
});

AutoForm.hooks({
    newVideoForm: {
        onSubmit: function(insertDoc, updateDoc, currentDoc) {
            var self = this;
            var parent = Template.instance().parent();

            parent.submitting.set(true);
            Meteor.call('tiles.insert', insertDoc, function(error) {
                parent.submitting.set(false);

                // Error
                if (error) {
                    Partup.client.notify.error(error.reason);
                    self.done(new Error(error.message));

                    return;
                }

                // Success
                AutoForm.resetForm('newVideoForm');
                self.done();
                Partup.client.popup.close();
            });

            return false;
        }
    }
});
