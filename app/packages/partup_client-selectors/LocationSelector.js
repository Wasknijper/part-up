var STUB_LOCATIONS = [
    {
        'city': 'Amsterdam',
        'lat': 52.3702157000000028,
        'lng': 4.8951679000000006,
        'id': 'ChIJVXealLU_xkcRja_At0z9AGY',
        'country': 'Netherlands'
    },
    {
        'city': 'Rotterdam',
        'lat': 51.9244200999999990,
        'lng': 4.4777325000000001,
        'id': 'ChIJfcRUX2C3xUcRhUtelay7KVI',
        'country': 'Netherlands'
    },
    {
        'city': 'Den Haag',
        'lat': 52.0704977999999983,
        'lng': 4.3006998999999997,
        'id': 'ChIJcb2YQi-3xUcREGwejVreAAQ',
        'country': 'Netherlands'
    },
    {
        'city': 'Utrecht',
        'lat': 52.0907373999999876,
        'lng': 5.1214200999999999,
        'id': 'ChIJNy3TOUNvxkcR6UqvGUz8yNY',
        'country': 'Netherlands'
    }
];

Template.LocationSelector.onCreated(function() {
    var tpl = this;

    // When the value changes, notify the parent using the onSelect callback
    this.currentLocation = new ReactiveVar(false, function(a, location) {
        if (!location) return;

        if (tpl.data.onSelect) tpl.data.onSelect(location);
    });

    // Suggested locations
    tpl.suggestedLocations = new ReactiveVar();
    tpl.autorun(function() {
        var locations = STUB_LOCATIONS;
        tpl.suggestedLocations.set(locations);
    });
});

Template.LocationSelector.onRendered(function() {
    var tpl = this;

    // Reset the form when the LocationSelector closes
    var form = tpl.find('form');
    tpl.autorun(function() {
        var activeVar = Template.currentData().isActive;
        if (!activeVar) return;

        if (!activeVar.get()) {
            form.reset();
        }
    });

});

Template.LocationSelector.helpers({
    currentLocation: function() {
        return Template.instance().currentLocation.get();
    },
    suggestedLocations: function() {
        return Template.instance().suggestedLocations.get();
    },

    onAutocompleteQuery: function() {
        return function(query, sync, async) {
            Meteor.call('google.cities.autocomplete', query, function(error, locations) {
                lodash.each(locations, function(l) {
                    l.value = l.city; // what to show in the autocomplete list
                });
                async(locations);
            });
        };
    },
    onAutocompleteSelect: function() {
        var tpl = Template.instance();

        return function(location) {
            tpl.currentLocation.set(location);
        };
    },
});

Template.LocationSelector.events({
    'click [data-select-suggested-location]': function(event, template) {
        event.preventDefault();
        var locations = template.suggestedLocations.get();
        if (!locations || !locations.length) return;

        var locationId = event.currentTarget.getAttribute('data-select-suggested-location');
        var location = lodash.find(locations, {id: locationId});
        template.currentLocation.set(location);
    },
    'submit form': function(event) {
        event.preventDefault();
    }
});
