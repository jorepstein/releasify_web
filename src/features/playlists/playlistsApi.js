var SpotifyWebApi = require("spotify-web-api-node");

var spotifyApi = new SpotifyWebApi({});

async function getUserPlaylistsBatch(userId, limit, offset) {
    return await spotifyApi
      .getUserPlaylists(userId, { limit, offset })
      .then(function ({ body }) {
        return body.items;
      });
  }

async function getNumUserPlaylists(userId) {
    return await spotifyApi
      .getUserPlaylists(userId, { limit: 1 })
      .then(function (data) {
        return data.body.total;
      });
  }

export async function* generateUserPlaylists(userId) {
    // debugger;
    const res = await fetch("/api/refresh");
    const { access_token } = await res.json();
    spotifyApi.setAccessToken(access_token);
    let limit = 50;
    let numAlbums = await getNumUserPlaylists(userId);
    // e.g. 25 albums = 1 batch
    // 75 albums = 2 batches
    console.log("ABOUT TO BATCH")
    // debugger
    let numBatches = Math.floor(numAlbums / limit) + 1;
    for (let batchNum = 0; batchNum <= numBatches; batchNum++) {
        console.log("A BATCH", batchNum)
        yield await getUserPlaylistsBatch(userId, limit, batchNum * limit);
      }
  }
  
