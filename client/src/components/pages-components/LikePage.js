import React from 'react';
import {useEffect, useState, useContext} from 'react'
import axios from 'axios'

import PageBanner from '../featured-components/PageBanner'
import PlayListFunctions from '../featured-components/PlayListFunctions'
import TrackList from '../featured-components/TrackList'

import {LoginContext, TokenContext, UserContext} from '../../utilities/context'
import useTokenScroll from '../../utilities/hooks/useTokenScroll'
import requestWithToken from '../../utilities/requestWithToken';
import putWithToken from '../../utilities/putWithToken'


const LikePage = () => {
    const loggedIn = useContext(LoginContext);
    const token = useContext(TokenContext);
    const user = useContext(UserContext);


    const bannerInfo = {
        name: 'Liked Songs',
        description: '',
        user: [user],
        followers: 0,
        primary_color: 'rgb(70, 62, 118)',
        images: [{url: 'https://t.scdn.co/images/3099b3803ad9496896c43f22fe9be8c4.png'}],
    }
    const [tracks, setTracks] = useState([])
    const source = axios.CancelToken.source()
    const [setNext, lastRef] = useTokenScroll(setTracks, token, source)

    useEffect(() => {
        if (token) {
            requestWithToken('https://api.spotify.com/v1/me/tracks?limit=50', token, source)
                .then((data) => {
                    const _tracks = data.data.items
                    setTracks(tracks => [...tracks, ..._tracks.map((track) => track.track)])
                    setNext(data.data.next)
                })
                .catch((error) => console.log(error))
        }
        return () => source.cancel()
    // eslint-disable-next-line
    }, [])
    console.log(tracks)
    const playTracks = (trackUri) => {
        const track_uris = tracks.map(track => {
            return track.uri
        })
        const body = {
            uris: track_uris,
            offset: {uri: trackUri}
        }

        if (token) {
            putWithToken(`https://api.spotify.com/v1/me/player/play`, token, source, body)
                .then(response => console.log(response))
                .catch(error => console.log(error))
        }

        
    }

    const playTrack = (uri) => {
        const body = {
            uris: [uri]
        }
        if (token) {
            putWithToken(`https://api.spotify.com/v1/me/player/play`, token, source, body)
                .then(response => console.log(response))
                .catch(error => console.log(error))
        }
        
    }

    if (loggedIn) {
        return (
            <div className='listPage' style={{display: `${tracks.length===0? 'none':'block'}`}}>
                <PageBanner pageTitle='playlist' bannerInfo={bannerInfo}/>
                <div className="playListContent">
                    <div className="playListOverlay" style={{backgroundColor: `${bannerInfo.primary_color}`}}></div>
                    <PlayListFunctions type='playOnly' playContext={playTracks}/>
                    <div className="page-content">
                        <TrackList ref={lastRef} tracks={tracks} playContextTrack={playTrack}/>
                    </div>
                </div>
            </div>
        );
    } else {
        return <></>;
    }

    
}

export default LikePage;

