import { Settings } from "@mui/icons-material";
import { useState } from "react";
import { SettingsDialog } from "../views/SettingsDialog";
import { ToolBarButton } from "./ToolBarButton";

export function SettingsButton() {
  const [open, setOpen] = useState(false);

  const onClick = async () => {
    setOpen(true);
  };

  return (
    <>
      <ToolBarButton onClick={onClick} icon={<Settings fontSize="small" />}/>
      <SettingsDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
