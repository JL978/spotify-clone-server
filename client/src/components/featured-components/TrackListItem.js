import React, { useState, useContext } from 'react';
import Icon from '../icons';
import msTimeFormat from '../../utilities/utils';
import { PlayContext } from '../../utilities/context';
import ControlButton from '../footer-components/ControlButton';
import SongCommentList from './SongCommentList';



const TrackListItem = React.forwardRef(({ track, styleName, highlight, playContextTrack }, ref) => {
  const { album, artists, name, explicit, duration_ms, uri } = track;
  const updatePlayer = useContext(PlayContext);

  const thumbNail = styleName === 'simplify' && album.images.length > 0 ? album.images[album.images.length - 1].url : null;
  const formattedTime = msTimeFormat(duration_ms);
  const simplifyStyle = styleName === 'simplify';

  const [songCommentTip, setSongCommentTip] = useState(false);

  const renderThumbnail = () => (
    thumbNail ? (
      <img
        loading='lazy'
        src={thumbNail}
        style={{ width: '100%', height: '100%' }}
        alt=''
      />
    ) : (
      <div style={{ position: 'absolute', top: '35%', bottom: '35%', left: '35%', right: '35%' }}>
        <Icon name='Music2' />
      </div>
    )
  );

  const renderTrackInfo = () => (
    styleName !== 'simplify' && (
      <div className='trackInfo'>
        {explicit && <span className='explicit-label'>E</span>}
        <span className='trackArtists ellipsis-one-line'>
          {artists.map((artist) => (
            <a href={`/artist/${artist.id}`} key={artist.id}>
              {artist.name}
            </a>
          ))}
        </span>
        {album && (
          <>
            <span className='trackInfoSep'>•</span>
            <span className='trackAlbum ellipsis-one-line'>
              <a href={`/ablum/${album.id}`}>{album.name}</a>
            </span>
          </>
        )}
      </div>
    )
  );

  return (
    <li ref={ref} className={`trackListItem ${highlight ? 'highlight' : ''}`}>
      <div className='trackItemPlay' style={simplifyStyle ? simplyStyle : null}>
        <button className={`hoverIcon ${simplifyStyle ? 'no-outline' : 'trackTopAlign no-outline'}`} onClick={() => { playContextTrack(uri); updatePlayer(); }}>
          <Icon name='Play' height='20' width='20' />
        </button>
        <div className={`itemIcon ${simplifyStyle ? '' : 'trackTopAlign'}`} style={{ marginTop: simplifyStyle ? '0' : null }}>
          <Icon name='Music' />
        </div>
      </div>

      {simplifyStyle && (
        <div className='trackMidAlign'>
          <div className='trackItemThumb'>
            {renderThumbnail()}
          </div>
        </div>
      )}

      <div className='trackItemInfo'>
        <div className={simplifyStyle ? 'trackMidAlign' : 'trackTopAlign'}>
          <div className='trackName ellipsis-one-line'>{name}</div>
          {renderTrackInfo()}
        </div>
      </div>

      <div className='trackItemComment'>
        {songCommentTip && (
          <SongCommentList 
            closeTip={() => setSongCommentTip(false)}
          />
        )}
      </div>

      <ControlButton
									title="Comment"
									icon="Comment" 
									size="x-larger"
                  onClick={() => setSongCommentTip(true)}
								/>

      <div className='trackItemDuration'>
        <div className={`duration ${simplifyStyle ? 'trackMidAlign' : 'trackTopAlign'}`}>
          <span>{formattedTime}</span>
        </div>
      </div>
    </li>
  );
});

const simplyStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
};

export default TrackListItem;