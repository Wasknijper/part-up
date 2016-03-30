/**
 * A widget that will render a single rating
 *
 * @module client-rating
 * @param {Object} contribution   The contribution on which this rating is applied
 * @param {Object} rating   The rating data
 */

/*************************************************************/
/* Widget helpers */
/*************************************************************/
Template.Rating.helpers({
    canEdit: function() {
        var user = Meteor.user();
        if (!user) return false;

        if (this.rating && this.rating.upper_id !== user._id) return false;

        var partup = Partups.findOne({_id: this.contribution.partup_id});
        if (!partup) return false;

        return true;
    },
    formSchema: Partup.schemas.forms.rating,
    generateFormId: function() {
        if (this.rating) {
            return 'ratingEditForm-' + this.rating._id;
        }

        return 'ratingCreateForm-' + this.contribution._id;
    },
    placeholders: Partup.services.placeholders.rating,
    upper: function() {
        return !this.rating ? Meteor.user() : Meteor.users.findOne({_id: this.rating.upper_id});
    }
});

/*************************************************************/
/* Widget form hooks */
/*************************************************************/
AutoForm.addHooks(null, {
    onSubmit: function(doc) {
        if (!/rating(Create|Edit)Form/.test(this.formId)) return;

        var self = this;
        var template = this.template.parent();
        var method = 'ratings.insert';
        var id = template.data.contribution._id;

        if (template.data.rating) {
            method = 'ratings.update';
            id = template.data.rating._id;
        }

        Meteor.call(method, id, doc, function(error) {
            if (error) return console.error(error);

            Partup.client.updates.addUpdateToUpdatesCausedByCurrentuser(template.data.contribution.update_id);
            self.done();
        });

        return false;
    }
});
