SketchBit = function SketchBit($bit, bit, npApiPlugin) {
  var self = this;
  _.extend(self, bit);
  self.$bit = $bit;
  self.npApiPlugin = npApiPlugin;
  self.canvas = self.$bit.find('canvas')[0];
  self.ploma = new Ploma(self.canvas);
  self.ploma.setStrokes(self.content);
  self.drawingEnabled = false;
};

SketchBit.prototype.enableDrawing = function () {
  var self = this;
  var isStroke = false;
  self.drawingEnabled = true;
  self.$bit.css('cursor', 'crosshair');

  // begin a stroke at the mouse down point
  self.canvas.onmousedown = function (event) {
    isStroke = true;
    var point = self.getEventPoint(event);
    self.ploma.beginStroke(point.x, point.y, point.p);
    Parallels.Audio.player.play('fx-cinq-drop');

    // disabled - need to make sure performance is snappy first
    // template.firstNode.style.cursor = 'none';
  };

  // extend the stroke at the mouse move point
  self.canvas.onmousemove = function (event) {
    if (!isStroke) return;
    var point = self.getEventPoint(event);
    self.ploma.extendStroke(point.x, point.y, point.p);
  };

  // end the stroke at the mouse up point
  self.canvas.onmouseup = function (event) {
    isStroke = false;
    var point = self.getEventPoint(event);
    self.ploma.endStroke(point.x, point.y, point.p);
  };
};

SketchBit.prototype.disableDrawing = function () {
  var self = this;
  self.canvas.onmousedown = self.canvas.onmousemove = self.canvas.onmouseup = null;
  self.drawingEnabled = false;
};

SketchBit.prototype.getEventPoint = function (event) {
  var self = this;
  var point = {};

  // recalc mouse coordinates, accounting for combination of 2 things:
  // 1) where the bit sits, offset from 0,0 via the template instance
  // 2) if person is scrolled away from default viewport, via the Window object
  // use verge lib for cross-browser compatibility
  point.x = (verge.scrollX() + event.clientX) - self.$bit.position().left;
  point.y = (verge.scrollY() + event.clientY) - self.$bit.position().top;

  // fail gracefully if no pressure is detected (no tablet found)
  // tablet reports a range of 0 to 1
  point.p = self.npApiPlugin.penAPI && self.npApiPlugin.penAPI.pressure ? self.npApiPlugin.penAPI.pressure : 0.6;
  return point;
};

SketchBit.prototype.isFocused = function () {
  var self = this;
  var currentlyEditingId = Session.get('sketchBitEditingId');
  return currentlyEditingId && currentlyEditingId === self._id;
};

SketchBit.prototype.hasChanged = function () {
  var self = this;
  var addedOrRemovedStrokes = _.filter(self.ploma.getStrokes(), function (obj) {
    return !_.findWhere(self.content, obj);
  });
  var changedOpacity = self.$bit.css('opacity') != self.opacity;
  return changedOpacity || addedOrRemovedStrokes.length > 0;
};

SketchBit.prototype.save = function () {
  var self = this;

  if (self.hasChanged()) {
    Meteor.call('changeState', {
      command: 'updateBitContent',
      data: {
        canvasId: Session.get('canvasId'),
        _id: self._id,
        content: self.ploma.getStrokes(),
        opacity: self.opacity
      }
    }, function (err, bit) {
      _.extend(self, bit);
    });
  }

  Parallels.Audio.player.play('fx-cha-ching');

  if (self.isFocused()) {
    Session.set('sketchBitEditingId', null);
  }
};
