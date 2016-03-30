Package.describe({
    name: 'partup:client-resetpassword',
    version: '0.0.1',
    summary: 'The reset password module',
    documentation: null
});

Package.onUse(function(api) {

    api.use([
        'templating',
        'partup:lib',
        'aldeed:autoform'
    ], ['client']);

    api.addFiles([

        'Resetpassword.html',
        'Resetpassword.js'

    ], 'client');

});
