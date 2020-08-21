# Spotify Clone App Authenication Server
This repository is the code to run an authorization/authentication server to connect to the Spotify API. The server is to be used in conjunction with the front-end code of the cloned app found [here](https://github.com/JL978/spotify-clone-client)

## Motivation
When working with the [Spotify API](https://developer.spotify.com/documentation/web-api/), you must follow this authorization [guide](https://developer.spotify.com/documentation/general/guides/authorization-guide/) provided on the API documentation. The basis of this authorization flow involve using a client id and client secret provided by signing up on the Spotify Developer dash board. These keys must be sent with every single request made to the Spotify server. 

When working with a client secret, one must keep it... well secret. Therefore, the solution to this is to keep the requests to the Spotify API on the server-side so that the client-side app can't expose the secret key to potential attackers - making the app more secure. Authenitcation of users are also done through this server for the same purpose and a refresh_token is sent back as a cookie while an access token is sent back to be stored in memory. This authorization flow was built to avoid the most common types of cyber attack - Cross Site Scripting and Cross Site Request Forgery.

## Tech/Framework Used
* Node.js
* Express.js
* axios

## Installation

