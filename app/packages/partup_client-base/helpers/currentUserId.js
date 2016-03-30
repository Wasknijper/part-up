Template.registerHelper('currentUserId', function() {
    var user = Meteor.user();
    if (!user) return;

    return user._id;
});
