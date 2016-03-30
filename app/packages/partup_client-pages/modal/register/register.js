/*************************************************************/
/* Page events */
/*************************************************************/
Template.modal_register.events({
    'click [data-closepage]': function(event, template) {
        event.preventDefault();

        Intent.return('register-details', {
            fallback_action: function() {
                Intent.return('register');
            }
        });
    }
});
