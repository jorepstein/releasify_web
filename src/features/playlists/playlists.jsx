import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Textfield from "@mui/material/ListItemText";

import { useDispatch, useSelector } from "react-redux";
import {
  userPlaylistsSelector,
  makeIsSelectedSelector,
  togglePlaylistSelection,
  getUserPlaylists,
  arePlaylistsLoadedSelector,
  arePlaylistsSelectedSelector,
  selectedUserPlaylistIdsSelector,
} from "./playlistsSlice";
import { makeNewPlaylist, runPlaylists } from "./runPlaylistsApi";
import { newPlaylistIdSelector, setNewPlaylistId } from "../status/statusSlice";
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
    >
      Get all my playlists
    </Button>
  );
}

export function PlaylistListBox() {
  let filterText,
    setFilterText = useState("");

  return (
    true && (
      <Box
        sx={{
          overflow: "auto",
          height: "100%",
          maxHeight: "500px",
          border: 4,
          borderColor: "secondary.main",
          borderRadius: 5,
        }}
      >
        <PlaylistList />
      </Box>
    )
  );
}

function FilterEdit({ filterText, setFilterText }) {
  return (
    <Box>
      <TextField id="outlined-basic" label="Outlined" variant="outlined" />
    </Box>
  );
}

function PlaylistList() {
  const userPlaylists = useSelector(userPlaylistsSelector);
  return (
    <List>
      {userPlaylists.map((item) => (
        <Playlist
          key={item.id}
          name={item.name}
          imageUrl={item.images[0]?.url}
          playlistId={item.id}
        />
      ))}
    </List>
  );
}

function Playlist({ name, imageUrl, playlistId }) {
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
      sx={{ borderBottom: 1, borderColor: "primary.main" }}
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
    <Button variant={variant} color="primary" onClick={onRunClick}>
      Run
    </Button>
  );
}
