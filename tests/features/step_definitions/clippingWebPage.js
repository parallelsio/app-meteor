module.exports = function () {
  this.World = require("../support/world.js").World;

  var CanvasPage = require("../page_objects/canvas_page.js").CanvasPage;

  var currentPage;

  this.When(/^I navigate to a webpage$/, function (callback) {
    currentPage = new CanvasPage(this, function (pageLoaded) {
      if (pageLoaded) {
        callback();
      } else {
        callback.fail('Parallels is not running or did not load successfully at ' + currentPage.parallelsUrl);
      }
    });
  });

  this.When(/^I use the extension to save$/, function (callback) {
    var self = this;

    currentPage.toggleClipper();
    currentPage.switchToClipperFrame();

    var cancelClipper = function () {
      self.browser.findElement({xpath: "//button[contains(@class, 'submit')]"}).click();

      return self.browser.sleep(2000);
    };

    cancelClipper().then(callback);
  });

  this.Then(/^the page should be saved to my canvas$/, function (callback) {
    currentPage.switchToPage();

    currentPage.isBitPresent('Parallels').then(function (isPresent) {
      if (isPresent)
        callback();
      else
        callback.fail();
    });
  });
};
