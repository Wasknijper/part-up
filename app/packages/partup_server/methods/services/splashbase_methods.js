var d = Debug('methods:splashbase_methods');

Meteor.methods({
    /**
     * Return Splashbase images based on tags
     *
     * @param {string[]} tags
     * @param {number} count Number of results to return
     */
    'partups.services.splashbase.search': function(tags, count) {
        check(tags, [String]);
        check(count, Match.Optional(Number));

        this.unblock();

        if (!tags || !tags.length || !tags[0] || !tags[0].length) {
            var error = 'No tags given';
            Log.error(error);
            throw new Meteor.Error(400, error);
        }

        // Set default values
        count = Math.min(count, 5) || 5;

        var lookupTags = Meteor.wrapAsync(function(tags, count, callback) {

            var searchByTags = function(tags, count, photos) {
                // Splashbase doesn't handle comma's
                tags = tags.join(' ');

                HTTP.get('http://www.splashbase.co/api/v1/images/search?query=' + encodeURIComponent(tags), null, function(error, result) {
                    if (error || result.statusCode !== 200) {
                        Log.error(error);
                        throw new Meteor.Error(400, 'Error while getting photos from Splashbase: ' + error);
                    }

                    var images = result.data.images;
                    var pictureData = [];

                    images.forEach(function(image) {
                        pictureData.push({
                            'imageUrl': image.url,
                            'authorUrl': image.site
                        });
                    });

                    d('Image URLs downloaded from Splashbase:', pictureData);

                    // Randomize array a little and slice off the count before returning
                    return callback(null, pictureData.sort(function() {
                        return .5 - Math.random();
                    }).slice(0, count));
                });
            };

            searchByTags(tags, count);
        });

        return lookupTags(tags, count);
    }
});
