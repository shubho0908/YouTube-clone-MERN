import nothing from "../../img/nothing.png";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";

function generateRandomColors(count) {
  const transparency = 0.7; // Adjust transparency as needed (0 to 1)
  const colors = [];

  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    colors.push(`rgba(${r}, ${g}, ${b}, ${transparency})`);
  }

  return colors;
}

function ChannelPlaylists(prop) {
  const { id } = useParams();
  const [PlaylistData, setPlaylistData] = useState([]);
  const token = localStorage.getItem("userToken");

  const [playlistColors, setPlaylistColors] = useState([]);

  useEffect(() => {
    // Generate colors based on the length of PlaylistData array
    const colors = generateRandomColors(Math.max(1, PlaylistData.length));
    setPlaylistColors(colors);
  }, [PlaylistData]);

  useEffect(() => {
    const getPlaylistData = async () => {
      try {
        if (prop.newmail !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getplaylistdata/${prop.newmail}`
          );
          const playlistData = await response.json();
          setPlaylistData(playlistData);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getPlaylistData();
  }, [prop.newmail]);

  if (PlaylistData === "No playlists available...") {
    return (
      <div className="no-playlists">
        <img src={nothing} alt="no results" className="nothing-found" />
        <p className="no-results">No playlists found!</p>
      </div>
    );
  }

  return (
    <>
      <div className="channel-playlist-section">
        <div className="created-playlist-section">
          <p>Created playlists</p>
          <div className="thischannel-playlists">
            {PlaylistData &&
              PlaylistData.length > 0 &&
              PlaylistData.map((element, index) => {
                const backgroundColor =
                  playlistColors[index] || playlistColors[0];
                return (
                  <div className="created-all-playlistss" key={index}>
                    <img
                      src={element.playlist_videos[0].thumbnail}
                      alt=""
                      className="playlist-thumbnail"
                    />
                   <div className="playy-all-btn">
                    
                   </div>
                    <div
                      className="playlist-element"
                      style={{ backgroundColor }}
                    >
                      <PlaylistPlayIcon
                        fontSize="medium"
                        style={{ color: "white" }}
                      />
                      <p>{element.playlist_videos.length} videos</p>
                    </div>
                    <div className="playlistt-details">
                      <p>{element.playlist_name}</p>
                      <p>View full playlist</p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ChannelPlaylists;
