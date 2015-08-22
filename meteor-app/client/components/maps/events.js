var getDroppedFiles = function(e) {
  var files = e.target.files;

  if (!files || files.length == 0)
    files = e.dataTransfer ? e.dataTransfer.files : [];

  return files;
};

var createImageBit = function (file, downloadUrl, event, uploadKey, index) {
  var u = URL.createObjectURL(file);
  var img = new Image;
  var xOffset = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
  var yOffset = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
  img.onload = function() {
    Meteor.call('changeState', {
      command: 'createBit',
      data: {
        canvasId: Session.get('canvasId'),
        type: "image",
        position: {
          x: (event.clientX + xOffset) + (30 * index),
          y: (event.clientY + yOffset) + (30 * index)
        },
        filename: file.name,
        uploadKey: uploadKey,
        imageSource: downloadUrl,
        nativeWidth: img.width,
        nativeHeight: img.height
      }
    });
  };
  img.src = u;
};

Template.map.events({

  'mousemove .map': function (event) {
    pointerPosition =  {
      x: event.pageX,
      y: event.pageY
    };
  },

  'dropped .map': function(e) {
    var event = (e.originalEvent || e);

    Session.set('uploadProgress', 0);
    Session.set('uploading', true);

    var droppedFiles = getDroppedFiles(event);

    var fileUploads = _.map(droppedFiles, function (file, index) {
      var uploadKey = Math.random().toString(36).slice(2);
      var slingshotUploader = new Slingshot.Upload(Session.get('PARALLELS_FILE_UPLOADER') || 'fileSystemUploader');
      slingshotUploader.send(file, function (error) {
        if (error) Parallels.log.debug({dateTimeStamp: Date.now(), action: 'Image Upload', message: error.message});
      });
      Parallels.FileUploads[uploadKey] = slingshotUploader;
      createImageBit(file, slingshotUploader.url(true), event, uploadKey, index);
      return slingshotUploader;
    });

    Tracker.autorun(function (computation) {
      var overallProgress = 0;

      fileUploads.forEach(function (fileUpload) {
        var fileUploadProgress = fileUpload.progress();
        fileUploadProgress = Math.round((fileUploadProgress || 0) * 100);
        overallProgress = overallProgress + fileUploadProgress;
      });

      overallProgress = overallProgress / droppedFiles.length;
      Session.set('uploadProgress', Math.round(overallProgress || 0));

      if (overallProgress === 100) {
        Session.set('uploading', false);
        computation.stop();
      }
    });
  },

  'dblclick .map': function (event) {

    Parallels.log.debug("keyCommand:createBitViaMapDbleClick");

    Meteor.call('changeState', {
      command: 'createBit',
      data: {
        canvasId: Session.get('canvasId'),
        type: 'text',
        content: '',
        width: '150',
        height: '50',
        color: 'white',
        position: pointerPosition
      }
    }, function (err, bit) {
      if (!err) {
        Session.set('textBitEditingId', bit._id);
      }
    });
  },

});
