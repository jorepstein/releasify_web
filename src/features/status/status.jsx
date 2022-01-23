import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";

import {
  foundArtistIdsSelector,
  inputPlaylistIdsSelector,
  newPlaylistUrlSelector,
  newTrackIdsSelector,
  processedArtistIdsSelector,
  processedPlaylistIdsSelector,
} from "../releasify/releasifySlice";

export function StatusBox() {
  return (
    <Box
      sx={{
        border: 4,
        borderColor: "secondary.main",
        borderRadius: 5,
        width: "max-content",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Status1 />
      <Status2 />
      <Status3 />
      <NewPlaylistLink />
    </Box>
  );
}

function Status1() {
  let numArtists = useSelector(foundArtistIdsSelector).length;
  let numProcessedArtists = useSelector(processedArtistIdsSelector).length;
  return (
    <Typography sx={{ color: "white" }}>
      found {numArtists} artists of which {numProcessedArtists} have been
      processed
    </Typography>
  );
}

function Status2() {
  let numInputPlaylists = useSelector(inputPlaylistIdsSelector).length;
  let numProcessedPlaylists = useSelector(processedPlaylistIdsSelector).length;
  return (
    <Typography sx={{ color: "white" }}>
      Processed {numProcessedPlaylists} out of {numInputPlaylists} selected
      playlists.
    </Typography>
  );
}

function Status3() {
  let numNewTracks = useSelector(newTrackIdsSelector).length;
  return (
    <Typography sx={{ color: "white" }}>
      Found {numNewTracks} new tracks
    </Typography>
  );
}

function NewPlaylistLink() {
  const newPlaylistUrl = useSelector(newPlaylistUrlSelector);
  return (
    <>
      {newPlaylistUrl && (
        <Button href={newPlaylistUrl} target="_blank" rel="noopener">
          {newPlaylistUrl}
        </Button>
      )}
    </>
  );
}
