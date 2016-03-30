/**
 * Publish all languages of partups
 *
 */
Meteor.publishComposite('languages.all', function() {
    return {
        find: function() {
            return Languages.find();
        }
    };
});
