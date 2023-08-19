import Mucom88, { CHDATA } from "mucom88-js";
import { AudioDecoderWorker } from "webaudio-stream-player";

import bd from "../assets/wav/2608_bd.wav";
import hh from "../assets/wav/2608_hh.wav";
import rim from "../assets/wav/2608_rim.wav";
import sd from "../assets/wav/2608_sd.wav";
import tom from "../assets/wav/2608_tom.wav";
import top from "../assets/wav/2608_top.wav";
import { Fader, getTimeFadeTagValue, loadAsset } from "./common";

export type MucomDecoderAttachment = {
  type: "pcm" | "voice";
  name: string;
  data: Uint8Array;
};

export type MucomDecoderStartOptions = {
  mml: string;
  attachments?: MucomDecoderAttachment[];
  duration?: number | null;
  fadeDuration?: number | null;
};

export type MucomDecoderSnapshot = {
  timeInMs: number;
  data: (CHDATA | null)[];
};

class MucomDecoderWorker extends AudioDecoderWorker {
  constructor(worker: Worker) {
    super(worker);
  }

  private _mucom: Mucom88 | null = null;

  private _decodeFrames = 0;

  private _fader: Fader = new Fader();

  async init(_: unknown): Promise<void> {
    console.log("MucomDecoderWorker.init");
    await Mucom88.initialize();
    Mucom88.FS.writeFile("/2608_BD.WAV", await loadAsset(bd));
    Mucom88.FS.writeFile("/2608_SD.WAV", await loadAsset(sd));
    Mucom88.FS.writeFile("/2608_HH.WAV", await loadAsset(hh));
    Mucom88.FS.writeFile("/2608_RIM.WAV", await loadAsset(rim));
    Mucom88.FS.writeFile("/2608_TOM.WAV", await loadAsset(tom));
    Mucom88.FS.writeFile("/2608_TOP.WAV", await loadAsset(top));
  }


  async start(args: MucomDecoderStartOptions): Promise<void> {
    if (this._mucom == null) {
      this._mucom = new Mucom88();
    }

    for (const attachment of args.attachments ?? []) {
      const { name, data } = attachment;
      Mucom88.FS.writeFile(name, data);
    }

    this._fader = new Fader();
    this._decodeFrames = 0;

    const { time, fade } = getTimeFadeTagValue(args.mml);
    this._mucom.reset(this.sampleRate);
    this._mucom.loadMML(args.mml);
    this._fader.setup(this._mucom, this.sampleRate, time, fade);

    this.worker.postMessage({
      type: "onstart",
      message: this._mucom.getMessageBuffer(),
    });
  }

  getChannelSnapshot(): MucomDecoderSnapshot {
    const data: CHDATA[] = [];
    if (this._mucom != null) {
      for (let ch = 0; ch < 11; ch++) {
        data.push(this._mucom.getChannelData(ch));
      }
    }
    return {
      timeInMs: (this._decodeFrames / this.sampleRate) * 1000,
      data,
    };
  }

  async process(): Promise<Array<Int16Array> | null> {
    if (this._mucom == null) {
      return null;
    }

    this._fader?.updateFadeState(this._decodeFrames, this._mucom);
    if (this._fader?.getValue(this._decodeFrames) == 0.0) {
      return null;
    }

    const lch = new Int16Array(this.sampleRate);
    const rch = new Int16Array(this.sampleRate);

    let i = 0;
    const fps = 120;
    const incr = Math.floor(this.sampleRate / fps);
    const snapshots: MucomDecoderSnapshot[] = [];
    while (i < this.sampleRate) {
      const step = Math.min(incr, this.sampleRate - i);
      const buf = this._mucom.render(step);
      snapshots.push(this.getChannelSnapshot());
      for (let j = 0; j < step; j++) {
        const fade = this._fader?.getValue(this._decodeFrames + j) ?? 1.0;
        lch[i + j] = Math.round(fade * buf[j * 2]);
        rch[i + j] = Math.round(fade * buf[j * 2 + 1]);
      }
      this._decodeFrames += step;
      i += step;
    }

    if (snapshots.length > 0) {
      this.worker.postMessage({ type: "snapshots", data: snapshots });
    }

    return [lch, rch];
  }

  async abort(): Promise<void> {
    this._decodeFrames = 0;
    this._mucom?.release();
    this._mucom = null;
  }

  async dispose(): Promise<void> {
    this._mucom?.release();
    this._mucom = null;
  }
}

console.log("mucom-decoder-worker");

/* `self as any` is workaround. See: [issue#20595](https://github.com/microsoft/TypeScript/issues/20595) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
new MucomDecoderWorker(self as any);
