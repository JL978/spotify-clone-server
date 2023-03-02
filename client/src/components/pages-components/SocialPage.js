import React, { useState, useEffect } from "react";
import PageTitle from "../featured-components/PageTitle";
import SocialCard from '../featured-components/SocialCard';

export default function SocialPage() {
    const [feed,setFeed] = useState([]);

    // data from the data base will be pulled into the feed state and then mapped out
    // within the component inside the socialCard components (to be created soon). 
  
    return (
      <div className="socialPage">
        <PageTitle name="Your Feed" />
        <div className="socialGrid">
        </div>
      </div>
    );
}
