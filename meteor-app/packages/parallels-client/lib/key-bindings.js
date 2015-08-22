/*

 TODO:
 * add a check before each bind function
 to ensure it doesnt already exist.

 * refactor structure into bind + unbind for each key

 */



Parallels.Keys = {

  bindActions: function () {

    // TODO: add 'except' param, convery this list into a map
    Parallels.log.debug("keyCommand:bindActions");

    this.bindDeleteBit();
    this.bindCreateSketchBit();
    this.bindCreateTextBit();
    this.bindEditTextBit();
    this.bindBeginCreateParallel();
    this.bindImageBitPreview();
    this.bindHistory();
    this.bindUndo();
    this.bindRedo();
  },

  unbindActions: function () {
    Parallels.log.debug("keyCommand:disableActions");

    // delete bit
    Mousetrap.unbind('d');

    // create new text bit
    Mousetrap.unbind('t');

    // edit text bit
    Mousetrap.unbind('e');

    // preview
    Mousetrap.unbind('space');

    // create-parallel
    Mousetrap.unbind('shift');

    // history dialog, for undo/redo
    Mousetrap.unbind('h');

    // undo last action
    // mod is an alias for both Apple/command (Mac) and control (Win/Linux)
    Mousetrap.unbind('mod+z');

    // redo last action
    Mousetrap.unbind('mod+shift+z');

    // create new sketch bit
    Mousetrap.unbind('s');

    // shortcuts
    Mousetrap.unbind('1', function () {

      Parallels.Panels.toggleShortcuts("close");

      // TODO: clear + garbage collect timeline objects, handlers
      $('.shortcut').each(function () {
        $shortcut = $(this);
        Parallels.log.debug('unbinding each shortcut: ', $shortcut);
      });

    });

  },

  bindShortcuts: function () {
    Parallels.log.debug("keyCommand:bindShortcuts");
    Session.set('isShortcutsDisplayed', false);

    Mousetrap.bind("1", function () {
      Parallels.log.debug("pressed '1' key");

      Parallels.Panels.toggleShortcuts();

    });
  },

  bindDeleteBit: function () {
    Parallels.log.debug("keyCommand:bindDeleteBit");

    Mousetrap.bind("d", function () {
      Parallels.log.debug("pressed 'd' key");
      var bitHoveringId = Session.get('bitHoveringId');

      if (bitHoveringId) {
        Parallels.log.debug("starting bit:delete on ", bitHoveringId);
        Parallels.Audio.player.play('fx-tri');
        Meteor.call('changeState', {
          command: 'deleteBit',
          data: {
            canvasId: Session.get('canvasId'),
            _id: bitHoveringId
          }
        });
      }

      else {
        Parallels.log.debug('delete key ignored, not captured for a specific bit')
      }

    });
  },

  bindImageBitPreview: function () {
    Parallels.log.debug("keyCommand:bindImageBitPreview");

    Mousetrap.bind('space', function (event) {
      Parallels.log.debug("pressed 'Space' key");
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
        Parallels.log.debug("already previewing bit: ", bitPreviewingId);
        return false; // failcheck - end if we're somehow already previewing
      }

      if (bitHoveringId) {
        Parallels.AppModes['preview-bit'].enter();
      }

      else {
        Parallels.log.debug('space key ignored, not captured for a specific bit')
      }
    });
  },

  bindBeginCreateParallel: function () {
    Parallels.log.debug("keyCommand:bindBeginCreateParallel");

    Mousetrap.bind('shift', function () {
      var bitHoveringId = Session.get('bitHoveringId');
      var currentMode = Session.get('currentMode');

      // begin craete parallel,
      // bitHoveringId is the origin/source bit
      if (bitHoveringId && (!currentMode)) {
        Parallels.AppModes['create-parallel'].enter();
      }

      // else if (bitHoveringId && (currentMode === 'create-parallel')) {
      //   Parallels.log.debug('closing parallel with ', bitHoveringId);
      // }
    });
  },

  bindCreateSketchBit: function () {
    Parallels.log.debug("keyCommand:bindCreateSketchBit");

    Mousetrap.bind('s', function () {
      Meteor.call('changeState', {
        command: 'createBit',
        data: {
          canvasId: Session.get('canvasId'),
          type: 'sketch',
          content: [],
          opacity: 1,
          color: 'blue',
          position: pointerPosition
        }
      }, function (err, bit) {
        if (!err) {
          Session.set('sketchBitEditingId', bit._id);
        }
      });
    });
  },

  bindCreateTextBit: function () {
    // TODO: 
  },

  bindEditTextBit: function () {
    // Parallels.log.debug("keyCommand:bindEditTextBit");

    // Mousetrap.bind("e", function () {
    //   Parallels.log.debug("pressed 'e' key");

    //   var bitHoveringId = Session.get('bitHoveringId');

    //   if (bitHoveringId) {
    //     var bitTemplate = Utilities.getBitTemplate(bitHoveringId);
    //     var bitData = Blaze.getData(bitTemplate);
    //     var $bitElement = Utilities.getBitElement(bitHoveringId);

    //     if (bitData.type === "text") {
    //       Session.set('textBitEditingId', bitHoveringId);
    //       Parallels.AppModes['edit-text-bit'].enter($bitElement, bitTemplate);
    //     }

    //     else {
    //       Parallels.log.debug("bit:edit: bit not of type 'text'.");
    //     }
    //   }

    //   else {
    //     Parallels.log.debug('edit key ignored, not captured for a specific bit')
    //   }
    // });
  },

  bindEsc: function () {
    Parallels.log.debug("keyCommand:bindEsc");

    Mousetrap.bindGlobal('esc', function () {
      Parallels.log.debug("pressed 'Esc' key");
      var currentMode = Session.get('currentMode');

      if (!currentMode) return;
      Parallels.AppModes[currentMode].exit();
    });
  },

  bindHistory: function () {
    Parallels.log.debug("keyCommand:bindHistory");

    Mousetrap.bind('h', function () {
      var viewingEventLog = Session.get('viewingEventLog');
      Session.set('viewingEventLog', !viewingEventLog);
    });
  },

  bindUndo: function () {
    Parallels.log.debug("keyCommand:bindUndo");

    Mousetrap.bind('mod+z', function () {
      Meteor.call('undoState', {canvasId: Session.get('canvasId')});
    });
  },

  bindRedo: function () {
    Parallels.log.debug("keyCommand:bindRedo");

    Mousetrap.bind('mod+shift+z', function () {
      Meteor.call('redoState', {canvasId: Session.get('canvasId')});
    });
  }

};
