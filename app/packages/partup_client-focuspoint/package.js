Package.describe({
    name: 'partup:client-focuspoint',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use([
        'templating',
        'lifelynl:focuspoint'
    ], ['client']);

    api.addFiles([
        'Focuspoint.html',
        'Focuspoint.js'
    ], 'client');
});
