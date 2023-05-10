import {
    FileOpen
} from "@mui/icons-material";
import {
    ListItemText,
    Menu,
    MenuItem
} from "@mui/material";
import { useContext, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { EditorContext } from "../contexts/EditorContext";
import { ToolBarButton } from "./ToolBarButton";

export function FileButton() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const onClick = async () => {
    setOpen(true);
  };

  return (
    <>
      <ToolBarButton
        ref={buttonRef}
        onClick={onClick}
        icon={<FileOpen fontSize="small" />}
        label="File"
      />
      <FileMenu
        anchorEl={buttonRef.current}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export function FileMenu(props: {
  anchorEl?: Element | null;
  open?: boolean | null;
  onClose?: () => void;
  onError?: (message: string) => void;
}) {
  const { t } = useTranslation();

  const editorContext = useContext(EditorContext);
  const onClickNew = () => {
    props.onClose?.();
    editorContext.reducer.onFileOpen(["./samples/dsa/blank.muc"]);
  };
  const onClickOpen = () => {
    props.onClose?.();
    editorContext.openFile();
  };
  return (
    <>
      <Menu
        open={props.open ?? false}
        anchorEl={props.anchorEl}
        onClose={props.onClose}
      >
        <MenuItem onClick={onClickNew}>
          <ListItemText>{t('menu.file.new')}</ListItemText>
        </MenuItem>
        <MenuItem onClick={onClickOpen}>
          <ListItemText>{t('menu.file.open')}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
