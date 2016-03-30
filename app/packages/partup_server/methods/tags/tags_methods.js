Meteor.methods({
    /**
     * Return a list of tags based on search query
     *
     * @param {string} searchString
     */
    'tags.autocomplete': function(searchString) {
        check(searchString, String);

        var user = Meteor.user();
        if (!user) throw new Meteor.Error(401, 'unauthorized');

        try {
            return Tags.find({_id: new RegExp('.*' + searchString + '.*', 'i')}, {limit: 30}).fetch();
        } catch (error) {
            Log.error(error);
            throw new Meteor.Error(400, 'tags_could_not_be_autocompleted');
        }
    }
});
