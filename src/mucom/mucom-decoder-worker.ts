console.log("mucom-decoder-worker");

import Mucom88 from "mucom88-js";
import { AudioDecoderWorker } from "webaudio-stream-player";

import bd from "../assets/wav/2608_bd.wav";
import hh from "../assets/wav/2608_hh.wav";
import rim from "../assets/wav/2608_rim.wav";
import sd from "../assets/wav/2608_sd.wav";
import tom from "../assets/wav/2608_tom.wav";
import top from "../assets/wav/2608_top.wav";

export type MucomDecoderAttachment = {
  type: "pcm" | "voice";
  name: string;
  data: Uint8Array;
};

export type MucomDecoderStartOptions = {
  mml: string;
  attachments?: MucomDecoderAttachment[];
};

const defaultDuration = 60 * 1000 * 5;
const defaultFadeDuration = 5 * 1000;
// const defaultLoop = 2;

async function loadAsset(url: string): Promise<Uint8Array> {
  const res = await fetch(new URL(url, import.meta.url));
  return new Uint8Array(await res.arrayBuffer());
}

class MucomDecoderWorker extends AudioDecoderWorker {
  constructor(worker: Worker) {
    super(worker);
  }

  private _mucom: Mucom88 | null = null;

  private _duration = defaultDuration;
  private _fadeDuration = defaultFadeDuration;
  // private _loop = defaultLoop;
  private _decodeFrames = 0;

  async init(_: any): Promise<void> {
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

    this._decodeFrames = 0;
    this._mucom.reset(this.sampleRate);
    this._mucom.loadMML(args.mml);
    this.worker.postMessage({
      type: "onstart",
      message: this._mucom.getMessageBuffer(),
    });
  }

  async process(): Promise<Array<Int16Array> | null> {
    const currentTimeInMs = (this._decodeFrames / this.sampleRate) * 1000;
    if (this._duration + this._fadeDuration < currentTimeInMs) {
      return null;
    }
    const lch = new Int16Array(this.sampleRate);
    const rch = new Int16Array(this.sampleRate);
    const buf = this._mucom!.render(this.sampleRate);
    for (let i = 0; i < this.sampleRate; i++) {
      lch[i] = buf[i * 2] >> 1;
      rch[i] = buf[i * 2 + 1] >> 1;
    }
    this._decodeFrames += this.sampleRate;
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
new MucomDecoderWorker(self as any);
