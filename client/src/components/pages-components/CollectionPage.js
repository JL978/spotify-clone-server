import React, {useState, useEffect, useContext} from 'react';
import {Route} from 'react-router-dom'
import axios from 'axios'

import CollectionRow from '../featured-components/CollectionRow'

import {TokenContext} from '../../utilities/context'

const CollectionPage = ({playlists}) => {
    const [artists, setArtists] = useState([])
    const [albums, setAlbums] = useState([])

    const token = useContext(TokenContext)

    useEffect(() => {
        if (token) {
            const cancelSource = axios.CancelToken.source()

            fetch('https://api.spotify.com/v1/me/following?type=artist', {
                method: 'GET', headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
                }
            })
            .then((response) => {
                console.log(response.json().then(
                (data) => { 
                    console.log(data)
                    setArtists(data.artists.items)
                    }
                ));
            });


            fetch('https://api.spotify.com/v1/me/albums', {
                method: 'GET', headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
                }
            })
            .then((response) => {
                console.log(response.json().then(
                (data) => { 
                    console.log(data.items)
                    setAlbums(data.items)
                    }
                ));
            });
            return () => cancelSource.cancel()
        }
    // eslint-disable-next-line
    }, [])

    return (
        <div className='page-content' style={{paddingTop:'16px'}} data-testid="collection-page-content">
            <Route exact path='/collection/playlist'>
                <CollectionRow name='Playlists' playlists={playlists} data-testid="playlists-row"/>
            </Route>
            <Route exact path='/collection/artist'>
                <CollectionRow name='Artists' playlists={artists} data-testid="artist-row"/>
            </Route>
            <Route exact path='/collection/album'>
                <CollectionRow name='Albums' playlists={albums} data-testid="albums-row"/>
            </Route>
        </div>
    );
}


export default CollectionPage;
