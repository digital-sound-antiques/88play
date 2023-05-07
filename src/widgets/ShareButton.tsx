import { Share } from "@mui/icons-material";
import {
  Button,
  ButtonProps,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useContext, useState } from "react";
import { EditorContext } from "../contexts/EditorContext";
import { useShare } from "../hooks/use-share";
import { ShareDialog } from "../views/ShareDialog";

type ShareState = "initial" | "inprogress" | "done" | "error";

export function ShareButton(props: ButtonProps) {
  const [share] = useShare();
  const context = useContext(EditorContext);

  const [state, setState] = useState<ShareState>("initial");

  const [_progress, setProgress] = useState<number | null | undefined>(undefined);
  const [url, setUrl] = useState<string | null>(null);

  const onClick = async () => {
    setState("inprogress");
    setProgress(null);
    const res = await share(context.text, setProgress);
    setProgress(undefined);
    setUrl(res.url);
    setState("done");
  };

  return (
    <>
      <Button onClick={onClick} {...props}>
        <Share fontSize="small" />
        &nbsp;Share
      </Button>
      <ShareDialog
        open={state == "done"}
        url={url}
        onClose={() => setState("initial")}
      />
      <ProgressDialog open={state == "inprogress"} />
      <ErrorDialog
        open={state == "error"}
        onClose={() => setState("initial")}
      />
    </>
  );
}

function ProgressDialog(props: { open: boolean }) {
  return (
    <Dialog open={props.open}>
      <DialogContent>
        <CircularProgress variant="indeterminate" />
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
