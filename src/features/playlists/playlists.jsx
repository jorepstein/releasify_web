import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FixedSizeList as List } from "react-window";

import { newPlaylistIdSelector, setNewPlaylistId } from "../status/statusSlice";
import {
  getUserPlaylists,
  makeIsSelectedSelector,
  selectedUserPlaylistIdsSelector,
  togglePlaylistSelection,
  userPlaylistsSelector,
} from "./playlistsSlice";
import { runPlaylists } from "./runPlaylistsApi";

export function GetPlaylistsButton() {
  const dispatch = useDispatch();
  const { data: session } = useSession();

  const variant = true ? "outlined" : "contained";
  return (
    <Button
      variant={variant}
      onClick={() => {
        dispatch(getUserPlaylists(session.user));
      }}
      color="primary"
      sx={{ width: "200px" }}
    >
      Get all my playlists
    </Button>
  );
}

function escapeRegExp(value) {
  return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

export function PlaylistListBox() {
  const [filterText, setFilterText] = useState("");
  const userPlaylists = useSelector(userPlaylistsSelector);
  const searchRegex = new RegExp(escapeRegExp(filterText), "i");
  const searchFields = ["description", "name", "id"];
  const filteredRows = userPlaylists.filter((row) => {
    return searchFields.some((field) => {
      return searchRegex.test(row[field].toString());
    });
  });
  return (
    <Box
      sx={{
        border: 4,
        borderColor: "secondary.main",
        borderRadius: 5,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <FilterEdit filterText={filterText} setFilterText={setFilterText} />
      <PlaylistList rows={filteredRows} />
    </Box>
  );
}

function FilterEdit({ filterText, setFilterText }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        position: "absolute",
        right: 50,
        "z-index": 1,
      }}
    >
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
        }}
        margin="dense"
        value={filterText}
        placeholder="Search"
        onChange={(ev) => setFilterText(ev.target.value)}
      />
    </Box>
  );
}

function PlaylistList({ rows }) {
  return (
    <Box
      sx={{
        overflow: "auto",
      }}
    >
      <List height={500} itemSize={60} itemCount={rows.length} width="100%">
        {({ index, style }) => {
          let item = rows[index];
          return (
            <Playlist
              key={item.id}
              name={item.name}
              imageUrl={item.images[0]?.url}
              playlistId={item.id}
              sx={style}
            />
          );
        }}
      </List>
    </Box>
  );
}

function Playlist({ name, imageUrl, playlistId, sx }) {
  const dispatch = useDispatch();
  const memoizedSelector = useMemo(makeIsSelectedSelector);
  const isSelected = useSelector((state) =>
    memoizedSelector(state, playlistId)
  );
  return (
    <ListItemButton
      selected={isSelected}
      onClick={() => {
        dispatch(togglePlaylistSelection(playlistId));
      }}
      sx={sx}
    >
      <img src={imageUrl} width="50" />
      <ListItemText primary={name} sx={{ color: "primary.main" }} />
    </ListItemButton>
  );
}

export function RunButton() {
  const dispatch = useDispatch();
  const userPlaylists = useSelector(userPlaylistsSelector);
  const selectedPlaylistIds = useSelector(selectedUserPlaylistIdsSelector);
  const newPlaylistId = useSelector(newPlaylistIdSelector);
  const variant = userPlaylists.length ? "contained" : "outlined";

  function onRunClick() {
    // let newPlaylist = await makeNewPlaylist();

    dispatch(setNewPlaylistId("2iKFiRdttTeG5fDHWDjSJp"));
    runPlaylists(selectedPlaylistIds, "2iKFiRdttTeG5fDHWDjSJp");
  }
  return (
    <Button
      variant={variant}
      color="primary"
      onClick={onRunClick}
      sx={{ width: "100px" }}
    >
      Run
    </Button>
  );
}
