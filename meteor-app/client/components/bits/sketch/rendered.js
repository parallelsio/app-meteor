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
  var $bitElement = $(template.firstNode);
  var timeline;

  if (!npApiPlugin) {
    npApiPlugin = document.getElementById('wtPlugin');
  }

  var sketchBit = new SketchBit($bitElement, this.data, npApiPlugin);

  var draggable = makeBitDraggable($bitElement);

  // track the sketch bit's coordinates and opacity from mongo for concurrent session editing
  Tracker.autorun(function () {
    var bit = Bits.findOne(sketchBit._id);
    if (bit) {
      timeline = new TimelineMax();
      timeline.to(template.firstNode, 0, {x: bit.position.x, y: bit.position.y});
      $bitElement.css('opacity', bit.opacity);
    }
  });


  // isFocused() checks to see if Session.get("sketchBitEditingId") is set to this sketch.
  // As the sketchBitEditingId changes we need to ensure our code checks to see if it's now in focus for drawing.
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
    Parallels.log.debug("pressed 'c' key");
    if (sketchBit.isFocused()) {
      Parallels.log.debug("clearing bit:sketch canvas on ", sketchBit._id);
      Parallels.Audio.player.play('fx-pep');
      sketchBit.ploma.clear();
    }
  });

  mousetrap.bind('mod+z', function (event) {
    Parallels.log.debug("pressed 'command/ctrl + z'");

    if (sketchBit.isFocused()) {
      // remove the most recent stroke
      sketchBit.ploma.setStrokes(_.dropRight(sketchBit.ploma.getStrokes()));
      event.stopPropagation();
    }
  });

  mousetrap.bind('e', function () {
    Session.set('textBitEditingId', sketchBit._id);
  });

  mousetrap.bind('up', function (event) {
    Parallels.log.debug("pressed 'up' key");
    event.preventDefault();

    Parallels.Audio.player.play('fx-pep');
    var opacity = Number(template.firstNode.style.opacity);
    Parallels.log.debug("bit:sketch:opacity = ", opacity);

    if (opacity < 1) {
      template.firstNode.style.opacity = opacity + 0.10;
    }
    else {
      Parallels.Audio.player.play('fx-tri');
    }

    sketchBit.opacity = opacity;

  });

  mousetrap.bind('down', function (event) {
    Parallels.log.debug("pressed 'down' key");
    event.preventDefault();

    Parallels.Audio.player.play('fx-pep');
    var opacity = Number(template.firstNode.style.opacity);
    Parallels.log.debug("bit:sketch:opacity = ", opacity);

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
      Session.set('sketchBitEditingId', null);
    }
  });
});

