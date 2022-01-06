import { Data } from "dataclass";
import { useSession, getSession } from "next-auth/react";
import {
  getPlaylistTracks,
  getArtistAlbums,
  getNumArtistsAlbums,
  getTracksFromAlbums,
  addTracksToPlaylist,
} from "../job/jobApi";
var SpotifyWebApi = require("spotify-web-api-node");

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REFRESH_ENDPOINT = `/api/refresh`;
const DAY_IN_SECONDS = 24 * 60 * 60 * 14;
var spotifyApi = new SpotifyWebApi();

export async function makeNewPlaylist() {
  const res = await fetch(REFRESH_ENDPOINT);
  const { access_token } = await res.json();
  spotifyApi.setAccessToken(access_token);

  let { body: newPlaylist } = await spotifyApi.createPlaylist("Releasify", {
    description: "My description",
    public: false,
  });
  return newPlaylist;
}

async function getTracksOnPlaylistId(sourcePlaylistId, limit, offset) {}

async function* generateTracksFromPlaylistID(sourcePlaylistId) {
  yield await getPlaylistTracks(sourcePlaylistId, spotifyApi.getAccessToken());
}

async function* generateArtistIds(sourcePlaylistIds) {
  for (let sourcePlaylistId of sourcePlaylistIds) {
    for await (const tracks of generateTracksFromPlaylistID(sourcePlaylistId)) {
      let artists = [];
      tracks.map((track) => {
        artists.push(...track.artists);
      });
      yield artists;
    }
  }
}

async function* generateAlbumsForArtistId(artistId) {
  let limit = 50;
  let numAlbums = await getNumArtistsAlbums(
    artistId,
    spotifyApi.getAccessToken()
  );
  // e.g. 25 albums = 1 batch
  // 75 albums = 2 batches
  let numBatches = Math.floor(numAlbums / limit) + 1;
  for (let batchNum = 0; batchNum <= numBatches; batchNum++) {
    yield await getArtistAlbums(artistId, spotifyApi.getAccessToken(), {
      limit,
      offset: batchNum * limit,
    });
  }
}

async function* generateNewAlbums(sourcePlaylistIds) {
  let processedArtistIds = [];
  for await (let artists of generateArtistIds(sourcePlaylistIds)) {
    for (let { id: artistId } of artists) {
      if (!processedArtistIds.includes(artistId)) {
        processedArtistIds.push(artistId);
        let newAlbumIds = [];
        for await (let albums of generateAlbumsForArtistId(artistId)) {
          let newAlbums = albums.filter((album) => {
            let releaseTime = new Date(`${album.release_date}`).getTime();
            let currentTime = new Date().getTime();
            let ageOfAlbumInSeconds = currentTime - releaseTime;
            return ageOfAlbumInSeconds < DAY_IN_SECONDS;
          });
          if (newAlbums.length) {
            yield newAlbums;
          }
        }
      }
    }
  }
}

async function* generateTrackIds(sourcePlaylistIds) {
  let processedAlbumIds = [];
  for await (let newAlbums of generateNewAlbums(sourcePlaylistIds)) {
    let newAlbumIds = newAlbums.map((album) => album.id);
    let albumIdsToProcess = newAlbumIds.filter(
      (albumId) => !processedAlbumIds.includes(albumId)
    );
    processedAlbumIds.push(...albumIdsToProcess);
    if (albumIdsToProcess.length) {
      yield await getTracksFromAlbums(
        albumIdsToProcess,
        spotifyApi.getAccessToken()
      );
    }
  }
}

export async function runPlaylists(sourcePlaylistIds, newPlaylistId) {
  // const res = await fetch(REFRESH_ENDPOINT);
  const { accessToken } = await fetch(REFRESH_ENDPOINT).then((response) =>
    response.json()
  );
  spotifyApi.setAccessToken(accessToken);

  for await (let tracks of generateTrackIds(sourcePlaylistIds)) {
    let trackUris = tracks.map((track) => `spotify:track:${track.id}`);
    addTracksToPlaylist(newPlaylistId, trackUris, spotifyApi.getAccessToken());
  }
}
