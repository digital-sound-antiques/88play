import React, { useContext, useEffect, useRef, useState } from "react";
import { AudioPlayerState } from "webaudio-stream-player";
import { MucomDecoderAttachment } from "../mucom/mucom-decoder-worker";
import { MucomPlayer } from "../mucom/mucom-player";
import { isIOS, isSafari } from "../utils/platform-detect";
import { downloadBinary } from "../utils/share-utils";
import { unmuteAudio } from "../utils/unmute";
import { MMLResourceMap } from "./EditorContext";
import { getResourceMap } from "./EditorContextReducer";
import { PlayerContextReducer } from "./PlayerContextReducer";
import { StorageContext, StorageContextState } from "./StorageContext";

export type PlayItem = {
  title?: string | null;
  filename?: string;
  mml: string;
  duration?: number | null; // in ms
  fadeDuration?: number | null; // in ms
  song?: number | null; // sub song number
};

export interface PlayerContextState {
  audioContext: AudioContext;
  gainNode: GainNode;
  masterGain: number;
  player: MucomPlayer;
  currentItem?: PlayItem | null;
  playState: "playing" | "paused" | "stopped";
  playStateChangeCount: number;
  unmute: () => Promise<void>;
}

function autoResumeAudioContext(audioContext: AudioContext) {
  if (isIOS && isSafari) {
    document.addEventListener("visibilitychange", () => {
      console.log(`visibility change / state=${audioContext.state}`);
      if ((audioContext.state as any) == "interrupted") {
        /* unawaited */ audioContext.resume();
      }
    });
  }
}

const createDefaultContextState = () => {
  const audioContext = new AudioContext({
    sampleRate: 44100,
    latencyHint: "interactive",
  });
  const state: PlayerContextState = {
    audioContext: audioContext,
    gainNode: new GainNode(audioContext),
    player: new MucomPlayer("worklet"),
    currentItem: null,
    playStateChangeCount: 0,
    playState: "stopped",
    masterGain: 4.0,
    unmute: async () => {
      unmuteAudio();
      if (audioContext.state != "running") {
        await audioContext.resume();
      }
    },
  };

  state.gainNode.gain.value = state.masterGain;
  state.gainNode.connect(state.audioContext.destination);
  state.player.connect(state.gainNode);
  autoResumeAudioContext(state.audioContext);

  try {
    const data = localStorage.getItem("88play.playerContext");
    const json = data != null ? JSON.parse(data) : {};
    state.masterGain = json.masterGain ?? state.masterGain;
    state.gainNode.gain.value = state.masterGain;
  } catch (e) {
    console.error(e);
    localStorage.clear();
  }
  return state;
};

const defaultContextState: PlayerContextState = createDefaultContextState();

export const PlayerContext = React.createContext({
  ...defaultContextState,
  reducer: new PlayerContextReducer(() => {}),
});

function usePrevious<T>(value: T) {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

async function loadLocalOrNetworkResource(
  storageContext: StorageContextState,
  id: string
): Promise<Uint8Array | null> {
  const data = await storageContext.get(id);
  if (data != null) {
    return data;
  }
  try {
    const data = await downloadBinary(id);
    await storageContext.put(data, id);
    return data;
  } catch (_) {
    return null;
  }
}

async function prepareAttachments(
  rmap: MMLResourceMap,
  storageContext: StorageContextState,
): Promise<MucomDecoderAttachment[]> {
  const res: MucomDecoderAttachment[] = [];

  for (const name in rmap) {
    const { type, id } = rmap[name]!;
    if (id != null) {
      const data = await loadLocalOrNetworkResource(storageContext, id);
      if (data != null) {
        res.push({ type, name, data });
      }
    }
  }
  return res;
}

async function applyPlayStateChange(
  storageContext: StorageContextState,
  oldState: PlayerContextState | null,
  state: PlayerContextState
) {
  const play = async (item: PlayItem) => {
    const { mml, duration, fadeDuration } = item;
    const rmap = getResourceMap(mml);
    const attachments = await prepareAttachments(rmap, storageContext);
    await state.player.play({ mml, attachments, duration, fadeDuration });
  };

  if (state.playState == "playing") {
    if (state.currentItem != null) {
      if (oldState?.currentItem != state.currentItem) {
        return play(state.currentItem);
      }
      if (state.player.state != "playing" && state.player.state != "paused") {
        return play(state.currentItem);
      }
    } else {
      console.warn("Missing current entry.");
      return;
    }
  }

  if (state.playState == "playing" && state.player.state == "paused") {
    return state.player.resume();
  }
  if (state.playState == "paused" && state.player.state == "playing") {
    return state.player.pause();
  }
  if (state.playState == "stopped" && state.player.state != "aborted") {
    return state.player.abort();
  }
}

export function PlayerContextProvider(props: React.PropsWithChildren) {
  const storageContext = useContext(StorageContext);
  const [state, setState] = useState(defaultContextState);
  const oldState = usePrevious(state);

  useEffect(() => {
    applyPlayStateChange(storageContext, oldState, state);
  }, [state.playStateChangeCount]);

  useEffect(() => {
    state.gainNode.gain.value = state.masterGain;
  }, [state.masterGain]);

  const reducer = new PlayerContextReducer(setState);

  useEffect(() => {
    state.player.addEventListener("statechange", onPlayerStateChange);
    return () => {
      state.player.removeEventListener("statechange", onPlayerStateChange);
    };
  }, []);

  const save = () => {
    const { masterGain } = state;
    const data = { version: 1, masterGain };
    localStorage.setItem("88play.playerContext", JSON.stringify(data));
  };

  useEffect(() => {
    save();
  }, [state.masterGain]);

  const onPlayerStateChange = (ev: CustomEvent<AudioPlayerState>) => {
    if (ev.detail == "stopped") {
      reducer.onPlayerStopped();
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        reducer,
      }}
    >
      {props.children}
    </PlayerContext.Provider>
  );
}
