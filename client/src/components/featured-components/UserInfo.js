import React, { useState, useContext } from 'react';
import axios from 'axios';

import { UserContext } from '../../utilities/context';
import { Link } from 'react-router-dom';

const UserInfoOptions = ({ id, logout }) => (
    <ul className="UserInfoOptions" style={{ display: 'block' }}>
        <li>
            <a
                href="https://www.spotify.com/account/?utm_source=play&amp;utm_campaign=wwwredirect"
                target="_blank"
                rel="noopener noreferrer"
            >
                Account
            </a>
        </li>
        <li>
            <Link to={`/user/${id}`}>Profile</Link>
        </li>
        <li>
            <button onClick={logout}>Log out</button>
        </li>
    </ul>
);

const UserInfo = () => {
  const [open, setOpen] = useState(false);
  const user = useContext(UserContext);

  // Return null if user is not available
  if (!user) {
    return null;
  }

  const { images, display_name, id } = user;

  const toggleOpen = () => setOpen((prevOpen) => !prevOpen);

  const logout = () => {
    axios(`${process.env.REACT_APP_BACK_URI}/logout`, { withCredentials: true })
      .then((response) => {
        window.location.reload();
        localStorage.removeItem('token');
      })
      .catch((error) => console.log(error));
  };

  let imgSrc;
  if (images && images.length > 0) {
    imgSrc = images[0].url;
  }

  return (
    <div className="userInfo">
      <button className="UserInfoButton no-outline" onClick={toggleOpen}>
        <figure className="figureStyle">
          <img loading="eager" src={imgSrc} className="imgStyle" alt=""></img>
        </figure>
        <span className="UserInfoSpan mediaNoneXL">{display_name}</span>
        <span className="arrowStyle mediaNoneXL">
          {open ? <p>&#9650;</p> : <p>&#9660;</p>}
        </span>
      </button>
      {open && <UserInfoOptions id={id} logout={logout} />}
    </div>
  );
};

export default UserInfo;