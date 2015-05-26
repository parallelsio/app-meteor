Template.bit.onDestroyed(function(){
  BitEvents.hoverOutBit();
});

Template.bit.onRendered(function (){

  var template = this;
  var bitDataContext = template.data;
  var bitDatabaseId = bitDataContext._id;
  var bitHtmlElement = Utilities.getBitHtmlElement(bitDatabaseId);
  log.debug("bit:render: ", bitDatabaseId);

  // Track upload status for new Bits
  Tracker.autorun(function (computation) {
    var bitUpload = Parallels.FileUploads[bitHtmlElement.data('upload-key')];
    if (!bitUpload) {
      computation.stop();
      return;
    }

    if (bitUpload.status() === 'failed') {
      /* 
        would show a friendly error message but the next line we remove the bit 
        so it isn't worth it. Should we figure out how to keep the Bit even if upload fails?
        bitHtmlElement.find('.content')[0].classList.add('complete', 'error'); 
      */ 
      computation.stop();
      Meteor.call('changeState', {
        command: 'deleteBit',
        data: {
          canvasId: '1',
          _id: bitDatabaseId
        }
      });
      return;
    }

    if (bitUpload.status() === 'done') {
      bitHtmlElement.find('.content')[0].classList.add('complete', 'success');
      Meteor.call('changeState', {
        command: 'uploadImage',
        data: {
          canvasId: '1',
          _id: bitDatabaseId,
          imageSource: bitUpload.instructions.download,
          uploadKey: null
        }
      });
      computation.stop();
    }
  });

  var bitDragAudioInstance = "";

  function timelineDone(bitDatabaseId){
    log.debug("bit:render. Move into position and keep hidden ", bitDatabaseId, " : timeline animate done");
  }

  var timeline = new TimelineMax({
    onComplete: timelineDone,
    onCompleteParams:[ bitDatabaseId  ]
  });

  // move to position, immediately hide
  timeline.to(bitHtmlElement, 0, { x: bitDataContext.position.x, y: bitDataContext.position.y });

  var resetBitSize = function(message){
    function timelineDone(bitDatabaseId){
      log.debug(message, bitDatabaseId);
    }

    var timeline = new TimelineMax({
      onComplete: timelineDone,
      onCompleteParams:[ bitDatabaseId  ]
    });

    timeline.to(bitHtmlElement, 0.1, { scale: 1, boxShadow: "0", ease: Expo.easeOut });
  };


  // // Needs to happen after position set, or else positions
  // // via manual transforms get overwritten by Draggable
  // // http://greensock.com/docs/#/HTML5/GSAP/Utils/Draggable
  Draggable.create(Template.instance().firstNode, {

    // TODO: unbind keys

    throwProps:false,
    zIndexBoost:false,

    onDragStart:function(event){
      log.debug("bit:drag:onDragStart", bitDatabaseId);

      var x = this.endX;
      var y = this.endY;

      // TODO: delay play so it's got time to 'breathe', and doesnt stutter ?
      // bitDragAudioInstance = Parallels.Audio.player.play('elasticStretch');
      // console.log(event.type, " : dragStart: ", x, " : ", y, " : ", this.getDirection("start"), " : ");

      Parallels.Audio.player.play('fx-cinq-drop');
    },

    onPress: function(event){
      function timelineDone(bitDatabaseId){
        log.debug("bit:drag:onPress", bitDatabaseId);
      }

      var timeline = new TimelineMax({
        onComplete: timelineDone,
        onCompleteParams:[ bitDatabaseId  ]
      });

      // TODO: improve performance
      // use image asset instead of CSS shadow: 
      // https://stackoverflow.com/questions/16504281/css3-box-shadow-inset-painful-performance-killer
      
      // TODO: ensure this happens only when in Draggable and mouse is held down
      // and not on regular taps/clicks of bit
      timeline.to(bitHtmlElement, 0.20, { scale: 1.05, boxShadow: "rgba(0, 0, 0, 0.2) 0 16px 32px 0", ease: Expo.easeOut });
    },

    onRelease: function(event){
      log.debug("bit:drag:onrelease", bitDatabaseId);
      resetBitSize("bit:drag:onRelease: animation end");
    },

    onDrag:function(event){
      var x = this.endX;
      var y = this.endY;

      // TODO: only display if changed from last reading's value
      console.log("bit:drag:onDrag: ", event.type, " : ", x, " : ", y, " : ", this.getDirection("start"), " : ", bitDragAudioInstance);

      // bitDragAudioInstance.set("elasticStretch.source.freq", x)
    },

    onDragEnd:function( event ) {
      log.debug("bit:drag:onDragEnd", bitDatabaseId);

      var x = this.endX;
      var y = this.endY;

      var mongoId = this.target.dataset.id;
      log.debug(event.type + ": " + mongoId + " : " + x + " : " + y);

      Meteor.call('changeState', {
        command: 'updateBitPosition',
        data: {
          canvasId: '1',
          _id: mongoId,
          position: { x: x, y: y }
        }
      });

      Session.set("dragInstance", null);

      Parallels.Audio.player.play('fx-ffft');

      resetBitSize("bit:drag:onDragEnd, animation end");


      // replace with envelope close instead:
      // it would be more performant, less slitch
      // and would be more like turning down the volume on the stereo,
      // rather than how we have it now, where were
      // pressing the power button to turn off
      // Parallels.Audio.player.stop();
      return true;
    }
  });

});


