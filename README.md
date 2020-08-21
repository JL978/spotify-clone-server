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
This project requires [node](http://nodejs.org) and [npm](https://npmjs.com) installed globally. 

Clone the repository to a directory of your choosing

```sh
$ git clone https://github.com/JL978/spotify-clone-server.git
```
Navigate into spotify-clone-server and install the necessary packages

```sh
$ npm install 
```
To run the server

```sh
$ npm start
```
To run the dev server

```sh
$ npm run dev
```

### **Other requirement**
[The Spotify Developer Dashboard](https://developer.spotify.com/dashboard/login)

Create a new .env file in the root folder and add the following key value pairs to the file

```sh
CLIENT_ID = [client id optained from the Spotify Developer Dashboard]
CLIENT_SECRET = [client secret optained from the Spotify Developer Dashboard]
FRONT_URI = http://localhost:3000
RE_URI = http://localhost:4000/callback
REXP = /\.localhost:3000/
```

## Usage

This server is to be consumed by a front-end application - namely the Spotify clone at this [repo](https://github.com/JL978/spotify-clone-client)

The following endpoints are available

|Endpoint|Method|Body|Response|
|:---|:---|:---|:---|
|/|POST|{endpoint}|200 with the returned data from the endpoint|
|/login|GET|none|redirect to the Spotify authentication page|
|/refresh_token|GET|none|if a valid refresh token is available in the cookie, an access_token is sent back as data|
|/logout|GET|none|clear the refresh token and effectively log the user out off the app|

