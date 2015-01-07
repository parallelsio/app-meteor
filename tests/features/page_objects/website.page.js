function WebsitePage(world, url, callback) {
  this.url = url;
  this.browser = world.browser;

  this._navigate(callback);
}

WebsitePage.prototype._navigate = function (callback) {
  this.browser.get(this.url);
  this.browser.sleep(2000);

  // Have to chain 'then' to make this a promise and not immediately execute
  return this.browser.isElementPresent({id: "activate-extension"}).then(callback);
};

WebsitePage.prototype.toggleClipper = function () {
  this.browser.findElement({id: "activate-extension"}).click();
  return this.browser.sleep(1000);
};

module.exports = {
  WebsitePage: WebsitePage
};
