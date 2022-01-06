export async function getPlaylistTracks(playlistId, accessToken, options = {}) {
  return fetchEndpoint(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    accessToken,
    options
  ).then((body) => body.items.map((item) => item.track));
}

export async function getArtistAlbums(artistId, accessToken, options = {}) {
  return fetchEndpoint(
    `https://api.spotify.com/v1/artists/${artistId}/albums`,
    accessToken,
    options
  ).then((body) => body.items);
}

export async function getNumArtistsAlbums(artistId, accessToken, options = {}) {
  return fetchEndpoint(
    `https://api.spotify.com/v1/artists/${artistId}/albums`,
    accessToken,
    { limit: 1, ...options }
  ).then((body) => body.total);
}

export async function getTracksFromAlbums(albumIds, accessToken, options = {}) {
  return fetchEndpoint("https://api.spotify.com/v1/albums", accessToken, {
    ids: albumIds,
    ...options,
  }).then((body) => {
    return body.albums.flatMap((album) => album.tracks.items);
  });
}

export async function addTracksToPlaylist(
  playlistId,
  trackUris,
  accessToken,
  options = {}
) {
  return fetchEndpoint(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    accessToken,
    {
      tracks: trackUris,
      ...options,
    }
  );
}

async function fetchEndpoint(endpoint, accessToken, options) {
  let url = endpoint;
  if (Object.keys(options).length != 0) {
    url += "?" + new URLSearchParams(options);
  }
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }).then(
    async function success(response) {
      if (!response.ok) {
        if (response.status == 429) {
          await new Promise((resolve) => {
            setTimeout(resolve, 1000);
          });
          return fetchEndpoint(endpoint, accessToken, options);
        }
        throw new Error("HTTP Status: " + response.status);
      }
      return response.json();
    },
    (reason) => {
      throw new Error("Rejected:" + reason);
    }
  );
}
