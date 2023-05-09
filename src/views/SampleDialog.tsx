import { Close, MusicNote } from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  Typography,
} from "@mui/material";
import { useContext } from "react";
import { EditorContext } from "../contexts/EditorContext";
import { PlayerContext } from "../contexts/PlayerContext";
import {
  SampleEntry,
  SampleSection,
  sampleSections,
} from "../models/sample-entry";
import { PlayControl } from "./PlayerControl";

export function SampleDialog(props: { open: boolean; onClose?: () => void }) {
  const editorContext = useContext(EditorContext);
  const playerContext = useContext(PlayerContext);
  const onClickItem = async (e: SampleEntry, section: SampleSection) => {
    await playerContext.unmute();

    await editorContext.reducer.onFileOpen(
      e.files.map((file) => ["samples", section.folder, file].join("/"))
    );
    const { text } = await editorContext.reducer.getLatestState();
    playerContext.reducer.play({ title: e.title, mml: text });
  };
  const createSection = (section: SampleSection, index: number) => {
    return (
      <Box key={index}>
        <ListSubheader>{section.title}</ListSubheader>
        {section.entries.map((e) => {
          const copyright = e.copyright ?? section.copyright;
          const license = e.license ?? section.license;

          return (
            <ListItem key={e.id} disablePadding>
              <ListItemButton onClick={() => onClickItem(e, section)}>
                <ListItemIcon>
                  <MusicNote color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={e.title}
                  secondary={
                    <Typography variant="caption">
                      {copyright != null ? `Copyright (c) ${copyright}` : null}
                      {license != null ? ` / ${license}` : null}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </Box>
    );
  };

  return (
    <Dialog
      open={props.open}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { maxHeight: "80%" } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1,
        }}
      >
        Samples
        <IconButton
          edge="end"
          onClick={props.onClose}
          sx={{ color: "primary.main" }}
        >
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <List disablePadding>
          {sampleSections.map((s, i) => createSection(s, i))}
        </List>
      </DialogContent>
      <DialogActions disableSpacing sx={{ p: 0 }}>
        <Box sx={{ width: "100%" }}>
          <PlayControl />
        </Box>
      </DialogActions>
    </Dialog>
  );
}
