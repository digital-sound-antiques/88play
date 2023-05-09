import { CircularProgress, Dialog, DialogContent } from "@mui/material";
import { useContext } from "react";
import { PlayerContext } from "../contexts/PlayerContext";
import { EditorContext } from "../contexts/EditorContext";

export function GlobalProgress() {
  const playerContext = useContext(PlayerContext);
  const editorContext = useContext(EditorContext);
  const open = playerContext.busy || editorContext.busy;

  return (
    <Dialog open={open} hideBackdrop={true}>
      <DialogContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        <CircularProgress variant="indeterminate" />
      </DialogContent>
    </Dialog>
  );
}
