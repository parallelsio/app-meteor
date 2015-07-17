/*
 Ploma only does rendering
 doesnt care where location + pressure data come from
 Ploma can be used with any tablet

 SD/OQ:  - Any benefit of using Meteor template event map,
 versus doing it here?

 - Use a local collection to cache strokes to minimize
 delays/writes to db?

 */

// NAPAPI is necessary for interfacing with the Wacom tablet
// We can re-use the same npApiPlugin instance for all sketch bits
// (which is why it's a "global").
var npApiPlugin;

Template.sketchBit.onRendered(function () {
  var template = this;

  log.debug("bit:sketch:render");

  if (!npApiPlugin) {
    npApiPlugin = document.getElementById('wtPlugin');
  }

  var sketchBit = new SketchBit($(template.firstNode), this.data, npApiPlugin);
  var timeline;

  // track the sketch bit's coordinates and opacity from mongo for concurrent session editing
  Tracker.autorun(function () {
    var bit = Bits.findOne(sketchBit._id);
    if (bit) {
      timeline = new TimelineMax();
      timeline.to(template.firstNode, 0, {x: bit.position.x, y: bit.position.y});
      $(template.firstNode).css('opacity', bit.opacity);
    }
  });

  // TODO: set up a draggable initializer, for reuse across bits
  var draggable = Draggable.create(template.firstNode, {

    throwProps: false,
    zIndexBoost: false,

    onDragStart: function () {
      Parallels.Audio.player.play('fx-cinq-drop');
    },

    onPress: function () {
      timeline.to(template.firstNode, 0.20, {
        scale: 1.05,
        boxShadow: "rgba(0, 0, 0, 0.2) 0 16px 32px 0",
        ease: Expo.easeOut
      });
    },

    onRelease: function () {
      timeline.to(template.firstNode, 0.1, {scale: 1, boxShadow: "0", ease: Expo.easeOut});
    },

    onDragEnd: function () {
      var x = this.endX;
      var y = this.endY;

      Meteor.call('changeState', {
        command: 'updateBitPosition',
        data: {
          canvasId: '1',
          _id: sketchBit._id,
          position: {x: x, y: y}
        }
      });

      Parallels.Audio.player.play('tone--aalto-dubtechno-mod-' + _.random(4, 8));
      timeline.to(template.firstNode, 0.1, {scale: 1, boxShadow: "0", ease: Expo.easeOut});
      return true;
    }
  });

  // isFocused() checks to see if Session.get("bitEditingId") is set to this sketch.
  // As the bitEditingId changes we need to ensure our code checks to see if it's now in focus for drawing.
  Tracker.autorun(function () {
    if (sketchBit.isFocused() && !sketchBit.drawingEnabled) {
      draggable[0].disable(); // should not be able to drag the bit while editing
      sketchBit.enableDrawing();
    } else {
      draggable[0].enable();
      sketchBit.disableDrawing();
    }
  });

  var mousetrap = new Mousetrap(template.firstNode);

  mousetrap.bind('c', function () {
    log.debug("pressed 'c' key");
    if (sketchBit.isFocused()) {
      log.debug("clearing bit:sketch canvas on ", sketchBit._id);
      Parallels.Audio.player.play('fx-pep');
      sketchBit.ploma.clear();
    }
  });

  mousetrap.bind('mod+z', function (event) {
    log.debug("pressed 'command/ctrl + z'");

    if (sketchBit.isFocused()) {
      // remove the most recent stroke
      sketchBit.ploma.setStrokes(_.dropRight(sketchBit.ploma.getStrokes()));
      event.stopPropagation();
    }
  });

  mousetrap.bind('e', function () {
    Session.set('bitEditingId', sketchBit._id);
  });

  mousetrap.bind('up', function (event) {
    log.debug("pressed 'up' key");
    event.preventDefault();

    Parallels.Audio.player.play('fx-pep');
    var opacity = Number(template.firstNode.style.opacity);
    log.debug("bit:sketch:opacity = ", opacity);

    if (opacity < 1) {
      template.firstNode.style.opacity = opacity + 0.10;
    }
    else {
      Parallels.Audio.player.play('fx-tri');
    }

    sketchBit.opacity = opacity;

  });

  mousetrap.bind('down', function (event) {
    log.debug("pressed 'down' key");
    event.preventDefault();

    Parallels.Audio.player.play('fx-pep');
    var opacity = Number(template.firstNode.style.opacity);
    log.debug("bit:sketch:opacity = ", opacity);

    if (opacity > 0.10) {
      template.firstNode.style.opacity = (opacity - 0.10);
    }
    else {
      Parallels.Audio.player.play('fx-tri');
    }

    sketchBit.opacity = opacity;

  });

  mousetrap.bind('enter', sketchBit.save.bind(sketchBit));

  mousetrap.bind('esc', function (event) {
    if (sketchBit.isFocused()) {
      sketchBit.ploma.setStrokes(sketchBit.content);
      event.stopPropagation();
      Session.set('bitEditingId', null);
    }
  });
});
