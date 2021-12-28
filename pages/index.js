import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

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

  const getMyPlaylists = async () => {
    const res = await fetch("/api/playlists");
    const f = await res.json();
    const { items } = f;
    setPlaylists(items);
  };

  const onPlaylistClick = (event, playlistId) => {
    if( selectedPlaylistIds.has(playlistId)) {
      selectedPlaylistIds.delete(playlistId);
    }else {
      selectedPlaylistIds.add(playlistId);
    }
    setSelectedPlaylistIds(new Set(selectedPlaylistIds));
  };

  if (session) {
    return (
      <>
        <button onClick={() => getMyPlaylists()}>Get all my playlists</button>
        <PlaylistBox
          playlists={playlists}
          selectedPlaylistIds={selectedPlaylistIds}
          onPlaylistClick={onPlaylistClick}
        />
        <RunButton />
      </>
    );
  }
  return <div />;
}

function PlaylistBox(props) {
  return (
    <Box sx={{ overflow: "auto", height: "100%", maxHeight: "500px" }}>
      <PlaylistList
        {...props}
      />
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
          onPlaylistClick={(event) => {onPlaylistClick(event, item.id)}}
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

function RunButton() {
  return <Button variant="outline">Run</Button>;
}
