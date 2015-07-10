Package.describe({
  name: 'parallels-audio',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: '',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');

  api.use([
    "parallels-core@0.0.1",
    "lifeinchords:teoria@0.0.1"
  ], 'client', { weak: false, unordered: false });

  api.addFiles([
    'namespace.js',
    'definitions/ah.js',
    'definitions/elastic-stretch.js',
    'definitions/impulse-drop.js',
    'definitions/moog-seq.js',
    'definitions/sample-fx.js',
    'definitions/tink.js',
    'definitions/twin-pipes.js',
    'actions.js'
  ], 'client');
});
