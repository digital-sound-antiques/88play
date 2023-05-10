import { ContentCopy } from "@mui/icons-material";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  FormControl,
  IconButton,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";

import { useState } from "react";
import { useTranslation } from "react-i18next";

export function ShareDialog(props: {
  open: boolean;
  url?: string | null;
  onClose?: () => void;
}) {
  const { t } = useTranslation();

  const [copied, setCopied] = useState(false);

  const onClickCopy = () => {
    if (props.url != null) {
      navigator.clipboard.writeText(props.url);
      setCopied(true);
    }
  };

  return (
    <Dialog open={props.open} maxWidth="xs" fullWidth>
      <DialogContent>
        <DialogContentText>{t("share.message")}</DialogContentText>
        <FormControl fullWidth sx={{ my: 1 }}>
          <Stack direction="row" gap={1}>
            <TextField
              size="small"
              onFocus={(event) => event.target.select()}
              InputProps={{ readOnly: true }}
              variant="outlined"
              value={props.url ?? ""}
              sx={{ width: "100%", userSelect: "all" }}
            />
            <IconButton color="primary" onClick={onClickCopy}>
              <ContentCopy fontSize="small" />
            </IconButton>
          </Stack>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Ok</Button>
      </DialogActions>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={copied}
        autoHideDuration={3000}
        onClose={() => setCopied(false)}
      >
        <Alert severity="success">{t('share.copyMessage')}</Alert>
      </Snackbar>
    </Dialog>
  );
}
