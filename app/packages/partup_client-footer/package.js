Package.describe({
    name: 'partup:client-footer',
    version: '0.0.1',
    summary: 'Responsive black app footer',
    documentation: null
});

Package.onUse(function(api) {

    api.use([
        'templating',
        'partup:lib',
        'reactive-var'
    ], 'client');

    api.addFiles([

        'Footer.html',
        'Footer.js'

    ], 'client');

});
