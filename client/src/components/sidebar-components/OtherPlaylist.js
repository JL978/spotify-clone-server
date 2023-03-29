import React from 'react';
import ListItem from './ListItem.js';

function OtherPlaylist({ playlists }) {
    const renderListItems = () => {
        if (!playlists) return null;

        return playlists.map((playlist) => {
            if (!playlist) return null;
            return <ListItem key={playlist.id} name={playlist.name} id={playlist.id} />;
        });
    };

    return (
        <div className="other-playlist-container">
            <ul className="other-list">{renderListItems()}</ul>
        </div>
    );
}

export default OtherPlaylist;