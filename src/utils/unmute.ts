import { isIOS } from "./platform-detect.js";

let audioTag: HTMLAudioElement | null;

// unmute for mobile browsers
// https://stackoverflow.com/questions/21122418/ios-webaudio-only-works-on-headphones/46839941#46839941
export function unmuteAudio() {
  if (isIOS) {
    if (audioTag == null) {
      audioTag = document.createElement("audio");
    }
    audioTag.controls = false;
    audioTag.preload = "auto";
    audioTag.loop = true;
    const silenceDataURL =
      "data:audio/mp3;base64,//MkxAAHiAICWABElBeKPL/RANb2w+yiT1g/gTok//lP/W/l3h8QO/OCdCqCW2Cw//MkxAQHkAIWUAhEmAQXWUOFW2dxPu//9mr60ElY5sseQ+xxesmHKtZr7bsqqX2L//MkxAgFwAYiQAhEAC2hq22d3///9FTV6tA36JdgBJoOGgc+7qvqej5Zu7/7uI9l//MkxBQHAAYi8AhEAO193vt9KGOq+6qcT7hhfN5FTInmwk8RkqKImTM55pRQHQSq//MkxBsGkgoIAABHhTACIJLf99nVI///yuW1uBqWfEu7CgNPWGpUadBmZ////4sL//MkxCMHMAH9iABEmAsKioqKigsLCwtVTEFNRTMuOTkuNVVVVVVVVVVVVVVVVVVV//MkxCkECAUYCAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV";
    audioTag.src = silenceDataURL;
    audioTag.play();
  }
}
