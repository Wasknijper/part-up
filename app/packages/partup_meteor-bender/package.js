Package.describe({
  name: 'partup:meteor-bender',
  summary: 'Page transitions with bender',
  version: '0.1.7',
  git: 'https://github.com/groupbuddies/meteor-bender'
});

Package.onUse(function(api) {
  api.versionsFrom('METEOR@1');

  api.use([
    'percolate:velocityjs@1.0.0',
    'partup:lib'
  ], 'client');

  api.addFiles([
    'lib/bender.js',
    'lib/animations/none.js',
    'lib/animations/slide_horizontal.js',
    'lib/animations/slide_over.js',
    'lib/animations/slide_over_close.js',
    'lib/animations/cross_fade.js',
    'lib/animations/zoom.js'
  ], 'client');
});
