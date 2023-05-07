import { Alert, Button, Divider } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { EditorContext } from "../contexts/EditorContext";
import { Trans, useTranslation } from "react-i18next";

export function ResourceAlert() {
  const { unresolvedResources, openFile } = useContext(EditorContext);
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const names: string[] = unresolvedResources.map((e) => e.name);
  useEffect(() => {
    setOpen(names.length > 0);
  }, [names]);

  const action = (
    <>
      <Button color="inherit" size="small" onClick={openFile}>
        {t("alert.unresolvedResources.buttonLabel")}
      </Button>
    </>
  );

  if (open) {
    return (
      <>
        <Alert
          severity="warning"
          action={action}
          onClose={() => {
            setOpen(false);
          }}
        >
          <Trans
            i18nKey="alert.unresolvedResources.message"
            count={names.length}
          >
            {{ file: names.join(", ") }}
          </Trans>
        </Alert>
        <Divider />
      </>
    );
  }
  return <></>;
}
