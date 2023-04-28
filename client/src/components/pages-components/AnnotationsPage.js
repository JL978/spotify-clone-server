import React, { useContext, useEffect, useState } from "react";
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
import { useHistory } from "react-router-dom";

export default function AnnotationsPage() {
  const token = useContext(TokenContext);
  const { song } = useContext(SongContext);
  const setMessage = useContext(MessageContext);
  const [lyrics, setLyrics] = useState("");
  const [annotatedText, setAnnotatedText] = useState("");
  const [annotationTip, setAnnotationTip] = useState(false);
  const [id, setId] = useState("");
  const [feed, setFeed] = useState([]);
  const history = useHistory()
  // const loggedIn = useContext(LoginContext);

  const cancelSource = axios.CancelToken.source();
  useEffect(() => {
    let songName = "";
    const track_search_base_url = process.env.REACT_APP_BACK_URI + "/api/track-search?";
    const lyrics_search_base_url = process.env.REACT_APP_BACK_URI + "/api/lyrics-search?";
    
    const musixMatchRequest = async (url) => {
      try {
        const result = await axios.get(url);
        return result;
      } catch (err) {
        setMessage(err.message);
        return err;
      }
    };
  
    const getSongInfo = async () => {
      try {
        const response = await requestWithToken("https://api.spotify.com/v1/me/player/currently-playing", token, cancelSource);
        const data = response.data;
        songName = data.item.name;
        setId(data.item.id);
        const artists = data.item.artists.map(({ name }) => name);
        const search_params = "artist=".concat(artists[0], "&track=", songName);
        const search_call = track_search_base_url.concat(search_params);
        const responseTrack = await musixMatchRequest(search_call);
        let track_ids = [];
        if (responseTrack.status === 200) {
          track_ids = responseTrack.data.message.body.track_list.map((track) => track.track.track_id);
        } else {
          history.push("/")
          setLyrics("");
          setMessage(`Sorry, we couldn't find lyrics for this song:${songName}. No track id.(${responseTrack.status})`);
          return;
        }
        let foundLyrics = false;
        for (const track_id of track_ids) {
          const lyrics_params = "track_id=".concat(track_id);
          const lyrics_call = lyrics_search_base_url.concat(lyrics_params);
          const responseLyrics = await musixMatchRequest(lyrics_call);
          if (responseLyrics.status === 200 && responseLyrics.data.message.header.status_code !== 404) {
            setLyrics("\n".concat(responseLyrics.data.message.body.lyrics.lyrics_body));
            foundLyrics = true;
            break;
          }
        }
        if (!foundLyrics) {
          history.push("/")
          setLyrics("No Lyrics");
          setMessage("Sorry, we couldn't find lyrics for this song");
        }
      } catch (error) {
        setMessage(error.message);
      }
    };
  
    console.log("useEffect rendering");
    getSongInfo();
    // eslint-disable-next-line
  }, [song, token]);

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
      axios.get(process.env.REACT_APP_BACK_URI + `/annotations/song/${id}`).then((response) => {
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
