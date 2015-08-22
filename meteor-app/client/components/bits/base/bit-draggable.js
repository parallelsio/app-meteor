makeBitDraggable = function makeBitDraggable($bitElement){

  var timeline = new TimelineMax();

  // // Needs to happen after position set, or else positions
  // // via manual transforms get overwritten by Draggable
  // // http://greensock.com/docs/#/HTML5/GSAP/Utils/Draggable
  var draggable = Draggable.create($bitElement, {
    throwProps:false,
    zIndexBoost:false,

    onPress: function(event){
      // TODO: improve performance
      // use image asset instead of CSS shadow:
      // https://stackoverflow.com/questions/16504281/css3-box-shadow-inset-painful-performance-killer

      timeline
        .to($bitElement, 
          0.10, 
          {
            scale: 1.05,
            boxShadow: "rgba(0, 0, 0, 0.2) 0 16px 32px 0",
            ease: Expo.easeOut
        })
        .to($bitElement.find('.bit__drag-handle'), 0.1, { scale: 1.5, opacity: "0.1", ease: Expo.easeOut }), "-=0.10";
    },

    onRelease: function(event){
      timeline
        .to($bitElement, 0.1, { scale: 1, boxShadow: "0", ease: Expo.easeOut })
        .to($bitElement.find('.bit__drag-handle'), 0.1, { scale: 1, opacity: "1", ease: Expo.easeOut }), "-=0.10";
    },

    onDragStart:function(event){
      // var x = this.endX;
      // var y = this.endY;
      // Parallels.log.debug(event.type, " : dragStart: ", x, " : ", y, " : ", this.getDirection("start"), " : ");
      Parallels.Audio.player.play('fx-cinq-drop');
    },

    onDragEnd:function( event ) {
      var x = this.endX;
      var y = this.endY;
      var mongoId = this.target.dataset.id;

      Meteor.call('changeState', {
        command: 'updateBitPosition',
        data: {
          canvasId: Session.get('canvasId'),
          _id: mongoId,
          position: { x: x, y: y }
        }
      });

      // a random tone, in the mid-range of the scale
      Parallels.Audio.player.play('tone--aalto-dubtechno-mod-' + _.random(4, 8));

      timeline
        .to($bitElement, 0.1, { scale: 1, boxShadow: "0", ease: Expo.easeOut });
    }
  });

  return draggable;
};
