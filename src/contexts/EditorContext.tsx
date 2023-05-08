import {
  ChangeEvent,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  EditorContextReducer,
  getResourceMap,
  getUnresolvedResources,
} from "./EditorContextReducer";
import { StorageContext } from "./StorageContext";

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
  openFile: () => void;
}

const defaultContextState: EditorContextState = {
  text: localStorage.getItem("88play.lastCompiledText") ?? "",
  resourceMap: {},
  unresolvedResources: [],
  openFile: () => {},
};

export const EditorContext = createContext({
  ...defaultContextState,
  reducer: new EditorContextReducer(() => {}),
});

export function EditorContextProvider(props: React.PropsWithChildren) {
  const [state, setState] = useState(defaultContextState);

  const { storage, rev } = useContext(StorageContext);
  const reducer = new EditorContextReducer(setState, storage);

  const updateUnresolvedResources = async (mml: string) => {
    const resourceMap = getResourceMap(mml);
    const unresolvedResources = await getUnresolvedResources(
      storage,
      resourceMap
    );
    setState((state) => ({ ...state, resourceMap, unresolvedResources }));
  };

  useEffect(() => {
    updateUnresolvedResources(state.text);
  }, [rev]);

  const onFileInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
    const { files } = ev.target;
    reducer.onFileOpen(files);
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