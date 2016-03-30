Package.describe({
    name: 'partup:client-network-settings-uppers',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use([
        'partup:lib',
        'meteorhacks:subs-manager'
    ], ['client', 'server']);

    api.use([
        'templating'
    ], 'client');

    api.addFiles([

        'NetworkSettingsUppers.html',
        'NetworkSettingsUppers.js'

    ], 'client');

});
