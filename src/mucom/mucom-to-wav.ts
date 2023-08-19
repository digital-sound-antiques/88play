import Mucom88 from "mucom88-js";

import bd from "../assets/wav/2608_bd.wav";
import hh from "../assets/wav/2608_hh.wav";
import rim from "../assets/wav/2608_rim.wav";
import sd from "../assets/wav/2608_sd.wav";
import tom from "../assets/wav/2608_tom.wav";
import top from "../assets/wav/2608_top.wav";
import { MucomDecoderStartOptions } from "./mucom-decoder-worker";
import { Fader, getTimeFadeTagValue } from "./common";

async function loadAsset(url: string): Promise<Uint8Array> {
  const res = await fetch(new URL(url, import.meta.url));
  return new Uint8Array(await res.arrayBuffer());
}

type Mucom2WavProgress = {
  decodedFrames: number;
  totalFrames: number;
  sampleRate: number;
};

export class Mucom2Wav {
  constructor(sampleRate: number) {
    this.sampleRate = sampleRate;
    this._mucom = null;
    this._fader = null;
  }

  sampleRate: number;

  private _mucom: Mucom88 | null;
  private _fader: Fader | null;
  private _decodedFrames = 0;

  static initialized = false;

  async _init(): Promise<void> {
    if (!Mucom2Wav.initialized) {
      console.log("Mucom2Wav.init");
      await Mucom88.initialize();
      Mucom88.FS.writeFile("/2608_BD.WAV", await loadAsset(bd));
      Mucom88.FS.writeFile("/2608_SD.WAV", await loadAsset(sd));
      Mucom88.FS.writeFile("/2608_HH.WAV", await loadAsset(hh));
      Mucom88.FS.writeFile("/2608_RIM.WAV", await loadAsset(rim));
      Mucom88.FS.writeFile("/2608_TOM.WAV", await loadAsset(tom));
      Mucom88.FS.writeFile("/2608_TOP.WAV", await loadAsset(top));
      Mucom2Wav.initialized = true;
    }
  }

  _render(): Int16Array | null {
    this._fader!.updateFadeState(this._decodedFrames, this._mucom!);
    if (this._fader!.getValue(this._decodedFrames) == 0.0) {
      return null;
    }
    const buf = this._mucom!.render(this.sampleRate);
    const res = new Int16Array(buf.length);

    const frames = buf.length / 2;

    for (let i = 0; i < frames; i++) {
      const fade = this._fader?.getValue(this._decodedFrames + i) ?? 1.0;
      res[i * 2] = Math.round(fade * buf[i * 2]);
      res[i * 2 + 1] = Math.round(fade * buf[i * 2 + 1]);
    }

    this._decodedFrames += frames;
    return res;
  }

  _setup(args: MucomDecoderStartOptions): void {
    for (const attachment of args.attachments ?? []) {
      const { name, data } = attachment;
      Mucom88.FS.writeFile(name, data);
    }
    this._mucom = new Mucom88();
    this._fader = new Fader();
    this._decodedFrames = 0;
    const { time, fade } = getTimeFadeTagValue(args.mml);
    this._mucom.reset(this.sampleRate);
    this._mucom.loadMML(args.mml);
    this._fader.setup(this._mucom, this.sampleRate, time, fade);
  }

  async *convert(
    args: MucomDecoderStartOptions
  ): AsyncGenerator<Mucom2WavProgress, Uint8Array> {
    await this._init();
    this._setup(args);

    const buffers: Array<Int16Array> = [];
    while (this._decodedFrames < this._fader!.durationInFrame) {
      const data = this._render();
      yield {
        decodedFrames: this._decodedFrames,
        totalFrames: this._fader!.durationInFrame,
        sampleRate: this.sampleRate,
      };
      if (data != null) {
        buffers.push(data);
      } else {
        break;
      }
    }
    return _rawToWav(this.sampleRate, _concat(buffers));
  }

  release() {
    this._mucom?.release();
  }
}

function _concat(buffers: Array<Int16Array>): Int16Array {
  const length = buffers.map((e) => e.length).reduce((p, c) => p + c);
  const res = new Int16Array(length);
  let offset = 0;
  for (const buf of buffers) {
    res.set(buf, offset);
    offset += buf.length;
  }
  return res;
}

function _rawToWav(rate: number, data: Int16Array): Uint8Array {
  const nch = 2;
  const bitsPerSample = 16;
  const bytesPerSample = bitsPerSample >> 3;
  const dataSize = 44 + data.length * bytesPerSample;
  const blockAlign = bitsPerSample >> 3;
  const buf = new ArrayBuffer(dataSize);
  const view = new DataView(buf, 0);
  view.setUint32(0, 0x52494646); // 'RIFF'
  view.setUint32(4, dataSize - 8, true); // size of RIFF  chunk
  view.setUint32(8, 0x57415645); // 'WAVE'
  view.setUint32(12, 0x666d7420); // 'fmt '
  view.setUint32(16, 16, true); // size of format chunk (16)
  view.setUint16(20, 1, true); // WAVE_FORMAT_PCM
  view.setUint16(22, nch, true); // channels=nch
  view.setUint32(24, rate, true); // samples per sec
  view.setUint32(28, nch * bytesPerSample * rate, true); // byte per sec
  view.setUint16(32, blockAlign, true); // block alignment
  view.setUint16(34, bitsPerSample, true); // bit per sample
  view.setUint32(36, 0x64617461); // 'data'
  view.setUint32(40, data.length * bytesPerSample, true); // 'data'

  const wavbuf = new DataView(buf, 44);
  for (let i = 0; i < data.length; i++) {
    wavbuf.setInt16(i * 2, data[i], true);
  }
  return new Uint8Array(buf);
}
