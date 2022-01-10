import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";

import {
  generateTargetPlaylist,
  setTargetPlaylistId,
  setTimeRange,
  setUseExistingPlaylist,
  targetPlaylistIdSelector,
  timeRangeSelector,
  useExistingPlaylistSelector,
} from "./optionsSlice";

export function OptionsBox() {
  return (
    <Box
      sx={{
        border: 4,
        padding: 1,
        borderColor: "secondary.main",
        borderRadius: 5,
        position: "relative",
        overflow: "hidden",
        width: 400,
      }}
    >
      <TimeRangeEdit />
      <TargetPlaylistFormGroup />
    </Box>
  );
}
const TIME_RANGE_REGEXP = new RegExp("^[0-9]*$");

function TimeRangeEdit() {
  const timeRange = useSelector(timeRangeSelector);
  const dispatch = useDispatch();

  return (
    <Box>
      <TextField
        label="Time Range"
        variant="outlined"
        size="small"
        margin="dense"
        value={timeRange}
        onChange={(ev) =>
          dispatch(setTimeRange(ev.target.value ? Number(ev.target.value) : ""))
        }
        onBlur={(ev) => {
          if (!ev.target.value || ev.target.value == "0") {
            dispatch(setTimeRange(1));
          }
        }}
        InputProps={{
          endAdornment: <InputAdornment position="end">day(s)</InputAdornment>,
        }}
        inputProps={{ inputMode: "numeric" }}
        sx={{ width: 130 }}
      />
    </Box>
  );
}

function TargetPlaylistFormGroup() {
  return (
    <FormGroup>
      <FormControlLabel
        sx={{ color: "text.secondary" }}
        control={<UseExistingPlaylistCheckbox />}
        label="Add discoveries to existing playlist"
      />
      <TargetPlaylistIdTextField />
    </FormGroup>
  );
}

function TargetPlaylistIdTextField() {
  const useExistingPlaylist = useSelector(useExistingPlaylistSelector);
  const targetPlaylistId = useSelector(targetPlaylistIdSelector);
  const dispatch = useDispatch();
  return (
    useExistingPlaylist && (
      <TextField
        label="Existing Playlist ID"
        variant="outlined"
        size="small"
        margin="dense"
        value={targetPlaylistId}
        onChange={(ev) => dispatch(setTargetPlaylistId(ev.target.value))}
      />
    )
  );
}

function UseExistingPlaylistCheckbox() {
  const useExistingPlaylist = useSelector(useExistingPlaylistSelector);
  const dispatch = useDispatch();
  return (
    <Checkbox
      checked={useExistingPlaylist}
      onChange={(ev) => dispatch(setUseExistingPlaylist(ev.target.checked))}
    />
  );
}
