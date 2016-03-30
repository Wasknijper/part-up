var path = Npm.require('path');

Meteor.methods({

    /**
     * Insert an image by url
     *
     * @param {String} url
     *
     * @return {String} imageId
     */
    'images.insertByUrl': function(url) {
        check(url, String);

        this.unblock();

        var result = HTTP.get(url, {'npmRequestOptions': {'encoding': null}});

        var filename = Random.id() + '.jpg';
        var body = new Buffer(result.content, 'binary');
        var mimetype = 'image/jpeg';

        var image = Partup.server.services.images.upload(filename, body, mimetype);

        return {
            _id: image._id
        };
    }

});
