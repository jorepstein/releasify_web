import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import { signIn, signOut, useSession } from "next-auth/react";
import Head from "next/head";
import { useSelector } from "react-redux";

import { OptionsBox } from "../features/options/options";
import {
  GetPlaylistsButton,
  PlaylistListBox,
  RunButton,
} from "../features/playlists/playlists";
import { userPlaylistsSelector } from "../features/playlists/playlistsSlice";
import { statusDescriptionSelector } from "../features/releasify/releasifySlice";
import { StatusBox } from "../features/status/status";

export default function AppBox() {
  return (
    <div className="container">
      <Head>
        <title>Releasify</title>
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <Stack>
        <Component />
        <LogIn />
      </Stack>
    </div>
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
        Signed in as {session?.token?.email} TEST
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
  const userPlaylists = useSelector(userPlaylistsSelector);
  const statusDescription = useSelector(statusDescriptionSelector);

  return (
    <>
      {session && (
        <Stack>
          <GetPlaylistsButton />
          {userPlaylists.length > 0 && (
            <>
              <PlaylistListBox />
              <OptionsBox />
              <RunButton />
              {statusDescription !== "" && <StatusBox />}
            </>
          )}
        </Stack>
      )}
    </>
  );
}
