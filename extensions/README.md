In order to build the extension for installation into the browser while running tests, you'll need to generate
a pem file. Follow the instructions below to generate the file. ***WARNING: DO NOT CHECK IN YOUR PEM FILE.***

1. Using the Chrome Browser, navigate to chrome://extensions/
2. Check the 'Developer mode' checkbox
3. Click 'Load unpacked extension...'
4. Select the location where you saved the `core-modules/extensions/chrome` directory

This should generate two files:

1. A crx file which is your packed extension. You can discard this file*

2. A pem file which is your chrome extension signature. This file is used by the build step.

*The `grunt build` task will auto-create the crx file so don't worry about deleting that.
