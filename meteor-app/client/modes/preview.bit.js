
Parallels.AppModes['preview-bit'] = {

  initVars: function(){
    // OQ: no scope for this function inside of enter/exit functions?
    // OQ: is this the right place to put this?
    // some of the session getting/setting is happening outside of the mode,
    // for example, in the binding of the Space bar key
    // TODO: make consistent across modes
    // var bitHoveringId = Session.get('bitHoveringId');
    // var $bit = $("[data-id='" + bitHoveringId + "']");
    // var bitTemplate = Blaze.getView($bit[0]);
    // var bitData = Blaze.getData(bitTemplate);
    // var bitPreviewingId = Session.get('bitPreviewingId');
  },

  enter: function () {
    log.debug("mode:preview-bit:enter");
    var bitHoveringId = Session.get('bitHoveringId');
    var $bit = $("[data-id='" + bitHoveringId + "']");
    var bitTemplate = Blaze.getView($bit[0]);
    var bitData = Blaze.getData(bitTemplate);
    var bitPreviewingId = bitHoveringId;
    Session.set('currentMode', 'preview-bit');
    Session.set('bitPreviewingId', bitPreviewingId);
    log.debug("mode:preview-bit: ", bitPreviewingId);
    
    // TODO: disable bitHover too

    // only supporting image preview currently
    // webpage is currently represented on canvas an image
    if ((bitData.type === "image") || (bitData.type === "webpage")){
      log.debug("bit:image:preview: " + bitHoveringId);

      // nothing is being previewed currently, expand the image
      Parallels.KeyCommands.disableAll();
      Parallels.KeyCommands.bindEsc();

      Transform.scaleImage(bitData, bitHoveringId, $bit, bitTemplate, "expand");
    }

    else {
      log.debug("bit:preview:", bitPreviewingId, " is not an image. Do nothing." );
    }
  },
  
  exit: function () {

    log.debug("mode:preview-bit:exit");

    var bitHoveringId = Session.get('bitHoveringId');
    var $bit = $("[data-id='" + bitHoveringId + "']");
    var bitTemplate = Blaze.getView($bit[0]);
    var bitData = Blaze.getData(bitTemplate);
    var bitPreviewingId = Session.get('bitPreviewingId');

    if (bitPreviewingId)
    {
      // OQ: what's the right place to reset the session?
      // is it on Greensock animate complete? If so, how do we send this into ScaleImage function?
      Session.set('currentMode', null);
      Session.set('bitPreviewingId', null);

      // close/restore to thumbnail size
      Transform.scaleImage(bitData, bitHoveringId, $bit, bitTemplate, "contract");

      Parallels.KeyCommands.bindAll();
    }

    else {
      log.debug("nothing to close: not previewing a bit");
    }
  }
};
