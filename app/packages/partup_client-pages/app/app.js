/**
 * Package that contains all of the pages corresponding to app routes
 *
 * @module client-pages
 */

Template.app.onRendered(function() {
    var $body = $('body');
    $body.removeClass('pu-state-currentlayout-modal');
    $body.addClass('pu-state-currentlayout-app');
});

Template.app.helpers({
    currentUserId: function() {
        return Meteor.userId();
    }
});
