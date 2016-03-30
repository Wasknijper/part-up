Package.describe({
    summary: 'Generate an icon font from SVG files. This is not a part-up original package, we just packaged it to include in our iconfont-process',
    version: '0.1.8',
    git:     'https://github.com/andrefgneves/meteor-iconfont.git',
    name:    'partup:iconfont-generator'
});

Package.registerBuildPlugin({
    name: 'partup:iconfont-generator',
    sources: [
        'plugin/iconfont.js'
    ],
    npmDependencies: {
        'fs-extra':         '0.16.5',
        'lodash':           '2.4.1',
        'MD5':              '1.2.1',
        'svg2ttf':          '1.2.0',
        'svgicons2svgfont': '1.0.0',
        'temp':             '0.7.0',
        'ttf2eot':          '1.3.0',
        'ttf2woff':         '1.2.0',
    }
});

Package.onUse(function(api) {
    api.add_files('plugin/stylesheet.tpl', 'server', {isAsset: true});
});

Package.on_test(function(api) {
    api.use('andrefgneves:iconfont');
    api.use('tinytest');

    api.add_files('iconfont_tests.js');
});

