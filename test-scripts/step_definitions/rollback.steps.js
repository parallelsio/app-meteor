module.exports = function () {
  this.World = require("../support/world.js").World;

  this.When(/^I create a new text bit on the canvas with content "([^"]*)"$/, function (content, callback) {
    var self = this;

    self.browser.get('http://' + process.env.PARALLELS_DOMAIN).
      then(function () {
        self.browser.sleep(3000); // wait for animations to be done
        return self.browser.executeScript("var e = jQuery.Event( 'dblclick', { offsetX: 100, offsetY: 100 } ); $('.map').trigger(e);");
      }).
      then(function () {
        return self.browser.findElement(self.webdriver.By.className("bit--editing")).sendKeys(content);
      }).
      then(function () {
        return self.browser.findElement(self.webdriver.By.className("bit--editing")).sendKeys(self.webdriver.Key.RETURN);
      }).
      then(callback).
      then(null, function(err) {
        callback.fail(err);
      });
  });

  this.When(/^I click the "([^"]*)" link in the event stream$/, function (rollbackLinkText, callback) {
    var self = this;

    self.browser.executeScript("window.KeyboardSimulator = {};" +
      "window.KeyboardSimulator.keypress = function(k) {" +
        "var oEvent = document.createEvent('KeyboardEvent');" +
        "Object.defineProperty(oEvent, 'keyCode', {" +
          "get : function() {" +
            "return this.keyCodeVal;" +
          "}" +
        "});" +
        "Object.defineProperty(oEvent, 'which', {" +
          "get : function() {" +
            "return this.keyCodeVal;" +
          "}" +
        "});" +
        "if (oEvent.initKeyboardEvent) {" +
          "oEvent.initKeyboardEvent(\"keypress\", true, true, document.defaultView, false, false, false, false, false, false);" +
        "} else {" +
          "oEvent.initKeyEvent(\"keypress\", true, true, document.defaultView, false, false, false, false, k, 0);" +
        "}" +
        "oEvent.keyCodeVal = k;" +
        "if (oEvent.keyCode !== k) {" +
          "alert(\"keyCode mismatch \" + oEvent.keyCode + \"(\" + oEvent.which + \")\");" +
        "}" +
        "document.dispatchEvent(oEvent);" +
      "};").
      then(function () {
        return self.browser.executeScript("window.KeyboardSimulator.keypress(76);");
      }).
      then(function () {
        callback.pending();
      }).
      then(null, function(err) {
        callback.fail(err);
      });
  });

  this.Then(/^the bit should be gone$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

  this.Then(/^I should not see an event for creating the bit in my event stream$/, function (callback) {
    // Write code here that turns the phrase above into concrete actions
    callback.pending();
  });

};
