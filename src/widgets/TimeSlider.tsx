import React, { useContext, useEffect, useRef, useState } from "react";
import { Box, LinearProgress } from "@mui/material";
import { AudioPlayerProgress } from "webaudio-stream-player";
import { PlayerContext } from "../contexts/PlayerContext";

export function TimeSlider() {
  const [state, setState] = useState({
    currentTime: 0,
    bufferedTime: 0,
    isFulFilled: false,
  });

  const context = useContext(PlayerContext);

  const handleProgress = (ev: CustomEvent<AudioPlayerProgress>) => {
    setState({
      currentTime: ev.detail.renderer.currentTime,
      bufferedTime: ev.detail.renderer.bufferedTime,
      isFulFilled: ev.detail.renderer.isFulFilled,
    });
  };

  useEffect(() => {
    context.player.addEventListener("progress", handleProgress);
    return () => {
      context.player.removeEventListener("progress", handleProgress);
    };
  });

  let value: number;
  let valueBuffer: number;
  let variant: "buffer" | "determinate" | "indeterminate";
  if (state.bufferedTime == 0) {
    value = 0;
    valueBuffer = 0;
    variant = "determinate";
  } else if (state.isFulFilled) {
    value = Math.min(100, (100 * state.currentTime) / state.bufferedTime);
    valueBuffer = 100;
    variant = "determinate";
  } else {
    const max = Math.max(state.bufferedTime + 30 * 1000, 60 * 1000);
    value = Math.min(100, (100 * state.currentTime) / max);
    valueBuffer = (100 * state.bufferedTime) / max;
    variant = "buffer";
  }

  const boxRef = useRef<HTMLDivElement>(null);
  const onClick = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (boxRef.current != null) {
      const { left } = boxRef.current.getBoundingClientRect();
      const offsetX = ev.clientX - left;
      const boxWidth = boxRef.current.clientWidth;
      const pos = (offsetX / boxWidth) * state.bufferedTime;
      context.player.seekInTime(pos);
    }
  };

  return (
    <Box ref={boxRef} sx={{ py: 0 }} onClick={onClick}>
      <LinearProgress
        variant={variant}
        color="secondary"
        value={value}
        valueBuffer={valueBuffer}
        sx={{
          height: "4px",
          "& .MuiLinearProgress-bar": {
            transition: "none",
          },
        }}
      />
    </Box>
  );
}
