import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { PlayerContextProvider } from "./contexts/PlayerContext";
import { EditorContextProvider } from "./contexts/EditorContext";
import { ConsoleContextProvider } from "./contexts/ConsoleContext";

const banner = ` █████╗  █████╗ ██████╗ ██╗      █████╗ ██╗   ██╗
██╔══██╗██╔══██╗██╔══██╗██║     ██╔══██╗╚██╗ ██╔╝
╚█████╔╝╚█████╔╝██████╔╝██║     ███████║ ╚████╔╝ 
██╔══██╗██╔══██╗██╔═══╝ ██║     ██╔══██║  ╚██╔╝  
╚█████╔╝╚█████╔╝██║     ███████╗██║  ██║   ██║   
 ╚════╝  ╚════╝ ╚═╝     ╚══════╝╚═╝  ╚═╝   ╚═╝ 
PC-8801 FM/SSG emulator, powered by Open Mucom88`;

import "./i18n/i18n";
import { StorageContextProvider } from "./contexts/StorageContext";
import { EditorSettingsContextProvider } from "./contexts/EditorSettingContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <StorageContextProvider>
      <EditorSettingsContextProvider>
        <EditorContextProvider>
          <PlayerContextProvider>
            <ConsoleContextProvider banner={banner}>
              <App />
            </ConsoleContextProvider>
          </PlayerContextProvider>
        </EditorContextProvider>
      </EditorSettingsContextProvider>
    </StorageContextProvider>
  </React.StrictMode>
);
