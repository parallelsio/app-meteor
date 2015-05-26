/*

  OQ: 
    * would binding 2x cause 2 listeners?
    * how to pass contextMessage properly?

  TODO: 
    * add a check before each bind function
      to ensure it doesnt already exist.

*/

Parallels.KeyCommands = {
  
  bindAll: function(){
    log.debug("keyCommand:bindAll");

    this.bindDelete("via all");
    this.bindShift("via all");
    this.bindSpace("via all");
    this.bindEsc("via all");
  },

  disableAll: function(){
    log.debug("keyCommand:disableAll");

    Mousetrap.unbind('d'); 
    Mousetrap.unbind('space'); 
    Mousetrap.unbind('shift'); 
    Mousetrap.unbind('esc'); 
  },

  bindDelete: function(){
    log.debug("keyCommand:bindDelete");

    Mousetrap.bind("d", function() {
      log.debug("pressed 'd' key");
      var bitHoveringId = Session.get('bitHoveringId');

      if (bitHoveringId) {
        log.debug("starting bit:delete on ", bitHoveringId);
        Parallels.Audio.player.play('fx-tri');
        Meteor.call('changeState', {
          command: 'deleteBit',
          data: {
            canvasId: '1',
            _id: bitHoveringId
          }
        });
      }
      
      else {
        log.debug ('delete key ignored, not captured for a specific bit')
      }

    });
  },

  bindSpace: function(){
    log.debug("keyCommand:bindSpace");

    Mousetrap.bind('space', function (event) {
      log.debug("pressed 'Space' key");
      var bitHoveringId = Session.get('bitHoveringId');
      var bitPreviewingId = Session.get('bitPreviewingId');

      try {
        event.stopPropagation();
        event.preventDefault();
      }
      catch (err) {
        /*  Try/Catch is here for integration tests:
            https://github.com/ccampbell/mousetrap/issues/257
        */
      }

      if (bitPreviewingId) { 
        log.debug("already preview bit: ", bitPreviewingId);
        return false; // failcheck - end if we're somehow already previewing
      }
      
      if (bitHoveringId) {
        Parallels.AppModes['preview-bit'].enter();
      }

      else{
        log.debug ('space key ignored, not captured for a specific bit')
      }
    });
  },

  bindShift: function(contextMessage){
    var contextMessage = contextMessage || "";
    log.debug("keyCommand:bindShift");

    // OQ: this strategy of passing the contextMessage isnt working
    Mousetrap.bind('shift', function (contextMessage){
      log.debug("pressed 'Shift' key : ", contextMessage);
      Parallels.AppModes['create-parallel'].enter();
    });
  },

  bindEsc: function(){
    log.debug("keyCommand:bindEsc");
    
    Mousetrap.bindGlobal('esc', function() {
      log.debug("pressed 'Esc' key");
      var currentMode = Session.get('currentMode');

      if (!currentMode) return;
      Parallels.AppModes[currentMode].exit();
    });
  }

};

