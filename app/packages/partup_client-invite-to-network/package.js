Package.describe({
    name: 'partup:client-invite-to-network',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {

    api.use([
        'templating',
        'partup:lib',
        'aldeed:autoform'
    ], 'client');

    api.addFiles([

        'InviteToNetwork.html',
        'InviteToNetwork.js'

    ], 'client');

});
