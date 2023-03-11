import React, { useState, useEffect, useContext} from "react";
import PageTitle from "../featured-components/PageTitle";
import { LoginContext } from "../../utilities/context";
// import SocialCard from '../featured-components/SocialCard';

export default function SocialPage() {
    const [feed,setFeed] = useState([]);
    const loggedIn = useContext(LoginContext);

    // data from the data base will be pulled into the feed state and then mapped out
    // within the component inside the socialCard components (to be created soon). 
  
    return (
      loggedIn ? 
      <div className="socialPage">
        <PageTitle name="Your Feed" />
        <div className="socialGrid">
          <div class="spotify-tweet-box">
            <div class="avatar">
              <img src="https://via.placeholder.com/50x50" alt="User avatar"/>
            </div>
            <div class="content">
              <div class="header">
                <span class="username">viducco</span>
                <span class="time">20m</span>
              </div>
              <div class="message">
                Lorem Ipsum
              </div>
              <div class="actions">
                <button class="reply-button">
                    <i class="fa fa-reply" aria-hidden="true"></i>
                    10
                </button>
                <button class="like-button">
                    <i class="fa fa-heart" aria-hidden="true"></i>
                    150
                </button>
                <button class="retweet-button">
                    <i class="fa fa-retweet" aria-hidden="true"></i>
                    25
                </button>
              </div>
            </div>
          </div>
        
        </div>
      </div>
      :
      <div>
        Log in to see feed
      </div>
    );
}
