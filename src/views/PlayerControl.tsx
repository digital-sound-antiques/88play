import { Pause, PlayArrow, Replay, Stop } from "@mui/icons-material";
import { Box, IconButton } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AudioPlayerState } from "webaudio-stream-player";
import { PlayerContext } from "../contexts/PlayerContext";
import { TimeSlider } from "../widgets/TimeSlider";

export function PlayControl() {
  const context = useContext(PlayerContext);
  const [playState, setPlayState] = useState(context.player.state);
  const onStateChange = (ev: CustomEvent<AudioPlayerState>) => {
    setPlayState(ev.detail);
  };
  useEffect(() => {
    context.player.addEventListener("statechange", onStateChange);
    return () => {
      context.player.removeEventListener("statechange", onStateChange);
    };
  });

  let playIcon = playState == "playing" ? <Pause /> : <PlayArrow />;

  if (context.currentItem == null) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pb: 1,
      }}
    >
      <Box sx={{ width: "100%", pb: 1 }}>
        <TimeSlider />
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          maxWidth: "240px",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <IconButton
          color="primary"
          onClick={async () => {
            context.reducer.stop();
            await new Promise((resolve) => setTimeout(resolve, 100));
            context.reducer.play();
          }}
        >
          <Replay />
        </IconButton>
        <IconButton
          color="primary"
          sx={{ p: 0 }}
          onClick={async () => {
            if (playState == "playing") {
              context.reducer.pause();
            } else if (playState == "paused") {
              context.reducer.resume();
            } else {
              await context.unmute();
              context.reducer.play();
            }
          }}
        >
          {playIcon}
        </IconButton>
        <IconButton
          color="primary"
          onClick={() => {
            context.reducer.stop();
          }}
        >
          <Stop />
        </IconButton>
      </Box>
    </Box>
  );
}
