import { getSession, useSession, signIn, signOut } from "next-auth/react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";

import {
  GetPlaylistsButton,
  PlaylistListBox,
  RunButton,
} from "../features/playlists/playlists";
import { StatusBox } from "../features/status/status";

export default function AppBox() {
  return (
    <Stack
      sx={{
        bgcolor: "background.default",
        color: "text.primary",
        width: "100%",
        height: "100%",
      }}
    >
      <Component />
      <LogIn />
    </Stack>
  );
}

function LogIn() {
  const { data: session } = useSession();
  if (session) {
    return (
      <Box>
        <hr />
        <Button variant="outlined" onClick={() => signOut()}>
          Sign out
        </Button>
        Signed in as {session?.token?.email}
      </Box>
    );
  }
  return (
    <Box>
      <Button variant="contained" onClick={() => signIn("spotify")}>
        Sign in
      </Button>
      Not signed in
    </Box>
  );
}

function Component() {
  const { data: session } = useSession();

  if (session) {
    return (
      <Stack>
        <GetPlaylistsButton />
        <PlaylistListBox />
        <RunButton />
        <StatusBox />
      </Stack>
    );
  }
  return <div />;
}
