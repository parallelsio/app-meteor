### How do the Flocking.js Definitions work?

Each sound in our app is defined as a JSON object.
Flocking.js refers to these objects as Definitions, by convention
Definitions are really one big config file that instructs Flocking.js
how to synthesize (generate) the audio in realtime.

Each definition uses 1 or more uGen's, a unit generator.
Think of a ugen as a sound emitter that produces a particular 
type of tone or sound. There are thousands of uGens, and each have their own
input + output paramters, and particular options.
uGens can be combined inside a single definition, like Lego, to make complex sounds 

[More info](https://github.com/colinbdclark/Flocking/blob/master/docs/synths/creating-synths.md)
[Overlaps with SuperCollider](https://www.youtube.com/watch?v=LKGGWsXyiyo&index=6&list=WL)

To see what inputs/outputs/options are available for each uGen, 
look at `flocking-ugens.js` submodule.

This is an example of a ugen called `dust`, which makes a scratchy, noise sound.
It'll be defined in `flocking-ugens.js` submodule like this:

```
   flock.ugen.dust = function (inputs, output, options) {
      ........ the math algorthim used to generate the sound .........
      .............. we dont touch any of this .......................
   }
```


Directly underneath each ugen definition in the `flocking-ugens.js` submodule,
are the defaults for that uGen. These give us clues how to use/control it:

```
   fluid.defaults("flock.ugen.dust", {
       inputs: {
           density: 1.0,   // first input parameter: How dense should this be, from 0 to 1
           mul: 2,         // 2nd input parameter: a multiplier increases the volume
           add: null       // 3rd input parameter: etc
       },
       ugenOptions: {
           model: {
              density: 0.0,        // 1st option to shape the sound
              scale: 0.0,          // 2nd option ...
              threshold: 0.0,      // 3rd option ...
              unscaledValue: 0.0,  // 4th option ...
              value: 0.0           // 5th option ...
           }
        }
    });
```

These inputs/outputs/options are what we declare below in each synthDefinition
to override the defaults for the uGens we use.
We then control these parameters in real time via user input
and other data related to Parallels around our Meteor app

####Definition example

```
// The arbitrary name we made up for this definition in our Meteor app
Parallels.Audio.Definition.twinSineDrones: {  
    
    // don't change the key name 'synthDef'           
    // Flocking depends on this exact naming + spelling        
    synthDef:     { 

      // we use the 'id' key to lookup this definition,
      // when handling events in Meteor elsewhere.      
      // For readability, use the same name as the object 
      id: "twinSineDrones",

      ugen: "flock.ugen.xxxxxx",
      
      inputs: {

      },

      outputs: {

      },

      options: {
        callback: {
          func: function () {
            console.log("audio:definition: done.")
            this._enviro.stop();
          }
        }
      }
    }
}
```


###Open Questions:

>  OQ: what does 'add' do? 'multiply'? they are used everywhere.

>  OQ: what does 'value' mean in this context:
>      https://github.com/colinbdclark/Flocking/blob/master/docs/ugens/triggers.md

>  OQ: what's a good buffer size to choose on init? can we tie this somehow to detecting if a person is on a specific device or class of devices (desktop, tablet, phone)?

