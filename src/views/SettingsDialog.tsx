import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    MenuItem,
    Select,
    Typography
} from "@mui/material";
import { useContext } from "react";
import { EditorSettingsContext } from "../contexts/EditorSettingContext";

const fontItems = [
  { id: "xs", name: "XS", value: 10 },
  { id: "s", name: "S", value: 12 },
  { id: "m", name: "M", value: 14 },
  { id: "l", name: "L", value: 16 },
  { id: "xl", name: "XL", value: 20 },
];

export function SettingsDialog(props: { open: boolean; onClose?: () => void }) {
  const { fontSize, setFontSize, wrap, setWrap } = useContext(
    EditorSettingsContext
  );

  return (
    <Dialog open={props.open} maxWidth="xs" fullWidth={true}>
      <DialogTitle>Editor Settings</DialogTitle>
      <DialogContent sx={{ minWidth: "288px" }}>
        <FormControl sx={{ m: 1, minWidth: 128, gap: 1 }} size="small">
          <InputLabel id="font-size">Font Size</InputLabel>
          <Select<number>
            labelId="font-size"
            label="Font Size"
            fullWidth
            value={fontSize}
            onChange={(e) => setFontSize(e.target.value as number)}
          >
            {fontItems.map((e) => {
              return (
                <MenuItem key={e.id} value={e.value}>
                  <Typography>{e.name}</Typography>
                </MenuItem>
              );
            })}
          </Select>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={wrap}
                  onChange={(e) => setWrap(e.target.checked)}
                />
              }
              label="Auto Wrap"
            />
          </FormGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
}
