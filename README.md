# Spotify Clone App
Shoutify is an add-on for Spotify (built in React) that adds a social element to the platform’s web player. Namely, it will add three separate but connected components: song comments, song annotations, and a social tab. Song comments and annotations are intended to augment the user’s existing application experience by adding a social aspect to the core functionality of Spotify (streaming music) and the social tab is intended to be a new experience which will provide social engagement in the form of an information feed, as if common in contemporary social media platforms. 

## Motivation
Modern streaming platforms, such as Apple Music and Spotify, have grown to dominate the music space in recent years and have fundamentally changed the way we listen to our favorite songs. Moreover, streaming platforms have dramatically changed the way music is shared; listeners are no longer beholden to magazine reviews and radio plays in the search for music that might align with their tastes. It is more common now for one to discover new music simply by browsing their already curated social media feeds, or by engaging in discussion on various forums and discussion boards. Our age is consequently experiencing the impacts of viral music: songs which are shared and gain popularity on platforms such as Instagram, Snapchat, and TikTok will have this popularity later reflected in their streaming numbers and their likelihood of being played on the radio. To this end, the relationship between social media and music has evolved such that the social aspect of music is beginning to precede the institutional notion of popularity (Billboard charts, radio plays, etc.)

Despite the radical changes, most modern streaming platforms have failed to capitalize on the social aspect of music. While it is true that features such as Spotify’s Wrapped and Apple Music’s Replay have managed to create new social phenomena out of the experience of streaming music, these innovations have achieved little success in maintaining engagement and keeping users on the platform for longer periods of time. Both Wrapped and Replay, as well as Spotify’s Friend Activity feature rely on users sharing and discussing music on external platforms before returning to Spotify. This creates an unnecessary friction that can limit users’ likelihood to explore music that they encounter through social media or are sent directly through direct message. We propose Shoutify as an opportunity to increase users’ average time spent interacting with streaming platforms by allowing them to create content for each other which is directly related to the music enjoyed by members of their social circles.

Finally, existing social innovations implemented in modern streaming platforms have largely focused on individualized music preference. Recommendation algorithms, omnipresent on these platforms, push users towards certain songs, limiting their discovery of new music. This coupled with the lack of the ability to share music with friends in-app have largely made these streaming platforms individualistic. Allowing people to share their music preferences with their friends in-app would help the growth of independent artists, push lesser-known music into the mainstream, and foster communities built around listening to music.

## Tech/Framework Used
* Node.js
* Express.js
* axios
* MongoDB

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

## Running tests


## The architecture
### Client Credential Flow (un-authorized requests)

![client credential flow](demo/unauthed.png)

The advantage of doing request this way instead of using the implicit grant flow as outlined in the Spotify API document is that you have a higher rate limit. It also doesn't prompt the user to login, which would be a bad experience for users who don't have a Spotify account but just want to browse their selections. 

An improvement to this process would be to store the access_token in memory after the first request and use that for subsequent requests instead of requesting for a new access token on every request.
