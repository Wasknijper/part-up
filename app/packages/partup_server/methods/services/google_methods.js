Meteor.methods({

    /**
     * Get an autocompletion of cities
     *
     * @param {String} term
     */
    'google.cities.autocomplete': function(term) {
        check(term, String);

        this.unblock();

        var results = Partup.server.services.google.searchCities(term);

        return results.map(function(result) {
            return {
                id: result.place_id,
                city: result.description
            };
        });
    }

});
