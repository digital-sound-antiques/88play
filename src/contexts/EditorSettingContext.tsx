import { createContext, useEffect, useState } from "react";

export interface EditorSettingsContextState {
  fontSize: number;
  wrap: boolean;
}

const defaultContextState: EditorSettingsContextState = {
  fontSize: 12,
  wrap: true,
};

function restore(): Partial<EditorSettingsContextState> {
  try {
    return JSON.parse(localStorage.getItem("88play.editor.settings") ?? "{}");
  } catch {
    return {};
  }
}

function save(state: EditorSettingsContextState) {
  const json = JSON.stringify(state);
  localStorage.setItem("88play.editor.settings", json);
}

export const EditorSettingsContext = createContext({
  ...defaultContextState,
  setFontSize: (_: number) => {
    /* noop */
  },
  setWrap: (_: boolean) => {
    /* noop */
  },
});

export function EditorSettingsContextProvider(props: React.PropsWithChildren) {
  const [state, setState] = useState({ ...defaultContextState, ...restore() });

  const setFontSize = (fontSize: number) => {
    setState((state) => ({ ...state, fontSize }));
  };

  const setWrap = (wrap: boolean) => {
    setState((state) => ({ ...state, wrap }));
  };

  useEffect(() => {
    save(state);
  }, [state.fontSize, state.wrap]);

  return (
    <EditorSettingsContext.Provider value={{ ...state, setFontSize, setWrap }}>
      {props.children}
    </EditorSettingsContext.Provider>
  );
}
