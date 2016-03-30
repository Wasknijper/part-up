Package.describe({
    name: 'partup:client-admin',
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
        'reactive-dict'
    ], 'client');

    api.addFiles([

        'Admin.html',
        'Admin.js'

    ], 'client');

});
