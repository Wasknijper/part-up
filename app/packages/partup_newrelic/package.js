Package.describe({
    name: 'partup:newrelic',
    version: '0.0.1',
    summary: '',
    git: '',
    documentation: null
});

Package.onUse(function(api) {
    api.addFiles('newrelic.js', ['server']);
    api.export('Newrelic', ['server']);
});

Npm.depends({
    'newrelic': '1.19.2'
});
