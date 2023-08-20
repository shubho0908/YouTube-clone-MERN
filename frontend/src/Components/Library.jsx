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
        // console.log(error.message);
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
        // console.log(error.message);
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
        // console.log(error.message);
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
        // console.log(error.message);
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
            <span className="loader2"></span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <LeftPanel />

      <div
        className="library-section"
        style={{
          left: menuClicked === false ? "150px" : "320px",
        }}
      >
        {/* SKELETON WATCH LATER  */}
        <SkeletonTheme baseColor="#353535" highlightColor="#444">
          <div
            className="watchlater-library"
            style={{
              display: LibraryLoading ? "block" : "none",
              marginBottom: "20px",
            }}
          >
            <div className="top-watchlater-library">
              <Skeleton count={1} width={160} height={22} />
            </div>
            <div className="watchlater-library-videos">
              {watchLaterArray &&
                watchLaterArray.map((element, index) => {
                  return (
                    <div className="thiswatchlater-videoss" key={index}>
                      <Skeleton
                        count={1}
                        width={225}
                        height={129}
                        style={{ borderRadius: "8px" }}
                      />

                      <div
                        className="thislibrary-video-details"
                        style={{ position: "relative", top: "14px" }}
                      >
                        <Skeleton count={1} width={220} height={22} />
                        <div className="thisvideo-extra-daataa">
                          <div className="thisvide-oneliner-1">
                            <Skeleton count={1} width={180} height={14} />
                          </div>
                          <div className="thisvide-oneliner-2">
                            <p className="thisvideo-uploaddate">
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
        </SkeletonTheme>

        <div
          className="watchlater-library"
          style={{
            visibility: LibraryLoading ? "hidden" : "visible",
            display: !LibraryLoading ? "block" : "none",
          }}
        >
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
                  window.location.href = `/watchlater`;
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
                          <p className="thisvideo-uploaddate">
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
            (PlaylistData && PlaylistData !== "No playlists available...") ||
            (savedPlaylist && savedPlaylist.length > 0)
              ? { display: "block" }
              : { display: "none" }
          }
        />

        {/* SKELETON PLAYLIST  */}
        <SkeletonTheme baseColor="#353535" highlightColor="#444">
          <div
            className="playlists-library"
            style={{
              display: LibraryLoading ? "block" : "none",
              marginBottom: "50px",
            }}
          >
            <div className="topplaylist-section">
              <Skeleton count={1} width={160} height={22} />
            </div>
            <div className="thischannel-playlists2">
              {PlaylistArray &&
                PlaylistArray !== "No playlists available..." &&
                PlaylistArray.slice(
                  0,
                  Math.min(6 - savedPlaylist.length, 6)
                ).map((element, index) => {
                  return (
                    <div className="created-all-playlistss2" key={index}>
                      <Skeleton
                        count={1}
                        width={225}
                        height={129}
                        style={{ borderRadius: "8px" }}
                      />

                      <div
                        className="playlistt-details"
                        style={{ position: "relative", top: "12px" }}
                      >
                        <Skeleton count={1} width={220} height={22} />
                        <div
                          className="extra-playlists-data"
                          style={{ position: "relative", top: "5px" }}
                        >
                          <Skeleton count={1} width={180} height={16} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              {savedPlaylist &&
                savedPlaylist.length > 0 &&
                savedPlaylist
                  .slice(0, Math.min(6 - PlaylistArray.length, 6))
                  .map((element, index) => {
                    return (
                      <div className="created-all-playlistss2" key={index}>
                        <Skeleton
                          count={1}
                          width={225}
                          height={129}
                          style={{ borderRadius: "8px" }}
                        />

                        <div
                          className="playlistt-details"
                          style={{ position: "relative", top: "12px" }}
                        >
                          <Skeleton count={1} width={220} height={22} />
                          <div
                            className="extra-playlists-data"
                            style={{ position: "relative", top: "5px" }}
                          >
                            <Skeleton count={1} width={180} height={16} />
                          </div>
                        </div>
                      </div>
                    );
                  })}
            </div>
          </div>
        </SkeletonTheme>
        <div
          className="playlists-library"
          style={{
            display:
              (!LibraryLoading &&
                PlaylistData &&
                PlaylistData !== "No playlists available...") ||
              (savedPlaylist && savedPlaylist.length > 0)
                ? "block"
                : "none",
            visibility: LibraryLoading ? "hidden" : "visible",
          }}
        >
          <div className="topplaylist-section">
            <div className="playlistt-left">
              <PlaylistPlayOutlinedIcon
                fontSize="medium"
                style={{ color: "white" }}
              />
              <p>Playlists</p>
              <p>{savedPlaylist.length + PlaylistData.length}</p>
            </div>

            {PlaylistArray.length + savedPlaylist.length >= 6 && (
              <p
                className="see-all"
                onClick={() => {
                  localStorage.setItem("Section", "Playlists");
                  window.location.href = `/channel/${channelID}`;
                }}
              >
                See all
              </p>
            )}
          </div>
          <div className="thischannel-playlists2">
            {PlaylistArray &&
              PlaylistArray !== "No playlists available..." &&
              PlaylistArray.slice(0, Math.min(6 - savedPlaylist.length, 6)).map(
                (element, index) => {
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
                      <div className="playlist-main-img">
                        <img
                          src={thumbnailURL}
                          alt=""
                          className="playlist-thumbnail"
                          onClick={() => {
                            window.location.href = `/video/${element.playlist_videos[0].videoID}`;
                          }}
                        />
                      </div>

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
                          onClick={() =>
                            (window.location.href = `/playlist/${element._id}`)
                          }
                          className="view-playlist"
                        >
                          View full playlist
                        </p>
                      </div>
                    </div>
                  );
                }
              )}
            {savedPlaylist &&
              savedPlaylist.length > 0 &&
              savedPlaylist
                .slice(0, Math.min(6 - PlaylistArray.length, 6))
                .map((element, index) => {
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
                      <div className="playlist-main-img">
                        <img
                          src={thumbnailURL}
                          alt=""
                          className="playlist-thumbnail"
                          onClick={() => {
                            window.location.href = `/video/${element.playlist_videos[0].videoID}`;
                          }}
                        />
                      </div>

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
                          onClick={() =>
                            (window.location.href = `/playlist/${element._id}`)
                          }
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

        {/* SKELETON LIKE VIDEOS  */}
        <SkeletonTheme baseColor="#353535" highlightColor="#444">
          <div
            className="likedvideos-library"
            style={{ display: LibraryLoading ? "block" : "none" }}
          >
            <div className="top-watchlater-library">
              <Skeleton count={1} width={160} height={22} />
            </div>
            <div className="watchlater-library-videos">
              {LikedVideosArray &&
                LikedVideosArray.map((element, index) => {
                  return (
                    <div className="thiswatchlater-videoss" key={index}>
                      <Skeleton
                        count={1}
                        width={225}
                        height={129}
                        style={{ borderRadius: "8px" }}
                      />
                      <div
                        className="thislibrary-video-details"
                        style={{ position: "relative", top: "12px" }}
                      >
                        <Skeleton count={1} width={210} height={22} />

                        <div className="thisvideo-extra-daataa">
                          <Skeleton count={1} width={180} height={18} />

                          <div className="thisvide-oneliner-2">
                            <Skeleton count={1} width={140} height={14} />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </SkeletonTheme>
        <div
          className="likedvideos-library"
          style={{
            visibility: LibraryLoading ? "hidden" : "visible",
            display: LibraryLoading ? "none" : "block",
          }}
        >
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
                  window.location.href = `/likedVideos`;
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
                      window.location.href = `/video/${element.likedVideoID}`;
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
                          <p className="thisvideo-uploaddate">
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
