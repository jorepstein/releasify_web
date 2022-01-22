import { configureStore } from "@reduxjs/toolkit";

import optionsReducer from "../features/options/optionsSlice";
import playlistsReducer from "../features/playlists/playlistsSlice";
import releasifyReducer from "../features/releasify/releasifySlice";

function makeStore() {
  return configureStore({
    reducer: {
      options: optionsReducer,
      playlists: playlistsReducer,
      releasify: releasifyReducer,
    },
  });
}

export default makeStore();
