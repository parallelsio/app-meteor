Parallels.AppModes['edit-text-bit'] = {


  enter: function ($bitElement, template) {

    Parallels.log.debug("mode:edit-text-bit:enter");

    // TODO: doesnt this auto wire up Esc key
    Session.set('currentMode', 'edit-text');
    Draggable.get( $bitElement ).disable();

    var $content = $bitElement.find('.bit__content');
    var $editingElement = $bitElement.find('.bit--editing');

    $editingElement.attr('contenteditable', 'true');
    $editingElement.attr('data-clickable', 'true');

    $content.resizable({
      handles: { se: '.ui-resizable-se' },

      stop: function (event, $resizable) {
        // getting weird behavior when trying to resize, 
        // as this Session var remain 'stuck'. 
        // Clear it as a hackfix
        Session.set('mousedown', null);

        Meteor.call('changeState', {
          command: 'updateBitContent',
          data: {
            canvasId: Session.get('canvasId'),
            _id: template.data._id,
            content: $editingElement.html(),
            height: $resizable.size.height,
            width: $resizable.size.width
          }
        });
      }
    });

    $bitElement.addClass('bit--selected');
    $bitElement.find('.bit__resize').show();
    $bitElement.find('.bit__controls-edit').show();

    $editingElement.focus();

    Parallels.Audio.player.play('fx-temp-temp-subtle');
    Parallels.Keys.unbindActions();
  },

  exit: function ($bitElement, template, withSave) {
    Parallels.log.debug("mode:edit-text-bit:exit");

    var $content = $bitElement.find('.bit__content');
    var $editingElement = $bitElement.find('.bit--editing');
    Session.set('currentMode', null);
    Draggable.get( $bitElement ).enable();

    $editingElement.attr('contenteditable', 'false');
    $editingElement.attr('data-clickable', 'false');

    $bitElement.removeClass('bit--selected');
    $bitElement.find('.bit__resize').hide();
    $bitElement.find('.bit__controls-edit').hide();

    Session.set('textBitEditingId', null);
    $editingElement.blur();

    if ((template.data.content != $editingElement.html()) && withSave) {
      Meteor.call('changeState', {
        command: 'updateBitContent',
        data: {
          canvasId: Session.get('canvasId'),
          _id: template.data._id,
          content: $editingElement.html(),
          height: $content.height(),
          width: $content.width()
        }
      });

      Parallels.Audio.player.play('fx-cha-ching');
    }

    Parallels.Keys.bindActions();
  }
};
