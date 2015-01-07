function ClipperPage(world) {
  this.browser = world.browser;
}

ClipperPage.prototype.focus = function () {
  this.browser.switchTo().frame(this.browser.findElement({id: "parallels-iframe"}));
};

ClipperPage.prototype.savePage = function () {
  this.browser.findElement({xpath: "//button[contains(@class, 'submit')]"}).click();
  return this.browser.sleep(10000); // Give some time for the bit to be saved back to the canvas
};

module.exports = {
  ClipperPage: ClipperPage
};
