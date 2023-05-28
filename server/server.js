if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;
const db_uri = process.env.MY_MONGO_URI;
const musixmatch = process.env.MUSIXMATCH;

const { client_auth, authed_header } = require("./utils/client-auth");
const random_string = require("./utils/random");

const axios = require("axios");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const commentRoute = require("./routes/comments");
const noteRoute = require("./routes/annotations");

//connect db
mongoose
  .connect(db_uri)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err.reason);
  });

const PORT = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);

var corsOptions = {
  origin: [process.env.FRONT_URI, process.env.REXP],
  credentials: true,
};

// const bodyParser = require("body-parser")

// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/comments", commentRoute);
app.use("/annotations", noteRoute);

const redirect_uri = process.env.RE_URI;
const front_end_uri = process.env.FRONT_URI;

const stateKey = "spotify_auth_state";
const refreshKey = "refresh_key";
const cookieOption = {
  // Comment out the following 2 lines while in development for the authoriazation flow to work properly
  sameSite: "None",
  secure: true,
};

const scope =
  "user-read-private user-read-playback-state streaming user-modify-playback-state playlist-modify-public user-library-modify user-top-read user-read-currently-playing playlist-read-private user-follow-read user-read-recently-played playlist-modify-private user-follow-modify user-library-read user-read-email";

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

//endpoint to send a full spotify endpoint to request data
app.post("/", (req, res) => {
  const endpoint = req.body.endpoint;
  client_auth(client_id, client_secret)
    .then((token) => {
      axios
        .get(endpoint, authed_header(token))
        .then((response) => {
          res.status(200).send(response.data);
        })
        .catch((error) => {
          console.log(error);
          res.send(error);
        });
    })
    .catch((error) => res.send(error));
});

//aux endpoint to make and store a cookie value as the state and redirect to the spotify authorization page
app.get("/login", function (req, res) {
  //respond with randomly generated cookie value for the state key - used to prevent XSRF
  const state = random_string(16);
  res.cookie(stateKey, state);

  // Build the URL to the Spotify authorization page with the required parameters
  const authUrl = new URL("https://accounts.spotify.com/authorize");
  authUrl.searchParams.append("response_type", "code");
  authUrl.searchParams.append("client_id", client_id);
  authUrl.searchParams.append("scope", scope);
  authUrl.searchParams.append("redirect_uri", redirect_uri);
  authUrl.searchParams.append("state", state);
  authUrl.searchParams.append("show_dialog", true);

  // Redirect to the Spotify authorization page
  res.redirect(authUrl.toString());
});

app.get("/callback", function (req, res) {
  const code = req.query.code || null;
  const state = req.query.state || null;
  const storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      front_end_uri +
        new URLSearchParams({
          error: "state_mismatch",
        }).toString()
    );
  } else {
    res.clearCookie(stateKey);

    const params = new URLSearchParams({
      code: code,
      redirect_uri: redirect_uri,
      grant_type: "authorization_code",
    }).toString();

    const authOptions = {
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      data: params,
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(client_id + ":" + client_secret).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    };

    axios(authOptions)
      .then((response) => {
        const access_token = response.data.access_token;
        const refresh_token = response.data.refresh_token;

        res.cookie(refreshKey, refresh_token, cookieOption);

        res.redirect(
          front_end_uri +
            "/#" +
            new URLSearchParams({ access_token, refresh_token }).toString()
        );
      })
      .catch((error) => {
        res.redirect(
          front_end_uri +
            "/#" +
            new URLSearchParams({
              error: "invalid_token",
            }).toString()
        );
        console.log(error);
      });
  }
});

app.get("/refresh_token", async (req, res) => {
  // Get the refresh token from the cookie
  const refresh_token = req.cookies.refreshKey;

  try {
    // Make a POST request to Spotify API with refresh token to get new access token
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
      }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${client_id}:${client_secret}`
          ).toString("base64")}`,
        },
      }
    );

    // Extract access token and new refresh token from response
    const { access_token, refresh_token: new_refresh_token } = response.data;

    // Set new refresh token if available
    if (new_refresh_token) {
      res.cookie(refreshKey, new_refresh_token, cookieOption);
    }

    // Send response with access token
    res.send({ access_token });
  } catch (error) {
    // Send error response if there is an error with the request
    res.status(400).send(error.response.data.error);
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie(refreshKey, cookieOption);
  res.status(200).send("logged out");
});

// Handles proxy requests for tracks.
app.get("/api/track-search", async (req, res) => {
  const { track, artist } = req.query;

  try {
    const response = await axios.get(
      `https://api.musixmatch.com/ws/1.1/track.search?q_artist=${artist}&q_track=${track}&apikey=${musixmatch}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Handles proxy requests for lyrics.
app.get("/api/lyrics-search", async (req, res) => {
  const { track_id } = req.query;

  try {
    const response = await axios.get(
      `https://api.musixmatch.com/ws/1.1/track.lyrics.get?track_id=${track_id}&apikey=${musixmatch}`
    );
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default app;

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));


