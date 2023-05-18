import { Pause, PlayArrow, Replay, Stop } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { AudioPlayerState } from "webaudio-stream-player";
import { PlayerContext } from "../contexts/PlayerContext";
import { TimeSlider } from "../widgets/TimeSlider";
import { toTimeString } from "../utils/format-utils";

export function PlayControl() {
  const context = useContext(PlayerContext);
  const [playState, setPlayState] = useState(context.player.state);
  const onStateChange = (ev: CustomEvent<AudioPlayerState>) => {
    setPlayState(ev.detail);
  };

  const [timeInfo, setTimeInfo] = useState({ currentTime: 0, bufferedTime: 0 });

  useEffect(() => {
    context.player.addEventListener("statechange", onStateChange);
    return () => {
      context.player.removeEventListener("statechange", onStateChange);
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const { currentTime, bufferedTime } = context.player.progress.renderer;
      setTimeInfo({ currentTime, bufferedTime });
    }, 100);
    return () => clearInterval(id);
  }, []);

  const playIcon = playState == "playing" ? <Pause /> : <PlayArrow />;

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
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          px: 2,
        }}
      >
        <Typography variant="caption">
          {toTimeString(Math.min(timeInfo.currentTime, timeInfo.bufferedTime))}
        </Typography>
        <Box
          sx={{
            display: "flex",
            flex: 1,
            maxWidth: "256px",
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <IconButton
            color="primary"
            onClick={async () => {
              context.reducer.replay();
            }}
            disabled={
              context.player.state == "initial" ||
              context.player.state == "aborted" ||
              context.player.state == "disposed"
            }
          >
            <Replay />
          </IconButton>
          <IconButton
            color="primary"
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
        <Typography variant="caption">
          {toTimeString(timeInfo.bufferedTime)}
        </Typography>
      </Box>
    </Box>
  );
}
