import React from 'react'



// Lyrics container component. The component displays the lyrics provided to it.
const LyricsContainer = ({lyrics, selectionCallback, openTip}) => {
    const onMouseUpCallback = () => {
        const selectionObject = window.getSelection();

        // const selectionRange = selectionObject.getRangeAt(0);
        // console.log(selectionRange);
        const selectedText = selectionObject.toString();
        // console.log(`Text selected: ${selectedText}`);
        selectionCallback(selectedText);
        if (selectedText === '') {
            return
        }
        openTip();
    }

    return (
        <div className='LyricsContainer'>
            <div className='lyric-container-title'>
                <h1>
                    Lyrics:
                </h1>
            </div>
            <div className='lyric-container-body' data-testid="lyrics-body">
                <span className='lyrics-container-body-wrapper' onMouseUp={onMouseUpCallback} data-testid="lyrics-selection-wrapper">
                    <h1>
                        {lyrics}
                    </h1>
                </span>
            </div>
        </div>
        
    )
}

export default LyricsContainer
