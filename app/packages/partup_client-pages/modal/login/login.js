/*************************************************************/
/* Page events */
/*************************************************************/
Template.modal_login.events({
    'click [data-closepage]': function(event, template) {
        event.preventDefault();
        Intent.return('login');
    }
});
