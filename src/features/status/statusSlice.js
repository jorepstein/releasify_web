import { createSlice } from "@reduxjs/toolkit";
import { createSelector } from "reselect";

const initialState = {
  statusDescription: "",
  newPlaylistId: "",
  inputPlaylistIds: [],
  processedPlaylistIds: [],
  foundArtistIds: [],
  processedArtistIds: [],
  newTrackIds: [],
};

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
  appState.status.statusDescription;
export const newPlaylistIdSelector = (appState) =>
  appState.status.newPlaylistId;
export const inputPlaylistIdsSelector = (appState) =>
  appState.status.inputPlaylistIds;
export const processedPlaylistIdsSelector = (appState) =>
  appState.status.processedPlaylistIds;
export const foundArtistIdsSelector = (appState) =>
  appState.status.foundArtistIds;
export const processedArtistIdsSelector = (appState) =>
  appState.status.processedArtistIds;
export const newTrackIdsSelector = (appState) => appState.status.newTrackIds;

export const newPlaylistUrlSelector = createSelector(
  newPlaylistIdSelector,
  (newPlaylistId) =>
    newPlaylistId && `https://open.spotify.com/playlist/${newPlaylistId}`
);

export default statusSlice.reducer;
