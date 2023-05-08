import { PlayCircle } from "@mui/icons-material";
import { Button, Dialog, DialogContent, Typography } from "@mui/material";
import { PlayerContext } from "../contexts/PlayerContext";
import { useContext } from "react";
import { EditorContext } from "../contexts/EditorContext";
import { loadBlobOrUrlAsText } from "../utils/load-urls";
import { shareApi } from "../utils/share-utils";

export function ReadyToPlayDialog() {
  const playerContext = useContext(PlayerContext);
  const editorContext = useContext(EditorContext);

  const onClick = async () => {
    await playerContext.unmute();

    const url = shareApi.getTextUrl(playerContext.idToOpen!);
    const mml = await loadBlobOrUrlAsText(url);

    editorContext.reducer.updateText(mml);
    const m = mml?.match(/^#title\s+([^\s]+).*$/);
    const title = m != null ? m[1] : null;
    
    localStorage.setItem("88play.lastCompiledText", mml);

    playerContext.reducer.clearIdToOpen();
    playerContext.reducer.play({ title, mml });
  };


  return (
    <Dialog
      open={playerContext.idToOpen != null}
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: 3 } }}
    >
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
