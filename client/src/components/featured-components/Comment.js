import React from 'react';

export default function Comment(props) {
    const {user, timeOfPost, timestamp, track, artist, comment, replies, likes, reshares} = props;

    return (
          <div class="spotify-tweet-box">
            <div class="avatar">
              <img src="https://via.placeholder.com/50x50" alt="User avatar"/>
            </div>
            <div class="content">
              <div class="header">
                <span class="username">{user}</span>
                <span class="time">{timeOfPost}</span>
              </div>
              <div class="message">
                <span class="timestamp">@{timestamp}</span>
                {comment}
              </div>
              <div class="spotify-track">
                <img src="https://via.placeholder.com/50x50" alt="Album cover for the track"/>
                <div class="track-details">
                  <h2 class="track-name">{track}</h2>
                  <h3 class="artist-name">{artist}</h3>
                </div>
              </div>
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
