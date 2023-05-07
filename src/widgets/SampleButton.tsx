import { LibraryMusic } from "@mui/icons-material";
import { Button, ButtonProps } from "@mui/material";
import { useState } from "react";
import { SampleDialog } from "../views/SampleDialog";

export function SampleButton(props: ButtonProps) {
  const [open, setOpen] = useState(false);

  const onClick = async () => {
    setOpen(true);
  };

  return (
    <>
      <Button onClick={onClick} {...props}>
        <LibraryMusic fontSize="small" />
        &nbsp; Samples
      </Button>
      <SampleDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
