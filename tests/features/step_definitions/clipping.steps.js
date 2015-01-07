module.exports = function () {
  this.World = require("../support/world.js").World;

  var Website = require("../page_objects/website.page.js").WebsitePage;
  var Clipper = require("../page_objects/clipper.page.js").ClipperPage;
  var ParallelsApp = require("../page_objects/parallels.page.js").ParallelsPage;

  var website, clipper, parallelsApp;

  this.When(/^I navigate to a webpage$/, function (callback) {
    website = new Website(this, 'http://www.wikipedia.org', function (pageLoaded) {
      if (pageLoaded) {
        callback();
      } else {
        callback.fail('Web page is not running or did not load successfully at ' + website.url);
      }
    });
  });

  this.When(/^I use the extension to save$/, function (callback) {
    website.toggleClipper();
    clipper = new Clipper(this);
    clipper.focus();
    clipper.savePage().then(callback);
  });

  this.Then(/^the page should be saved to my canvas$/, function (callback) {
    parallelsApp = new ParallelsApp(this, function (pageLoaded) {
      if (pageLoaded) {
        parallelsApp.isBitPresent('Wikipedia').then(function (isPresent) {
          if (isPresent)
            callback();
          else
            callback.fail('Bit not found on canvas');
        });
      } else {
        callback.fail('Web page is not running or did not load successfully at ' + website.url);
      }
    });

  });
};
