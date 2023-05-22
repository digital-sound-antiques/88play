import {
  Button,
  Dialog,
  DialogActions,
  DialogContent
} from "@mui/material";
import { useContext } from "react";
import { AppGlobalContext } from "../contexts/AppGlobalContext";

export function GlobalErrorDialog() {
  const { errorMessage, setErrorMessage } = useContext(AppGlobalContext);

  return (
    <Dialog open={errorMessage != null}>
      <DialogContent
        sx={{
          minWidth: 288,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {errorMessage}
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={() => setErrorMessage(null)}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
}
