Package.describe({
    name: 'partup:client-gallery',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {

    api.use([
        'templating',
        'partup:lib'
    ], 'client');

    api.addFiles([

        'Gallery.html',
        'Gallery.js'

    ], 'client');

});
