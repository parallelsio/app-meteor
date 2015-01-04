function CanvasPage(world, callback) {
    var that = this;

    that.browser = world.browser;
    that.issueUrl = "http://127.0.0.1:3000";
    that.settings = world.settings;

    that.browser.getAllWindowHandles().then(function (handles) {
      that.handle = handles[0];
    });

    that._navigate().then(callback);
}

CanvasPage.prototype._navigate = function () {
  var that = this;
  that.browser.get(that.issueUrl);
  that.browser.sleep(2000); // wait for the animations

  // Have to chain 'then' to make this a promise and not immediately execute
  return that.browser.isElementPresent({xpath: '//div[@class="map"]'}).then(function(isPresent) {
    console.log('map present: ' + isPresent);
  });
};


CanvasPage.prototype.isBitPresent = function (id) {
  var that = this;

  var xpath = "//div[@data-title='"+ id + "']";

  return that.browser.isElementPresent({
    xpath: xpath
  });
};


CanvasPage.prototype.switchToClipperFrame = function () {
  this.browser.switchTo().frame(this.browser.findElement({id: "parallels-iframe"}));
};

CanvasPage.prototype.switchToPage = function () {
  return this.browser.switchTo().window(this.handle);
}

CanvasPage.prototype.toggleClipper = function () {
  this.browser.findElement({id: "activate-extension"}).click();
  return this.browser.sleep(1000);
};

module.exports = {
  CanvasPage: CanvasPage
};
