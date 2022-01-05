import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const initialState = {
  newPlaylistId: "",
};

export const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    setNewPlaylistId: (state, action) => {
      state.newPlaylistId = action.payload;
    },
  },
});

export const { setNewPlaylistId } = statusSlice.actions;

export const newPlaylistIdSelector = (appState) =>
  appState.status.newPlaylistId;

export const newPlaylistUrlSelector = createSelector(
  newPlaylistIdSelector,
  (newPlaylistId) =>
    newPlaylistId && `https://open.spotify.com/playlist/${newPlaylistId}`
);

export default statusSlice.reducer;
