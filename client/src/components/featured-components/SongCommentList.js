import React, {useState, useEffect} from 'react';
import axios from 'axios';

// import Comment from './Comment';

// eslint-disable-next-line
const SongCommentList = ({ closeTip, song_id }) => {
    //display a list of Comment components for each comment in the database with this song_id
    // eslint-disable-next-line
    const [feed,setFeed] = useState([]);

    
    
    useEffect(() => {
        axios.get(process.env.REACT_APP_BACK_URI + "/comments/all")
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
          setFeed(jsonData.reverse());
          console.log(jsonData);
        }
        )
  
        
      },[]);

      const closeCommentList = event => {
		closeTip();
	    }




    return (
        <div className="song-comment-list">
            <div className="add-comment-title" data-source="inside">
					<h1 data-source="inside">Song Comments</h1>
				</div>
            {/* <div className="songCommentListBody">
            {feed.map(comm => 
                <Comment
                key = {comm._id}
                user = {comm.authorID}
                commentBody = {comm.commentBody}
                timestamp = {comm.timestamp}
                replies={comm.replies}
                likes={comm.likes}
                reshares={comm.reshares}
                songID = {comm.songID}
                ></Comment>)}
            </div> */}
            <button class="pill-button-grey2" onClick = {closeCommentList}>Close</button>

        </div>
    );




}






export default SongCommentList;