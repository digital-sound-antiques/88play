import { PlaylistPlay } from "@mui/icons-material";
import { Box, Toolbar } from "@mui/material";
import { useContext } from "react";
import { EditorContext } from "../contexts/EditorContext";
import { PlayerContext } from "../contexts/PlayerContext";
import { ExportButton } from "./ExportButton";
import { FileButton } from "./FileButton";
import { MoreButton } from "./MoreButton";
import { SampleButton } from "./SampleButton";
import { ShareButton } from "./ShareButton";
import { ToolBarButton } from "./ToolBarButton";

export function AppToolBar() {
  const playerContext = useContext(PlayerContext);
  const editorContext = useContext(EditorContext);

  const onCompileClick = async () => {
    await playerContext.unmute();
    const mml = editorContext.text;
    const m = mml?.match(/^#title\s+([^\s]+).*$/);
    const title = m != null ? m[1] : null;
    localStorage.setItem("88play.lastCompiledText", mml);
    editorContext.reducer.updateUnresolvedResources(mml);
    playerContext.reducer.play({ title, mml });
  };

  return (
    <Toolbar variant="dense" sx={{ gap: { xs: 0.5, sm: 1 } }}>
      <FileButton/>
      <SampleButton />
      <Box sx={{ flex: 1 }}></Box>
      <ToolBarButton
        onClick={onCompileClick}
        icon={<PlaylistPlay fontSize="small" />}
        label="Compile"
        noShrink
      />
      <Box sx={{ flex: 1 }}></Box>
      <ShareButton />
      <ExportButton />
      <Box sx={{ flex: 1 }}></Box>
      <MoreButton />
    </Toolbar>
  );
}
