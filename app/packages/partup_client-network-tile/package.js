Package.describe({
    name: 'partup:client-network-tile',
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

        'NetworkTile.html',
        'NetworkTile.js'

    ], 'client');

});
