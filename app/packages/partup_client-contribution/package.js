Package.describe({
    name: 'partup:client-contribution',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {

    api.use([
        'templating',
        'aldeed:autoform',
        'partup:lib',
        'reactive-var'
    ], 'client');

    api.addFiles([

        'ContributionPlaceholders.js',
        'Contribution.html',
        'Contribution.js'

    ], 'client');

});
