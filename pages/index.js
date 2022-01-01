import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import run from "./api/run";
import { makeNewPlaylist, generateUserPlaylists } from "./api/ui_actions";

export default function AppBox() {
  return (
    <Box
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        width: "100%",
        height: "100%",
      }}
    >
      <Component />
      <LogIn />
    </Box>
  );
}
function LogIn() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        <hr />
        <Button variant="outlined" onClick={() => signOut()}>
          Sign out
        </Button>
        Signed in as {session?.token?.email}
      </>
    );
  }
  return (
    <>
      <Button variant="contained" onClick={() => signIn("spotify")}>
        Sign in
      </Button>
      Not signed in
    </>
  );
}

function Component() {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState(new Set());
  const [newPlaylistId, setNewPlaylistId] = useState("");

  const onGetPlaylistsClick = async () => {
    let userPlaylists = []
    for await (let playlistChunk of generateUserPlaylists(session.user)) {
      if (playlistChunk.length) {
        userPlaylists = [...userPlaylists, ...playlistChunk]
        setPlaylists(userPlaylists);
      }
    }
  };

  const onPlaylistClick = (event, playlistId) => {
    if (selectedPlaylistIds.has(playlistId)) {
      selectedPlaylistIds.delete(playlistId);
    } else {
      selectedPlaylistIds.add(playlistId);
    }
    setSelectedPlaylistIds(new Set(selectedPlaylistIds));
  };

  async function onRunClick() {
    let newPlaylist = await makeNewPlaylist();
    setNewPlaylistId(newPlaylist.id);
    return await run(Array.from(selectedPlaylistIds), newPlaylistId);
  }

  if (session) {
    return (
      <>
        <GetPlaylistsButton onGetPlaylistsClick={onGetPlaylistsClick} playlists={playlists}/>
        <PlaylistBox
          playlists={playlists}
          selectedPlaylistIds={selectedPlaylistIds}
          onPlaylistClick={onPlaylistClick}
        />
        <RunButton onRunClick={onRunClick} playlists={playlists}/>
        <StatusBox
          newPlaylistUrl={
            newPlaylistId &&
            `https://open.spotify.com/playlist/${newPlaylistId}`
          }
        />
      </>
    );
  }
  return <div />;
}

function GetPlaylistsButton({playlists, onGetPlaylistsClick}) {
  let variant = playlists.length ? "outlined" : "contained"
  return (
    <Button
      variant={variant}
      onClick={onGetPlaylistsClick}
      color="primary"
    >
      Get all my playlists
    </Button>
  );
}

function PlaylistBox(props) {
  return (
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
      <PlaylistList {...props} />
    </Box>
  );
}

function PlaylistList({ playlists, selectedPlaylistIds, onPlaylistClick }) {
  return (
    <List>
      {playlists.map((item) => (
        <Playlist
          key={item.id}
          name={item.name}
          imageUrl={item.images[0]?.url}
          selected={selectedPlaylistIds.has(item.id)}
          onPlaylistClick={(event) => {
            onPlaylistClick(event, item.id);
          }}
        />
      ))}
    </List>
  );
}

function Playlist({ name, imageUrl, selected, onPlaylistClick }) {
  return (
    <ListItemButton
      selected={selected}
      onClick={onPlaylistClick}
      sx={{ borderBottom: 1, borderColor: "primary.main" }}
    >
      <img src={imageUrl} width="50" />
      <ListItemText primary={name} sx={{ color: "primary.main" }} />
    </ListItemButton>
  );
}

function RunButton({ onRunClick, playlists }) {
  let variant = playlists.length ? "contained" : "outlined";
  return (
    <Button variant={variant} color="primary" onClick={onRunClick}>
      Run
    </Button>
  );
}

function StatusBox({ newPlaylistUrl }) {
  return (
    <Box>
      {newPlaylistUrl && <NewPlaylistLink newPlaylistUrl={newPlaylistUrl} />}
    </Box>
  );
}

function NewPlaylistLink({ newPlaylistUrl }) {
  return (
    <Button href={newPlaylistUrl} target="_blank" rel="noopener">
      {newPlaylistUrl}
    </Button>
  );
}
