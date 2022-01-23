import {
  getAccessToken,
  getNumUserPlaylists,
  getUserPlaylists,
} from "../spotifyApi";

async function getUserPlaylistsBatch(userId, limit, offset, accessToken) {
  return await getUserPlaylists(userId, accessToken, { limit, offset }).then(
    (items) =>
      items.map((playlist) => {
        return {
          id: playlist.id,
          name: playlist.name,
          images: playlist.images,
          description: playlist.description,
        };
      })
  );
}

export async function* generateUserPlaylists(userId) {
  const { accessToken } = await getAccessToken();

  let limit = 50;
  let numAlbums = await getNumUserPlaylists(userId, accessToken);
  // e.g. 25 albums = 1 batch
  // 75 albums = 2 batches
  let numBatches = Math.floor(numAlbums / limit) + 1;
  for (let batchNum = 0; batchNum <= numBatches; batchNum++) {
    yield await getUserPlaylistsBatch(userId, limit, batchNum * limit);
  }
}
