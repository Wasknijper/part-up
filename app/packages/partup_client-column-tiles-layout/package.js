Package.describe({
    name: 'partup:client-column-tiles-layout',
    version: '0.0.1',
    summary: 'View tiles in a column-based layout'
});

Package.onUse(function(api) {
    api.use([
        'tap:i18n'
    ], ['client', 'server']);

    api.use([
        'templating',
        // 'reactive-var'
    ], 'client');

    api.addFiles([
        'ColumnTilesLayout.html',
        'ColumnTilesLayout.js',

        // 'subtemplates/Tile.html',
        // 'subtemplates/Tile.js'
    ], 'client');
});
