export async function getAccessToken() {
  return await fetch("/api/refresh").then((response) => response.json());
}

export async function makeNewPlaylist(userId, accessToken, options = {}) {
  return fetchEndpointPost(
    `https://api.spotify.com/v1/users/${userId}/playlists`,
    accessToken,
    options
  ).then((body) => body.items.map((item) => item.track));
}

export async function getPlaylistTracks(playlistId, accessToken, options = {}) {
  return fetchEndpoint(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    accessToken,
    options
  ).then((body) => body.items.map((item) => item.track));
}

export async function getNumPlaylistTracks(
  playlistId,
  accessToken,
  options = {}
) {
  return fetchEndpoint(
    `https://api.spotify.com/v1/playlists/${playlistId}`,
    accessToken,
    { fields: "tracks.total", ...options }
  ).then((body) => body.tracks.total);
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
    (response) =>
      success(response, () => fetchEndpoint(endpoint, accessToken, options)),
    rejected
  );
}

export async function fetchEndpointPost(endpoint, accessToken, options) {
  return fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "Content-Type: application/json",
    },
    body: new URLSearchParams({
      ...options,
    }),
  }).then(
    (response) =>
      success(response, () =>
        fetchEndpointPost(endpoint, accessToken, options)
      ),
    rejected
  );
}

async function success(response, tryAgain) {
  if (!response.ok) {
    if (response.status == 429) {
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      return tryAgain();
    }
    throw new Error("HTTP Status: " + response.status);
  }
  return response.json();
}

async function rejected(reason) {
  throw new Error("Rejected:" + reason);
}
