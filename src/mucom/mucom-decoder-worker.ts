console.log("mucom-decoder-worker");

import Mucom88, { MucomStatusType } from "mucom88-js";
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

async function loadAsset(url: string): Promise<Uint8Array> {
  const res = await fetch(new URL(url, import.meta.url));
  return new Uint8Array(await res.arrayBuffer());
}


class Fader {
  durationInFrame = 0;
  fadeDurationInFrame = 0;
  fadeStartFrame: number | null = null;

  updateFadeState(currentFrame: number, mucom: Mucom88) {
    if (this.fadeStartFrame == null) {
      if (currentFrame >= this.durationInFrame - this.fadeDurationInFrame) {
        this.fadeStartFrame = currentFrame;
      }
      const maxCount = mucom.getStatus(MucomStatusType.MAXCOUNT);
      const curCount = mucom.getStatus(MucomStatusType.INTCOUNT);
      if (maxCount * 2 <= curCount) {
        this.fadeStartFrame = currentFrame;
      }
    }
  }

  getValue(currentFrame: number): number {
    if (this.fadeStartFrame != null) {
      const elapsed = currentFrame - this.fadeStartFrame;
      return Math.min(
        1.0,
        Math.max(0, (this.fadeDurationInFrame - elapsed) / this.fadeDurationInFrame)
      );
    }
    return 1.0;
  }
}

class MucomDecoderWorker extends AudioDecoderWorker {
  constructor(worker: Worker) {
    super(worker);
  }

  private _mucom: Mucom88 | null = null;

  private _duration = defaultDuration;
  private _fadeDuration = defaultFadeDuration;

  private _decodeFrames = 0;

  private _fader = new Fader();

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

    this._fader.durationInFrame = Math.floor((this.sampleRate * this._duration) / 1000);
    this._fader.fadeDurationInFrame = Math.floor((this.sampleRate * this._fadeDuration) / 1000);
    this._fader.fadeStartFrame = null;

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

    this._fader.updateFadeState(this._decodeFrames, this._mucom!);
    if (this._fader.getValue(this._decodeFrames) == 0.0) {
      return null;
    }

    const lch = new Int16Array(this.sampleRate);
    const rch = new Int16Array(this.sampleRate);
    const buf = this._mucom!.render(this.sampleRate);

    for (let i = 0; i < this.sampleRate; i++) {
      const fade = this._fader.getValue(this._decodeFrames++);
      lch[i] = Math.round(fade * buf[i * 2] >> 1);
      rch[i] = Math.round(fade * buf[i * 2 + 1] >> 1);
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
new MucomDecoderWorker(self as any);

