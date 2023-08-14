import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import jwtDecode from "jwt-decode";
import nothing from "../img/nothing.png";
import PlaylistPlayOutlinedIcon from "@mui/icons-material/PlaylistPlayOutlined";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { useState, useEffect } from "react";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import deleteIMG from "../img/delete.jpg";
import "../Css/library.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function generateRandomColors(count) {
  const transparency = 0.65; // Adjust transparency as needed (0 to 1)
  const colors = [];

  for (let i = 0; i < count; i++) {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    colors.push(`rgba(${r}, ${g}, ${b}, ${transparency})`);
  }

  return colors;
}

function Library() {
  const [watchlater, setWatchLater] = useState([]);
  const [PlaylistData, setPlaylistData] = useState([]);
  const [playlistColors, setPlaylistColors] = useState([]);
  const [channelID, setChannelID] = useState();
  const [videolike, setLikedVideos] = useState([]);
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const token = localStorage.getItem("userToken");
  const [loading, setLoading] = useState(true);
  const [LibraryLoading, setLibraryLoading] = useState(true);
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const [savedPlaylist, setSavedPlaylist] = useState([]);
  document.title = "Library - YouTube";

  useEffect(() => {
    setEmail(jwtDecode(token).email);
  }, [token]);

  useEffect(() => {
    localStorage.setItem("menuClicked", JSON.stringify(menuClicked));
  }, [menuClicked]);

  useEffect(() => {
    const colors = generateRandomColors(Math.max(1, PlaylistData.length));
    setPlaylistColors(colors);
  }, [PlaylistData]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    setTimeout(() => {
      setLibraryLoading(false);
    }, 4200);
  }, []);

  useEffect(() => {
    const getPlaylistData = async () => {
      try {
        if (email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getplaylistdata/${email}`
          );
          const playlistData = await response.json();
          setPlaylistData(playlistData);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    getPlaylistData();
  }, [email]);

  useEffect(() => {
    const getWatchLater = async () => {
      try {
        if (email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getwatchlater/${email}`
          );
          const savedData = await response.json();
          setWatchLater(savedData);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getWatchLater, 100);

    return () => clearInterval(interval);
  }, [email]);

  useEffect(() => {
    const getLikeVideos = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getlikevideos/${email}`
        );
        const result = await response.json();
        setLikedVideos(result);
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getLikeVideos, 100);

    return () => clearInterval(interval);
  }, [email]);

  useEffect(() => {
    const getChannelID = async () => {
      try {
        if (email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getchannelid/${email}`
          );
          const { channelID } = await response.json();
          setChannelID(channelID);
        }
      } catch (error) {
        // console.log("Error fetching user data:", error.message);
      }
    };

    const interval = setInterval(getChannelID, 100);

    return () => clearInterval(interval);
  }, [email]);

  useEffect(() => {
    const GetSavedPlaylist = async () => {
      try {
        if (email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getsavedplaylist/${email}`
          );
          const matchingPlaylists = await response.json();
          setSavedPlaylist(matchingPlaylists);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(GetSavedPlaylist, 250);

    return () => clearInterval(interval);
  }, [email]);

  useEffect(() => {
    const handleMenuButtonClick = () => {
      setMenuClicked((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".menu");
    menuButton.addEventListener("click", handleMenuButtonClick);

    return () => {
      menuButton.removeEventListener("click", handleMenuButtonClick);
    };
  }, []);

  const watchLaterArray =
    watchlater && watchlater.length > 0 && watchlater.savedData !== "NO DATA"
      ? watchlater.slice(0, 6) // Get the first four elements if available
      : [];

  const PlaylistArray =
    PlaylistData &&
    PlaylistData.length > 0 &&
    PlaylistData !== "No playlists available..."
      ? PlaylistData.slice(0, 6) // Get the first four elements if available
      : [];

  const LikedVideosArray =
    videolike && videolike.length > 0 && videolike !== "NO DATA"
      ? videolike.slice(0, 6) // Get the first four elements if available
      : [];

  if (
    PlaylistData === "No playlists available..." &&
    watchlater.savedData === "NO DATA" &&
    videolike === "NO DATA"
  ) {
    return (
      <>
        <Navbar />
        <LeftPanel />
        <div className="no-playlists">
          <img src={nothing} alt="no results" className="nothing-found" />
          <p className="no-results">No data found!</p>
        </div>
      </>
    );
  }

  if (loading === true) {
    return (
      <>
        <Navbar />
        <LeftPanel />
        <div className="main-trending-section">
          <div className="spin23" style={{ top: "200px" }}>
            <span className="loader"></span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <LeftPanel />
      <SkeletonTheme baseColor="#353535" highlightColor="#444">
        <div
          className="library-section"
          style={{
            left: menuClicked === false ? "150px" : "320px",
            display: LibraryLoading === true ? "flex" : "none",
          }}
        >
          <div className="watchlater-library">
            <Skeleton count={1} width={160} height={22} />
            <div className="watchlater-library-videos">
              {watchLaterArray &&
                watchLaterArray.map((index) => {
                  return (
                    <div className="thiswatchlater-videoss" key={index}>
                      <Skeleton count={1} width={230} height={129} />
                      <div className="thislibrary-video-details">
                        <Skeleton
                          count={1}
                          width={225}
                          height={25}
                          style={{ position: "relative", top: "25px" }}
                        />
                        <Skeleton
                          count={1}
                          width={175}
                          height={20}
                          style={{ position: "relative", top: "28px" }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
            <hr
              className="seperate"
              style={
                PlaylistData && PlaylistData !== "No playlists available..."
                  ? { display: "block", position: "relative", top: "60px" }
                  : { display: "none" }
              }
            />
            <div
              className="playlists-library"
              style={
                PlaylistData && PlaylistData !== "No playlists available..."
                  ? { display: "block", position: "relative", top: "66px" }
                  : { display: "none" }
              }
            >
              <div className="topplaylist-section">
                <Skeleton count={1} width={160} height={22} />
              </div>
              <div className="thischannel-playlists2">
                {PlaylistArray &&
                  PlaylistArray !== "No playlists available..." &&
                  PlaylistArray.map((element, index) => {
                    return (
                      <div className="created-all-playlistss2" key={index}>
                        <Skeleton count={1} width={230} height={129} />

                        <div className="playlistt-details">
                          <div className="extra-playlists-data">
                            <Skeleton
                              count={1}
                              width={160}
                              height={22}
                              style={{ position: "relative", top: "25px" }}
                            />
                            <Skeleton
                              count={1}
                              width={140}
                              height={18}
                              style={{ position: "relative", top: "26px" }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
            <hr
              className="seperate"
              style={{ position: "relative", top: "157px" }}
            />

            <div
              className="likedvideos-library"
              style={
                LikedVideosArray && LikedVideosArray !== "NO DATA"
                  ? { display: "block", position: "relative", top: "160px" }
                  : { display: "none" }
              }
            >
              <div className="top-watchlater-library">
                <div className="top-like-lefttt">
                  <Skeleton count={1} width={160} height={22} />
                </div>
              </div>
              <div className="watchlater-library-videos">
                {LikedVideosArray &&
                  LikedVideosArray.map((element, index) => {
                    return (
                      <div className="created-all-playlistss2" key={index}>
                        <Skeleton count={1} width={230} height={129} />

                        <div className="playlistt-details">
                          <div className="extra-playlists-data">
                            <Skeleton
                              count={1}
                              width={160}
                              height={22}
                              style={{ position: "relative", top: "25px" }}
                            />
                            <Skeleton
                              count={1}
                              width={140}
                              height={18}
                              style={{ position: "relative", top: "26px" }}
                            />
                            <Skeleton
                              count={1}
                              width={110}
                              height={15}
                              style={{ position: "relative", top: "32px" }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </SkeletonTheme>
      <div
        className="library-section"
        style={{
          left: menuClicked === false ? "150px" : "320px",
          visibility: LibraryLoading === true ? "hidden" : "visible",
        }}
      >
        <div className="watchlater-library">
          <div className="top-watchlater-library">
            <div className="top-watch-left">
              <WatchLaterOutlinedIcon
                fontSize="medium"
                style={{ color: "white" }}
              />
              <p>Watch later</p>
              <p>{watchlater && watchlater.length}</p>
            </div>
            {watchLaterArray && watchLaterArray.length >= 6 ? (
              <p
                className="see-all"
                onClick={() => {
                  navigate(`/watchlater`);
                  window.location.reload();
                }}
              >
                See all
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="watchlater-library-videos">
            {watchLaterArray &&
              watchLaterArray.map((element, index) => {
                return (
                  <div
                    className="thiswatchlater-videoss"
                    key={index}
                    onClick={() => {
                      navigate(`/video/${element.savedVideoID}`);
                      window.location.reload();
                    }}
                  >
                    <img
                      src={element.thumbnailURL}
                      alt="thumbnail"
                      className="thiswatch-thumbnail"
                    />
                    <p className="thislibrary-duration">
                      {Math.floor(element.videoLength / 60) +
                        ":" +
                        (Math.round(element.videoLength % 60) < 10
                          ? "0" + Math.round(element.videoLength % 60)
                          : Math.round(element.videoLength % 60))}
                    </p>
                    <div className="thislibrary-video-details">
                      <p>
                        {element.Title && element.Title.length <= 46
                          ? element.Title
                          : `${element.Title.slice(0, 46)}..`}
                      </p>
                      <div className="thisvideo-extra-daataa">
                        <div className="thisvide-oneliner-1">
                          <p>{element.uploader}</p>
                          <Tooltip
                            TransitionComponent={Zoom}
                            title="Verified"
                            placement="right"
                          >
                            <CheckCircleIcon
                              fontSize="100px"
                              style={{
                                color: "rgb(138, 138, 138)",
                                marginLeft: "4px",
                              }}
                            />
                          </Tooltip>
                        </div>
                        <div className="thisvide-oneliner-2">
                          <p>
                            {element.views >= 1e9
                              ? `${(element.views / 1e9).toFixed(1)}B`
                              : element.views >= 1e6
                              ? `${(element.views / 1e6).toFixed(1)}M`
                              : element.views >= 1e3
                              ? `${(element.views / 1e3).toFixed(1)}K`
                              : element.views}{" "}
                            views
                          </p>
                          <p className="thisvideo-uploaddate">
                            &#x2022;{" "}
                            {(() => {
                              const timeDifference =
                                new Date() - new Date(element.uploaded_date);
                              const minutes = Math.floor(
                                timeDifference / 60000
                              );
                              const hours = Math.floor(
                                timeDifference / 3600000
                              );
                              const days = Math.floor(
                                timeDifference / 86400000
                              );
                              const weeks = Math.floor(
                                timeDifference / 604800000
                              );
                              const years = Math.floor(
                                timeDifference / 31536000000
                              );

                              if (minutes < 1) {
                                return "just now";
                              } else if (minutes < 60) {
                                return `${minutes} mins ago`;
                              } else if (hours < 24) {
                                return `${hours} hours ago`;
                              } else if (days < 7) {
                                return `${days} days ago`;
                              } else if (weeks < 52) {
                                return `${weeks} weeks ago`;
                              } else {
                                return `${years} years ago`;
                              }
                            })()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <hr
          className="seperate"
          style={
            PlaylistData && PlaylistData !== "No playlists available..."
              ? { display: "block" }
              : { display: "none" }
          }
        />
        <div
          className="playlists-library"
          style={
            PlaylistData && PlaylistData !== "No playlists available..."
              ? { display: "block" }
              : { display: "none" }
          }
        >
          <div className="topplaylist-section">
            <PlaylistPlayOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>Playlists</p>
            {(PlaylistArray && PlaylistArray.length >= 6) ||
            (savedPlaylist && savedPlaylist.length >= 6) ? (
              <p
                className="see-all"
                onClick={() => {
                  navigate(`/channel/${channelID}`);
                  localStorage.setItem("Section", "Playlists");
                  window.location.reload();
                }}
              >
                See all
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="thischannel-playlists2">
            {PlaylistArray &&
              PlaylistArray !== "No playlists available..." &&
              PlaylistArray.map((element, index) => {
                const backgroundColor =
                  playlistColors[index] || playlistColors[0];

                const thumbnailURL =
                  element.playlist_videos &&
                  element.playlist_videos.length > 0 &&
                  element.playlist_videos[0].thumbnail
                    ? element.playlist_videos[0].thumbnail
                    : deleteIMG;

                return (
                  <div className="created-all-playlistss2" key={index}>
                    <img
                      src={thumbnailURL}
                      alt=""
                      className="playlist-thumbnail"
                      onClick={() => {
                        navigate(
                          `/video/${element.playlist_videos[0].videoID}`
                        );
                        window.location.reload();
                      }}
                    />

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
                      <div className="extra-playlists-data">
                        <p className="playlist-ownner">
                          {element.playlist_owner}
                        </p>

                        <div
                          className="private-privacyy"
                          style={
                            element.playlist_privacy === "Private"
                              ? { display: "flex" }
                              : { display: "none" }
                          }
                        >
                          <LockOutlinedIcon
                            fontSize="small"
                            style={{ color: "#aaa" }}
                          />
                          <p>Private</p>
                        </div>
                      </div>
                      <p
                        onClick={() => navigate(`/playlist/${element._id}`)}
                        className="view-playlist"
                      >
                        View full playlist
                      </p>
                    </div>
                  </div>
                );
              })}
            {savedPlaylist &&
              savedPlaylist.length > 0 &&
              savedPlaylist.map((element, index) => {
                const backgroundColor =
                  playlistColors[index] || playlistColors[0];

                const thumbnailURL =
                  element.playlist_videos &&
                  element.playlist_videos.length > 0 &&
                  element.playlist_videos[0].thumbnail
                    ? element.playlist_videos[0].thumbnail
                    : deleteIMG;

                return (
                  <div
                    className="created-all-playlistss2"
                    key={index}
                    style={
                      element.owner_email !== email &&
                      element.playlist_privacy === "Private"
                        ? { display: "none" }
                        : { display: "block" }
                    }
                  >
                    <img
                      src={thumbnailURL}
                      alt=""
                      className="playlist-thumbnail"
                      onClick={() => {
                        window.location.href = `/video/${element.playlist_videos[0].videoID}`;
                      }}
                    />

                    <div
                      className="playlist-element"
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
                    <div className="playlistt-details">
                      <p>{element.playlist_name}</p>
                      <div className="extra-playlists-data">
                        <p className="playlist-ownner">
                          {element.playlist_owner}
                        </p>

                        <div
                          className="private-privacyy"
                          style={
                            element.playlist_privacy === "Private"
                              ? { display: "flex" }
                              : { display: "none" }
                          }
                        >
                          <LockOutlinedIcon
                            fontSize="small"
                            style={{ color: "#aaa" }}
                          />
                          <p>Private</p>
                        </div>
                      </div>
                      <p
                        onClick={() => navigate(`/playlist/${element._id}`)}
                        className="view-playlist"
                      >
                        View full playlist
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
        <hr
          className="seperate"
          style={
            LikedVideosArray && LikedVideosArray !== "NO DATA"
              ? { display: "block" }
              : { display: "none" }
          }
        />

        <div className="likedvideos-library">
          <div className="top-watchlater-library">
            <div className="top-like-lefttt">
              <ThumbUpOutlinedIcon
                fontSize="medium"
                style={{ color: "white" }}
              />
              <p>Liked videos</p>
              <p>{videolike && videolike.length}</p>
            </div>
            {LikedVideosArray && LikedVideosArray.length >= 6 ? (
              <p
                className="see-all"
                onClick={() => {
                  navigate(`/likedVideos`);
                  window.location.reload();
                }}
              >
                See all
              </p>
            ) : (
              ""
            )}
          </div>
          <div className="watchlater-library-videos">
            {LikedVideosArray &&
              LikedVideosArray.map((element, index) => {
                return (
                  <div
                    className="thiswatchlater-videoss"
                    key={index}
                    onClick={() => {
                      navigate(`/video/${element.likedVideoID}`);
                      window.location.reload();
                    }}
                  >
                    <img
                      src={element.thumbnailURL}
                      alt="thumbnail"
                      className="thiswatch-thumbnail"
                    />
                    <p className="thislibrary-duration">
                      {Math.floor(element.videoLength / 60) +
                        ":" +
                        (Math.round(element.videoLength % 60) < 10
                          ? "0" + Math.round(element.videoLength % 60)
                          : Math.round(element.videoLength % 60))}
                    </p>
                    <div className="thislibrary-video-details">
                      <p>
                        {element.Title && element.Title.length <= 46
                          ? element.Title
                          : `${element.Title.slice(0, 46)}..`}
                      </p>
                      <div className="thisvideo-extra-daataa">
                        <div className="thisvide-oneliner-1">
                          <p>{element.uploader}</p>
                          <Tooltip
                            TransitionComponent={Zoom}
                            title="Verified"
                            placement="right"
                          >
                            <CheckCircleIcon
                              fontSize="100px"
                              style={{
                                color: "rgb(138, 138, 138)",
                                marginLeft: "4px",
                              }}
                            />
                          </Tooltip>
                        </div>
                        <div className="thisvide-oneliner-2">
                          <p>
                            {element.views >= 1e9
                              ? `${(element.views / 1e9).toFixed(1)}B`
                              : element.views >= 1e6
                              ? `${(element.views / 1e6).toFixed(1)}M`
                              : element.views >= 1e3
                              ? `${(element.views / 1e3).toFixed(1)}K`
                              : element.views}{" "}
                            views
                          </p>
                          <p className="thisvideo-uploaddate">
                            &#x2022;{" "}
                            {(() => {
                              const timeDifference =
                                new Date() - new Date(element.uploaded_date);
                              const minutes = Math.floor(
                                timeDifference / 60000
                              );
                              const hours = Math.floor(
                                timeDifference / 3600000
                              );
                              const days = Math.floor(
                                timeDifference / 86400000
                              );
                              const weeks = Math.floor(
                                timeDifference / 604800000
                              );
                              const years = Math.floor(
                                timeDifference / 31536000000
                              );

                              if (minutes < 1) {
                                return "just now";
                              } else if (minutes < 60) {
                                return `${minutes} mins ago`;
                              } else if (hours < 24) {
                                return `${hours} hours ago`;
                              } else if (days < 7) {
                                return `${days} days ago`;
                              } else if (weeks < 52) {
                                return `${weeks} weeks ago`;
                              } else {
                                return `${years} years ago`;
                              }
                            })()}
                          </p>
                        </div>
                      </div>
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

export default Library;
