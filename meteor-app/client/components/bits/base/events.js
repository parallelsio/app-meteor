BitEvents = {

  // TODO: clean up

  hoverInBit: function (event, template) {
    // prevents bits that were under the bit person is dragging, from starting to highlight
    // TODO: refactor to use GSAP built in methods, to test if something is being dragged?
    if (!Session.get('mousedown')) {
      Session.set('bitHoveringId', template.data._id);

      Parallels.Audio.player.play('fx-ting3');

      // SD: OQ/TODO: this fails on bit:delete, how can we reuse this function?
      var $bitElement = $(template.firstNode);
      $bitElement.addClass('hovering');
      $bitElement.find('.bit__controls-persistent').show();
    }
  },

  hoverOutBit: function (event, template){
    if (!Session.get('mousedown')) {
      Session.set('bitHoveringId', null);

      var $bitElement = $(template.firstNode);
      $bitElement.removeClass('hovering');
      $bitElement.find('.bit__controls-persistent').hide();

    }
  }
};


// for more bit events see /client/lib/key-bindings.js
Template.bit.events({

  'mouseenter .bit': BitEvents.hoverInBit,

  'mouseleave .bit': BitEvents.hoverOutBit,

  'mousedown .bit': function () {
    Session.set('mousedown', true);
  },

  'mouseup .bit': function () {
    Session.set('mousedown', false);
  },

  'dblclick .bit': function (event, template) {
    event.stopPropagation() // so map doesnt register a double click

    var $bitElement = $(template.firstNode);
    if (template.data.type === "text" && !(Session.get('textBitEditingId'))) { 
      Session.set('textBitEditingId', template.data._id);
      Parallels.AppModes['edit-text-bit'].enter($bitElement, template);
    }
  },

  'click .controls__icon-save': function (event, template) {
     if (Session.get('textBitEditingId')){
      var $bitElement = $(template.firstNode);
      var withSave = true;
      Parallels.AppModes['edit-text-bit'].exit($bitElement, template, withSave);
    }
  },

  'click .controls__icon-delete': function (event, template) {
     var bitDeleteId = Session.get('textBitEditingId');

     if (bitDeleteId){
      Parallels.log.debug("starting bit:delete on ", bitDeleteId);
      Parallels.Audio.player.play('fx-tri');

        Meteor.call('changeState', {
          command: 'deleteBit',
          data: {
            canvasId: Session.get('canvasId'),
            _id: bitDeleteId
          }
        });

      var $bitElement = $(template.firstNode);
      var withSave = false;
      Parallels.AppModes['edit-text-bit'].exit($bitElement, template, withSave);
    }
  },

  'click .controls__icon-cancel': function (event, template) {

      // Parallels.Audio.player.play('fx-tri');
      var $bitElement = $(template.firstNode);
      var withSave = false;
      Parallels.AppModes['edit-text-bit'].exit($bitElement, template, withSave);
  }

});
