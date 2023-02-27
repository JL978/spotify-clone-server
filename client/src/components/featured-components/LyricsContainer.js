import React from 'react'

// Lyrics container component. The component receives a `playInfo` prop
// that contains current track name, artist, and id. 
const LyricsContainer = ({lyrics}) => {
    // Return JSX for the component. Will likely need the <div> tag with some react components
    // sprinkled in. 
    return (
        <div className='LyricsContainer'>
            <div className='lyric-container'>
                <h1>
                    Lyrics: {lyrics}
                </h1>
            </div>
        </div>
    )
}

export default LyricsContainer
// **Will need some way to update the lyrics dynamically if the song changes.**
