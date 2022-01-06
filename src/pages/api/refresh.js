import { getSession } from "next-auth/react";

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const handler = async (req, res) => {
  const {
    token: { accessToken },
  } = await getSession({ req });
  console.log("TOKEN", accessToken);
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
        console.log("!!");
        console.log(response);
        console.log(response.status);
        console.log(response.error_description);
        throw new Error("Hello");
        // res.status(200);
      }
      return response.json();
    })
    .then((response) => {
      console.log("YOOO", response.access_token);
      return res.status(200).json({ accessToken: response.access_token });
    })
    .catch((err) => {
      console.log(err);
      debugger;
      return res.status(err.status).json({ statusText: err.statusText });
    });
  // console.log(refreshedToken);
  // return res.status(200).json({ accessToken: refreshedToken });
};

export default handler;
