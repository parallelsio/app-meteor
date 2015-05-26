Parallels.AppModes['edit-bit'] = {
  
  enter: function (id) {

    var $bit = $("[data-id='" + id + "']");
    var bitTemplate = Blaze.getView($bit[0]);
    var bitData = Blaze.getData(bitTemplate);

    // currently, we're only supporting edit for text type
    if (bitData.type === "text") {
      Session.set('currentMode', 'edit-bit');
      Session.set('bitEditingId', id);
      log.debug("bit:edit: " + Session.get('bitEditingId'));
    }

    else {
      log.debug("bit:edit: bit not of type 'text'. Can't edit this yet."); 
    }

  },

  exit: function () {
    Session.set('currentMode', null);
    Session.set('bitEditingId', null);

    Meteor.call('changeState', {
      command: 'deleteBit',
      data: {
        canvasId: '1',
        _id: bitEditingId
      }
    });

  }
};



