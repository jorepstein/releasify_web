import { getSession, useSession, signIn, signOut } from "next-auth/react";
import { useState, useMemo } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { useDispatch, useSelector } from "react-redux";
import { newPlaylistUrlSelector } from "./statusSlice";
import { createSelector } from "reselect";

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
  return <Typography>Hello</Typography>;
}

function NewPlaylistLink() {
  const newPlaylistUrl = useSelector(newPlaylistUrlSelector);
  if (newPlaylistUrl) {
    return (
      <Button href={newPlaylistUrl} target="_blank" rel="noopener">
        {newPlaylistUrl}
      </Button>
    );
  } else {
    return <div />;
  }
}
