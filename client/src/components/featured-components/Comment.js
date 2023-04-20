import React from 'react';
import CommentSongInfo from './CommentSongInfo';
import millisToTime from '../../utilities/millisToTime';

export default function Comment(props) {
    const {user, time, timestamp, songID, commentBody, showSong} = props;

    return (
          <div class="spotify-tweet-box">
            <div class="avatar">
              <span class="timestamp">@{millisToTime(timestamp)}</span>
            </div>
            <div class="content">
              <div class="header">
                <span class="username">{user}</span>
                <span class="time">{time}</span>
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
