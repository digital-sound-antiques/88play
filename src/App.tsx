import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Link,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme
} from "@mui/material";

import { PlayControl } from "./views/PlayerControl";

import { brown } from "@mui/material/colors";

import { EditorView } from "./views/EditorView.js";
import { ResourceAlert } from "./views/ResourceAlert.js";
import { Console } from "./widgets/Console.js";

import { Nightlife } from "@mui/icons-material";
import {
  ISplitviewPanelProps,
  Orientation,
  SplitviewReact,
  SplitviewReadyEvent,
} from "dockview";
import "dockview/dist/styles/dockview.css";
import { useTranslation } from "react-i18next";
import packageJson from "../package.json";
import ghlogo from "./assets/github-mark-white.svg";
import { GlobalProgress } from "./views/GlobalProgress.js";
import { ReadyToPlayDialog } from "./views/ReadyToPlayDialog.js";
import { AppToolBar } from "./widgets/AppToolBar.js";
import { VolumeControl } from "./widgets/VolumeControl.js";

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

  const components = {
    main: (_props: ISplitviewPanelProps<{ title: string }>) => {
      return <EditorView />;
    },
    console: (_props: ISplitviewPanelProps<{ title: string }>) => {
      return <Console />;
    },
  };

  const onReady = (event: SplitviewReadyEvent) => {
    event.api.addPanel({
      id: "main",
      component: "main",
    });
    event.api.addPanel({
      id: "console",
      component: "console",
      size: 160,
    });
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
        <SplitviewReact
          onReady={onReady}
          components={components}
          orientation={Orientation.VERTICAL}
          className="dockview-theme-abyss"
        />
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
