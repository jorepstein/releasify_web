import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { generateUserPlaylists } from "./playlistsApi";
import { createSelector } from "reselect";

const initialState = {
  userPlaylists: [],
  selectedUserPlaylistIds: [],
};

export const getUserPlaylists = createAsyncThunk(
  "playlists/getUserPlaylists",
  async (userId, thunkAPI) => {
    for await (let userPlaylistsBatch of generateUserPlaylists(userId)) {
      thunkAPI.dispatch(
        playlistsSlice.actions.addPlaylists(userPlaylistsBatch)
      );
    }
    return userPlaylistsSelector(thunkAPI.getState());
  }
);

export const playlistsSlice = createSlice({
  name: "playlists",
  initialState,
  reducers: {
    addPlaylists: (state, action) => {
      state.userPlaylists.push(...action.payload);
    },
    togglePlaylistSelection: (state, action) => {
      let selectedPlaylistIdsSet = new Set(state.selectedUserPlaylistIds);
      let playlistId = action.payload;
      if (selectedPlaylistIdsSet.has(playlistId)) {
        selectedPlaylistIdsSet.delete(playlistId);
      } else {
        selectedPlaylistIdsSet.add(playlistId);
      }
      state.selectedUserPlaylistIds = Array.from(selectedPlaylistIdsSet);
    },
  },
});

export const { addPlaylists, togglePlaylistSelection } = playlistsSlice.actions;
export const userPlaylistsSelector = (appState) =>
  appState.playlists.userPlaylists;
export const selectedUserPlaylistIdsSelector = (appState) =>
  appState.playlists.selectedUserPlaylistIds;

// Derived state selectors
export const arePlaylistsLoadedSelector = createSelector(
  userPlaylistsSelector,
  (userPlaylists) => userPlaylists.length != 0
);
export const arePlaylistsSelectedSelector = createSelector(
  selectedUserPlaylistIdsSelector,
  (selectedPlaylistIds) => selectedPlaylistIds.length != 0
);

// Selector factories for memoization in components
export const makeIsSelectedSelector = () =>
  createSelector(
    selectedUserPlaylistIdsSelector,
    (_, playlistId) => playlistId,
    (ids, playlistId) => ids.includes(playlistId)
  );
export default playlistsSlice.reducer;
