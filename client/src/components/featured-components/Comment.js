import React from 'react';
import CommentSongInfo from './CommentSongInfo';
import millisToTime from '../../utilities/millisToTime';

export default function Comment(props) {
    const {user, time, timestamp, songID, commentBody, replies, likes, reshares} = props;

    return (
          <div class="spotify-tweet-box">
            <div class="avatar">
              {/* <img src="https://via.placeholder.com/50x50" alt="User avatar"/> */}
            </div>
            <div class="content">
              <div class="header">
                <span class="username">{user}</span>
                <span class="time">{time}</span>
              </div>
              <div class="message">
                <span class="timestamp">@{millisToTime(timestamp)}</span>
                {commentBody}
              </div>
              <CommentSongInfo songID = {songID}/>
              <div class="actions">
                <button class="reply-button">
                    <i class="fa fa-reply" aria-hidden="true"></i>
                    {replies}
                </button>
                <button class="like-button">
                    <i class="fa fa-heart" aria-hidden="true"></i>
                    {likes}
                </button>
                <button class="retweet-button">
                    <i class="fa fa-retweet" aria-hidden="true"></i>
                    {reshares}
                </button>
                <button class="share-button">
                    <i class="fa-solid fa-arrow-up-from-bracket"></i>
                </button>
              </div>
            </div>
          </div>

    )
}
