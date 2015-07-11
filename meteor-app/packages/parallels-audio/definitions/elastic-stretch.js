/* 
 *  
 *  OQ: How do we synthesize a stretchy sound, based on param input of drag on Create-parallel?
        Lead: See Designing Sound by Andy Farnell, MIT book
 */

Parallels.Audio.Definition['elasticStretch'] = {

  synthDef: {   

    id: "elasticStretch",  
    ugen: "flock.ugen.freeverb",
    inputs: {
      source: {
          ugen: "flock.ugen.sinOsc",
          inputs: {
              freq: 100
          },
          mul: 0.5
      },

      mix: 0.93,
      room: 0.5,
      damp: 0.5
    }
  }
}
