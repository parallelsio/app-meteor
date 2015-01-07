function ParallelsPage(world, callback) {
  this.browser = world.browser;
  this.parallelsUrl = 'http://' + process.env.PARALLELS_DOMAIN;

  this._navigate(callback);
}

ParallelsPage.prototype._navigate = function (callback) {
  this.browser.get(this.parallelsUrl);
  this.browser.sleep(2000); // wait for the animations

  // Have to chain 'then' to make this a promise and not immediately execute
  return this.browser.isElementPresent({xpath: '//div[@class="map"]'}).then(callback);
};

ParallelsPage.prototype.isBitPresent = function (id) {
  return this.browser.isElementPresent({ xpath: "//div[@data-title='" + id + "']" });
};

module.exports = {
  ParallelsPage: ParallelsPage
};
