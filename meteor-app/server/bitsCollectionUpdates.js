// We use the Bits collection to enable reactive UI changes based on events
// invoked on a entity and initiated from our changeStateMethods.

var BitsUI = {
  insertBit: Meteor.bindEnvironment(function (event) {
    var bit = event.data.payload;
    Parallels.log.debug('bitsUI:insertBit', bit._id);

    var newBit = {
      _id: bit._id,
      canvasId: bit.canvasId,
      url: bit.url,
      title: bit.title,
      liftStatus: bit.liftStatus,
      content: bit.content,
      opacity: bit.opacity,
      width: bit.width,
      height: bit.height,
      type: bit.type,
      position: bit.position,
      filename: bit.filename,
      uploadKey: bit.uploadKey,
      imageSource: bit.imageSource,
      imageDataUrl: bit.imageDataUrl,
      nativeWidth: bit.nativeWidth,
      nativeHeight: bit.nativeHeight,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    Bits.insert(newBit);
  }, function (err) {
    Parallels.log.error('bitsUI:insertBit', err);
  }),

  updateBitPosition: Meteor.bindEnvironment(function (event) {
    var bit = event.data.payload;
    Parallels.log.debug('bitsUI:updateBitPosition', bit._id);

    var query = {
      $set: {
        position: bit.position,
        updatedAt: Date.now()
      }
    };

    Bits.update({_id: bit._id}, query, function (err /*, result */) {
      if (err) Parallels.log.error(err);
    });
  }, function (err) {
    Parallels.log.debug('bitsUI:updateBitPosition', err);
  }),

  updateBitContent: Meteor.bindEnvironment(function (event) {
    var bit = event.data.payload;
    Parallels.log.debug('bitsUI:updateBitContent', bit._id);

    var query = {
      $set: {
        content: bit.content,
        opacity: bit.opacity,
        width: bit.width,
        height: bit.height,
        updatedAt: Date.now()
      }
    };

    Bits.update({_id: bit._id}, query, function (err /*, result */) {
      if (err) Parallels.log.error(err);
    });
  }, function (err) {
    Parallels.log.debug('bitsUI:updateBitContent', err);
  }),

  updateImageSource: Meteor.bindEnvironment(function (event) {
    var bit = event.data.payload;
    Parallels.log.debug('bitsUI:updateImageSource', bit._id);

    var query = {
      $set: {
        imageSource: bit.imageSource,
        uploadKey: bit.uploadKey,
        updatedAt: Date.now()
      }
    };

    Bits.update({_id: bit._id}, query, function (err /*, result */) {
      if (err) Parallels.log.error(err);
    });
  }, function (err) {
    Parallels.log.debug('bitsUI:updateImageSource', err);
  }),

  updateBitHtml: Meteor.bindEnvironment(function (event) {
    var bit = event.data.payload;
    Parallels.log.debug('bitsUI:updateBitHtml', bit._id);

    var query = {
      $set: {
        html: bit.html,
        liftStatus: bit.liftStatus,
        updatedAt: Date.now()
      }
    };

    Bits.update({_id: bit._id}, query, function (err /*, result */) {
      if (err) Parallels.log.error(err);
    });
  }, function (err) {
    Parallels.log.debug('bitsUI:updateBitHtml', err);
  }),

  removeBit: Meteor.bindEnvironment(function (event) {
    var bit = event.data.payload;
    Parallels.log.debug('bitsUI:removeBit', bit._id);

    Bits.remove(bit._id);
  }, function (err) {
    Parallels.log.debug('bitsUI:removeBit', err);
  })
};

InfiniteUndo.EventStream.on('entity.bit.created', BitsUI.insertBit);
InfiniteUndo.EventStream.on('entity.bit.undo_created', BitsUI.removeBit);
InfiniteUndo.EventStream.on('entity.bit.redo_created', BitsUI.insertBit);
InfiniteUndo.EventStream.on('entity.bit.deleted', BitsUI.removeBit);
InfiniteUndo.EventStream.on('entity.bit.undo_deleted', BitsUI.insertBit);
InfiniteUndo.EventStream.on('entity.bit.redo_deleted', BitsUI.removeBit);
InfiniteUndo.EventStream.on('entity.bit.positionUpdated', BitsUI.updateBitPosition);
InfiniteUndo.EventStream.on('entity.bit.undo_positionUpdated', BitsUI.updateBitPosition);
InfiniteUndo.EventStream.on('entity.bit.redo_positionUpdated', BitsUI.updateBitPosition);
InfiniteUndo.EventStream.on('entity.bit.contentUpdated', BitsUI.updateBitContent);
InfiniteUndo.EventStream.on('entity.bit.undo_contentUpdated', BitsUI.updateBitContent);
InfiniteUndo.EventStream.on('entity.bit.redo_contentUpdated', BitsUI.updateBitContent);
InfiniteUndo.EventStream.on('entity.bit.uploadImage', BitsUI.updateImageSource);
InfiniteUndo.EventStream.on('entity.bit.undo_uploadImage', BitsUI.updateImageSource);
InfiniteUndo.EventStream.on('entity.bit.redo_uploadImage', BitsUI.updateImageSource);
InfiniteUndo.EventStream.on('entity.bit.clipWebpage', BitsUI.updateBitHtml);
InfiniteUndo.EventStream.on('entity.bit.undo_clipWebpage', BitsUI.updateBitHtml);
InfiniteUndo.EventStream.on('entity.bit.redo_clipWebpage', BitsUI.updateBitHtml);
