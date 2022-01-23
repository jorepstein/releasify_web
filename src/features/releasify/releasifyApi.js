import {
  addTracksToPlaylist,
  getAccessToken,
  getArtistAlbums,
  getNumArtistsAlbums,
  getNumPlaylistTracks,
  getPlaylistTracks,
  getTracksFromAlbums,
} from "../spotifyApi";
import {
  addFoundArtistIds,
  addNewTrackIds,
  addProcessedArtistIds,
  addProcessedPlaylistIds,
} from "./releasifySlice";

async function* generateTracksFromPlaylistID(
  sourcePlaylistId,
  token,
  thunkAPI
) {
  let limit = 50;
  let numTracks = await getNumPlaylistTracks(sourcePlaylistId, token);
  // e.g. 25 tracks = 1 batch
  // 75 tracks = 2 batches
  let numBatches = Math.floor(numTracks / limit) + 1;
  for (let batchNum = 0; batchNum <= numBatches; batchNum++) {
    yield await getPlaylistTracks(sourcePlaylistId, token, {
      limit,
      offset: batchNum * limit,
    });
  }
}

async function* generateArtistIds(sourcePlaylistIds, token, thunkAPI) {
  for (let sourcePlaylistId of sourcePlaylistIds) {
    for await (const tracks of generateTracksFromPlaylistID(
      sourcePlaylistId,
      token,
      thunkAPI
    )) {
      let artists = [];
      tracks.map((track) => {
        artists.push(...track.artists);
      });
      let artistIds = artists.map((artist) => artist.id);
      thunkAPI.dispatch(addFoundArtistIds(artistIds));
      yield artistIds;
    }
    thunkAPI.dispatch(addProcessedPlaylistIds([sourcePlaylistId]));
  }
}

async function* generateAlbumsForArtistId(artistId, token, thunkAPI) {
  let limit = 50;
  let numAlbums = await getNumArtistsAlbums(artistId, token);
  // e.g. 25 albums = 1 batch
  // 75 albums = 2 batches
  let numBatches = Math.floor(numAlbums / limit) + 1;
  for (let batchNum = 0; batchNum <= numBatches; batchNum++) {
    yield await getArtistAlbums(artistId, token, {
      limit,
      offset: batchNum * limit,
    });
  }
}

async function* generateNewAlbums(
  sourcePlaylistIds,
  timeRangeDays,
  token,
  thunkAPI
) {
  let processedArtistIds = [];
  for await (let artistIds of generateArtistIds(
    sourcePlaylistIds,
    token,
    thunkAPI
  )) {
    for (let artistId of artistIds) {
      if (!processedArtistIds.includes(artistId)) {
        processedArtistIds.push(artistId);
        for await (let albums of generateAlbumsForArtistId(
          artistId,
          token,
          thunkAPI
        )) {
          let newAlbums = albums.filter((album) => {
            let releaseTime = new Date(album.release_date).getTime();
            let currentTime = new Date().getTime();
            let ageOfAlbumInSeconds = currentTime - releaseTime;
            return ageOfAlbumInSeconds < timeRangeDays * 24 * 60;
          });
          if (newAlbums.length) {
            yield newAlbums;
          }
        }
        thunkAPI.dispatch(addProcessedArtistIds([artistId]));
      }
    }
  }
}

async function* generateTrackIds(
  sourcePlaylistIds,
  timeRangeDays,
  token,
  thunkAPI
) {
  let processedAlbumIds = [];
  for await (let newAlbums of generateNewAlbums(
    sourcePlaylistIds,
    timeRangeDays,
    token,
    thunkAPI
  )) {
    let newAlbumIds = newAlbums.map((album) => album.id);
    let albumIdsToProcess = newAlbumIds.filter(
      (albumId) => !processedAlbumIds.includes(albumId)
    );
    processedAlbumIds.push(...albumIdsToProcess);
    if (albumIdsToProcess.length) {
      yield await getTracksFromAlbums(albumIdsToProcess, token);
    }
  }
}

export async function runPlaylists(
  sourcePlaylistIds,
  targetPlaylistId,
  timeRangeDays,
  thunkAPI
) {
  const { accessToken } = await getAccessToken();

  for await (let tracks of generateTrackIds(
    sourcePlaylistIds,
    timeRangeDays,
    accessToken,
    thunkAPI
  )) {
    let trackIds = tracks.map((track) => track.id);
    thunkAPI.dispatch(addNewTrackIds(trackIds));
    let trackUris = trackIds.map((trackId) => `spotify:track:${trackId}`);
    addTracksToPlaylist(targetPlaylistId, trackUris, accessToken);
  }
}
