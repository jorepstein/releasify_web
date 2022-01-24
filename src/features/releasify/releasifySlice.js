import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

import { runPlaylists } from "./releasifyApi";

const initialState = {
  statusDescription: "",
  newPlaylistId: "",
  inputPlaylistIds: [],
  processedPlaylistIds: [],
  foundArtistIds: [],
  processedArtistIds: [],
  newTrackIds: [],
};

export const runReleasify = createAsyncThunk(
  "status/run",
  async ({ inputPlaylistIds, targetPlaylistId, timeRangeDays }, thunkAPI) => {
    thunkAPI.dispatch(statusSlice.actions.clearStatus());
    thunkAPI.dispatch(setNewPlaylistId(targetPlaylistId));
    thunkAPI.dispatch(setInputPlaylistIds(inputPlaylistIds));
    return runPlaylists(
      inputPlaylistIds,
      targetPlaylistId,
      timeRangeDays,
      thunkAPI
    );
  }
);

export const statusSlice = createSlice({
  name: "status",
  initialState,
  reducers: {
    clearStatus: (state) => {
      state = initialState;
    },
    setStatusDescription: (state, action) => {
      state.statusDescription = action.payload;
    },
    setNewPlaylistId: (state, action) => {
      state.newPlaylistId = action.payload;
    },
    setInputPlaylistIds: (state, action) => {
      state.inputPlaylistIds = action.payload;
    },
    addProcessedPlaylistIds: (state, action) => {
      state.processedPlaylistIds.push(...action.payload);
    },
    addFoundArtistIds: (state, action) => {
      state.foundArtistIds.push(...action.payload);
    },
    addProcessedArtistIds: (state, action) => {
      state.processedArtistIds.push(...action.payload);
    },
    addNewTrackIds: (state, action) => {
      state.newTrackIds.push(...action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runReleasify.pending, (state, action) => {
        state.statusDescription = "pending";
      })
      .addCase(runReleasify.fulfilled, (state, action) => {
        state.statusDescription = "fulfilled";
      })
      .addCase(runReleasify.rejected, (state, action) => {
        state.statusDescription = "rejected";
      });
  },
});

export const {
  clearStatus,
  setNewPlaylistId,
  setInputPlaylistIds,
  addProcessedPlaylistIds,
  addFoundArtistIds,
  addProcessedArtistIds,
  addNewTrackIds,
} = statusSlice.actions;

export const statusDescriptionSelector = (appState) =>
  appState.releasify.statusDescription;
export const newPlaylistIdSelector = (appState) =>
  appState.releasify.newPlaylistId;
export const inputPlaylistIdsSelector = (appState) =>
  appState.releasify.inputPlaylistIds;
export const processedPlaylistIdsSelector = (appState) =>
  appState.releasify.processedPlaylistIds;
export const foundArtistIdsSelector = (appState) =>
  appState.releasify.foundArtistIds;
export const processedArtistIdsSelector = (appState) =>
  appState.releasify.processedArtistIds;
export const newTrackIdsSelector = (appState) => appState.releasify.newTrackIds;

export const newPlaylistUrlSelector = createSelector(
  newPlaylistIdSelector,
  (newPlaylistId) =>
    newPlaylistId && `https://open.spotify.com/playlist/${newPlaylistId}`
);

export default statusSlice.reducer;
