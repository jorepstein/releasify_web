var SpotifyWebApi = require("spotify-web-api-node");

var spotifyApi = new SpotifyWebApi({
    // redirectUri: "http://www.example.com/callback",
  });

export async function makeNewPlaylist() {
    const res = await fetch("/api/refresh");
    const { access_token } = await res.json();
    spotifyApi.setAccessToken(access_token);

    let { body: newPlaylist } = await spotifyApi.createPlaylist("Releasify", {
      description: "My description",
      public: false,
    });
    return newPlaylist;
  }
  