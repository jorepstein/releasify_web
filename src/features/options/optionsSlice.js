import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { makeNewPlaylist } from "../spotifyApi";

const TIME_RANGE_REGEXP = new RegExp("^[0-9]*$");

const initialState = {
  timeRange: 1,
  targetPlaylistId: "",
  useExistingPlaylist: false,
};
if (process.env.NODE_ENV == "development") {
  initialState.targetPlaylistId = "2iKFiRdttTeG5fDHWDjSJp";
  initialState.useExistingPlaylist = true;
}
export const generateTargetPlaylist = createAsyncThunk(
  "options/generateTargetPlaylist",
  async (userId, thunkAPI) => {
    const { accessToken } = await fetch("/api/refresh").then((response) =>
      response.json()
    );
    const targetPlaylistId = await makeNewPlaylist(userId, accessToken, {
      name: "Releasify",
      public: "false",
    });
    thunkAPI.dispatch(
      optionsSlice.actions.setTargetPlaylistId(targetPlaylistId)
    );
    return targetPlaylistIdSelector(thunkAPI.getState());
  }
);

export const optionsSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    setTimeRange: (state, action) => {
      if (TIME_RANGE_REGEXP.test(action.payload)) {
        state.timeRange = action.payload;
      }
    },
    setTargetPlaylistId: (state, action) => {
      state.targetPlaylistId = action.payload;
    },
    setUseExistingPlaylist: (state, action) => {
      state.useExistingPlaylist = action.payload;
    },
  },
});

export const { setTimeRange, setTargetPlaylistId, setUseExistingPlaylist } =
  optionsSlice.actions;
export const targetPlaylistIdSelector = (appState) =>
  appState.options.targetPlaylistId;
export const timeRangeSelector = (appState) => appState.options.timeRange;
export const useExistingPlaylistSelector = (appState) =>
  appState.options.useExistingPlaylist;
export const optionsSelector = (appState) => appState.options;
export default optionsSlice.reducer;
