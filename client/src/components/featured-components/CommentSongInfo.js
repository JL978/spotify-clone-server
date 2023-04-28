import React, { useContext, useState, useEffect } from 'react';

import { TokenContext } from '../../utilities/context';
import requestWithToken from '../../utilities/requestWithToken';
import axios from "axios";

export default function CommentSongInfo({songID}) {
    const token = useContext(TokenContext);
    const [songData, setSongData] = useState({
        artist: "",
        album: "",
        track: ""
    })

    useEffect(() => {
        const source = axios.CancelToken.source();
        
        requestWithToken(`https://api.spotify.com/v1/tracks/${songID}`, token, source)
            .then((response) => {
                console.log(response.data);
                const artist_name = response.data.artists[0].name;
                const album_cover = response.data.album.images[2].url;
                const track_name = response.data.name;
                setSongData({...songData, artist: artist_name, album: album_cover, track: track_name});
            })
        // eslint-disable-next-line
    },[])

    return (
        <div class="spotify-track">
            <div class="player-cover" data-testid="comment-play-cover">
                <img src={songData.album} alt='album'></img> 
            </div>
            <div class="track-details" data-testid="comment-track-details">
                <h2 class="track-name">{songData.track}</h2>
                <h3 class="artist-name">{songData.artist}</h3>
            </div>
        </div>
    );
}
