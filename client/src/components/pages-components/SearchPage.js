import React from 'react'
import BrowsePage from './BrowsePage'
import QueryPage from './QueryPage'

// Search page that displays the search results for a search; by default, it displays the different categories
export default function SearchPage({query}) {
    if (query === ''){
        return (

            // This the browse page that shows the results of the search
            <BrowsePage />
        )
    }else{
        return (
            // This is the default query page with the displayed categories
            <QueryPage query={query}/>
        )
    }
}

