import { Share } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const { t } = useTranslation();

  const onClick = async () => {
    setState("inprogress");
    setProgress(null);

    try {
      const unresolved = await context.reducer.updateUnresolvedResources(
        context.text
      );
      if (unresolved.length > 0) {
        throw new Error(
          t("share.unresolvedMessage", { file: unresolved[0].name, tag: unresolved[0].type })!
        );
      }
      const res = await share(context.text, setProgress);
      setProgress(undefined);
      setUrl("https://f.88play.app/" + res.id);
      setState("done");
    } catch (e) {
      if (e instanceof Error) {
        setErrorMessage(e.message);
      } else {
        setErrorMessage("Unknown Error");
      }
      setState("error");
    }
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
        message={errorMessage}
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

function ErrorDialog(props: {
  open: boolean;
  message?: string | null;
  onClose?: () => void;
}) {
  return (
    <Dialog open={props.open}>
      <DialogTitle>Error</DialogTitle>
      <DialogContent>
        <DialogContentText>{props.message ?? "Error"}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
