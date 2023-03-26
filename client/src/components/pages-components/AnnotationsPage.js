import React, {useContext, useEffect, useRef, useState} from 'react'
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
    const [songName, setSongName] = useState('')
    const [trackIDs, setTrackIDs] = useState([])
    const [NumTrackIDs, setNumTrackIDs] = useState(0)
    let num_track_ids = useRef(trackIDs.length)
    // eslint-disable-next-line
    const [artists, setArtists] = useState([])
    // Need a state variable for the text displaying lyrics in the component.
    // The state variable, `currentLyrics` is first set to an empty string.
    const [lyrics, setLyrics] = useState('')

    const cancelSource = axios.CancelToken.source()
    useEffect(() => {
        // Get the info on the curretly-playing song
        const requestSongInfo = reqWithToken('https://api.spotify.com/v1/me/player/currently-playing', token, cancelSource)
        requestSongInfo()
            .then((response) => {
                setSongName(response.data.item.name)
                setArtists(response.data.item.artists.map(({name}) => name))
                console.log(artists)
            }).catch((error) => {
                setMessage(error.message)
            })
    


        // Make the axios request for the lyrics from musixmatch
        const apikey = 'd6c8b83bfc21e9bb13c124be7dc6062b' // apikey for musixmatch requests
        const base_url = 'https://api.musixmatch.com/ws/1.1/'
        // Append the search params. We take the first artist in the list of artists, assuming that the first is the primary artist.
        const search_params = 'track.search?q_artist='.concat(artists[0], '&q_track=', songName, '&apikey=', apikey)
        console.log(search_params)
        // Function to make axios requests to musixMatch
        const musixMatchRequest = async (url) => {
            let result
            try {
                result = await axios.get(url)
            } catch (err) {
                console.log(err)
                return err
            }
    
            return result
        }

        // Use axios to make a musixmatch api call to search for the musixmatch track_id.
        const search_call = base_url.concat(search_params)
        console.log(search_call)
        const track_ids = []
        musixMatchRequest(search_call)
            .then(response => {
                console.log(response)
                if (response.status === 200){
                    // set track_id to track_id returned from the response
                    console.log(response.data.message.body.track_list)
                    const track_ids = response.data.message.body.track_list.map((track) => track.track.track_id)
                    console.log(track_ids)
                    /**TODO: loop through all returned tracks' track_ids to see which one gives lyrics.
                     * musixmatch returns a track list of tracks and there can be multiple entries for the
                     * same song. One entry may have the track_id that gives lyrics and another may not.
                    */
                    setTrackIDs(track_ids)
                    console.log(trackIDs)

                }else{
                    setLyrics('') // Set lyrics to blank
                    // set error message to fail gracefully
                    setMessage(`Sorry, we couldn't find lyrics for this song:${songName}. No track id.(${response.status})`)
                }
            }).catch(err => {
                // set error message to fail gracefully
                setMessage(err.message)
            })
    
        // Only search for lyrics if we were able to obtain the musixmatch track_id
        console.log(trackIDs)
        num_track_ids = trackIDs.length
        console.log(num_track_ids)
        if (num_track_ids > 0) {
            console.log('Searching for track lyrics')
            // Use axios to make a musixmatch api call to search for the musixmatch lyrics for the given
            // track_id.
            for (const track_id of trackIDs) {
                console.log(`checking track id ${track_id}`)
                const lyrics_params = 'track.lyrics.get?track_id='.concat(track_id, '&apikey=', apikey)
                const lyrics_call = base_url.concat(lyrics_params)
                musixMatchRequest(lyrics_call)
                    .then(response => {
                        if (response.status === 200){
                            console.log('got lyrics')
                            setLyrics(response.data.message.body.lyrics.lyrics_body)
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
    /**NOTE: Right now, the code is set up to use the song context to detect when a song has changed. The issue is that
     * it song context detects a change whenver the player is updated, and the player is updated more than I think we want it to be.
     * We need to figure out a when to update the song context only whenever a different song starts playing. Because of that, I'm leaving
     * the dependency list empty for now.
     */
    // Disabling lint line because it is asking to add dependencies that I don't think are necessary.
    // eslint-disable-next-line

    }, [song])
    console.log(songName)
    console.log(lyrics)

    return (
        <div className='page-content'>
            <script type="text/javascript" src="http://tracking.musixmatch.com/t1.0/AMa6hJCIEzn1v8RuOP"></script>
            <div className='pageContent'>
                <LyricsContainer lyrics={lyrics}/>
            </div>
        </div>
    )
}