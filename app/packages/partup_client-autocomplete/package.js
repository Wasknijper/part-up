Package.describe({
    name: 'partup:client-autocomplete',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use([
        'templating',
        'partup:lib'
    ], 'client');

    api.addFiles([
        'Autocomplete.html',
        'Autocomplete.js',
        'AutocompleteAdvanced.html',
        'AutocompleteAdvanced.js',
    ], 'client');
});
