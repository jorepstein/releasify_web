import { getSession } from "next-auth/react";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const handler = async (req, res) => {
  const {
    token: { accessToken },
  } = await getSession({ req });
  return await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: accessToken,
    }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP Status: " + response.status);
      }
      return response.json();
    })
    .then((response) => {
      return res.status(200).json({ accessToken: response.access_token });
    })
    .catch((err) => {
      console.log(err);
      return res.status(err.status).json({ statusText: err.statusText });
    });
};

export default handler;
