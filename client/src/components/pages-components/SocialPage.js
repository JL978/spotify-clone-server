import React, { useState, useEffect } from "react";
import PageTitle from "../featured-components/PageTitle";

import makeAxiosRequest from "../../utilities/makeAxiosRequest";

export default function SocialPage() {
    const [feed,setFeed] = useState([]);

    // data from the data base will be pulled into the feed state and then mapped out
    // within the component inside the socialCard components (to be created soon). 
    const [genre, setGenre] = useState([]);

    useEffect(() => {
      const [source, makeRequest] = makeAxiosRequest(
        "https://api.spotify.com/v1/browse/categories?limit=50"
      );
  
      makeRequest()
        .then((data) => {
          setGenre(data.categories.items);
        })
        .catch((error) => console.log(error));
  
      return () => source.cancel();
    }, []);
  
    // return (
    //     <div className="page-content">
    //         <div className='browsePage'>
    //             <PageTitle name='Browse All' />
    //             <div className="browseGrid">
    //                 {genre.map((genre) => {
    //                     return <BrowseCard key={genre.id} info={genre}/>
    //                 })}
    //             </div>
    //         </div>
    //     </div>
    // )
  
    return (
      <div className="page-content">
        <div className="socialPage">
          <PageTitle name="Your Feed" />
          <div className="socialGrid">
            {genre.map((genre) => {
              return <BrowseCard key={genre.id} info={genre} />;
            })}
          </div>
          <div>
            
          </div>
        </div>
      </div>
    );
}
