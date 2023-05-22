import { createContext, useState } from "react";

export interface AppGlobalContextState {
  errorMessage: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setErrorMessage: (value: any) => void;
}

const noop = () => {
  throw new Error("Not Implemented");
};

const defaultContextState: AppGlobalContextState = {
  errorMessage: null,
  setErrorMessage: noop,
};

export const AppGlobalContext = createContext(defaultContextState);

export function AppGlobalContextProvider(props: React.PropsWithChildren) {
  const [state, setState] = useState(defaultContextState);

  const setErrorMessage = (value: string | Error | null) => {
    let errorMessage: string | null = null;
    if (typeof value == "string") {
      errorMessage = value;
    } else if (value instanceof Error) {
      errorMessage = value.message;
    } else if (value != null) {
      errorMessage = `${value}`;
    } else {
      errorMessage = null;
    }
    setState((state) => ({ ...state, errorMessage }));
  };

  return (
    <AppGlobalContext.Provider value={{ ...state, setErrorMessage }}>
      {props.children}
    </AppGlobalContext.Provider>
  );
}
