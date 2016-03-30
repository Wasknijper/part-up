Package.describe({
    name: 'partup:client-profilesettings',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {

    api.use([
        'templating',
        'aldeed:autoform',
        'yogiben:autoform-tags',
        'reactive-var',
        'reactive-dict'
    ], 'client');

    api.addFiles([

        'Profilesettings.html',
        'Profilesettings.js'

    ], 'client');

});
