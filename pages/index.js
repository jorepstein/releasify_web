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
import { makeNewPlaylist, getUserPlaylists } from "./api/ui_actions";

export default function AppBox() {
  const { data: session } = useSession();

  return (
    <Box
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <LogIn />
      <hr />
      <Component />
    </Box>
  );
}
function LogIn() {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session?.token?.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    );
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn("spotify")}>Sign in</button>
    </>
  );
}

function Component() {
  const { data: session } = useSession();
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState(new Set());

  const [newPlaylistId, setNewPlaylistId] = useState([]);

  const getMyPlaylists = async () => {
    let userPlaylists = await getUserPlaylists(session.user);
    setPlaylists(userPlaylists);
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
        <button onClick={() => getMyPlaylists(session.user)}>Get all my playlists</button>
        <PlaylistBox
          playlists={playlists}
          selectedPlaylistIds={selectedPlaylistIds}
          onPlaylistClick={onPlaylistClick}
        />
        <RunButton onRunClick={onRunClick} />
        <StatusBox
          newPlaylistUrl={`https://open.spotify.com/playlist/${newPlaylistId}`}
        />
      </>
    );
  }
  return <div />;
}

function PlaylistBox(props) {
  return (
    <Box sx={{ overflow: "auto", height: "100%", maxHeight: "500px" }}>
      <PlaylistList {...props} />
    </Box>
  );
}

function PlaylistList({ playlists, selectedPlaylistIds, onPlaylistClick }) {
  return (
    <List sx={{ height: "100%" }}>
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
    <ListItemButton selected={selected} onClick={onPlaylistClick}>
      <img src={imageUrl} width="50" />
      <ListItemText primary={name} />
    </ListItemButton>
  );
}

function RunButton({ onRunClick }) {
  return (
    <Button variant="outline" onClick={onRunClick}>
      Run
    </Button>
  );
}

function StatusBox({ newPlaylistUrl }) {
  return (
    <Box>
      <NewPlaylistLink newPlaylistUrl={newPlaylistUrl} />
    </Box>
  );
}

function NewPlaylistLink({ newPlaylistUrl }) {
  return (
    <Link href={newPlaylistUrl} target="_blank">
      {newPlaylistUrl}
    </Link>
  );
}
