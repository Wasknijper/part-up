/*************************************************************/
/* Page events */
/*************************************************************/
Template.modal_forgotpassword.events({
    'click [data-closepage]': function(event, template) {
        event.preventDefault();
        Intent.return('login');
    }
});
