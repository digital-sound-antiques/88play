import { MoreVert } from "@mui/icons-material";
import { IconButton, Menu, MenuItem } from "@mui/material";
import { useRef, useState } from "react";
import { AboutDialog } from "../views/AboutDialog";
import { SettingsDialog } from "../views/SettingsDialog";

export function SettingsButton() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const onClick = async () => {
    setOpen(true);
  };

  return (
    <>
      <IconButton edge="end" color="primary" ref={buttonRef} onClick={onClick}>
        <MoreVert fontSize="small" />
      </IconButton>
      <MoreMenu
        anchorEl={buttonRef.current}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}

export function MoreMenu(props: {
  anchorEl?: Element | null;
  open?: boolean | null;
  onClose?: () => void;
  onError?: (message: string) => void;
}) {
  const [openSettings, setOpenSettings] = useState(false);
  const [openAbout, setOpenAbout] = useState(false);

  const onClickSettings = () => {
    props.onClose?.();
    setOpenSettings(true);
  };

  const onClickAbout = () => {
    props.onClose?.();
    setOpenAbout?.(true);
  };

  return (
    <>
      <Menu
        open={props.open ?? false}
        anchorEl={props.anchorEl}
        onClose={props.onClose}
      >
        <MenuItem onClick={onClickSettings}>Settings</MenuItem>
        <MenuItem onClick={onClickAbout}>About</MenuItem>
      </Menu>
      <AboutDialog open={openAbout} onClose={() => setOpenAbout(false)} />
      <SettingsDialog
        open={openSettings}
        onClose={() => setOpenSettings(false)}
      />
    </>
  );
}
