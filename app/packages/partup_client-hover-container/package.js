Package.describe({
    name: 'partup:client-hover-container',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {


    api.use([
        'templating',
        'reactive-var',
        'reactive-dict'
    ], 'client');

    api.addFiles([

        'HoverContainer.html',
        'HoverContainer.js',

        'templates/upper.html',
        'templates/upper.js',
        'templates/upperList.html',
        'templates/upperList.js',
        'templates/network.html',
        'templates/network.js'

    ], 'client');

});
