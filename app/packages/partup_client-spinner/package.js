Package.describe({
    name: 'partup:client-spinner',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Npm.depends({
    'spin.js': '2.0.1'
});

Package.onUse(function(api, where) {
    api.use([
        'templating',
        'underscore'
    ], 'client');

    api.addFiles([
        '.npm/package/node_modules/spin.js/spin.js',
        'Spinner.html',
        'Spinner.js'
    ], 'client');
});
