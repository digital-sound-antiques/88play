import { AudioPlayer, AudioRendererType } from "webaudio-stream-player";

import workletUrl from "./renderer-worklet.ts?worker&url";
import { MucomDecoderSnapshot, MucomDecoderStartOptions } from "./mucom-decoder-worker";
import { CHDATA } from "mucom88-js";

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
      recycleDecoder: false,
      numberOfChannels: 2,
    });

    this.addEventListener("decodermessage", (ev: CustomEvent) => {
      const detail = ev.detail;
      if (detail.type == "snapshots") {
        const snapshots = detail.data as Array<MucomDecoderSnapshot>;
        for (let i = 0; i < snapshots.length; i++) {
          const snapshot = snapshots[i];
          const index = _toFrame(snapshot.timeInMs);
          this._snapshots[index] = snapshot;
        }
      }
    });
  }

  override async play(args: MucomDecoderStartOptions) {
    this._snapshots = [];
    await super.play(args);
  }

  override async abort() {
    this._snapshots = [];
    await super.abort();
  }

  _snapshots: MucomDecoderSnapshot[] = [];

  findSnapshotAt(timeInMs: number): MucomDecoderSnapshot | null | undefined {
    const index = Math.max(0, _toFrame(timeInMs - this.outputLatency * 1000));
    return this._snapshots[index];
  }

  getChannelStatus(ch: number): CHDATA | null | undefined {
    return this.findSnapshotAt(this.progress.renderer.currentTime)?.data[ch];
  }
}

function _toFrame(timeInMs: number): number {
  const fps = 120;
  return Math.floor((timeInMs * fps) / 1000);
}
