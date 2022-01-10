import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useSelector } from "react-redux";

import { newPlaylistUrlSelector } from "./statusSlice";

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
      <Status />
      <NewPlaylistLink />
    </Box>
  );
}

function Status() {
  return <Typography></Typography>;
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
