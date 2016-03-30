Package.describe({
    name: 'partup:client-invite-to-activity',
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

        'InviteToActivity.html',
        'InviteToActivity.js'

    ], 'client');

});
