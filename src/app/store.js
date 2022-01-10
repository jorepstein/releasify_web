import { configureStore } from "@reduxjs/toolkit";

import optionsReducer from "../features/options/optionsSlice";
import playlistsReducer from "../features/playlists/playlistsSlice";
import statusReducer from "../features/status/statusSlice";

function makeStore() {
  return configureStore({
    reducer: {
      options: optionsReducer,
      playlists: playlistsReducer,
      status: statusReducer,
    },
  });
}

export default makeStore();
