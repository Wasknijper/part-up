Meteor.startup(function(){

    /*************************************************************/
    /* Global autoform hooks */
    /*************************************************************/
    AutoForm.addHooks(null, {
        beginSubmit: function() {
            Partup.client.forms.removeAllStickyFieldErrors(this);
        }
    });

    /*************************************************************/
    /* Global autoform rendered callback */
    /*************************************************************/
    Template.autoForm.onRendered(function() {
        this.findAll('form').forEach(function(form) {
            AutoForm.resetForm(form.id);
        });
    });

});
