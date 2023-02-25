import React from 'react'
import axios from 'axios'

import { MessageContext} from '../../utilities/context'

// Lyrics container component. The component receives a `playInfo` prop
// that contains current track name, artist, and id. 
const LyricsContainer = React.forwardRef(({playInfo}, ref) => {
    setMessage = userContext(MessageContext)
    const {name, artist, spotify_id} = playInfo
    // Need a state variable for the text displaying lyrics in the component.
    // The state variable, `currentLyrics` is first set to an empty string.
    const [lyrics, setLyrics] = useState('')
    const apikey = 'd6c8b83bfc21e9bb13c124be7dc6062b' // apikey for musixmatch requests
    const base_url = 'https://api.musixmatch.com/ws/1.1/'
    const search_params = 'track.search?q_artist='.concat(artist, '&q_track=', name, '&apikey=', apikey)
    

    // Use axios to make a musixmatch api call to search for the musixmatch track_id.
    const search_call = base_url.concat(search_params)
    const trackIdRequest = async (url) => {
        let result
        try {
            result = axios.get(url)
        } catch (err) {
            console.log(err)
            return err
        }

        return result
    }
    let track_id = null
    trackIdRequest(search_call)
        .then(response => {
            if (response.status === 204){
                setTimeout(() => updatePlayer(), 1000)
                // set track_id to track_id returned from the response
                console.log(response.data.body.track_list)
            }else{
                setLyrics('') // Set lyrics to blank
                // set error message to fail gracefully
                setMessage('Sorry, we couldn\'t find lyrics for this song')
            }
        }).catch(err => {
            // set error message to fail gracefully
            setMessage('Sorry, we couldn\'t find lyrics for this song')
        })

    // Use axios to make a musixmatch api call to search for the musixmatch lyrics for the given
    // track_id.
    const lyrics_params = 'track.lyrics.get?track_id='.concat(track_id, '&apikey=', apikey)
    const lyrics_call = base_url.concat(lyrics_params)
    const lyricsRequest = async (url) => {
        let result
        try {
            result = axios.get(url)
        } catch (err) {
            console.log(err)
            return err
        }

        return result
    }
    
    if (track_id !== null) {
        // Only search for lyrics if we were able to obtain the musixmatch track_id
        lyricsRequest(lyrics_call)
            .then(response => {
                if (response.status === 204){
                    setTimeout(() => updatePlayer(), 1000)
                    // set track_id to track_id returned from the response
                    console.log(response.data)
                }else{
                    setLyrics() // Set lyrics to blank
                    // set error message to fail gracefully
                    setLyrics('')
                    setMessage('Sorry, we couldn\'t find lyrics for this song')
                }
            }).catch(err => {
                // set error message to fail gracefully
                setLyrics('No Lyrics')
                setMessage('Sorry, we couldn\'t find lyrics for this song')
            })
    }

    // Return JSX for the component. Will likely need the <div> tag with some react components
    // sprinkled in. 
    return (
        <div></div>
    )
})

// **Will need some way to update the lyrics dynamically if the song changes.**
