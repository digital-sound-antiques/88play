import { AudioPlayer, AudioRendererType } from "webaudio-stream-player";

import workletUrl from "./renderer-worklet.ts?worker&url";

export class MucomPlayer extends AudioPlayer {
  constructor(rendererType: AudioRendererType) {
    super({
      rendererType: rendererType,
      decoderWorkerFactory: () => {
        return new Worker(
          new URL("./mucom-decoder-worker.ts", import.meta.url),
          { type: "module" }
        );
      },
      rendererWorkletUrl: workletUrl,
      rendererWorkletName: "renderer",
      recycleDecoder: true,
      numberOfChannels: 2,
    });
  }
}
