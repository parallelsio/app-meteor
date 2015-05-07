'use strict';

define(['browser', 'modules/server', 'lib/htmlParser/background/main'],
  function (browser, server, HTMLParser) {

    // TODO: How should we add new bits locally and at the same time have the list refresh while in development?
    var localBits = {};

    HTMLParser.subscribe('bg-init', function() {
      browser.notify({title: 'Bit Lift Received', message: 'Page Saved'}, function () {
        console.log('ok to close the browser');
      });
    });

    HTMLParser.subscribe('process-start', function(message) {
      //chrome.tabs.sendMessage(pageData.tabId, message);
      console.log('received process-start');
      console.log(message);
    });

    HTMLParser.subscribe('process-progress', function(message) {
      //chrome.tabs.sendMessage(pageData.tabId, message);
      console.log('received process-progress');
      console.log(message);
    });

    HTMLParser.subscribe('process-end', function(message) {
      console.log('finished parsing HTML');
      var pageIdentifier = btoa(message.data.url);
      localBits[pageIdentifier].html = message.data.content;
      localBits[pageIdentifier].liftStatus = 'complete';
      var updatedBit = JSON.parse(JSON.stringify(localBits[pageIdentifier]));
      delete updatedBit._id;
      var response = server.updateBit(localBits[pageIdentifier]._id, updatedBit);
      response.remote.then(function(data) {
        browser.notify({title: 'Bit Lift Complete', message: 'Page processed'}, function () {
          console.log('update is complete');
          console.log(data);
          delete localBits[pageIdentifier];
        });
      });
      response.remote.fail(function(err) {
        console.log('update is complete');
        console.log(err);
      });
    });

    /**
     * Bit: lift off!
     * @param pageInfo
     * @param callback
     */
    var startClipping = function (pageInfo) {
      var pageIdentifier = btoa(pageInfo.url);
      localBits[pageIdentifier] = {
        type: 'webpage',
        liftStatus: 'processing',
        url: pageInfo.url,
        title: pageInfo.title,
        nativeWidth: pageInfo.nativeWidth,
        nativeHeight: pageInfo.nativeHeight,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        position: {
          x: 0,
          y: 0
        }
      };

      browser.saveLocal({'parallels:bits': localBits}, function () {

        browser.currentTab(function (tab) {
          HTMLParser.start({id: tab.id, config: null, tabIds: null, processSelection: false, processFrame: false});
        });

        browser.screenshot(function (dataUrl) {
          localBits[pageIdentifier].imageDataUrl = dataUrl;
          saveBit({bit: localBits[pageIdentifier]});
          var message = JSON.parse(JSON.stringify(localBits[pageIdentifier]));
          message.event = 'clipper-activated';
          browser.sendMessageToDom({data: message});
        });
      });
    };

    /**
     * Save the bit back to the server
     * @param data
     */
    var saveBit = function (data) {
      server.saveBit(data.bit);
    };

    return {
      startClipping: startClipping,
      saveBit: saveBit
    };

  });
