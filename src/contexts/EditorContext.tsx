import {
  ChangeEvent,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { EditorContextReducer } from "./EditorContextReducer";
import { StorageContext } from "./StorageContext";
import { AppGlobalContext } from "./AppGlobalContext";

export type MMLResourceEntry = {
  type: "pcm" | "voice";
  name: string;
  id: string | null;
};

export type MMLResourceMap = { [key: string]: MMLResourceEntry };

export interface EditorContextState {
  text: string;
  resourceMap: MMLResourceMap;
  unresolvedResources: MMLResourceEntry[];
  busy: boolean;
  openFile: () => void;
}

const defaultContextState: EditorContextState = {
  text: localStorage.getItem("88play.lastCompiledText") ?? "",
  resourceMap: {},
  unresolvedResources: [],
  busy: false,
  openFile: () => {
    // noop
  },
};

export const EditorContext = createContext({
  ...defaultContextState,
  reducer: new EditorContextReducer(() => {
    // noop
  }),
});

export function EditorContextProvider(props: React.PropsWithChildren) {
  const { setErrorMessage } = useContext(AppGlobalContext);
  const [state, setState] = useState(defaultContextState);

  const { storage, rev } = useContext(StorageContext);
  const reducer = new EditorContextReducer(setState, storage);

  useEffect(() => {
    reducer.updateUnresolvedResources(state.text);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rev]);

  const onFileInputChange = async (ev: ChangeEvent<HTMLInputElement>) => {
    const { files } = ev.target;
    try {
      await reducer.onFileOpen(files);
    } catch (e) {
      setErrorMessage(`${e}`);
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);
  const openFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <EditorContext.Provider
      value={{
        ...state,
        openFile,
        reducer,
      }}
    >
      {props.children}
      <input
        onChange={onFileInputChange}
        ref={fileInputRef}
        type="file"
        multiple
        style={{ display: "none" }}
      />
    </EditorContext.Provider>
  );
}
