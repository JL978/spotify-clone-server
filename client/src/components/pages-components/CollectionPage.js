import React, {useState, useEffect, useContext} from 'react';
import {Route} from 'react-router-dom'
import axios from 'axios'

import CollectionRow from '../featured-components/CollectionRow'

import {TokenContext} from '../../utilities/context'
// import reqWithToken from '../../utilities/reqWithToken'

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
                    console.log(data)
                    setAlbums(data.items)
                    }
                ));
            });

            // const makeRequests = async () => {
            //     const requestArtist = reqWithToken('https://api.spotify.com/v1/me/following?type=artist', token, cancelSource)
            //     const requestAlbum = reqWithToken('https://api.spotify.com/v1/me/albums', token, cancelSource)

            //     try {
            //         const [_artists, _albums] = await Promise.all([requestArtist(), requestAlbum()]);

            //         // for debugging purposes
            //         console.log('Artists:', _artists);
            //         console.log('Albums:', _albums);

            //         setArtists(_artists.data.artists.items)
            //         setAlbums(_albums.data.items)

            //       } catch (error) {
            //         console.error('Error:', error);
            //       }

                
            // }

            // makeRequests()

            return () => cancelSource.cancel()
        }
    // eslint-disable-next-line
    }, [])

    return (
        <div className='page-content' style={{paddingTop:'16px'}}>
            <Route exact path='/collection/playlist'>
                <CollectionRow name='Playlists' playlists={playlists}/>
            </Route>
            <Route exact path='/collection/artist'>
                <CollectionRow name='Artists' playlists={artists}/>
            </Route>
            <Route exact path='/collection/album'>
                <CollectionRow name='Albums' playlists={albums}/>
            </Route>
        </div>
    );
}


export default CollectionPage;
