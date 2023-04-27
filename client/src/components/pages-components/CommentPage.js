import React, { useEffect, useState } from 'react';
import useId from '../../utilities/hooks/useId';
import makeAxiosRequest from '../../utilities/makeAxiosRequest';
import PageBanner from '../featured-components/PageBanner';
import axios from "axios";
import Comment from '../featured-components/Comment';

export default function CommentPage() {
    const uri = useId();
    const [feed,setFeed] = useState([]);

    const [bannerInfo, setbannerInfo] = useState({
        album_type: '',
        name: '',
        description: '',
        user: [],
        followers: 0,
        primary_color: '#262626',
        images: [],
        release_date: ''
    })

    useEffect(() => {
        if (!uri) {
            return;
        }
        const [source, makeRequest] = makeAxiosRequest(`https://api.spotify.com/v1/tracks/${uri}`)
        makeRequest()
            .then((data) => {
                console.log(data)
                const {album, name, artists} = data;
                if (album) {
                    const {album_type, images, release_date} = album;
                    setbannerInfo({
                        album_type: album_type,
                        name: name,
                        description: '',
                        user: artists,
                        followers: 0,
                        primary_color: '#262626',
                        images: images,
                        release_date: release_date
                    })
                }
                console.log(album)
            })
            .then(() => source.cancel())
            .catch((error) => console.log(error))
    }, [uri])

    useEffect(() => {
        if (!uri) {
            return;
        }
        axios.get(process.env.REACT_APP_BACK_URI + `/comments/song/${uri}`)
            .then(response => {
                const data = response.data;
                console.log(data);
                const jsonData = data.comments.map(item => {
                    const stringifiedObjectId = item._id.toString();
                    return {
                    authorID: item.authorID,
                    songID: item.songID,
                    commentBody: item.commentBody,
                    timestamp: item.timestamp,
                    likes: item.likes,
                    replies: item.replies,
                    reshares: item.reshares,
                    _id: stringifiedObjectId
                    };
                })
                jsonData.sort((a, b) => b.timestamp - a.timestamp);
                setFeed(jsonData.reverse());
                console.log(jsonData);
            }
        )
        .catch((error) => console.log(error))
      },[uri])
    

    return (
        <div className='listPage' style={{display: 'block'}}>
            <PageBanner pageTitle={bannerInfo.album_type} bannerInfo={bannerInfo}/>
            <div className="playListContent" style={{marginLeft: '2em', marginRight: '2em'}}>
                {feed.map(comm => 
                    <Comment
                        key = {comm._id}
                        user = {comm.authorID}
                        commentBody = {comm.commentBody}
                        timestamp = {comm.timestamp}
                        songID = {comm.songID}
                        showSong = {false}
                    ></Comment>)}
            </div>
        </div>
    );
}