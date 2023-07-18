import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import nothing from "../../img/nothing.png";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";

function FeaturedChannels(prop) {
  const [Email, setEmail] = useState();

  const token = localStorage.getItem("userToken");

  useEffect(() => {
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, [token]);
  return (
    <>
      <div className="featured-channels-sections">
        <div
          className="featured-channel-btn"
          style={
            Email === prop.newmail ? { display: "flex" } : { display: "none" }
          }
        >
          <PlaylistAddIcon fontSize="medium" style={{ color: "white" }} />
          <p>Add channels</p>
        </div>
      </div>
      <div className="no-playlists">
        <img src={nothing} alt="no results" className="nothing-found" />
        <p className="no-results">No channels found!</p>
      </div>
    </>
  );
}

export default FeaturedChannels;
