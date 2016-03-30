/**
 @namespace Places
 @name Places
 */
Places = new Mongo.Collection('places');

// Add indices
if (Meteor.isServer) {
    Places._ensureIndex('place_id');
    Places._ensureIndex({'created_at': 1}, {expireAfterSeconds: 604800});
}
