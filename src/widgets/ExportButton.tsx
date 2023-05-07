import { Download } from "@mui/icons-material";
import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import { useContext, useRef, useState } from "react";
import { EditorContext } from "../contexts/EditorContext";

import { Mucom88 } from "mucom88-js";
import { StorageContext } from "../contexts/StorageContext";
import md5 from "md5";

function saveAs(input: Uint8Array | string, filename: string) {
  const blob = new Blob([input]);
  const a = document.createElement("a");
  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

function removeExt(file: string) {
  const parts = file.split('.');
  if (parts.length > 1) {
    return parts.slice(0, parts.length -1);
  }
  return parts;
}

function getBasename(mml: string) {  
  let m = mml.match(/^;?#88play name=(.+)$/m);
  if (m != null) {
    return removeExt(m[1].trim());
  } 
  m = mml.match(/^#comment\s+([A-Z0-9_\-.]+)\s*$/i);
  if (m != null && m[1]!.length <= 16) {
    return removeExt(m[1]);
  }
  return md5(mml).slice(0, 8);  
}

export function ExportMenu(props: {
  anchorEl?: Element | null;
  open?: boolean | null;
  onClose?: () => void;
  onError?: (message: string) => void;
}) {
  const { storage } = useContext(StorageContext);
  const editorContext = useContext(EditorContext);

  const onClickDownloadMML = () => {
    props.onClose?.();
    const mml = editorContext.text;
    saveAs(mml, getBasename(mml) + ".muc");
  };

  const onClickDownloadMUB = async () => {
    props.onClose?.();
    const mml = editorContext.text;
    await Mucom88.initialize();
    const mucom = new Mucom88();
    mucom.reset(44100);
    const mub = mucom.compile(mml);
    if (mub != null) {
      saveAs(mub, getBasename(mml) + ".mub");
    } else {
      props.onError?.("Compile Error.");
    }
  };

  const onClickDownloadAttachment = async (type: "voice" | "pcm") => {
    props.onClose?.();
    for (const key in editorContext.resourceMap) {
      const r = editorContext.resourceMap[key];
      if (r.type == type && r.id != null) {
        const data = await storage.get(r.id);
        if (data != null) {
          saveAs(data, r.name);
          return;
        }
      }
    }
    props.onError?.(`Missing ${type} data file.`);
  };

  return (
    <Menu
      open={props.open ?? false}
      anchorEl={props.anchorEl}
      onClose={props.onClose}
    >
      <MenuItem onClick={onClickDownloadMML}>Download MML</MenuItem>
      <MenuItem onClick={() => onClickDownloadAttachment("voice")}>
        Download Voice
      </MenuItem>
      <MenuItem onClick={() => onClickDownloadAttachment("pcm")}>
        Download PCM
      </MenuItem>
      <Divider />
      <MenuItem onClick={onClickDownloadMUB}>Download MUB</MenuItem>
    </Menu>
  );
}

export function ExportButton(props: ButtonProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <Button
        ref={buttonRef}
        onClick={() => setOpen(true)}
        {...props}
      >
        <Download fontSize="small" />
        &nbsp;Export
      </Button>
      <ExportMenu
        open={open}
        anchorEl={buttonRef.current}
        onClose={() => setOpen(false)}
        onError={setError}
      />
      <Dialog onClose={() => setError(null)} open={error != null}>
        <DialogContent>{error}</DialogContent>
        <DialogActions>
          <Button onClick={() => setError(null)}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
