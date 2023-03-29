import React from 'react';
import CommentSongInfo from './CommentSongInfo';

export default function Comment(props) {
    const {user, time, timestamp, track, artist, comment, replies, likes, reshares} = props;

    return (
          <div class="spotify-tweet-box">
            <div class="avatar">
              <img src="https://via.placeholder.com/50x50" alt="User avatar"/>
            </div>
            <div class="content">
              <div class="header">
                <span class="username">{user}</span>
                <span class="time">{time}</span>
              </div>
              <div class="message">
                <span class="timestamp">@{timestamp}</span>
                {comment}
              </div>
              {/* <div class="spotify-track">
                <div class="player-cover">
                    <div>
                        <svg width="80" height="81" viewBox="0 0 80 81" xmlns="http://www.w3.org/2000/svg"><path d="M25.6 11.565v45.38c-2.643-3.27-6.68-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4 14.4-6.46 14.4-14.4v-51.82l48-10.205V47.2c-2.642-3.27-6.678-5.37-11.2-5.37-7.94 0-14.4 6.46-14.4 14.4s6.46 14.4 14.4 14.4S80 64.17 80 56.23V0L25.6 11.565zm-11.2 65.61c-6.176 0-11.2-5.025-11.2-11.2 0-6.177 5.024-11.2 11.2-11.2 6.176 0 11.2 5.023 11.2 11.2 0 6.174-5.026 11.2-11.2 11.2zm51.2-9.745c-6.176 0-11.2-5.024-11.2-11.2 0-6.174 5.024-11.2 11.2-11.2 6.176 0 11.2 5.026 11.2 11.2 0 6.178-5.026 11.2-11.2 11.2z" fill="currentColor" fill-rule="evenodd"></path></svg>
                    </div>
                </div>
                <div class="track-details">
                  <h2 class="track-name">{track}</h2>
                  <h3 class="artist-name">{artist}</h3>
                </div>
              </div> */}
              <CommentSongInfo track={track} artist={artist}/>
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
