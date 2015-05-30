var 
  bitHoveringId,
  $bit,
  bitTemplate,
  bitData,
  bitPreviewingId;

Parallels.AppModes['preview-bit'] = {

  enter: function () {
    bitHoveringId = Session.get('bitHoveringId');
    $bit = $("[data-id='" + bitHoveringId + "']");
    bitTemplate = Blaze.getView($bit[0]);
    bitData = Blaze.getData(bitTemplate);
    bitPreviewingId = bitHoveringId;
    Session.set('currentMode', 'preview-bit');
    Session.set('bitPreviewingId', bitPreviewingId);
    log.debug("mode:preview-bit:enter ", bitPreviewingId);
    
    // TODO: disable bitHover too

    // only supporting image preview currently
    // webpage is currently represented on canvas an image
    if ((bitData.type === "image") || (bitData.type === "webpage")){
      log.debug("bit:image:preview: " + bitHoveringId);

      Parallels.KeyCommands.disableAll();
      Parallels.KeyCommands.bindEsc();

      var options = {
        bitData: bitData,
        bitHoveringId: bitHoveringId,
        $bit: $bit,
        bitTemplate: bitTemplate,
        direction: "expand"
      };

      Transform.scaleImage(options);
    }

    else {
      log.debug("bit:preview:", bitPreviewingId, " is not an image. Do nothing." );
    }
  },
  
  exit: function () {

    log.debug("mode:preview-bit:exit");

    // refactor: get rid of dep on these vars.
    var bitHoveringId = Session.get('bitHoveringId');
    var $bit = $("[data-id='" + bitHoveringId + "']");
    var bitTemplate = Blaze.getView($bit[0]);
    var bitData = Blaze.getData(bitTemplate);
    var bitPreviewingId = Session.get('bitPreviewingId');

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
        bitHoveringId: bitHoveringId,
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
