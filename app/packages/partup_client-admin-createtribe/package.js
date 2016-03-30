Package.describe({
    name: 'partup:client-admin-createtribe',
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

        'AdminCreateTribe.html',
        'AdminCreateTribe.js',

        'templates/_EditTribe.html',
        'templates/_EditTribe.js'

    ], 'client');

});
