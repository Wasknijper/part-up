Package.describe({
    name: 'partup:client-rating',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {

    api.use([
        'templating',
        'aldeed:autoform',
        'partup:lib',
        'reactive-var',
        'lifely:mout'
    ], 'client');

    api.addFiles([

        'RatingPlaceholders.js',
        'Rating.html',
        'Rating.js'

    ], 'client');

});
