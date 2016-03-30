/*
 * Latency Compensation
 *
 * These "fake" methods are available and executed on clientside to perform latency compensation
 * This means that while the method is being called on the server, the "fake" client code is executed
 *
 * If a method fails on the server, the "fake" client side action is reverted
 */
Meteor.methods({
    'activities.insert': function(partupId, fields) {
        var upper = Meteor.user();
        var activity = Partup.transformers.activity.fromForm(fields, upper._id, partupId);
        activity._id = Activities.insert(activity);
    }
});
