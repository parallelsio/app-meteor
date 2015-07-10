Meteor.startup(function(){

  console.log("Meteor.startup begin.");

  Parallels.Keys.bindAll();

  Meteor.call('getSetting', 'isFlockingAudioEnabled', function (err, displayIntroAnimation) {
    if (isFlockingAudioEnabled){
      Parallels.Audio.player.initAndStartEnv();
    }
  });

  // TODO: make Session bootup/init?
  Session.set('createTextBit', null);

  Tracker.autorun(function() {
    console.log(Bits.find().count() + ' bits, via Tracker:autorun');
  });

  Tracker.autorun(function() {
    console.log('Session:bitHoveringId is now: ', Session.get("bitHoveringId"), ', via Tracker:autorun');
  });

  // OQ: why is this reset twice? it's set above: line 9?
  Session.set('createTextBit', null);
});
