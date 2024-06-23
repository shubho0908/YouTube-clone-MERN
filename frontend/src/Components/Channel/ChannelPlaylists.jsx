import { useEffect, useState } from "react";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import deleteIMG from "../../img/delete.jpg";
import { useSelector } from "react-redux";

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
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000"
  const [PlaylistData, setPlaylistData] = useState([]);
  const [playlistColors, setPlaylistColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const sampleArr = [1, 2, 3, 4];
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const User = useSelector((state) => state.user.user);
  const { user } = User;

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Generate colors based on the length of PlaylistData array
    const colors = generateRandomColors(Math.max(1, PlaylistData.length));
    setPlaylistColors(colors);
  }, [PlaylistData]);

  useEffect(() => {
    const getPlaylistData = async () => {
      try {
        if (prop?.newmail) {
          const response = await fetch(
            `${backendURL}/getplaylistdata/${prop?.newmail}`
          );
          const playlistData = await response.json();
          setPlaylistData(playlistData);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };
    getPlaylistData();
  }, [prop?.newmail]);

  const publicPlaylists =
    PlaylistData &&
    PlaylistData !== "No playlists available..." &&
    PlaylistData.filter((item) => item.playlist_privacy === "Public");

  const noPublicPlaylists = publicPlaylists.length === 0;

  if (
    (loading === false && PlaylistData === "No playlists available...") ||
    (loading === false && PlaylistData.length === 0) ||
    (user?.email !== prop?.newmail && noPublicPlaylists)
  ) {
    return (
      <p
        className={theme ? "no-results" : "no-results text-light-mode"}
        style={{ color: "white", fontSize: "16px" }}
      >
        This channel doesn&apos;t have any playlists.
      </p>
    );
  }

  return (
    <>
      <SkeletonTheme
        baseColor={theme ? "#353535" : "#aaaaaa"}
        highlightColor={theme ? "#444" : "#b6b6b6"}
      >
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
              className="sk-create-playlist"
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
                          className="sk-playlist-thumbnail"
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
                            className="sk-playlist-name"
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
                            className="sk-playlist-desc"
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
        <div
          className={
            theme
              ? "created-playlist-section"
              : "created-playlist-section text-light-mode"
          }
        >
          <p>Created playlists</p>
          <div className="thischannel-playlists">
            {PlaylistData &&
              PlaylistData !== "No playlists available..." &&
              PlaylistData.length > 0 &&
              PlaylistData.map((element, index) => {
                const backgroundColor =
                  playlistColors[index] || playlistColors[0];

                return (
                  <>
                    <div
                      className="created-all-playlistss"
                      key={index}
                      style={
                        prop?.newmail !== user?.email &&
                        element.playlist_privacy === "Private"
                          ? { display: "none" }
                          : { display: "block" }
                      }
                    >
                      <div className="keep-playlist-one">
                        <div className="playlist-main-img">
                          <img
                            src={
                              element.playlist_videos[0] !== undefined
                                ? element.playlist_videos[0].thumbnail
                                : deleteIMG
                            }
                            alt=""
                            className="playlist-thumbnail"
                            onClick={() => {
                              window.location.href = `/video/${element.playlist_videos[0].videoID}`;
                            }}
                          />
                        </div>

                        <div
                          className={
                            theme
                              ? "playlist-element"
                              : "playlist-element text-dark-mode"
                          }
                          style={{ backgroundColor }}
                          onClick={() => {
                            window.location.href = `/video/${element.playlist_videos[0].videoID}`;
                          }}
                        >
                          <PlaylistPlayIcon
                            fontSize="medium"
                            style={{ color: "white" }}
                          />
                          <p>{element.playlist_videos.length} videos</p>
                        </div>
                      </div>

                      <div className="playlistt-details">
                        <p>{element.playlist_name}</p>
                        <p
                          onClick={() =>
                            (window.location.href = `/playlist/${element._id}`)
                          }
                          className={
                            theme
                              ? "view-playlist2"
                              : "view-playlist2-light text-light-mode2"
                          }
                        >
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
