/* 
 *  Adapted from from http://flockingjs.org/demos/interactive/html/playground.html#polyphonicSynth
 *  
 *  OQ: I love the tone of the SoundPrism app on iOS. How do we replicate that here?
 */

// Parallels.Audio.Definition.ah = {

    // _fundamental: 440;

    // _polySynth: flock.synth.polyphonic({
    //     synthDef: {
    //         id: "carrier",
    //         ugen: "flock.ugen.sin",
    //         freq: fundamental,
    //         mul: {
    //             id: "env",
    //             ugen: "flock.ugen.asr",
    //             attack: 0.01,
    //             sustain: 0.01,
    //             release: 0.06
    //         }
    //     }
    // }),

    // _score: [
    //     {
    //         action: "noteOn",
    //         noteName: "root",
    //         change: {
    //             "carrier.freq": fundamental
    //         }
    //     },

    //     {
    //         action: "noteOn",
    //         noteName: "mediant",
    //         change: {
    //             "carrier.freq": fundamental * 5/4
    //         }
    //     },

    //     {
    //         action: "noteOn",
    //         noteName: "dominant",
    //         change: {
    //             "carrier.freq": fundamental * 3/2
    //         }
    //     },

    //     {
    //         action: "noteOff",
    //         noteName: "root"
    //     },

    //     {
    //         action: "noteOff",
    //         noteName: "mediant"
    //     },

    //     {
    //         action: "noteOff",
    //         noteName: "dominant"
    //     }
    // ];

    // _clock: flock.scheduler.async();

    // _idx: 0;

    // clock.repeat(0.25, function () {
    //     if (idx >= score.length) {
    //         idx = 0;
    //     }
    //     var event = score[idx];
    //     polySynth[event.action](event.noteName, event.change);
    //     idx++;
    // });
// }

        