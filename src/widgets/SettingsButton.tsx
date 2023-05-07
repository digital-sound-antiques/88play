import { Settings } from "@mui/icons-material";
import { ButtonProps, IconButton } from "@mui/material";
import { useState } from "react";
import { SettingsDialog } from "../views/SettingsDialog";

export function SettingsButton(props: ButtonProps) {
  const [open, setOpen] = useState(false);

  const onClick = async () => {
    setOpen(true);
  };

  return (
    <>
      <IconButton color="primary" onClick={onClick} {...props}>
        <Settings fontSize="small" />
      </IconButton>
      <SettingsDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
