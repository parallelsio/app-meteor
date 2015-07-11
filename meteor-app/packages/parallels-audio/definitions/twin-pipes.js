Parallels.Audio.Definition['twinPipes'] = {

  synthDef: {   

    id: "twinPipes",  
    ugen: "flock.ugen.out",
    inputs: {
       sources: [
        {
          ugen: "flock.ugen.sinOsc"
        },
        {
          ugen: "flock.ugen.sinOsc",
          id: "sineosc",
          inputs: {
              freq: {
                ugen: "flock.ugen.xLine",
                start: 880,
                end: 2,
                duration: 10.0
              },
              mul: 0.10
          }
        }
      ] 
    } 
  }
}