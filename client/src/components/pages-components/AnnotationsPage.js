import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  MessageContext,
  SongContext,
  TokenContext,
} from "../../utilities/context";
import requestWithToken from "../../utilities/requestWithToken";
import LyricsContainer from "../featured-components/LyricsContainer";
import AddAnnotation from "../featured-components/AddAnnotation";
import Annotation from "../featured-components/Annotation";
import PageTitle from "../featured-components/PageTitle";

export default function AnnotationsPage() {
  const token = useContext(TokenContext);
  const { song } = useContext(SongContext);
  const setMessage = useContext(MessageContext);
  const [lyrics, setLyrics] = useState("");
  const [annotatedText, setAnnotatedText] = useState("");
  const [annotationTip, setAnnotationTip] = useState(false);
  const [id, setId] = useState("");
  const [feed, setFeed] = useState([]);
  // const loggedIn = useContext(LoginContext);

  const cancelSource = axios.CancelToken.source();
  useEffect(() => {
    console.log("useEffect rendering");
    // Get the info on the curretly-playing song
    let songName = "";
    let artists = [];

    const apikey = "d6c8b83bfc21e9bb13c124be7dc6062b"; // apikey for musixmatch requests
    const track_search_base_url = "http://localhost:3001/api/track-search?";
    const lyrics_search_base_url = "http://localhost:3002/api/lyrics-search?";
    // Function to make axios requests to musixMatch
    const musixMatchRequest = async (url) => {
      let result;
      try {
        console.log("Making API request to localhost");
        result = await axios.get(url);
        console.log(result);
      } catch (err) {
        console.log(err);
        setMessage(err.message);
        // THROW MUSIXMATCH ERROR
        return err;
      }

      return result;
    };

    requestWithToken("https://api.spotify.com/v1/me/player/currently-playing", token, cancelSource)
      .then((response) => {
        console.log("Song info requested");
        const data = response.data;
        songName = data.item.name;
        // console.log(data.item.id)
        setId(data.item.id);
        console.log(data.item.id);
        artists = data.item.artists.map(({ name }) => name);
        // console.log(artists)
        const info = {
          songName: songName,
          artists: artists,
        };
        console.log(info);
        return info;
      })
      .catch((error) => {
        console.log("Error getting song info");
        setMessage(error.message);
      })
      .then((info) => {
        // console.log(info.songName)
        // console.log(info.artists)
        // Append the search params. We take the first artist in the list of artists, assuming that the first is the primary artist.
        const search_params = "artist=".concat(
          info.artists[0],
          "&track=",
          info.songName,
          "&apikey=",
          apikey
        );
        // console.log(search_params)

        // Use axios to make a musixmatch api call to search for the musixmatch track_id.
        const search_call = track_search_base_url.concat(search_params);
        console.log(search_call);
        musixMatchRequest(search_call)
          .then((response) => {
            let track_ids = [];
            console.log(response);
            if (response.status === 200) {
              // set track_id to track_id returned from the response
              console.log(response.data.message.body.track_list);
              track_ids = response.data.message.body.track_list.map(
                (track) => track.track.track_id
              );
              console.log(track_ids);
              console.log(track_ids);
            } else {
              setLyrics(""); // Set lyrics to blank
              // set error message to fail gracefully
              setMessage(
                `Sorry, we couldn't find lyrics for this song:${songName}. No track id.(${response.status})`
              );
            }

            return track_ids;
          })
          .then((track_ids) => {
            // Only search for lyrics if we were able to obtain the musixmatch track_id
            console.log(track_ids);
            let num_track_ids = track_ids.length;
            console.log(num_track_ids);
            if (num_track_ids > 0) {
              console.log("Searching for track lyrics");
              // Use axios to make a musixmatch api call to search for the musixmatch lyrics for the given
              // track_id.
              for (const track_id of track_ids) {
                console.log(`checking track id ${track_id}`);
                const lyrics_params = "track_id=".concat(
                  track_id,
                  "&apikey=",
                  apikey
                );
                const lyrics_call =
                  lyrics_search_base_url.concat(lyrics_params);
                musixMatchRequest(lyrics_call)
                  .then((response) => {
                    if (
                      response.status === 200 &&
                      response.data.message.header.status_code !== 404
                    ) {
                      console.log("got lyrics");
                      console.log(response.data);
                      setLyrics(
                        "\n".concat(
                          response.data.message.body.lyrics.lyrics_body
                        )
                      );
                      console.log(lyrics);
                    } else {
                      setLyrics("No Lyrics");
                      // set error message to fail gracefully
                      setMessage(
                        "Sorry, we couldn't find lyrics for this song"
                      );
                    }
                  })
                  .catch((err) => {
                    setLyrics("No Lyrics");
                    // set error message to fail gracefully
                    setMessage(
                      `Sorry, we couldn't find lyrics for this song: ${err}`
                    );
                  });
                if (lyrics !== "No Lyrics") {
                  break;
                }
              }
            } else {
              console.log(
                `Not searching for track lyrics. ${track_ids.length}`
              );
            }
          });
      })
      .catch((err) => {
        // Just show error message for now, but eventaually add an error handler
        //**TODO: Add error handler to handle errors from different steps in the promise chain. */
        setMessage(`general error: ${err}`);
      });
  }, [song, token]);
  // console.log(songName)
  // console.log(lyrics)

  const openAnnotationTip = () => {
    if (annotationTip === false) {
      setAnnotationTip(true);
    }
  };

  const setAnnotatedTextCallback = (text) => {
    setAnnotatedText(text);
  };

  useEffect(() => {
    console.log(`/annotations/${id}`);

    if (id.length > 0) {
      axios.get(`/annotations/song/${id}`).then((response) => {
        const data = response.data;
        console.log(data);
        const jsonData = data.f_annotation.map((item) => {
          const stringifiedObjectId = item._id.toString();
          return {
            authorID: item.authorID,
            songID: item.songID,
            noteBody: item.noteBody,
            annotatedText: item.annotatedText,
            timestamp: item.timestamp,
            _id: stringifiedObjectId,
          };
        });
        setFeed(jsonData.reverse());
        console.log(jsonData);
      });
    }
  }, [id]);

  return (
    <div className="annotation-page-content">
      <script
        type="text/javascript"
        src="http://tracking.musixmatch.com/t1.0/AMa6hJCIEzn1v8RuOP"
      ></script>
      <div className="pageContent lyrics-container">
        <LyricsContainer
          lyrics={lyrics}
          selectionCallback={setAnnotatedTextCallback}
          openTip={openAnnotationTip}
        />
        <span className="annotation-wrapper">
          {annotationTip && (
            <AddAnnotation
              closeTip={() => setAnnotationTip(false)}
              token={token}
              annotatedText={annotatedText}
            />
          )}
        </span>
      </div>
      <div className="lyrics-container">
        <div className="socialPage">
          <PageTitle name="Comments" />
          <div className="socialGrid">
            {feed.map((comm) => (
              <Annotation
                key={comm._id}
                user={comm.authorID}
                noteBody={comm.noteBody}
                timestamp={comm.timestamp}
                songID={comm.songID}
                annotatedText={comm.annotatedText}
              ></Annotation>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
