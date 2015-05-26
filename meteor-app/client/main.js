Meteor.startup(function(){
  log.debug("Meteor.startup begin.");

  Parallels.KeyCommands.bindAll();
  Parallels.Audio.player.init();

  // TODO: make Session bootup/init?
  Session.set('newTextBit', null);

  Tracker.autorun(function() {
    log.debug(Bits.find().count() + ' bits, via Tracker:autorun');
  });

  Tracker.autorun(function() {
    log.debug('Session:bitHoveringId is now: ', Session.get("bitHoveringId"), ', via Tracker:autorun');
  });

});
