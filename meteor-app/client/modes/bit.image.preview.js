var 
  $bit,
  bitTemplate,
  bitData,
  bitPreviewingId,
  bitHoveringId;

Parallels.AppModes['preview-bit'] = {

  enter: function () {
    log.debug("mode:preview-bit:enter");

    bitHoveringId = Session.get('bitHoveringId');

    $bit = $("[data-id='" + bitHoveringId + "']");
    bitTemplate = Blaze.getView($bit[0]);
    bitData = Blaze.getData(bitTemplate);

    // TODO: disable bitHover too

    // only supporting image preview currently
    // webpage is currently represented on canvas as an image
    if ((bitData.type === "image") || (bitData.type === "webpage")){
      bitPreviewingId = bitHoveringId;
      Session.set('currentMode', 'preview-bit');
      Session.set('bitPreviewingId', bitPreviewingId);

      log.debug("bit:image:preview: " + bitPreviewingId);
      
      Parallels.KeyCommands.disableAll();
      Parallels.KeyCommands.bindEsc();

      var options = {
        bitData: bitData,
        $bit: $bit,
        bitTemplate: bitTemplate,
        direction: "expand"
      };

      Transform.scaleImage(options);
    }

    else {
      log.debug("bit:preview: is not an image. Do nothing." );
    }
  },
  
  exit: function () {
    log.debug("mode:preview-bit:exit");

    // refactor: get rid of dep on these vars.
    var bitPreviewingId = Session.get('bitPreviewingId');
    
    var $bit = $("[data-id='" + bitPreviewingId + "']");
    var bitTemplate = Blaze.getView($bit[0]);
    var bitData = Blaze.getData(bitTemplate);

    if (bitPreviewingId)
    {
      // TODO: pass the assignment/resetting of these 
      // into Transform.scale,
      // which will then reset it once the animation complete callback is triggered
      // this will avoid potential edge cases where person takes
      // action in between animations 
      Session.set('currentMode', null);
      Session.set('bitPreviewingId', null);

      var options = {
        bitData: bitData,
        $bit: $bit,
        bitTemplate: bitTemplate,
        direction: "contract"
      };

      Transform.scaleImage(options);

      Parallels.KeyCommands.bindAll();
    }

    else {
      log.debug("nothing to close: not previewing a bit");
    }
  }
};