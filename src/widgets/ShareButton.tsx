import { Share } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography
} from "@mui/material";
import { useContext, useState } from "react";
import { EditorContext } from "../contexts/EditorContext";
import { useShare } from "../hooks/use-share";
import { ShareDialog } from "../views/ShareDialog";
import { ToolBarButton } from "./ToolBarButton";

type ShareState = "initial" | "inprogress" | "done" | "error";

export function ShareButton() {
  const [share] = useShare();
  const context = useContext(EditorContext);

  const [state, setState] = useState<ShareState>("initial");

  const [progress, setProgress] = useState<number | null | undefined>(
    undefined
  );
  const [url, setUrl] = useState<string | null>(null);

  const onClick = async () => {
    setState("inprogress");
    setProgress(null);
    const res = await share(context.text, setProgress);
    setProgress(undefined);
    setUrl("https://f.88play.app/" + res.id);
    setState("done");
  };

  return (
    <>
      <ToolBarButton
        onClick={onClick}
        icon={<Share fontSize="small" />}
        label="Share"
      />
      <ShareDialog
        open={state == "done"}
        url={url}
        onClose={() => setState("initial")}
      />
      <ProgressDialog open={state == "inprogress"} progress={progress} />
      <ErrorDialog
        open={state == "error"}
        onClose={() => setState("initial")}
      />
    </>
  );
}

function ProgressDialog(props: { open: boolean; progress?: number | null }) {
  const { open, progress } = props;

  return (
    <Dialog open={open}>
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
        <Typography variant="body2">{(progress ?? 0) * 100}%</Typography>
      </DialogContent>
    </Dialog>
  );
}

function ErrorDialog(props: { open: boolean; onClose?: () => void }) {
  return (
    <Dialog open={props.open}>
      <DialogContent>
        <DialogContentText>Error</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
