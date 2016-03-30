Package.describe({
    name: 'partup:client-dropdown',
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
        'dropdown.html',
        'dropdown.js',
    ], 'client');
});
