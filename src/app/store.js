import { configureStore } from "@reduxjs/toolkit";
import playlistsReducer from "../features/playlists/playlistsSlice";
import statusReducer from "../features/status/statusSlice";
function makeStore() {
  return configureStore({
    reducer: {
      playlists: playlistsReducer,
      status: statusReducer,
    },
  });
}

export default makeStore();
