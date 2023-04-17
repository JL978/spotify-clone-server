import React from 'react';
import millisToTime from '../../utilities/millisToTime';

export default function Annotation(props) {
    const {user, time, timestamp, songID, annotatedText, noteBody} = props;

    return (
          <div class="spotify-tweet-box">
            <div class="avatar"></div>
            <div class="content">
                <div class="header">
                    <span class="username">{user}</span>
                    <span class="time">{time}</span>
                </div>
                <div class="message">
                    <span class="timestamp">@{millisToTime(timestamp)}</span>
                    <h3>{noteBody}</h3>
                    <i>{annotatedText}</i>
                    
                </div>
            </div>
          </div>

    )
}
