/*
      TODO: pass one bit object, get the other things from it, 
      versus passing 3 diff parts of similar objects
      
      TODO: refactor: remove bitPrevieweingId, combine bit references, 
      and dont go to Session store for original H/W
  */

Transform = {
  
  scaleImage: function(options){

    var $bitImg = $(options.bitTemplate.templateInstance().$('img'));

    var bitThumbnailHeight = $bitImg.height();
    var bitThumbnailWidth = $bitImg.width();

    var maskLeft         = $('.wipe.bit-preview.side-to-side .mask.left');
    var maskRight        = $('.wipe.bit-preview.side-to-side .mask.right');

    var documentWidth  = $(document).width();
    var documentHeight = $(document).height();

    var toWidth, toHeight, easeType;

    // set up and calculate the vars to be used during the animation differently,
    // depending on if the image is to be expanded or contracted.

    // when expanding, we try to make the image use up most of the viewport space to preview
    // and save the image's thumbnail height+width in a session var
    if (options.direction === "expand")
    {
      // padding for top and bottom, in pixels
      var edgePadding = 10;

      // using d.d.c faster than jQuery(window).width()
      // http://ryanve.com/lab/dimensions
      // TODO: refactor to use Verge lib. available as Meteor package?

      // calc the height available, accounting for space for image to breathe from edges
      var freeHeight = document.documentElement.clientHeight - (edgePadding * 2);

      // use freeHeight to determine how to preview
      // TODO: use height + width, for cases where height fits nicely
      // in the viewport, but image is very wide, wider than viewport
      if ((options.bitData.nativeHeight > bitThumbnailHeight) &&
          (bitThumbnailHeight <= freeHeight)) {

        var previewHeight = freeHeight;

        /*
            calc for the new width:

             nativeHeight       previewHeight
            -------------  =  ----------------
             nativeWidth       x (previewWidth)
        */
        var previewWidth = Math.floor((options.bitData.nativeWidth * previewHeight) / options.bitData.nativeHeight);

        toWidth = previewWidth;
        toHeight = previewHeight;
        easeType = Expo.easeOut;
      }
    }

    // when contracting (on the way down), the animation bounces to give it a feel
    // like gravity is at play. We use the original thumbnail height + width,
    // as our destination height + width, saved to the session when we expanded,
    // and clear these vars when finished
    else if (options.direction === "contract")
    {
      toWidth = Session.get('bitThumbnailWidth');
      toHeight = Session.get('bitThumbnailHeight');
      easeType = Elastic.easeOut.config(2, 0.4)
    }

    var animationOptions = {
      width: toWidth,
      height: toHeight,
      scale: 1,
      ease: easeType
    };


    var timelineStart = function () {
      log.debug('bit:preview timeline starting ...');

      // TODO: kill all running animations

      // disable scrolling
      $("body").css( "overflow", "hidden");

      // TODO: disable bit actions (drag, delete)

      if (options.direction === "expand") {
        Session.set('bitThumbnailHeight', bitThumbnailHeight);
        Session.set('bitThumbnailWidth', bitThumbnailWidth);
        Parallels.Audio.player.play('fx-quad-ripple');
      }

      else if (options.direction === "contract"){
        Session.set('bitThumbnailWidth', null);
        Session.set('bitThumbnailHeight', null);
        Parallels.Audio.player.play('fx-temp-temp');
      }
    };

    var timelineDone = function( bitPreviewingId, direction ){
      log.debug("bit:preview:", bitPreviewingId, " : " , direction, " : tween done." );
    };

    var timeline = new TimelineMax({
      onStart: timelineStart,
      onComplete: timelineDone,
      onCompleteParams:[ options.bitPreviewingId, options.direction ]
    });

    // run the animations.
    // the settings and sequencing is inspired by the Zelda 'wipes'
    // https://www.youtube.com/watch?v=wHaZrYX0kAU&t=14m54s
    if (options.direction === "expand")
    {
      log.debug("expanding...");

      timeline
        .set($('.wipe.bit-preview.side-to-side'), { alpha: 1, display: "block" })
        .fromTo(maskRight,  0.25, { x:  documentWidth / 2, ease: Expo.easeOut }, { x: 0 }, 0.12 )
        .fromTo(maskLeft,   0.25, { x: -documentWidth / 2, ease: Expo.easeOut }, { x: 0 }, 0.12 )

        // TODO: this wont be needed after on hover, bit swaps to top of
        // z-index stack
        .set(options.$bit, { zIndex: 10 })

        // TODO: move/center viewport around the image

        // blow up image from thumbnail size up to fit the viewport height
        .to($bitImg, 0.10, { scale: 0.9, ease:Quint.easeOut } )
        .to($bitImg, 0.25, animationOptions );
    }

    else if (options.direction === "contract")
    {
      log.debug("contracting...");

      timeline

        .fromTo(maskLeft, 0.25, { x: 0 }, { x: -documentWidth / 2, ease: Expo.easeOut }, 0.12 )
        .fromTo(maskRight, 0.25, { x: 0 }, { x:  documentWidth / 2, ease: Expo.easeOut }, 0.12 )

        // contract image from viewport height down to original thumbnail size
        .to($bitImg, 0.10, { scale: 1.1, ease:Quint.easeOut } )
        .to($bitImg, 0.25, animationOptions )

        .set(options.$bit, { zIndex: 1 })
        .set($('.wipe.bit-preview.side-to-side'), { alpha: 0, display: "none" });
    }
  }
};
