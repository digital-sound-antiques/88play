import { createContext, useContext, useEffect, useState } from "react";
import { PlayerContext } from "./PlayerContext";

export interface ConsoleContextState {
  lines: string[];
  incomingLines: string[];
  rev: number;
}

const defaultContextState: ConsoleContextState = {
  lines: [],
  incomingLines: [],
  rev: 0,
};

export const ConsoleContext = createContext(defaultContextState);

export function ConsoleContextProvider(
  props: React.PropsWithChildren & { banner: string }
) {
  const context = useContext(PlayerContext);
  const [state, setState] = useState({
    ...defaultContextState,
    lines: props.banner.split("\n"),
  });

  const processIncomingMessage = (message: string) => {
    const incomingLines = message.split("\n");
    setState((state) => ({
      lines: [...state.lines, ...incomingLines],
      incomingLines,
      rev: state.rev + 1,
    }));
  };

  const onDecoderMessage = (ev: CustomEvent) => {
    if (ev.detail.type == "onstart") {
      processIncomingMessage(ev.detail.message);
    }
  };

  useEffect(() => {
    context.player.addEventListener("decodermessage", onDecoderMessage);
    return () => {
      context.player.removeEventListener("decodermessage", onDecoderMessage);
    };
  }, []);

  return (
    <ConsoleContext.Provider value={state}>
      {props.children}
    </ConsoleContext.Provider>
  );
}
