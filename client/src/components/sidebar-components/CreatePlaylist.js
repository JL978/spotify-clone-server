import React, { useContext } from "react";
import Icon from "../icons";
import { LoginContext, MessageContext } from "../../utilities/context";

function CreatePlaylist() {
  const loggedIn = useContext(LoginContext);
  const setMessage = useContext(MessageContext);

  return (
    <button
      className="create-button no-outline"
      data-tip={!loggedIn ? "create" : undefined}
      data-for={!loggedIn ? "tooltip" : undefined}
      data-event={!loggedIn ? "click" : undefined}
      onClick={() =>
        setMessage("Oops, it looks like I chose not to implement this feature :)")
      }
    >
      <div className="playlist-icon">
        <Icon name="Create" />
      </div>
      <span className="featured-label">Create Playlist</span>
    </button>
  );
}

export default CreatePlaylist;