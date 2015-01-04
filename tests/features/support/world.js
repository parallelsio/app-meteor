var World = function (callback) {
    if (!callback)
        return;

    var appSettings;

    try {
      appSettings = require("../../../meteor-app/settings.json");
    }
        //error handled next
    catch (error) {
    }

    if (!appSettings)
        throw new Error("You need to create a features/support/settings.local.js file. "
            + "See features/support/world.js for details.");

    var webdriver = require("selenium-webdriver"),
        extension = require("../../../build/parallels.crx.json");

    var browser = new webdriver.Builder()
        .usingServer("http://localhost:4444/wd/hub")
        .withCapabilities({
            "browserName": "chrome",
            "selenium-version": "2.44.0",
            "chromeOptions": {
                "args": ["user-data-dir=chromeprofile"],
                "extensions": [extension.base64]
            }
        })
        .build();

    //wait up to 2.5 seconds for an element to appear
    browser.manage().timeouts().implicitlyWait(2500);

    callback({
        browser: browser,
        settings: appSettings,
        webdriver: webdriver
    });
};

module.exports.World = World;
