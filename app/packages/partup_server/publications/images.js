/**
 * Publish an image
 *
 * @param {String} networkId
 */
Meteor.publish('images.one', function(imageId) {
    check(imageId, String);

    this.unblock();

    return Images.find({_id: imageId}, {limit: 1});
});
