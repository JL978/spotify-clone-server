if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}
const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

const { client_auth, authed_header } = require("./utils/client-auth");
const random_string = require("./utils/random");

const axios = require("axios");
const cookieParser = require("cookie-parser");
const cors = require("cors");
var request = require("request");
const express = require("express");
const http = require("http");

const PORT = process.env.PORT || 4000;
const app = express();
const server = http.createServer(app);

var corsOptions = {
	origin: [process.env.FRONT_URI, process.env.REXP],
	credentials: true,
};

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", req.headers.origin);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const redirect_uri = process.env.RE_URI;
const front_end_uri = process.env.FRONT_URI;

const stateKey = "spotify_auth_state";
const refreshKey = "refresh_key";
const cookieOption = {
	// Comment out the following 2 lines while in development for the authoriazation flow to work properly
	sameSite:'None',
	secure: true
};

const scope =
	"user-read-private user-read-playback-state streaming user-modify-playback-state playlist-modify-public user-library-modify user-top-read user-read-currently-playing playlist-read-private user-follow-read user-read-recently-played playlist-modify-private user-follow-modify user-library-read user-read-email";

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


app.get("/refresh_token", (req, res) => {
	const refresh_key = req.cookies.refresh_key;

	var authOptions = {
		url: "https://accounts.spotify.com/api/token",
		headers: {
			Authorization:
				"Basic " +
				Buffer.from(client_id + ":" + client_secret).toString("base64"),
		},
		form: {
			grant_type: "refresh_token",
			refresh_token: refresh_key,
		},
		json: true,
	};

	request.post(authOptions, function (error, response, body) {
		if (!error && response.statusCode === 200) {
			var { access_token, refresh_token } = body;
			//in case a new refresh token is sent back
			if (refresh_token) {
				res.cookie(refreshKey, refresh_token, cookieOption);
			}
			res.send({ access_token });
		} else {
			res.status(400).send(body.error);
		}
	});
});

app.get("/logout", (req, res) => {
	res.clearCookie(refreshKey, cookieOption);
	res.status(200).send("logged out");
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));