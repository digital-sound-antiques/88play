import { runAudioWorklet, AudioRendererWorkletProcessor } from "webaudio-stream-player/dist/workers/audio-renderer-worklet-processor.js";

console.log("renderer-worklet-processor");
runAudioWorklet('renderer', AudioRendererWorkletProcessor);

