import React, {useState, useEffect, useRef} from 'react';

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
import {UserContext, LoginContext, TokenContext, MessageContext, PlayContext, SongContext} from './utilities/context'
import getHashParams from './utilities/getHashParams.js';

function App() {
  const [loading, setLoading] = useState(true)
  const [loggedIn, setloggedIn] = useState(localStorage.getItem('token') !== null)
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userInfo, setuserInfo] = useState({})
  const [playlists, setPlaylists] = useState([])

  const [status, setStatus] = useState(false) 
  const [message, setMessage] = useState('')
  // Boolean value that will be used to detect when I song has changed
  const [song, setSong] = useState(0)

  const timerRef = useRef(null)

  useEffect(() => {
    if (token) {
      setLoading(false);
      return;
    }

    let access_token = null;
    const hash = getHashParams();
    if (hash.access_token) {
      access_token = hash.access_token;
    }

    if (!access_token) {
      setStatusMessage(`ERROR: Not logged in.`);

    } else {
      setToken(access_token)
      localStorage.setItem('token', access_token);
      setloggedIn(true)
      window.location.hash = ''
    }

    setLoading(false);

  }, [token])

  useEffect(() => {
    if (token) {
      const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer " + token
      }
      fetch('https://api.spotify.com/v1/me', { method: 'GET', headers })
        .then((response) => {
          console.log(response.json().then(
            (data) => { 
              console.log(data)
              setuserInfo(data)
            }
          ));
        });

      fetch('https://api.spotify.com/v1/me/playlists', { method: 'GET', headers })
        .then((response) => {
          console.log(response.json().then(
            (data) => { 
              setPlaylists(data.items)
            }
          ));
        });
    }
  }, [token])


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
            setPlaylists(data.items);
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
    if (playerRef.current) {
      playerRef.current.updateState();
    }
    
  }

  return (
    <div className="App">
      {loading? 
        <Loading type='app'/> :
        <MessageContext.Provider value={setStatusMessage}>
          <LoginContext.Provider value={loggedIn}>
            <SongContext.Provider value={{song, setSong}}>
              <Sidebar>
                <Logo />
                <NavList>
                  <TokenContext.Provider value={token}>
                    <NavItem to='/' exact={true} name='Home' label='Home' />
                    <NavItem to='/search' exact={true} name='Search' label='Search' />
                    <NavItem to='/social' exact={true} name='Social' label='Social' data_tip='social' data_for='tooltip' data_event='click' style={{ pointerEvents: loggedIn? 'auto':'none'}}/> 
                    <NavItem to='/collection' exact={false} name='Library' label='Your Library' data_tip='library' data_for='tooltip' data_event='click' style={{ pointerEvents: loggedIn? 'auto':'none'}}/>
                  </TokenContext.Provider>
                  
                </NavList>
                <PlayLists 
                  top={<FeaturedPlaylist>
                          {/* <FeaturedItem label='Liked Songs' loggedIn={loggedIn} /> */}
                          <FeaturedItem to='/tracks' exact={true} name='Liked Songs' label='Liked Songs' data_event='click' style={{ pointerEvents: loggedIn? 'auto':'none'}}/>
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
            </SongContext.Provider>     
          </LoginContext.Provider>

        </MessageContext.Provider>
      }
    </div>
  );
}

export default App;
