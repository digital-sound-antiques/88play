import { createContext, useEffect, useState } from "react";
import { BinaryDataStorage } from "../utils/binary-data-storage";

export interface StorageContextState {
  storage: BinaryDataStorage;
  isInitialized: boolean;
  rev: number;
  put: (data: Uint8Array, id: string) => Promise<string>;
  get: (id: string) => Promise<Uint8Array | null>;
}

const defaultContextState: StorageContextState = {
  storage: new BinaryDataStorage(),
  isInitialized: false,
  rev: 0,
  put: async () => {
    throw new Error("noop");
  },
  get: async () => {
    throw new Error("noop");
  },
};

export const StorageContext = createContext(defaultContextState);

export function StorageContextProvider(props: React.PropsWithChildren) {
  const [state, setState] = useState(defaultContextState);

  const init = async (storage: BinaryDataStorage) => {
    await storage.open("88play");
    setState((state) => ({ ...state, storage, isInitialized: true }));
  };

  useEffect(() => {
    const storage = new BinaryDataStorage();
    init(storage);
    return () => {
      storage.close();
    };
  }, []);

  // put with state update
  const put = (data: Uint8Array, id: string): Promise<string> => {
    const res = state.storage.put(data, id);
    setState((state) => ({ ...state, rev: state.rev + 1 }));
    return res;
  };
  
  const get = (id: string): Promise<Uint8Array> => state.storage.get(id);

  return (
    <StorageContext.Provider value={{ ...state, put, get }}>
      {state.isInitialized ? props.children : null}
    </StorageContext.Provider>
  );
}
