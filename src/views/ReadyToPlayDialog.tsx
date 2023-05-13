import { PlayCircle } from "@mui/icons-material";
import { Button, Dialog, DialogContent, Typography } from "@mui/material";
import { useContext, useEffect } from "react";
import { EditorContext } from "../contexts/EditorContext";
import { PlayerContext } from "../contexts/PlayerContext";
import { loadBlobOrUrlAsText } from "../utils/load-urls";
import { shareApi } from "../utils/share-utils";
import AppGlobal from "../contexts/AppGlobal";

export function ReadyToPlayDialog() {
  const playerContext = useContext(PlayerContext);
  const editorContext = useContext(EditorContext);

  const loadMml = async (id: string) => {
    playerContext.reducer.setBusy(true);
    try {
      const url = shareApi.getTextUrl(id);
      const mml = await loadBlobOrUrlAsText(url);
      editorContext.reducer.updateText(mml);
    } finally {
      playerContext.reducer.setBusy(false);
    }
  };

  useEffect(() => {
    if (playerContext.idToOpen != null) {
      loadMml(playerContext.idToOpen);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerContext.idToOpen]);

  const onClick = async () => {
    await playerContext.unmute();
    AppGlobal.removeQueryParam('open');
    const mml = editorContext.text;
    const m = mml?.match(/^#title\s+([^\s]+).*$/);
    const title = m != null ? m[1] : null;
    localStorage.setItem("88play.lastCompiledText", mml);
    playerContext.reducer.clearIdToOpen();
    playerContext.reducer.play({ title, mml });
  };

  const open = playerContext.idToOpen != null && !playerContext.busy;

  return (
    <Dialog open={open} maxWidth="xs" PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogContent sx={{ p: 0 }}>
        <Button
          onClick={onClick}
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
          }}
        >
          <PlayCircle sx={{ m: 4, fontSize: 88 }} />
          <Typography>TAP to PLAY</Typography>
        </Button>
      </DialogContent>
    </Dialog>
  );
}
