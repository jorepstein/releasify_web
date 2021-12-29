import { lighten } from "@mui/material";
import { Data } from "dataclass";
import { useSession, getSession } from "next-auth/react";

var SpotifyWebApi = require("spotify-web-api-node");

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const BASIC = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const DAY_IN_SECONDS = 24 * 60 * 60 * 14;
var spotifyApi = new SpotifyWebApi({
  // redirectUri: "http://www.example.com/callback",
});

class Song extends Data {
  name = "";
  id = "";
}

class Artist extends Data {
  name = "";
  id = "";
}

class Album extends Data {
  name = "Anon";
  age = 25;
}

class Playlist extends Data {}

async function getTracksOnPlaylistId(sourcePlaylistId, limit, offset) {}

async function* generateTracksFromPlaylistID(sourcePlaylistId) {
  // console.log("Generating", sourcePlaylistId);
  yield await spotifyApi
    .getPlaylistTracks(sourcePlaylistId)
    .then(function (data) {
      return data.body.items.map((item) => item.track);
    });
}

async function* generateArtistIds(sourcePlaylistIds) {
  // console.log("WWWW", sourcePlaylistIds)
  for (let sourcePlaylistId of sourcePlaylistIds) {
    // console.log("Processing", sourcePlaylistId)
    for await (const tracks of generateTracksFromPlaylistID(sourcePlaylistId)) {
      let artists = [];
      // console.log("TRACKS", tracks)
      tracks.map((track) => {
        artists.push(...track.artists);
      });
      yield artists;
      // console.log("Artists", artists);
    }
  }
}

async function getAlbumsForArtistIdBatch(artistId, limit, offset) {
  // console.log(artistId, limit, offset)
  return await spotifyApi
    .getArtistAlbums(artistId, { limit, offset })
    .then(function ({ body }) {
      return body.items;
    });
}

async function getNumAlbumsFromArtist(artistId) {
  return await spotifyApi
    .getArtistAlbums(artistId, { limit: 1 })
    .then(function (data) {
      return data.body.total;
    });
}

async function* generateAlbumsForArtistId(artistId) {
  let limit = 50;
  let numAlbums = await getNumAlbumsFromArtist(artistId);
  // console.log(numAlbums);
  // e.g. 25 albums = 1 batch
  // 75 albums = 2 batches
  let numBatches = Math.floor(numAlbums / limit) + 1;
  // console.log("BUM BATCHES", numBatches)
  for (let batchNum = 0; batchNum <= numBatches; batchNum++) {
    yield await getAlbumsForArtistIdBatch(artistId, limit, batchNum * limit);
  }
}

async function* generateNewAlbums(sourcePlaylistIds) {
  let processedArtistIds = [];
  for await (let artists of generateArtistIds(sourcePlaylistIds)) {
    //  console.log("ART", artists)
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

async function getTrackIds(albumIds) {
  return await spotifyApi.getAlbums(albumIds).then(function ({ body }) {
    return body.albums.flatMap((album) => album.tracks.items);
  });
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
      yield await getTrackIds(albumIdsToProcess);
    }
  }
}

export default async function run(sourcePlaylistIds) {
  const res = await fetch("/api/refresh");
  const { access_token } = await res.json();
  spotifyApi.setAccessToken(access_token);
  let { body: newPlaylist } = await spotifyApi.createPlaylist("Releasify", {
    description: "My description",
    public: false,
  });
  console.log(newPlaylist);
  let playlistId = newPlaylist.id;

  for await (let trackIds of generateTrackIds(sourcePlaylistIds)) {
    trackIds = trackIds.map((track) => `spotify:track:${track.id}`);
    console.log("TRIKS", trackIds);
    spotifyApi.addTracksToPlaylist(playlistId, trackIds);
  }
}
