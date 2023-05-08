import { LibraryMusic } from "@mui/icons-material";
import { useState } from "react";
import { SampleDialog } from "../views/SampleDialog";
import { ToolBarButton } from "./ToolBarButton";

export function SampleButton() {
  const [open, setOpen] = useState(false);

  const onClick = async () => {
    setOpen(true);
  };

  return (
    <>
      <ToolBarButton
        onClick={onClick}
        icon={<LibraryMusic fontSize="small" />}
        label="Samples"
      />
      <SampleDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
