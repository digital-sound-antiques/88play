import { Download } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
  Menu,
  MenuItem,
} from "@mui/material";
import { useContext, useRef, useState } from "react";
import { EditorContext } from "../contexts/EditorContext";

import md5 from "md5";
import { Mucom88 } from "mucom88-js";
import { StorageContext } from "../contexts/StorageContext";
import { ToolBarButton } from "./ToolBarButton";
import { convert as toSjis } from "utf16-to-sjis";
import { addLineNumber, prepareAttachments } from "../utils/load-urls";
import { MucomLogFileType } from "mucom88-js/dist/module";
import { getResourceMap } from "../contexts/EditorContextReducer";
import { Mucom2Wav } from "../mucom/mucom-to-wav";

function saveAs(input: Uint8Array | string, filename: string) {
  const blob = new Blob([input]);
  const a = document.createElement("a");
  a.href = window.URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

function removeExt(file: string): string {
  const parts = file.split(".");
  if (parts.length > 1) {
    return parts.slice(0, parts.length - 1).join(".");
  }
  return file;
}

function getBasename(mml: string) {
  let m = mml.match(/^;?#name\s*(.+)\s*$/m);
  if (m != null) {
    return removeExt(m[1].trim());
  }
  m = mml.match(/^#comment\s+([A-Z0-9_\-.]+)\s*$/i);
  if (m != null && m[1].length <= 16) {
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
  const onClickDownloadBAS = () => {
    props.onClose?.();
    const mml = editorContext.text;
    const name = getBasename(mml);
    saveAs(toSjis(addLineNumber(mml, true)), name + ".txt");
  };

  const getAttachments = async () => {
    const rmap = getResourceMap(editorContext.text);
    return (await prepareAttachments(rmap, storage)) ?? [];
  };

  const onClickDownloadMUB = async () => {
    props.onClose?.();
    editorContext.reducer.setBusy(true);
    try {
      await Mucom88.initialize();
      const mml = editorContext.text;

      for (const attachment of await getAttachments()) {
        const { name, data } = attachment;
        Mucom88.FS.writeFile(name, data);
      }
      const mucom = new Mucom88();
      try {
        mucom.reset(44100);
        const mub = mucom.compile(mml);
        saveAs(mub, getBasename(mml) + ".mub");
      } catch (e) {
        props.onError?.("Compile Error.");
      }
      mucom.release();
    } finally {
      editorContext.reducer.setBusy(false);
    }
  };

  const onClickDownloadVGM = async () => {
    props.onClose?.();
    editorContext.reducer.setBusy(true);
    try {
      await Mucom88.initialize();
      const mml = editorContext.text;
      for (const attachment of await getAttachments()) {
        const { name, data } = attachment;
        Mucom88.FS.writeFile(name, data);
      }
      const mucom = new Mucom88();
      try {
        mucom.reset(44100);
        const mub = mucom.compile(mml);
        const { maxCount } = mucom.getCountData();
        const vgm = mucom.generateLogFile(mub, MucomLogFileType.VGM, maxCount);
        saveAs(vgm, getBasename(mml) + ".vgm");
      } catch (e) {
        console.log(e);
        props.onError?.("Compile Error");
      }
      mucom.release();
    } finally {
      editorContext.reducer.setBusy(false);
    }
  };

  const onClickDownloadAttachment = async (type: "voice" | "pcm") => {
    props.onClose?.();
    editorContext.reducer.setBusy(true);
    try {
      for (const attachment of await getAttachments()) {
        if (attachment.type == type) {
          saveAs(attachment.data, attachment.name);
          return;
        }
      }
      props.onError?.(`Missing ${type} data file.`);
    } finally {
      editorContext.reducer.setBusy(false);
    }
  };

  const onClickDownloadWAV = async () => {
    props.onClose?.();
    editorContext.reducer.setBusy(true);
    try {
      const mml = editorContext.text;
      const encoder = new Mucom2Wav(55467);
      const args = {
        mml,
        attachments: await getAttachments(),
      };
      const it = encoder.convert(args);
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const d = await it.next();
        if (d.done) {
          saveAs(d.value, getBasename(mml) + ".wav");
          break;
        } else {
          const seconds = (d.value.decodedFrames / d.value.sampleRate).toFixed(1);
          editorContext.reducer.setProgressMessage(`${seconds}s generated`);
          await new Promise((resolve) => setTimeout(resolve, 1));
          console.log(`${d.value}`);
        }
      }
      encoder.release();
    } finally {
      editorContext.reducer.setProgressMessage(null);
      editorContext.reducer.setBusy(false);
    }
  };

  return (
    <Menu
      open={props.open ?? false}
      anchorEl={props.anchorEl}
      onClose={props.onClose}
    >
      <MenuItem onClick={onClickDownloadMML}>MML (.muc)</MenuItem>
      <MenuItem onClick={onClickDownloadBAS}>MML (for BASIC)</MenuItem>
      <Divider />
      <MenuItem onClick={() => onClickDownloadAttachment("voice")}>
        Voice Data
      </MenuItem>
      <MenuItem onClick={() => onClickDownloadAttachment("pcm")}>
        ADPCM Data
      </MenuItem>
      <Divider />
      <MenuItem onClick={onClickDownloadMUB}>MUB (.mub)</MenuItem>
      <MenuItem onClick={onClickDownloadVGM}>VGM (.vgm)</MenuItem>
      <Divider />
      <MenuItem onClick={onClickDownloadWAV}>WAV (55.5KHz) (.wav)</MenuItem>
    </Menu>
  );
}

export function ExportButton() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <ToolBarButton
        ref={buttonRef}
        icon={<Download fontSize="small" />}
        label="Export"
        onClick={() => setOpen(true)}
      />
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
