import { VolumeDown } from "@mui/icons-material";
import { Slider, Stack } from "@mui/material";
import { useContext } from "react";
import { PlayerContext } from "../contexts/PlayerContext";

import { styled } from "@mui/material/styles";

const WhiteSlider = styled(Slider)(({ theme }) => ({
  "&": {
    color: theme.palette.primary.main,
  },
  "& .MuiSlider-thumb": {
    width: 8,
    height: 8,
    transition: "none",
  },
  "& .MuiSlider-thumb:hover": {
    width: 12,
    height: 12,
  },
  "& .MuiSlider-track": {
    transition: "none",
  },
}));

export function VolumeControl() {
  const context = useContext(PlayerContext);
  return (
    <Stack spacing={1} direction="row" alignItems="center">
      <VolumeDown sx={{ fontSize: "20px" }} />
      <WhiteSlider      
        size="small"
        min={0.5}
        max={8.0}
        defaultValue={4.0}
        step={0.25}
        value={context.masterGain}
        onChange={(_ev, value) => {
          context.reducer.setMasterGain(value as number);
        }}
      />
    </Stack>
  );
}
