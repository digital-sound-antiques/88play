import {
  FolderOpen,
  PlaylistPlay
} from "@mui/icons-material";
import { Box, Button, ButtonProps, Toolbar } from "@mui/material";
import { useContext } from "react";
import { EditorContext } from "../contexts/EditorContext";
import { PlayerContext } from "../contexts/PlayerContext";
import { ExportButton } from "./ExportButton";
import { SampleButton } from "./SampleButton";
import { SettingsButton } from "./SettingsButton";
import { ShareButton } from "./ShareButton";

export function AppToolBar() {
  const playerContext = useContext(PlayerContext);
  const editorContext = useContext(EditorContext);

  const onCompileClick = async () => {
    const mml = editorContext.text;
    const m = mml?.match(/^#title\s+([^\s]+).*$/);
    const title = m != null ? m[1] : null;
    localStorage.setItem("88play.lastCompiledText", mml);
    playerContext.reducer.play({ title, mml });
  };

  const onOpenClick = () => {
    editorContext.openFile();
  };

  const buttonProps: ButtonProps = { variant: "outlined", size: "small" };

  return (
    <Toolbar variant="dense" sx={{ gap: 1 }}>
      <Button {...buttonProps} onClick={onOpenClick}>
        <FolderOpen fontSize="small" />
        &nbsp;Open
      </Button>
      <SampleButton {...buttonProps} />
      <Box sx={{ flex: 1 }}></Box>
      <Button {...buttonProps} onClick={onCompileClick}>
        <PlaylistPlay fontSize="small" />
        &nbsp;Compile
      </Button>
      <Box sx={{ flex: 1 }}></Box>
      <ShareButton {...buttonProps} />
      <ExportButton {...buttonProps} />
      <Box sx={{ flex: 1 }}></Box>
      <SettingsButton {...buttonProps} />
    </Toolbar>
  );
}
