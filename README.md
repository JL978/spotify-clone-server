# Spotify Clone App
~OUR APP DESCRIPTION~

## Motivation
~OUR MOTIVATION~

## Tech/Framework Used
* Node.js
* Express.js
* axios

## Installation
This project requires [node](http://nodejs.org), [npm](https://npmjs.com), and [concurrently](https://www.npmjs.com/package/concurrently#installation) installed globally. 

Clone the repository to a directory of your choosing

```sh
$ git clone git@github.com:UwemWilson4/shoutify.git
```
Install necessary packages in `/client` and `/server` by running the following command in the respective directories.

```sh
$ npm install 
```

## Usage

To run the client and server concurrently

```sh
$ npm run dev
```

### **Other requirements**
[The Spotify Developer Dashboard](https://developer.spotify.com/dashboard/login)

Navigate to the spotify developer dashboard and in click "Edit Settings". Then add the following redirect URIs in the redirect URI section.

```sh
http://localhost:3000
http://localhost:4000/callback
```


Create a new .env file in the `/server` folder and add the following key value pairs to the file

```sh
CLIENT_ID = [client id optained from the Spotify Developer Dashboard]
CLIENT_SECRET = [client secret optained from the Spotify Developer Dashboard]
FRONT_URI = http://localhost:3000
RE_URI = http://localhost:4000/callback
REXP = /\.localhost:3000/
```

## Usage
~ANYTHING WE WANT TO SPECIFY ABOUT USAGE~

## The architecture
### Client Credential Flow (un-authorized requests)

![client credential flow](demo/unauthed.png)

The advantage of doing request this way instead of using the implicit grant flow as outlined in the Spotify API document is that you have a higher rate limit. It also doesn't prompt the user to login, which would be a bad experience for users who don't have a Spotify account but just want to browse their selections. 

An improvement to this process would be to store the access_token in memory after the first request and use that for subsequent requests instead of requesting for a new access token on every request.
