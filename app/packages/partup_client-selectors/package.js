Package.describe({
    name: 'partup:client-selectors',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use([
        'meteorhacks:subs-manager'
    ], ['client', 'server']);

    api.use([
        'templating',
        'partup:lib'
    ], 'client');

    api.addFiles([
        'BasicSelector.html',
        'BasicSelector.js',
        'NetworkSelector.html',
        'NetworkSelector.js',
        'LocationSelector.html',
        'LocationSelector.js',
        'LanguageSelector.html',
        'LanguageSelector.js'
    ], 'client');

});
