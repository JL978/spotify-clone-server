import React, { useState, useContext, useEffect} from "react";
import axios from "axios";
import PageTitle from "../featured-components/PageTitle";
import { LoginContext } from "../../utilities/context";
// import SocialCard from '../featured-components/SocialCard';
import Comment from "../featured-components/Comment";

export default function SocialPage() {
    const [feed,setFeed] = useState([]);
    const loggedIn = useContext(LoginContext);

    useEffect(() => {
      axios.get(process.env.REACT_APP_BACK_URI + "/comments/all")
      .then(response => {
        const data = response.data;
        console.log(data);
        if (data === undefined) {
          return;
        }
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

      
    },[])

    

    // data from the data base will be pulled into the feed state and then mapped out
    // within the component inside the socialCard components (to be created soon). 

    // use useEffect to pull from the database and then setFeed with the list of comments.
  
    return (
      loggedIn ? 
      <div className="socialPage">
        <PageTitle name="Your Feed" />
        <div className="socialGrid">
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
            showSong = {true}
            ></Comment>)}
          {/* <Comment user="viducco" timeOfPost="20m" timestamp="0:10" track="Love Sosa" artist="Chief Keef" comment="Lorem Ipsum" replies="10" likes="15" reshares="100"/> */}
        </div>
      </div>
      :
      <PageTitle name="Log in to see Your Feed" />
    );
}
