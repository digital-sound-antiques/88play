import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Link,
  Typography,
} from "@mui/material";

import logo from "../assets/88play.svg";
import packageJson from "../../package.json";

export function AboutDialog(props: { open: boolean; onClose?: () => void }) {
  const acknowledgements = [
    <>
      <Link href="https://github.com/onitama/mucom88">OPEN MUCOM88</Link> by
      Onionsoft
    </>,
    <>
      <Link href="https://www.ancient.co.jp/~mucom88">MUCOM88</Link> by Yuzo
      Koshiro
    </>,
  ];
  const specialThanks = ["Boukichi", "TAN-Y (aosoft)", "WING☆"];

  return (
    <Dialog open={props.open}>
      <DialogContent
        sx={{ minWidth: "288px", backgroundColor: "background.paper" }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
          }}
        >
          <Box sx={{mt: 3}}>
            <img src={logo} width="300px" style={{ padding: "8px 32px" }} />
          </Box>
          <Typography variant="caption">
            Version: {packageJson.version}
          </Typography>
          <Typography variant="caption">{packageJson.license}</Typography>
          <Typography variant="caption" fontWeight="bold" sx={{ mt: 1 }}>
            This software relies on:
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
            }}
          >
            {acknowledgements.map((e, i) => (
              <Typography key={i} variant="caption">
                {e}
              </Typography>
            ))}
          </Box>
          <Typography variant="caption" fontWeight="bold" sx={{ mt: 2 }}>
            SPECIAL THANKS
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0,
            }}
          >
            {specialThanks.map((e) => (
              <Typography key={e} variant="caption">
                {e}
              </Typography>
            ))}
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ backgroundColor: "background.paper" }}>
        <Button onClick={props.onClose}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
