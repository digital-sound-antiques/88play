import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  TextField,
} from "@mui/material";

import { useTranslation } from "react-i18next";

export function ShareDialog(props: {
  open: boolean;
  url?: string | null;
  onClose?: () => void;
}) {
  const { t } = useTranslation();

  return (
    <Dialog open={props.open} maxWidth="xs" fullWidth>
      <DialogContent>
        <DialogContentText>{t("share.message")}</DialogContentText>
        <FormControl fullWidth sx={{ my: 1 }}>
          <TextField
            onFocus={(event) => event.target.select()}
            InputProps={{ readOnly: true }}
            variant="standard"
            value={props.url ?? ""}
            sx={{ width: "100%", userSelect: "all" }}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
