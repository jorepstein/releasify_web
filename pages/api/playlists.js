import {getSession} from 'next-auth/react';

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const PLAYLISTS_ENDPOINT = 'https://api.spotify.com/v1/me/playlists';

const handler = async (req, res) => {

    const f = await getSession({req});
    const {
        token: {accessToken},
      } = f;
    console.log("F!F!F!F!F", f)
    console.log("TOKEN!!!!!!!!", accessToken);
    const response = await getUsersPlaylists(accessToken);
    console.log(response);
    const {items} = await response.json();
    console.log("ITEMS!!!", items);
    return res.status(200).json({items});
};
  
export default handler;
  
  const getAccessToken = async (refresh_token) => {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basic}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
      }),
    });
  
    return response.json();
  };
  
  const getUsersPlaylists = async (refresh_token) => {
    const {access_token} = await getAccessToken(refresh_token);
    return fetch(PLAYLISTS_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
  };
