/* 
 *  Using an xLine ugen to curve down the frequency of an impulse.
 *  Send this as a source to a reverb effect.


 *  OQ: How can we trigger a callback, so for example, when impulseResponse def plays and gets
 *      down to the end point, frequency of 2, we can trigger an envelope to turn off audio output 
 *      untill next sound is triggered?

 */


var customEnvelope = {
    levels: [0, 0.5, 0],
    times: [0.05, 0.05, 1],
    curve: ["exponential", "exponential", "linear"]
};

var gateDef = {
    ugen: "flock.ugen.lfPulse",
    rate: "control",
    freq: 0.39,
    width: 0.5
};


Parallels.Audio.Definition['impulseDrop'] = {

  synthDef: {   

    id: "impulseDrop",  
    ugen: "flock.ugen.freeverb",
    inputs: {
      source: {
          ugen: "flock.ugen.impulse",
          inputs: {
              freq: {
                id: "impulseDropxLine",
                ugen: "flock.ugen.xLine",
                start: 880,
                end: 2,
                duration: 3.0
              },
              mul: 0.2
          },
          mul: {
              ugen: "flock.ugen.envGen",
              rate: "control",
              envelope: customEnvelope,
              mul: 0.2,
              gate: gateDef
          }
      },

      mix: 0.6,
      room: 0.5,
      damp: 0.25
    }
  }
}
