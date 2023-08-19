import Mucom88, { MucomStatusType } from "mucom88-js";

export async function loadAsset(url: string): Promise<Uint8Array> {
  const res = await fetch(new URL(url, import.meta.url));
  return new Uint8Array(await res.arrayBuffer());
}

const maxDuration = 60 * 1000 * 10;
const defaultFadeDuration = 5 * 1000;

export class Fader {
  durationInFrame = 0;
  fadeDurationInFrame = 0;
  fadeStartFrame?: number | null;
  timeTagValue?: number | null;
  maxCount = 0;

  setup(
    mucom: Mucom88,
    sampleRate: number,
    timeTagValue?: number | null,
    fadeTagValue?: number | null
  ) {
    this.timeTagValue = timeTagValue;
    if (this.timeTagValue != null) {
      const duration = Math.min(60 * 20 * 1000, this.timeTagValue * 1000);
      this.durationInFrame = Math.floor((sampleRate * duration) / 1000);
    } else {
      this.durationInFrame = Math.floor((sampleRate * maxDuration) / 1000);
    }
    this.fadeDurationInFrame = Math.floor(
      sampleRate * (fadeTagValue ?? defaultFadeDuration / 1000)
    );
    this.fadeStartFrame = null;

    const { maxCount, hasGlobalLoop } = mucom.getCountData();
    this.maxCount = maxCount;

    if (!hasGlobalLoop) {
      this.fadeDurationInFrame = 0;
    }
  }

  updateFadeState(currentFrame: number, mucom: Mucom88) {
    if (this.fadeStartFrame == null) {
      if (currentFrame >= this.durationInFrame - this.fadeDurationInFrame) {
        this.fadeStartFrame = currentFrame;
      }
      if (this.timeTagValue == null) {
        const curCount = mucom.getStatus(MucomStatusType.INTCOUNT);
        if (this.maxCount <= curCount) {
          this.fadeStartFrame = currentFrame;
        }
      }
    }
  }

  getValue(currentFrame: number): number {
    if (this.fadeStartFrame != null) {
      const elapsed = currentFrame - this.fadeStartFrame;
      return Math.min(
        1.0,
        Math.max(
          0,
          (this.fadeDurationInFrame - elapsed) / this.fadeDurationInFrame
        )
      );
    }
    return 1.0;
  }
}

export function getTimeFadeTagValue(mml: string): {
  time: number | null;
  fade: number | null;
} {
  const matches = mml.matchAll(/^#(time|fade)\s+([0-9]+).*$/gm);
  let time = null;
  let fade = null;
  for (const match of matches) {
    if (match[1] == "time") {
      time = parseInt(match[2]);
    } else {
      fade = parseInt(match[2]);
    }
  }
  return { time, fade };
}
