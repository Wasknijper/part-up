/**
 @namespace PlacesAutocompletes
 @name PlacesAutocompletes
 */
PlacesAutocompletes = new Mongo.Collection('places_autocompletes');

// Add indices
if (Meteor.isServer) {
    PlacesAutocompletes._ensureIndex('query');
    PlacesAutocompletes._ensureIndex({'created_at': 1}, {expireAfterSeconds: 604800});
}
