import React from 'react';
import Icon from '../icons'
import { Link } from 'react-router-dom';

const ArtistRowItem = ({info}) => {
    const {name, type, id, images} = info;
    const thumbNail = images.length > 0 ? images[0].url : null;

    return (
        <div className='artistRowItem'>
            <Link to={`/${type}/${id}`}>
                <div className='artistRowThumb'>
                    {thumbNail 
                        ? <img loading="lazy" src={thumbNail} style={{width:'100%', height:'100%'}} alt="" />
                        : <Icon name='CD' />}
                </div>
            </Link>
            <div className="artistRowName ellipsis-one-line">
                <Link to={`/${type}/${id}`}>{name}</Link>
            </div>
        </div>
    );
}

export default ArtistRowItem;
