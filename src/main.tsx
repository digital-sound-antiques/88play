import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import React from "react";
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

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ConsoleContextProvider banner={banner}>
      <StorageContextProvider>
        <EditorSettingsContextProvider>
          <EditorContextProvider>
            <PlayerContextProvider>
              <App />
            </PlayerContextProvider>
          </EditorContextProvider>
        </EditorSettingsContextProvider>
      </StorageContextProvider>
    </ConsoleContextProvider>
  </React.StrictMode>
);
