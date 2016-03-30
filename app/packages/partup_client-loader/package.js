Package.describe({
    name: 'partup:client-loader',
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
        'Loader.html'
    ], 'client');
});
