'use strict';

define(['jquery', 'modules/messenger', 'jquery.tag-editor'], function ($, messenger) {

  var bit;

  var initialize = function () {
    console.log('parallels:init');
    $('button.cancel').on('click', onCancel);
    $('button.submit').on('click', onSubmit);
    $('.bit-tags').tagEditor({
      delimiter: ',;', // comma, semicolon
      placeholder: 'Enter tags ...'
    });
    messenger.sendEvent('iframe-loaded', {});
  };

  var onCancel = function () {
    console.log('parallels:onCancel');
    messenger.sendEvent('close-clipper', {});
  };

  var onSubmit = function () {
    console.log('parallels:onSubmit');

    bit.title = $('.bit-title').val();
    bit.context = $('.bit-context').val();
    bit.tags = $('.bit-tags').tagEditor('getTags')[0].tags;

    messenger.sendEvent('submit-bit', {bit: bit});
  };

  var onClipperActivated = function (data) {
    console.log('parallels:onClipperActivated');
    console.log(data);

    bit = {
      type: 'image',
      url: data.url,
      title: data.title,
      imageDataUrl: data.imageDataUrl,
      nativeWidth: data.nativeWidth,
      nativeHeight: data.nativeHeight,
      tags: [],
      context: null,
      createdAt: new Date(),
      position: {
        x: 0,
        y: 0
      }
    };

    $('.bit-title').val(data.title);
    $('.bit-screenshot').attr('src', data.imageDataUrl);
    messenger.sendEvent('show-clipper', {});
  };

  return {
    initialize: initialize,
    onClipperActivated: onClipperActivated
  };

});
