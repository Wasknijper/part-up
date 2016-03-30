/**
 */
Template._EditSwarm.onCreated(function() {
    var template = this;
    template.submitting = new ReactiveVar(false);
});

Template._EditSwarm.helpers({
    formSchema: Partup.schemas.forms.swarmEditAdmin,
    submitting: function() {
        return Template.instance().submitting.get();
    },
    swarmSlug: function() {
        return Template.instance().data.swarmSlug.get();
    }
});

AutoForm.hooks({
    editSwarmForm: {
        onSubmit: function(insertDoc, updateDoc, currentDoc) {
            Log.debug('dafuq bruh');
            var self = this;
            var template = self.template.parent();

            var parent = Template.instance().parent();
            parent.submitting.set(true);

            Meteor.call('swarms.admin_update', template.data.swarmSlug.get(), insertDoc, function(error, result) {
                console.log(error);
                console.log(result);
                parent.submitting.set(false);
                if (error) {
                    return Partup.client.notify.error(TAPi18n.__('base-errors-' + error.reason));
                }
                Partup.client.popup.close();
            });

            return false;
        }
    }
});
