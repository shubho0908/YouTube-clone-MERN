import nothing from "../../img/nothing.png";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import deleteIMG from "../../img/delete.jpg";

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
  const [PlaylistData, setPlaylistData] = useState([]);
  const [email, setEmail] = useState();
  const [playlistColors, setPlaylistColors] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const [loading, setLoading] = useState(true);
  const sampleArr = [1, 2, 3, 4];

  useEffect(() => {
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3200);
  }, []);

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

  const publicPlaylists =
    PlaylistData &&
    PlaylistData !== "No playlists available..." &&
    PlaylistData.filter((item) => item.playlist_privacy === "Public");

  const noPublicPlaylists = publicPlaylists.length === 0;

  if (PlaylistData === "No playlists available..." || noPublicPlaylists) {
    return (
      <div className="no-playlists">
        <img src={nothing} alt="no results" className="nothing-found" />
        <p className="no-results" style={{ fontSize: "15px" }}>
          No playlists found!
        </p>
      </div>
    );
  }

  return (
    <>
      <SkeletonTheme baseColor="#353535" highlightColor="#444">
        <div
          className="channel-playlist-section"
          style={
            loading === true
              ? { display: "block", width: "-webkit-fill-available" }
              : { display: "none" }
          }
        >
          <div className="created-playlist-section">
            <Skeleton
              count={1}
              width={150}
              height={16}
              style={{ borderRadius: "4px" }}
            />
            <div className="thischannel-playlists">
              {sampleArr &&
                sampleArr.map(() => {
                  return (
                    <>
                      <div className="created-all-playlistss">
                        <Skeleton
                          count={1}
                          width={230}
                          height={129}
                          style={{ borderRadius: "9px" }}
                        />

                        <div className="playlistt-details">
                          <Skeleton
                            count={1}
                            width={150}
                            height={18}
                            style={{
                              borderRadius: "4px",
                              position: "relative",
                              top: "23px",
                            }}
                          />
                          <Skeleton
                            count={1}
                            width={120}
                            height={16}
                            style={{
                              borderRadius: "4px",
                              position: "relative",
                              top: "27px",
                            }}
                          />
                        </div>
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
        </div>
      </SkeletonTheme>
      <div
        className="channel-playlist-section"
        style={
          loading === false
            ? {
                visibility: "visible",
                display: "block",
              }
            : { visibility: "hidden", display: "none" }
        }
      >
        <div className="created-playlist-section">
          <p>Created playlists</p>
          <div className="thischannel-playlists">
            {publicPlaylists &&
              publicPlaylists.map((element, index) => {
                const backgroundColor =
                  playlistColors[index] || playlistColors[0];

                return (
                  <>
                    <div
                      className="created-all-playlistss"
                      key={index}
                      style={
                        prop.newmail !== email &&
                        element.playlist_privacy === "Private"
                          ? { display: "none" }
                          : { display: "block" }
                      }
                    >
                      <img
                        src={
                          element.playlist_videos[0] !== undefined
                            ? element.playlist_videos[0].thumbnail
                            : deleteIMG
                        }
                        alt=""
                        className="playlist-thumbnail"
                        onClick={() => {
                          navigate(
                            `/video/${element.playlist_videos[0].videoID}`
                          );
                        }}
                      />
                      <div
                        className="playy-all-btn"
                        onClick={() => {
                          navigate(
                            `/video/${element.playlist_videos[0].videoID}`
                          );
                        }}
                      >
                        <PlayArrowIcon
                          fontSize="medium"
                          style={{ color: "white" }}
                        />
                        <p>PLAY ALL</p>
                      </div>
                      <div
                        className="playlist-element"
                        style={{ backgroundColor }}
                        onClick={() => {
                          navigate(
                            `/video/${element.playlist_videos[0].videoID}`
                          );
                        }}
                      >
                        <PlaylistPlayIcon
                          fontSize="medium"
                          style={{ color: "white" }}
                        />
                        <p>{element.playlist_videos.length} videos</p>
                      </div>
                      <div className="playlistt-details">
                        <p>{element.playlist_name}</p>
                        <p onClick={() => navigate(`/playlist/${element._id}`)}>
                          View full playlist
                        </p>
                      </div>
                    </div>
                  </>
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ChannelPlaylists;
