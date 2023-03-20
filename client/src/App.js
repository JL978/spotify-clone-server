import React, {useState, useEffect, useRef} from 'react';
import Axios from 'axios';

import Sidebar from './components/sidebar-components/Sidebar.js'
import Logo from './components/sidebar-components/Logo.js'
import NavList from './components/sidebar-components/NavList.js'
import NavItem from './components/sidebar-components/NavItem.js'
import PlayLists from './components/sidebar-components/PlayLists.js'
import FeaturedPlaylist from './components/sidebar-components/FeaturedPlaylist.js'
import FeaturedItem from './components/sidebar-components/FeaturedItem.js'
import OtherPlaylist from './components/sidebar-components/OtherPlaylist.js'
import InstallCTA from './components/sidebar-components/InstallCTA.js'
import Footer from './components/footer-components/Footer.js'
import CTAbanner from './components/footer-components/CTAbanner'
import Player from './components/footer-components/Player'
import Featured from './components/featured-components/Featured.js'
import Loading from './components/featured-components/Loading.js'

// import getHashParams from './utilities/getHashParams'
// import reqWithToken from './utilities/reqWithToken'
import {UserContext, LoginContext, TokenContext, MessageContext, PlayContext} from './utilities/context'
// import SocialSidebar from './components/featured-components/SocialSidebar.js';s

function App() {
  const [loading, setLoading] = useState(true)
  const [loggedIn, setloggedIn] = useState(false)
  const [token, setToken] = useState(null)
  const [userInfo, setuserInfo] = useState({})
  const [playlists, setPlaylists] = useState([])

  const [status, setStatus] = useState(false) 
  const [message, setMessage] = useState('')

  const timerRef = useRef(null)

  useEffect(() => {
    let access_token = null;
    let error = "Not logged in."

    const hash = window.location.hash
      .substring(1)
      .split("&")
      .reduce(function(initial, item) {
        if (item) {
          var parts = item.split("=");
          initial[parts[0]] = decodeURIComponent(parts[1]);
        }
        return initial;
      }, {});
    
    if (hash.access_token) {
      access_token = hash.access_token;
      error = null;
    }

    if (error) {
      setLoading(false);
      setStatusMessage(`ERROR: ${error}`);

    } else {
      // The access token exists within the hash params
      setToken(access_token)
      setloggedIn(true)
      window.location.hash = ''

      fetch('https://api.spotify.com/v1/me', {
        method: 'GET', headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer " + access_token
        }
      })
      .then((response) => {
        console.log(response.json().then(
          (data) => { 
              console.log(data)
              setuserInfo(data)
            }
          ));
        });
      
      fetch('https://api.spotify.com/v1/me/playlists', {
          method: 'GET', headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + access_token
          }
      })
      .then((response) => {
        console.log(response.json().then(
          (data) => { 
            setPlaylists(data.items)
          }
        ));
      });
      // add a catch error to this
      setLoading(false);

    }

  }, [])


  const refreshPlaylist = () =>{
    fetch('https://api.spotify.com/v1/me/playlists', {
          method: 'GET', headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          }
      })
      .then((response) => {
        console.log(response.json().then(
          (data) => { 
            setPlaylists(data.items)
          }
        ));
      })
      .catch(error => console.log(error));
  }

  const setStatusMessage = (message) => {
      clearTimeout(timerRef.current)
      setStatus(true)
      setMessage(message)
      timerRef.current = setTimeout(() => {
          setStatus(false)
      }, 3000)
  }


  const playerRef = useRef(null)
  const updatePlayer = () => {
    playerRef.current.updateState()
  }

  return (
    <div className="App">
      {loading? 
        <Loading type='app'/> :
        <MessageContext.Provider value={setStatusMessage}>
          <LoginContext.Provider
            value={loggedIn}>
              
              <Sidebar>
                <Logo />
                <NavList>
                  <NavItem to='/' exact={true} name='Home' label='Home' />
                  <NavItem to='/search' exact={true} name='Search' label='Search' />
                  <NavItem to='/social' exact={true} name='Social' label='Social' /> 
                  <NavItem to='/collection' exact={false} name='Library' label='Your Library' data_tip='library' data_for='tooltip' data_event='click' style={{ pointerEvents: loggedIn? 'auto':'none'}}/>
                </NavList>
                <PlayLists 
                  top={<FeaturedPlaylist>
                          <FeaturedItem label='Liked Songs' loggedIn={loggedIn} />
                        </FeaturedPlaylist>}
                  bottom={<OtherPlaylist playlists={playlists}/>}
                />
                {loggedIn? <InstallCTA /> : null}
              </Sidebar>
              
              <PlayContext.Provider value={updatePlayer}>
                <TokenContext.Provider value={token}>
                    <UserContext.Provider value={userInfo}>
                      <Featured loggedIn={loggedIn} playlists={playlists} refreshPlaylist={() => refreshPlaylist()} message={message} status={status} />
                    </UserContext.Provider>
                </TokenContext.Provider>
                
              </PlayContext.Provider>

              <Footer>
                {loggedIn? <Player token={token} ref={playerRef}/>: <CTAbanner/>}
              </Footer>
                  
          </LoginContext.Provider>

        </MessageContext.Provider>
      }
    </div>
  );
}

export default App;
