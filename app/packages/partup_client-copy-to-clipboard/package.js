Package.describe({
    name: 'partup:client-copy-to-clipboard',
    version: '0.0.1',
    summary: 'jQuery Clipboard plugin packaged for meteor. Official repo: https://github.com/pix/meteor-jquery-clipboard.git, repackaged by Lifely for newer versions of Meteor',
    documentation: null
});

Package.onUse(function(api) {

    api.use([
        'deps',
        'jquery'
    ], 'client');

    api.addFiles([
        'jquery.clipboard.js'
    ], 'client');

    api.addAssets([
        'jquery.clipboard.swf'
    ], 'client');

});
