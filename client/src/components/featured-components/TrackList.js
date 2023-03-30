import React, { forwardRef } from 'react';
import TrackListItem from './TrackListItem';

const TrackList = forwardRef(({ tracks, styleName, highlight, playContextTrack }, ref) => {
  const renderTrackListItem = (track, index) => {
    if (!track) {
      return null;
    }

    const isLastTrack = index + 1 === tracks.length;
    const itemProps = {
      track,
      key: track.id,
      styleName,
      highlight: track.id === highlight,
      playContextTrack,
      ...(isLastTrack ? { ref } : {})
    };

    return <TrackListItem {...itemProps} />;
  };

  return (
    <div className="trackListContainer">
      <ol className="trackList">
        {tracks.map((track, index) => renderTrackListItem(track, index))}
      </ol>
    </div>
  );
});

export default TrackList;