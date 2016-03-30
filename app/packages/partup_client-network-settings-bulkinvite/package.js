Package.describe({
    name: 'partup:client-network-settings-bulkinvite',
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
        'templating',
        'aldeed:autoform'
    ], 'client');

    api.addFiles([

        'NetworkSettingsBulkinvite.html',
        'NetworkSettingsBulkinvite.js'

    ], 'client');

});
