import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import React, { PropsWithChildren } from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ConsoleContextProvider } from "./contexts/ConsoleContext";
import { EditorContextProvider } from "./contexts/EditorContext";
import { PlayerContextProvider } from "./contexts/PlayerContext";
import "./index.css";

const banner = ` █████╗  █████╗ ██████╗ ██╗      █████╗ ██╗   ██╗
██╔══██╗██╔══██╗██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝
╚█████╔╝╚█████╔╝██████╔╝██║     ███████║ ╚████╔╝ 
██╔══██╗██╔══██╗██╔═══╝ ██║     ██╔══██║  ╚██╔╝  
╚█████╔╝╚█████╔╝██║     ███████╗██║  ██║   ██║   
 ╚════╝  ╚════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝ 
PC-8801 FM/SSG emulator, powered by OPEN MUCOM88`;

import { EditorSettingsContextProvider } from "./contexts/EditorSettingContext";
import { StorageContextProvider } from "./contexts/StorageContext";
import "./i18n/i18n";
import { AppGlobalContextProvider } from "./contexts/AppGlobalContext";

const compose = (providers: React.JSXElementConstructor<PropsWithChildren>[]) =>
  providers.reduce((Prev, Curr) => ({ children }) => (
    <Prev>
      <Curr>{children}</Curr>
    </Prev>
  ));

const InstallProviders = compose([
  StorageContextProvider,
  AppGlobalContextProvider,
  function (props: PropsWithChildren) {
    return (
      <ConsoleContextProvider banner={banner}>
        {props.children}
      </ConsoleContextProvider>
    );
  },
  StorageContextProvider,
  EditorSettingsContextProvider,
  EditorContextProvider,
  PlayerContextProvider,
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <InstallProviders>
      <App />
    </InstallProviders>
  </React.StrictMode>
);
