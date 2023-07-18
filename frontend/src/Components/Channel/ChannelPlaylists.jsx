import nothing from "../../img/nothing.png";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";

function ChannelPlaylists(prop) {
  const [Email, setEmail] = useState();

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

  return (
    <>
      <div className="channel-playlist-section">
        <div className="create-playlist-section">
          <div
            className="create-playlist"
            style={
              Email === prop.newmail ? { display: "flex" } : { display: "none" }
            }
          >
            <PlaylistAddIcon fontSize="medium" style={{ color: "white" }} />
            <p>Playlist</p>
          </div>
        </div>
      </div>
      <div className="no-playlists">
        <img src={nothing} alt="no results" className="nothing-found" />
        <p className="no-results">No playlists found!</p>
      </div>
    </>
  );
}

export default ChannelPlaylists;
