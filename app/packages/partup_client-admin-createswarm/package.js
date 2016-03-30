Package.describe({
    name: 'partup:client-admin-createswarm',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use([
        'partup:lib'
    ], ['client', 'server']);

    api.use([
        'templating',
        'aldeed:autoform',
        'reactive-dict'
    ], 'client');

    api.addFiles([

        'AdminCreateSwarm.html',
        'AdminCreateSwarm.js',

        'templates/_EditSwarm.html',
        'templates/_EditSwarm.js'

    ], 'client');

});
