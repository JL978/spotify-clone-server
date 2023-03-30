import React, { useState, useContext} from "react";
import PageTitle from "../featured-components/PageTitle";
import { LoginContext } from "../../utilities/context";
// import SocialCard from '../featured-components/SocialCard';
import Comment from "../featured-components/Comment";

export default function SocialPage() {
    // const [feed,setFeed] = useState([]);
    const loggedIn = useContext(LoginContext);

    // data from the data base will be pulled into the feed state and then mapped out
    // within the component inside the socialCard components (to be created soon). 

    // use useEffect to pull from the database and then setFeed with the list of comments.
  
    return (
      loggedIn ? 
      <div className="socialPage">
        <PageTitle name="Your Feed" />
        <div className="socialGrid">
          <Comment user="viducco" timeOfPost="20m" timestamp="0:10" track="Love Sosa" artist="Chief Keef" comment="Lorem Ipsum" replies="10" likes="15" reshares="100"/>
        </div>
      </div>
      :
      <PageTitle name="Log in to see Your Feed" />
    );
}
