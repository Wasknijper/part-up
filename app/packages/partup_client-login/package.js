Package.describe({
    name: 'partup:client-login',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {

    api.use([
        'templating',
        'aldeed:autoform',
        'accounts-password',
        'partup:lib',
        'reactive-var',
        'reactive-dict'
    ], 'client');

    api.addFiles([
        'Login.html',
        'Login.js',
    ], 'client');
});
