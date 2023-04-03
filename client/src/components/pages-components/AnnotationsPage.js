import React, {useContext, useEffect, useState} from 'react'
import axios from 'axios'
import { MessageContext, SongContext, TokenContext } from '../../utilities/context'
import reqWithToken from '../../utilities/reqWithToken'
import LyricsContainer from '../featured-components/LyricsContainer'
// We need to display annotations here as well, so we would need to
// import some component that holds the annotations for the song.


export default function AnnotationsPage() {
    const token = useContext(TokenContext)
    // eslint-disable-next-line
    const { song } = useContext(SongContext)
    const setMessage = useContext(MessageContext)
    // Need a state variable for the text displaying lyrics in the component.
    // The state variable, `currentLyrics` is first set to an empty string.
    const [lyrics, setLyrics] = useState('')

    const cancelSource = axios.CancelToken.source()
    useEffect(() => {
        console.log('useEffect rendering')
        // Get the info on the curretly-playing song
        let songName = ''
        let artists = []

        const apikey = 'd6c8b83bfc21e9bb13c124be7dc6062b' // apikey for musixmatch requests
        const base_url = 'https://api.musixmatch.com/ws/1.1/'
        // Function to make axios requests to musixMatch
        const musixMatchRequest = async (url) => {
            let result
            try {
                result = await axios.get(url)
            } catch (err) {
                console.log(err)
                setMessage(err.message)
                // THROW MUSIXMATCH ERROR
                return err
            }
    
            return result
        }

        const requestSongInfo = reqWithToken('https://api.spotify.com/v1/me/player/currently-playing', token, cancelSource)
        requestSongInfo()
            .then((response) => {
                console.log("Song info requested")
                const data = response.data
                songName = data.item.name
                // console.log(data.item.name)
                artists = data.item.artists.map(({name}) => name)
                // console.log(artists)
                const info = {
                    songName: songName, 
                    artists: artists
                }
                console.log(info)
                return info
            }).catch((error) => {
                console.log('Error getting song info')
                setMessage(error.message)
            })
            .then((info) => {
                // console.log(info.songName)
                // console.log(info.artists)
                // Append the search params. We take the first artist in the list of artists, assuming that the first is the primary artist.
                const search_params = 'track.search?q_artist='.concat(info.artists[0], '&q_track=', info.songName, '&apikey=', apikey)
                // console.log(search_params)

                // Use axios to make a musixmatch api call to search for the musixmatch track_id.
                const search_call = base_url.concat(search_params)
                console.log(search_call)
                musixMatchRequest(search_call)
                .then((response) => {
                let track_ids = []
                console.log(response)
                if (response.status === 200){
                    // set track_id to track_id returned from the response
                    console.log(response.data.message.body.track_list)
                    track_ids = response.data.message.body.track_list.map((track) => track.track.track_id)
                    console.log(track_ids)
                    console.log(track_ids)

                }else{
                    setLyrics('') // Set lyrics to blank
                    // set error message to fail gracefully
                    setMessage(`Sorry, we couldn't find lyrics for this song:${songName}. No track id.(${response.status})`)
                }
                
                return track_ids
                })
                .then((track_ids) => {
                    // Only search for lyrics if we were able to obtain the musixmatch track_id
                    console.log(track_ids)
                    let num_track_ids = track_ids.length
                    console.log(num_track_ids)
                    if (num_track_ids > 0) {
                        console.log('Searching for track lyrics')
                        // Use axios to make a musixmatch api call to search for the musixmatch lyrics for the given
                        // track_id.
                        for (const track_id of track_ids) {
                            console.log(`checking track id ${track_id}`)
                            const lyrics_params = 'track.lyrics.get?track_id='.concat(track_id, '&apikey=', apikey)
                            const lyrics_call = base_url.concat(lyrics_params)
                            musixMatchRequest(lyrics_call)
                                .then(response => {
                                    if (response.status === 200 && response.data.message.header.status_code !== 404){
                                        console.log('got lyrics')
                                        console.log(response.data)
                                        setLyrics('\n'.concat(response.data.message.body.lyrics.lyrics_body))
                                        console.log(lyrics)
                                    }else{
                                        setLyrics('No Lyrics') // Set lyrics to blank
                                        // set error message to fail gracefully
                                        setMessage('Sorry, we couldn\'t find lyrics for this song')
                                    }
                                }).catch(err => {
                                    setLyrics('No Lyrics')
                                    // set error message to fail gracefully
                                    setMessage(`Sorry, we couldn't find lyrics for this song: ${err}`)
                                })
                            if (lyrics !== 'No Lyrics') {
                                break
                            }
                        }
                    } else {
                        console.log(`Not searching for track lyrics. ${track_ids.length}`)
                    }
                })
            }).catch((err) => {
                // Just show error message for now, but eventaually add an error handler
                //**TODO: Add error handler to handle errors from different steps in the promise chain. */
                setMessage(`general error: ${err}`)
            })


        
    
        
    /**NOTE: Right now, the code is set up to use the song context to detect when a song has changed. The issue is that
     * it song context detects a change whenver the player is updated, and the player is updated more than I think we want it to be.
     * We need to figure out a when to update the song context only whenever a different song starts playing. Because of that, I'm leaving
     * the dependency list empty for now.
     */
    // Disabling lint line because it is asking to add dependencies that I don't think are necessary.
    // eslint-disable-next-line

    }, [song, token])
    // console.log(songName)
    // console.log(lyrics)

    return (
        <div className='page-content'>
            <script type="text/javascript" src="http://tracking.musixmatch.com/t1.0/AMa6hJCIEzn1v8RuOP"></script>
            <div className='pageContent'>
                <LyricsContainer lyrics={lyrics}/>
            </div>
        </div>
    )
}