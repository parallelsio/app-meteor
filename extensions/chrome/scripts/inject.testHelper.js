'use strict';

/* jshint jquery: true */

requirejs.config(requirejsConfig);

requirejs([], function () {
    console.log('init:testHelper');

    // a tags seem to get blocked on a lot of sites, including our own
    $( 'body' ).append( '<div id="activate-extension" class="test-helper">Activate Extension</div>' );

    $('#activate-extension').click(function () {
      console.log('testHelper:clipper-activated');
      chrome.extension.sendMessage({ data	: {event: 'test:clipper-activated'} });
    });

    return true;
  }
);
