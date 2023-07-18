import nothing from "../../img/nothing.png";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";

function ChannelPlaylists() {
  return (
    <>
      <div className="channel-playlist-section">
        <div className="create-playlist-section">
          <div className="create-playlist">
            <PlaylistAddIcon fontSize="large" style={{ color: "white" }} />
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
