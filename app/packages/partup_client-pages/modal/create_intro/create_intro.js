/*************************************************************/
/* Page helpers */
/*************************************************************/
Template.modal_create_intro.helpers({
    'user': function helperUser () {
        return Meteor.user();
    },
    'first_name': function helpFirstName() {
        var user = Meteor.user();
        return User(user).getFirstname();
    }
});

/*************************************************************/
/* Page events */
/*************************************************************/
Template.modal_create_intro.events({
    'click [data-closepage]': function eventClickClosePage (event, template) {
        event.preventDefault();
        Intent.return('create');
    }
});
