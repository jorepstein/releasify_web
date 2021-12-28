import { Data } from "dataclass";
import { useSession, getSession } from "next-auth/react";

var SpotifyWebApi = require("spotify-web-api-node");

const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const BASIC = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

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
  yield await spotifyApi.getPlaylistTracks(sourcePlaylistId).then(
    function (data) {
      return data.body;
    },
    function (err) {
      console.error(err);
    }
  );
}

async function generateArtistIds(sourcePlaylistIds) {
  for (let sourcePlaylistId of sourcePlaylistIds) {
    for await (const tracks of generateTracksFromPlaylistID(sourcePlaylistId)) {
      console.log("Tracks", tracks);
    }
  }
}

export default async function run(sourcePlaylistIds) {
  const res = await fetch("/api/refresh");
  const { access_token } = await res.json();
  spotifyApi.setAccessToken(access_token);
  await generateArtistIds(sourcePlaylistIds);
}
