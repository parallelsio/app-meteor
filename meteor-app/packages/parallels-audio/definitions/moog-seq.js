
Parallels.Audio.Definition['moogSeq'] = {

  synthDef: {   

    id: "moogSeq",  
    ugen: "flock.ugen.filter.moog",
      cutoff: {
      ugen: "flock.ugen.lfSaw",
      freq:1000,
      mul: 500,
      add: 7000,
    },
    resonance: {
      ugen: "flock.ugen.sin",
      freq:1/2,
      width:.25,
      mul: 0.5,
      add: 0.5
    },
    inputs: {
      source: {
        ugen:"flock.ugen.saw",
        freq: teoria.note('g1').fq()
      },
      mul: 0.5
    } 
  }
}
              