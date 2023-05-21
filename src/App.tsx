import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Divider,
  IconButton,
  Link,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";

import { PlayControl } from "./views/PlayerControl";

import { brown } from "@mui/material/colors";

import { EditorView } from "./views/EditorView.js";
import { ResourceAlert } from "./views/ResourceAlert.js";
import { Console } from "./widgets/Console.js";

import { ExpandLess, ExpandMore, Nightlife } from "@mui/icons-material";

import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ImperativePanelHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";
import packageJson from "../package.json";
import ghlogo from "./assets/github-mark-white.svg";
import { GlobalProgress } from "./views/GlobalProgress.js";
import { ReadyToPlayDialog } from "./views/ReadyToPlayDialog.js";
import { AppToolBar } from "./widgets/AppToolBar.js";
import { VolumeControl } from "./widgets/VolumeControl.js";
import { Monitor } from "./widgets/Monitor.js";
import { Keyboards } from "./widgets/Keyboard.js";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: brown[300],
    },
    secondary: {
      main: brown["500"],
    },
    text: {
      primary: brown[100],
    },
    action: {
      selectedOpacity: 0.84,
    },
  },
  shape: {
    borderRadius: 4,
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1200,
      xl: 1536,
    },
  },
});
export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoot />
      <ReadyToPlayDialog />
      <GlobalProgress />
    </ThemeProvider>
  );
}

export function AppRoot() {
  const { t } = useTranslation();

  const [panelMode, setPanelMode] = useState<PanelMode>("console");
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [isDragging, setDragging] = useState(false);
  const panelRef = useRef<ImperativePanelHandle>(null);

  const onPanelCollapse = () => {
    panelRef.current?.collapse();
  };
  const onPanelExpand = () => {
    panelRef.current?.expand();
  };
  const toggleCollapse = () => {
    if (panelCollapsed) {
      panelRef.current?.expand();
    } else {
      panelRef.current?.collapse();
    }
  };
  const onPanelModeChange = (mode: PanelMode) => {
    setPanelMode(mode);
    if (panelCollapsed) {
      panelRef.current?.expand();
    }
  };

  return (
    <Box
      sx={{
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
        left: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBar>
        <Toolbar variant="dense">
          <Nightlife sx={{ mr: 0.25 }} />
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            88play
          </Typography>
          <Box sx={{ width: 128 }}>
            <VolumeControl />
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          justifyContent: "stretch",
          alignItems: "stretch",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
      >
        <Toolbar variant="dense" />
        <AppToolBar />
        <Divider />
        <ResourceAlert />
        <Box sx={{ position: "relative", height: "100%" }}>
          <PanelGroup direction="vertical">
            <Panel defaultSize={75} style={{ position: "relative" }}>
              <EditorView />
            </Panel>
            <PanelResizeHandle onDragging={setDragging}>
              <div
                onDoubleClick={toggleCollapse}
                style={{
                  marginTop: "4px",
                  cursor: "auto",
                  borderTop: isDragging ? "2px solid #0080f0" : undefined,
                  transition: "border",
                  transitionDelay: "150ms",                  
                }}
              >
                <PanelTabBar
                  mode={panelMode}
                  collapsed={panelCollapsed}
                  onChange={onPanelModeChange}
                  onCollapse={onPanelCollapse}
                  onExpand={onPanelExpand}
                />
              </div>
            </PanelResizeHandle>
            <Panel
              defaultSize={25}
              collapsible={true}
              onCollapse={setPanelCollapsed}
              ref={panelRef}
            >
              {panelMode == "monitor" ? (
                <Monitor />
              ) : panelMode == "console" ? (
                <Console />
              ) : (
                <Keyboards />
              )}
            </Panel>
          </PanelGroup>
        </Box>
        <Box sx={{ flex: 0 }}>
          <PlayControl />
        </Box>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            height: "32px",
            px: 2,
          }}
        >
          <Typography variant="caption">
            <img src={ghlogo} width={10} height={10} />
            &nbsp;
            <Link
              target="_blank"
              underline="hover"
              href="https://github.com/digital-sound-antiques/88play"
            >
              88play v{packageJson.version}
            </Link>
          </Typography>
          <Link
            href={t("urls.mmlReference")!}
            target="_blank"
            underline="hover"
            variant="caption"
          >
            MML Help
          </Link>
        </Box>
      </Box>
    </Box>
  );
}

type PanelMode = "console" | "monitor" | "keyboard";

type PanelTabBarProps = {
  mode: PanelMode;
  collapsed: boolean;
  onChange: (mode: PanelMode) => void;
  onExpand: () => void;
  onCollapse: () => void;
};

function PanelTabBar(props: PanelTabBarProps) {
  return (
    <Stack
      direction="row"
      sx={{
        pl: 2,
        pr: 1,
        justifyContent: "start",
        alignItems: "center",
        gap: 1,
      }}
    >
      <PanelTab
        selected={props.mode == "console"}
        label="CONSOLE"
        onClick={() => props.onChange("console")}
      />
      <PanelTab
        selected={props.mode == "monitor"}
        label="MONITOR"
        onClick={() => props.onChange("monitor")}
      />
      <PanelTab
        selected={props.mode == "keyboard"}
        label="KEYBOARD"
        onClick={() => props.onChange("keyboard")}
      />
      <Box sx={{ flex: 1 }} />
      {props.collapsed ? (
        <IconButton edge="end" size="small" onClick={props.onExpand}>
          <ExpandLess fontSize="small" />
        </IconButton>
      ) : (
        <IconButton edge="end" size="small" onClick={props.onCollapse}>
          <ExpandMore fontSize="small" />
        </IconButton>
      )}
    </Stack>
  );
}

type PanelTabProps = {
  label: string;
  selected: boolean;
  onClick: () => void;
};

function PanelTab(props: PanelTabProps) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        px: 1,
      }}
    >
      <Button variant="text" onClick={props.onClick}>
        <Typography
          sx={{
            color: props.selected ? "white" : null,
            fontSize: "11px",
          }}
        >
          {props.label}
        </Typography>
      </Button>
    </Box>
  );
}
