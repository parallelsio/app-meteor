const ConfigurationOptions = {
  displayIntroAnimation: {key: 'DISPLAY_INTRO_ANIMATION', default: 'true', type: 'boolean'},
  uploader: {key: 'UPLOADER', default: 'fileSystemUploader', type: 'string'}
};

function stringToBool(string) {
  switch (string.trim().toLowerCase()) {
    case 'false':
    case 'no':
    case '0':
    case '':
      return false;
    default:
      return true;
  }
}

function transformValue(value, type) {
  if (type === 'boolean') {
    return stringToBool(value);
  } else {
    return value.trim();
  }
}

Meteor.methods({
  getSetting: function (name) {
    check(name, String);
    var setting = ConfigurationOptions[name];
    if (!setting) {
      throw new Meteor.Error('setting-not-found', 'Missing configuration for ' + name);
    }
    return transformValue(process.env[setting.key] || setting.default, setting.type);
  }
});
