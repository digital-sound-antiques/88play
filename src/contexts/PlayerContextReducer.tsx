import { PlayItem, PlayerContextState } from "./PlayerContext";

export class PlayerContextReducer {
  constructor(
    setState: React.Dispatch<React.SetStateAction<PlayerContextState>>
  ) {
    this.setState = setState;
  }

  setState: React.Dispatch<React.SetStateAction<PlayerContextState>>;

  setMasterGain(value: number): void {
    this.setState((oldState) => {
      return { ...oldState, masterGain: value };
    });
  }

  setPlaying(value: boolean): void {
    this.setState((oldState) => ({ ...oldState, isPlaying: value }));
  }

  setSelectedIndex(value: number) {
    this.setState((oldState) => {
      return { ...oldState, selectedIndex: value };
    });
  }

  _playReducer(
    state: PlayerContextState,
    item?: PlayItem | null
  ): PlayerContextState {
    const nextItem = item ?? state.currentItem;
    const nextPlayState = nextItem != null ? "playing" : "stopped";
    return {
      ...state,
      currentItem: nextItem,
      playState: nextPlayState,
      playStateChangeCount: state.playStateChangeCount + 1,
    };
  }

  play(item?: PlayItem | null) {
    this.setState((state) => {
      return this._playReducer(state, item);
    });
  }

  replay() {
    this.setState((state) => {
      if (state.playState == "playing") {
        state.player.seekInFrame(0);
        state.player.resume();
      }
      return state;
    });
  }

  pause() {
    this.setState((state) => {
      if (state.playState == "playing") {
        return {
          ...state,
          playState: "paused",
          playStateChangeCount: state.playStateChangeCount + 1,
        };
      }
      return state;
    });
  }

  resume() {
    this.setState((state) => {
      if (state.playState == "paused") {
        return {
          ...state,
          playState: "playing",
          playStateChangeCount: state.playStateChangeCount + 1,
        };
      }
      return state;
    });
  }

  stop() {
    this.setState((state) => ({
      ...state,
      playState: "stopped",
      playStateChangeCount: state.playStateChangeCount + 1,
    }));
  }

  onPlayerStopped() {
    //
  }

  async clearIdToOpen() {
    this.setState((state) => ({
      ...state,
      idToOpen: null,
    }));
  }

  setBusy(value: boolean) {
    this.setState((state) => ({ ...state, busy: value }));
  }
}
