import nothing from "../../img/nothing.png";

function ChannelPlaylists() {

  return (
    <>
      <div className="channel-playlist-section">
        <div className="create-playlist-section">
          
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
