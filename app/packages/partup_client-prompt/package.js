Package.describe({
    name: 'partup:client-prompt',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {

    api.use([
        'templating',
        'reactive-var'
    ], 'client');

    api.addFiles([

        'Prompt.html',
        'Prompt.js'

    ], 'client');

});
