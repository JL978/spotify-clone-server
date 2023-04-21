import React, { useContext, useEffect, useState } from 'react';
import CommentSongInfo from './CommentSongInfo';
import millisToTime from '../../utilities/millisToTime';
import axios from 'axios';
import { TokenContext } from '../../utilities/context';
import requestWithToken from '../../utilities/requestWithToken';

export default function Comment(props) {
    const {user, timestamp, songID, commentBody, showSong} = props;
    const [pfp, setPfp] = useState("");
    const token = useContext(TokenContext);

    useEffect(() => {
      console.log(`https://api.spotify.com/v1/users/${user}`)
      // axios.get(`https://api.spotify.com/v1/users/${user}`)
      //   .then((response) => console.log(response))
      //   .catch((error) => console.log(error))
      const source = axios.CancelToken.source();
      requestWithToken(`https://api.spotify.com/v1/users/${user}`, token, source)
        .then((response) => {
          setPfp(response.data.images[0].url);
          // console.log(response.data.images[0].url);
        })
        .then(() => source.cancel())
    }, [user, token])
    

    return (
          <div class="spotify-tweet-box">
            <div class="avatar">
              <img src={pfp} class="timestamp" alt='pfp'></img>
              {/* <span class="timestamp">@{millisToTime(timestamp)}</span> */}
            </div>
            <div class="content">
              <div class="header">
                <span class="username">{user}</span>
                <span class="time">@{millisToTime(timestamp)}</span>
              </div>
              <div class="message">
                {/* <span class="timestamp">@{millisToTime(timestamp)}</span> */}
                {commentBody}
              </div>
              {showSong ? 
                <CommentSongInfo songID = {songID}/>
                :
                <></>
              }
              
            </div>
          </div>

    )
}
