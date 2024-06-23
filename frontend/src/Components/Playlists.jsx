import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import nothing from "../img/nothing.png";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PlaylistAddOutlinedIcon from "@mui/icons-material/PlaylistAddOutlined";
import PlaylistAddCheckOutlinedIcon from "@mui/icons-material/PlaylistAddCheckOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Signup from "./Signup";
import Signin from "./Signin";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import "../Css/likevideos.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

function Playlists() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000";
  const { id } = useParams();
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const [isbtnClicked, setisbtnClicked] = useState(false);
  const [isSwitch, setisSwitched] = useState(false);
  const [playlistsVideos, setPlaylistsVideos] = useState([]);
  const [playlistDetails, setplaylistDetails] = useState();
  const [isEditmode, setIsEditmode] = useState(false);
  const [privacyClicked, setprivacyClicked] = useState(false);
  const [channelID, setChannelID] = useState();
  const [PlaylistName, setPlaylistName] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [deleteClicked, setDeleteClicked] = useState(false);

  const privacyRef = useRef();
  const deleteRef = useRef();

  const User = useSelector((state) => state.user.user);
  const { user } = User;

  //TOAST FUNCTIONS

  const savePlaylistNotify = () =>
    toast.success("Playlist added to library!", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  const RemovePlaylistNotify = () =>
    toast.success("Playlist removed from library!", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  const CopiedNotify = () =>
    toast.success("Link Copied!", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  //USE EFFECTS

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!privacyRef.current.contains(e.target)) {
        setprivacyClicked(false);
      }
    };

    document.addEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!deleteRef.current.contains(e.target)) {
        setDeleteClicked(false);
        document.body.classList.remove("bg-css");
      }
    };

    document.addEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    localStorage.setItem("menuClicked", JSON.stringify(menuClicked));
  }, [menuClicked]);

  useEffect(() => {
    const getPlaylists = async () => {
      try {
        if (id) {
          const response = await fetch(
            `${backendURL}/getplaylists/${id}`
          );
          const { playlistVideos, myPlaylists } = await response.json();
          setPlaylistsVideos(playlistVideos);
          setplaylistDetails(myPlaylists);
          setPlaylistName(myPlaylists.playlist_name);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    return () => getPlaylists();
  }, [id]);

  document.title =
    PlaylistName && PlaylistName !== undefined
      ? `${PlaylistName} - YouTube`
      : "YouTube";

  useEffect(() => {
    const handleMenuButtonClick = () => {
      setMenuClicked((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".menu");
    if (menuButton) {
      menuButton.addEventListener("click", handleMenuButtonClick);
    }

    return () => {
      if (menuButton) {
        menuButton.removeEventListener("click", handleMenuButtonClick);
      }
    };
  }, []);

  useEffect(() => {
    const handleMenuButtonClick = () => {
      setMenuClicked((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".menu-light");
    if (menuButton) {
      menuButton.addEventListener("click", handleMenuButtonClick);
    }

    return () => {
      if (menuButton) {
        menuButton.removeEventListener("click", handleMenuButtonClick);
      }
    };
  }, []);

  useEffect(() => {
    if (theme === false && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "white";
    } else if (theme === true && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "0f0f0f";
    }
  }, [theme]);

  const updateViews = async (id) => {
    try {
      const response = await fetch(`${backendURL}/updateview/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      await response.json();
    } catch (error) {
      // console.log(error.message);
    }
  };

  useEffect(() => {
    const getChannelID = async () => {
      try {
        if (playlistDetails.owner_email !== undefined) {
          const response = await fetch(
            `${backendURL}/getchannelid/${playlistDetails.owner_email}`
          );
          const { channelID } = await response.json();
          setChannelID(channelID);
        }
      } catch (error) {
        // console.log("Error fetching user data:", error.message);
      }
    };

    return () => getChannelID();
  }, [playlistDetails]);

  useEffect(() => {
    const GetSavedPlaylistData = async () => {
      try {
        if (id) {
          const response = await fetch(
            `${backendURL}/getsavedplaylist/${id}/${user?.email}`
          );
          const data = await response.json();
          if (data === "Found") {
            setIsSaved(true);
          } else {
            setIsSaved(false);
          }
        }
      } catch (error) {
        // console.log("Error fetching user data:", error.message);
      }
    };
    return () => GetSavedPlaylistData();
  }, [id, user?.email]);

  //POST REQUEST

  const saveEditData = async () => {
    try {
      const response = await fetch(`${backendURL}/saveplaylist/${id}`, {
        method: "POST",
        body: JSON.stringify({ playlist_name: PlaylistName }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      await response.json();
    } catch (error) {
      // console.log(error.message);
    }
  };

  const DeletePlaylist = async () => {
    try {
      const response = await fetch(
        `${backendURL}/deleteplaylist/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
    } catch (error) {
      // console.log(error.message);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        CopiedNotify();
      })
      .catch((error) => {
        console.log("Error copying link to clipboard:", error);
      });
  };

  const setPrivacy = async (privacy) => {
    try {
      const response = await fetch(`${backendURL}/saveplaylistprivacy/${id}`, {
        method: "POST",
        body: JSON.stringify({ privacy }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      await response.json();
    } catch (error) {
      // console.log(error.message);
    }
  };

  const SaveOtherPlaylist = async () => {
    try {
      const response = await fetch(
        `${backendURL}/addotherplaylist/${id}/${user?.email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data === "Saved") {
        savePlaylistNotify();
      } else if (data === "Removed") {
        RemovePlaylistNotify();
      }
    } catch (error) {
      // console.log(error.message);
    }
  };

  if (
    playlistsVideos === "No Playlists Found" ||
    (playlistsVideos &&
      playlistsVideos.length === 1 &&
      playlistsVideos[0].videoprivacy === "Private")
  ) {
    return (
      <>
        <Navbar />
        <LeftPanel />
        <div className="searched-content">
          <img src={nothing} alt="no results" className="nothing-found" />
          <p className="no-results">No videos found!</p>
        </div>
      </>
    );
  }

  if (
    playlistDetails &&
    playlistDetails.owner_email !== user?.email &&
    playlistsVideos !== "No Playlists Found" &&
    playlistDetails.playlist_privacy === "Private"
  ) {
    return (
      <>
        <Navbar />
        <LeftPanel />
        <div className="searched-content">
          <img src={nothing} alt="no results" className="nothing-found" />
          <p
            className={
              theme ? "no-results text-dark-mode" : "no-results text-light-mode"
            }
            style={{ fontSize: "16.8px" }}
          >
            This playlist is set to private by the user!
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <LeftPanel />
      <div
        className={
          theme
            ? "liked-video-data"
            : "liked-video-data light-mode text-light-mode"
        }
      >
        {playlistsVideos && playlistsVideos.length > 0 ? (
          <div
            className="like-video-sections"
            style={menuClicked === false ? { left: "80px" } : { left: "255px" }}
          >
            <div
              className={
                theme ? "like-left-section" : "like-left-section-light"
              }
              style={{
                backgroundImage: `url(${playlistsVideos[0]?.thumbnail})`,
              }}
            >
              <div className="page-cover">
                {playlistsVideos && (
                  <div
                    className="firstvideo-thumbnail"
                    onClick={() => {
                      if (user?.email) {
                        updateViews(playlistsVideos[0].videoID);
                        setTimeout(() => {
                          window.location.href = `/video/${playlistsVideos[0].videoID}`;
                        }, 400);
                      } else {
                        window.location.href = `/video/${playlistsVideos[0].videoID}`;
                      }
                    }}
                  >
                    <SkeletonTheme
                      baseColor={theme ? "#353535" : "#aaaaaa"}
                      highlightColor={theme ? "#444" : "#b6b6b6"}
                    >
                      <div
                        className="thisimggg"
                        style={
                          loading === true
                            ? { display: "block" }
                            : { display: "none" }
                        }
                      >
                        <Skeleton
                          count={1}
                          width={310}
                          height={174}
                          style={{ borderRadius: "12px" }}
                          className="sk-watch-bigimg"
                        />
                      </div>
                    </SkeletonTheme>
                    <img
                      src={playlistsVideos[0].thumbnail}
                      alt="first-like-thumbnail"
                      className="first-thumbnail playlist-first-thumbnail"
                      loading="lazy"
                      style={
                        loading === true
                          ? { visibility: "hidden", display: "none" }
                          : { visibility: "visible", display: "block" }
                      }
                    />
                    <p className="sample-play">&#9654; PLAY ALL</p>
                  </div>
                )}
                <div className="last-like-section">
                  <div
                    className="like-div"
                    style={
                      isEditmode === false
                        ? { display: "flex" }
                        : { display: "none" }
                    }
                  >
                    <p className="like-head playlist-name-edit">
                      {/* {playlistDetails.playlist_name.length <= 15
                          ? playlistDetails.playlist_name
                          : `${playlistDetails.playlist_name.slice(0, 15)}..`} */}
                      {playlistDetails.playlist_name}
                    </p>
                    <Tooltip
                      TransitionComponent={Zoom}
                      title="Edit"
                      placement="bottom"
                    >
                      <EditOutlinedIcon
                        className="edit-name-btn"
                        fontSize="medium"
                        style={
                          playlistDetails.owner_email === user?.email
                            ? { color: "white" }
                            : { display: "none" }
                        }
                        onClick={() => {
                          if (user?.email) {
                            setIsEditmode(true);
                          }
                        }}
                      />
                    </Tooltip>
                  </div>
                  <div
                    className="like-div"
                    style={
                      isEditmode === true
                        ? { display: "block" }
                        : { display: "none" }
                    }
                  >
                    <input
                      type="text"
                      name="playlist-name"
                      className="like-head like-head2 playlist-name-edit"
                      value={PlaylistName}
                      maxLength={50}
                      onChange={(e) => setPlaylistName(e.target.value)}
                    />
                    <div className="two-main-btns">
                      <button
                        className="cancel-edit"
                        onClick={() => setIsEditmode(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="save-edit"
                        onClick={() => {
                          saveEditData();

                          setTimeout(() => {
                            window.location.reload();
                          }, 300);
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  <div
                    className="last-like2"
                    style={
                      isEditmode === true
                        ? { marginTop: "65px" }
                        : { marginTop: "15px" }
                    }
                  >
                    <p
                      className="like-username"
                      onClick={() =>
                        (window.location.href = `/channel/${channelID}`)
                      }
                    >
                      {playlistDetails.playlist_owner}
                    </p>

                    <div
                      className="update-privacy"
                      style={
                        playlistDetails && playlistDetails.owner_email === user?.email
                          ? { display: "block" }
                          : { display: "none" }
                      }
                    >
                      <div
                        className="updateit-one"
                        onClick={() => {
                          if (privacyClicked === false) {
                            setprivacyClicked(true);
                          } else {
                            setprivacyClicked(false);
                          }
                        }}
                      >
                        <p>{playlistDetails.playlist_privacy}</p>
                        <KeyboardArrowDownIcon
                          fontSize="medium"
                          style={
                            playlistDetails.owner_email === user?.email
                              ? { color: "white" }
                              : { display: "none" }
                          }
                        />
                      </div>
                      <div
                        className={
                          theme
                            ? "choose-privacy2"
                            : "choose-privacy2 light-mode text-light-mode"
                        }
                        ref={window.innerWidth >= 1290 ? privacyRef : null}
                        style={
                          privacyClicked === true
                            ? { display: "block" }
                            : { display: "none" }
                        }
                      >
                        <div
                          className={
                            theme
                              ? "first-privacy"
                              : "first-privacy feature-light text-light-mode"
                          }
                          onClick={() => {
                            setprivacyClicked(false);
                            setPrivacy("Public");
                            setTimeout(() => {
                              window.location.reload();
                            }, 200);
                          }}
                        >
                          <PublicOutlinedIcon
                            fontSize="medium"
                            style={{ color: theme ? "white" : "black" }}
                          />
                          <div className="right-privacy">
                            <p>Public</p>
                            <p className={theme ? "" : "text-light-mode2"}>
                              Anyone can view
                            </p>
                          </div>
                        </div>
                        <div
                          className={
                            theme
                              ? "second-privacy"
                              : "second-privacy feature-light text-light-mode"
                          }
                          onClick={() => {
                            setprivacyClicked(false);
                            setPrivacy("Private");
                            setTimeout(() => {
                              window.location.reload();
                            }, 200);
                          }}
                        >
                          <LockOutlinedIcon
                            fontSize="medium"
                            style={{ color: theme ? "white" : "black" }}
                          />
                          <div className="right-privacy">
                            <p>Private</p>
                            <p className={theme ? "" : "text-light-mode2"}>
                              Only you can view
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="like-total-videos">
                      {playlistsVideos.length} videos
                    </p>
                  </div>

                  <div className="playlist-btns">
                    {isSaved === false ? (
                      <Tooltip
                        TransitionComponent={Zoom}
                        title="Add to Library"
                        placement="bottom"
                      >
                        <PlaylistAddOutlinedIcon
                          className="savethis-playlist"
                          fontSize="medium"
                          style={
                            playlistDetails.owner_email === user?.email
                              ? { display: "none" }
                              : { display: "block", color: "white" }
                          }
                          onClick={() => {
                            if (user?.email) {
                              SaveOtherPlaylist();
                            } else {
                              setisbtnClicked(true);
                              document.body.classList.add("bg-css");
                            }
                          }}
                        />
                      </Tooltip>
                    ) : (
                      <Tooltip
                        TransitionComponent={Zoom}
                        title="Add to Library"
                        placement="bottom"
                      >
                        <PlaylistAddCheckOutlinedIcon
                          className="savethis-playlist"
                          fontSize="medium"
                          style={
                            playlistDetails.owner_email === user?.email
                              ? { display: "none" }
                              : { display: "block", color: "white" }
                          }
                          onClick={() => {
                            if (user?.email) {
                              SaveOtherPlaylist();
                            } else {
                              setisbtnClicked(true);
                              document.body.classList.add("bg-css");
                            }
                          }}
                        />
                      </Tooltip>
                    )}
                    <Tooltip
                      TransitionComponent={Zoom}
                      title="Share"
                      placement="bottom"
                    >
                      <ReplyOutlinedIcon
                        className="share-playlist"
                        fontSize="medium"
                        style={{ color: "white" }}
                        onClick={handleCopyLink}
                      />
                    </Tooltip>
                    <Tooltip
                      TransitionComponent={Zoom}
                      title="Delete"
                      placement="bottom"
                    >
                      <DeleteIcon
                        className="delete-playlist"
                        fontSize="medium"
                        style={
                          playlistDetails.owner_email === user?.email
                            ? { color: "white" }
                            : { display: "none" }
                        }
                        onClick={() => {
                          setDeleteClicked(true);
                          document.body.classList.add("bg-css");
                        }}
                      />
                    </Tooltip>
                  </div>
                </div>
                <div
                  className="playvideo-btn"
                  onClick={() => {
                    if (user?.email) {
                      updateViews(playlistsVideos[0].videoID);
                      setTimeout(() => {
                        window.location.href = `/video/${playlistsVideos[0].videoID}`;
                      }, 400);
                    } else {
                      window.location.href = `/video/${playlistsVideos[0].videoID}`;
                    }
                  }}
                >
                  <PlayArrowIcon fontSize="medium" style={{ color: "black" }} />
                  <p className="play-all">Play all</p>
                </div>
              </div>
            </div>
            <SkeletonTheme
              baseColor={theme ? "#353535" : "#aaaaaa"}
              highlightColor={theme ? "#444" : "#b6b6b6"}
            >
              <div
                className="like-right-section"
                style={
                  loading === true ? { display: "block" } : { display: "none" }
                }
              >
                {playlistsVideos.length > 0
                  ? playlistsVideos.map((element, index) => {
                      return (
                        <div
                          className={
                            theme
                              ? "liked-all-videos"
                              : "liked-all-videos liked-all-videos-light text-light-mode"
                          }
                          key={index}
                          style={{
                            display:
                              element.videoprivacy === "Public"
                                ? "flex"
                                : "none",
                          }}
                        >
                          <div className="liked-videos-all-data">
                            <Skeleton
                              count={1}
                              width={180}
                              height={101}
                              style={{ borderRadius: "12px" }}
                              className="sk-watch-thumbnail"
                            />
                            <div
                              className="its-content"
                              style={{
                                position: "relative",
                                left: "10px",
                                top: "6px",
                              }}
                            >
                              <Skeleton
                                count={1}
                                width={450}
                                height={20}
                                className="sk-watch-title"
                              />
                              <Skeleton
                                count={1}
                                width={250}
                                height={16}
                                style={{ position: "relative", top: "10px" }}
                                className="sk-watch-channel"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : ""}
              </div>
            </SkeletonTheme>
            <div
              className="like-right-section"
              style={
                loading === true
                  ? { visibility: "hidden", display: "none" }
                  : { visibility: "visible", display: "block" }
              }
            >
              {playlistsVideos.length > 0
                ? playlistsVideos.map((element, index) => {
                    return (
                      <div
                        className={
                          theme
                            ? "liked-all-videos"
                            : "liked-all-videos liked-all-videos-light text-light-mode"
                        }
                        key={index}
                        style={{
                          display:
                            element.videoprivacy === "Public" ? "flex" : "none",
                        }}
                      >
                        <p style={{ color: "#aaa" }}>{index + 1}</p>
                        <div
                          className="liked-videos-all-data playlistvideos"
                          onClick={() => {
                            if (user?.email) {
                              updateViews(element.videoID);
                              setTimeout(() => {
                                window.location.href = `/video/${element.videoID}`;
                              }, 400);
                            } else {
                              window.location.href = `/video/${element.videoID}`;
                            }
                          }}
                        >
                          <img
                            src={element.thumbnail}
                            alt="first-like-thumbnail"
                            loading="lazy"
                          />
                          <p
                            className={
                              theme
                                ? "durationn3 playlist-duration"
                                : "durationn3 playlist-duration text-dark-mode"
                            }
                          >
                            {Math.floor(element.videolength / 60) +
                              ":" +
                              (Math.round(element.videolength % 60) < 10
                                ? "0" + Math.round(element.videolength % 60)
                                : Math.round(element.videolength % 60))}
                          </p>
                          <div className="its-content playlist-contentt">
                            {window.innerWidth <= 1000 ? (
                              <p>
                                {element.title.length <= 50
                                  ? element.title
                                  : `${element.title.slice(0, 50)}..`}
                              </p>
                            ) : (
                              <p>{element.title}</p>
                            )}

                            <p>{element.video_uploader}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
        ) : (
          <div className="main-trending-section">
            <div className="spin23" style={{ top: "200px" }}>
              <span className={theme ? "loader2" : "loader2-light"}></span>
            </div>
          </div>
        )}
      </div>

      {/* SECONDARY PLAYLIST  */}

      <div
        className={
          theme
            ? "liked-video-data-new"
            : "liked-video-data-new light-mode text-light-mode"
        }
      >
        {playlistsVideos && playlistsVideos.length > 0 ? (
          <div
            className="like-video-sections2"
            style={menuClicked === false ? { left: "80px" } : { left: "255px" }}
          >
            <div
              className={
                theme ? "like-left-section2" : "like-left-section2-light"
              }
              style={{
                backgroundImage: `url(${playlistsVideos[0]?.thumbnail})`,
              }}
            >
              <div className="page-cover2">
                <div className="playlist-tools">
                  {playlistsVideos && (
                    <div
                      className="firstvideo-thumbnail"
                      onClick={() => {
                        if (user?.email) {
                          updateViews(playlistsVideos[0].videoID);
                          setTimeout(() => {
                            window.location.href = `/video/${playlistsVideos[0].videoID}`;
                          }, 400);
                        } else {
                          window.location.href = `/video/${playlistsVideos[0].videoID}`;
                        }
                      }}
                    >
                      <SkeletonTheme
                        baseColor={theme ? "#353535" : "#aaaaaa"}
                        highlightColor={theme ? "#444" : "#b6b6b6"}
                      >
                        <div
                          className="thisimggg"
                          style={
                            loading === true
                              ? { display: "block" }
                              : { display: "none" }
                          }
                        >
                          <Skeleton
                            count={1}
                            width={310}
                            height={174}
                            style={{ borderRadius: "12px" }}
                            className="sk-watch-bigimg"
                          />
                        </div>
                      </SkeletonTheme>
                      <img
                        src={playlistsVideos[0].thumbnail}
                        alt="first-like-thumbnail"
                        className="first-thumbnail2 playlist-first-thumbnail"
                        loading="lazy"
                        style={
                          loading === true
                            ? { visibility: "hidden", display: "none" }
                            : { visibility: "visible", display: "block" }
                        }
                      />
                      <p className="sample-play">&#9654; PLAY ALL</p>
                    </div>
                  )}
                  <div className="last-like-section2 playlist-edit-tools">
                    <div
                      className="like-div"
                      style={
                        isEditmode === false
                          ? { display: "flex" }
                          : { display: "none" }
                      }
                    >
                      <p className="like-head playlist-name-edit">
                        {/* {playlistDetails.playlist_name.length <= 15
                          ? playlistDetails.playlist_name
                          : `${playlistDetails.playlist_name.slice(0, 15)}..`} */}
                        {playlistDetails.playlist_name}
                      </p>
                      <Tooltip
                        TransitionComponent={Zoom}
                        title="Edit"
                        placement="bottom"
                      >
                        <EditOutlinedIcon
                          className="edit-name-btn"
                          fontSize="medium"
                          style={
                            playlistDetails.owner_email === user?.email
                              ? { color: "white" }
                              : { display: "none" }
                          }
                          onClick={() => {
                            if (user?.email) {
                              setIsEditmode(true);
                            }
                          }}
                        />
                      </Tooltip>
                    </div>
                    <div
                      className="like-div"
                      style={
                        isEditmode === true
                          ? { display: "block" }
                          : { display: "none" }
                      }
                    >
                      <input
                        type="text"
                        name="playlist-name"
                        className="like-head like-head2 playlist-name-edit"
                        value={PlaylistName}
                        maxLength={50}
                        onChange={(e) => setPlaylistName(e.target.value)}
                      />
                      <div className="two-main-btns">
                        <button
                          className="cancel-edit"
                          onClick={() => setIsEditmode(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="save-edit"
                          onClick={() => {
                            saveEditData();

                            setTimeout(() => {
                              window.location.reload();
                            }, 300);
                          }}
                        >
                          Save
                        </button>
                      </div>
                    </div>
                    <div
                      className="last-like2"
                      style={
                        isEditmode === true
                          ? { marginTop: "65px" }
                          : { marginTop: "15px" }
                      }
                    >
                      <p
                        className="like-username"
                        onClick={() =>
                          (window.location.href = `/channel/${channelID}`)
                        }
                      >
                        {playlistDetails.playlist_owner}
                      </p>

                      <div
                        className="update-privacy"
                        style={
                          playlistDetails &&
                          playlistDetails.owner_email === user?.email
                            ? { display: "block" }
                            : { display: "none" }
                        }
                      >
                        <div
                          className="updateit-one"
                          onClick={() => {
                            if (privacyClicked === false) {
                              setprivacyClicked(true);
                            } else {
                              setprivacyClicked(false);
                            }
                          }}
                        >
                          <p>{playlistDetails.playlist_privacy}</p>
                          <KeyboardArrowDownIcon
                            fontSize="medium"
                            style={
                              playlistDetails.owner_email === user?.email
                                ? { color: "white" }
                                : { display: "none" }
                            }
                          />
                        </div>
                        <div
                          className={
                            theme
                              ? "choose-privacy2"
                              : "choose-privacy2 light-mode text-light-mode"
                          }
                          ref={window.innerWidth <= 1290 ? privacyRef : null}
                          style={
                            privacyClicked === true
                              ? { display: "block" }
                              : { display: "none" }
                          }
                        >
                          <div
                            className={
                              theme
                                ? "first-privacy"
                                : "first-privacy feature-light text-light-mode"
                            }
                            onClick={() => {
                              setprivacyClicked(false);
                              setPrivacy("Public");
                              setTimeout(() => {
                                window.location.reload();
                              }, 200);
                            }}
                          >
                            <PublicOutlinedIcon
                              fontSize="medium"
                              style={{ color: theme ? "white" : "black" }}
                            />
                            <div className="right-privacy">
                              <p>Public</p>
                              <p className={theme ? "" : "text-light-mode2"}>
                                Anyone can view
                              </p>
                            </div>
                          </div>
                          <div
                            className={
                              theme
                                ? "second-privacy"
                                : "second-privacy feature-light text-light-mode"
                            }
                            onClick={() => {
                              setprivacyClicked(false);
                              setPrivacy("Private");
                              setTimeout(() => {
                                window.location.reload();
                              }, 200);
                            }}
                          >
                            <LockOutlinedIcon
                              fontSize="medium"
                              style={{ color: theme ? "white" : "black" }}
                            />
                            <div className="right-privacy">
                              <p>Private</p>
                              <p className={theme ? "" : "text-light-mode2"}>
                                Only you can view
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="like-total-videos">
                        {playlistsVideos.length} videos
                      </p>
                    </div>

                    <div className="playlist-btns">
                      {isSaved === false ? (
                        <Tooltip
                          TransitionComponent={Zoom}
                          title="Add to Library"
                          placement="bottom"
                        >
                          <PlaylistAddOutlinedIcon
                            className="savethis-playlist"
                            fontSize="medium"
                            style={
                              playlistDetails.owner_email === user?.email
                                ? { display: "none" }
                                : { display: "block", color: "white" }
                            }
                            onClick={() => {
                              if (user?.email) {
                                SaveOtherPlaylist();
                              } else {
                                setisbtnClicked(true);
                                document.body.classList.add("bg-css");
                              }
                            }}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip
                          TransitionComponent={Zoom}
                          title="Add to Library"
                          placement="bottom"
                        >
                          <PlaylistAddCheckOutlinedIcon
                            className="savethis-playlist"
                            fontSize="medium"
                            style={
                              playlistDetails.owner_email === user?.email
                                ? { display: "none" }
                                : { display: "block", color: "white" }
                            }
                            onClick={() => {
                              if (user?.email) {
                                SaveOtherPlaylist();
                              } else {
                                setisbtnClicked(true);
                                document.body.classList.add("bg-css");
                              }
                            }}
                          />
                        </Tooltip>
                      )}
                      <Tooltip
                        TransitionComponent={Zoom}
                        title="Share"
                        placement="bottom"
                      >
                        <ReplyOutlinedIcon
                          className="share-playlist"
                          fontSize="medium"
                          style={{ color: "white" }}
                          onClick={handleCopyLink}
                        />
                      </Tooltip>
                      <Tooltip
                        TransitionComponent={Zoom}
                        title="Delete"
                        placement="bottom"
                      >
                        <DeleteIcon
                          className="delete-playlist"
                          fontSize="medium"
                          style={
                            playlistDetails.owner_email === user?.email
                              ? { color: "white" }
                              : { display: "none" }
                          }
                          onClick={() => {
                            setDeleteClicked(true);
                            document.body.classList.add("bg-css");
                          }}
                        />
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <div
                  className="playvideo-btn"
                  onClick={() => {
                    if (user?.email) {
                      updateViews(playlistsVideos[0].videoID);
                      setTimeout(() => {
                        window.location.href = `/video/${playlistsVideos[0].videoID}`;
                      }, 400);
                    } else {
                      window.location.href = `/video/${playlistsVideos[0].videoID}`;
                    }
                  }}
                >
                  <PlayArrowIcon fontSize="medium" style={{ color: "black" }} />
                  <p className="play-all">Play all</p>
                </div>
              </div>
            </div>
            <SkeletonTheme
              baseColor={theme ? "#353535" : "#aaaaaa"}
              highlightColor={theme ? "#444" : "#b6b6b6"}
            >
              <div
                className="like-right-section2"
                style={
                  loading === true ? { display: "block" } : { display: "none" }
                }
              >
                {playlistsVideos.length > 0
                  ? playlistsVideos.map((element, index) => {
                      return (
                        <div
                          className={
                            theme
                              ? "liked-all-videos"
                              : "liked-all-videos liked-all-videos-light text-light-mode"
                          }
                          key={index}
                          style={{
                            display:
                              element.videoprivacy === "Public"
                                ? "flex"
                                : "none",
                          }}
                        >
                          <div className="liked-videos-all-data">
                            <Skeleton
                              count={1}
                              width={180}
                              height={101}
                              style={{ borderRadius: "12px" }}
                              className="sk-watch-thumbnail"
                            />
                            <div
                              className="its-content"
                              style={{
                                position: "relative",
                                left: "10px",
                                top: "6px",
                              }}
                            >
                              <Skeleton
                                count={1}
                                width={450}
                                height={20}
                                className="sk-watch-title"
                              />
                              <Skeleton
                                count={1}
                                width={250}
                                height={16}
                                style={{ position: "relative", top: "10px" }}
                                className="sk-watch-channel"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : ""}
              </div>
            </SkeletonTheme>
            <div
              className="like-right-section2"
              style={
                loading === true
                  ? { visibility: "hidden", display: "none" }
                  : { visibility: "visible", display: "block" }
              }
            >
              {playlistsVideos.length > 0
                ? playlistsVideos.map((element, index) => {
                    return (
                      <div
                        className={
                          theme
                            ? "liked-all-videos"
                            : "liked-all-videos liked-all-videos-light text-light-mode"
                        }
                        key={index}
                        style={{
                          display:
                            element.videoprivacy === "Public" ? "flex" : "none",
                        }}
                      >
                        <p style={{ color: "#aaa" }}>{index + 1}</p>
                        <div
                          className="liked-videos-all-data playlistvideos"
                          onClick={() => {
                            if (user?.email) {
                              updateViews(element.videoID);
                              setTimeout(() => {
                                window.location.href = `/video/${element.videoID}`;
                              }, 400);
                            } else {
                              window.location.href = `/video/${element.videoID}`;
                            }
                          }}
                        >
                          <img
                            src={element.thumbnail}
                            alt="first-like-thumbnail"
                            loading="lazy"
                          />
                          <p
                            className={
                              theme
                                ? "durationn3 playlist-duration"
                                : "durationn3 playlist-duration text-dark-mode"
                            }
                          >
                            {Math.floor(element.videolength / 60) +
                              ":" +
                              (Math.round(element.videolength % 60) < 10
                                ? "0" + Math.round(element.videolength % 60)
                                : Math.round(element.videolength % 60))}
                          </p>
                          <div className="its-content playlist-contentt">
                            {window.innerWidth <= 1000 ? (
                              <p>
                                {element.title.length <= 50
                                  ? element.title
                                  : `${element.title.slice(0, 50)}..`}
                              </p>
                            ) : (
                              <p>{element.title}</p>
                            )}

                            <p>{element.video_uploader}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
        ) : (
          <div className="main-trending-section">
            <div className="spin23" style={{ top: "200px" }}>
              <span className={theme ? "loader2" : "loader2-light"}></span>
            </div>
          </div>
        )}
      </div>

      {/* SIGNUP/SIGNIN  */}

      <div
        className={
          theme ? "auth-popup" : "auth-popup light-mode text-light-mode"
        }
        style={
          isbtnClicked === true ? { display: "block" } : { display: "none" }
        }
      >
        <ClearRoundedIcon
          onClick={() => {
            if (isbtnClicked === false) {
              setisbtnClicked(true);
            } else {
              setisbtnClicked(false);
              document.body.classList.remove("bg-css");
            }
          }}
          className="cancel"
          fontSize="large"
          style={{ color: "gray" }}
        />
        <div
          className="signup-last"
          style={
            isSwitch === false ? { display: "block" } : { display: "none" }
          }
        >
          <Signup />
          <div className="already">
            <p>Already have an account?</p>
            <p
              onClick={() => {
                if (isSwitch === false) {
                  setisSwitched(true);
                } else {
                  setisSwitched(false);
                }
              }}
            >
              Signin
            </p>
          </div>
        </div>
        <div
          className="signin-last"
          style={isSwitch === true ? { display: "block" } : { display: "none" }}
        >
          <Signin />
          <div className="already">
            <p>Don&apos;t have an account?</p>
            <p
              onClick={() => {
                if (isSwitch === false) {
                  setisSwitched(true);
                } else {
                  setisSwitched(false);
                }
              }}
            >
              Signup
            </p>
          </div>
        </div>
      </div>

      {/* DELETE PLAYLIST POPUP */}

      <div
        className={
          theme ? "delete-playlist-pop" : "delete-playlist-pop light-mode"
        }
        ref={deleteRef}
        style={{ display: deleteClicked ? "block" : "none" }}
      >
        <p className="delete-playlist-top">Delete playlist</p>
        <div className="delete-mid">
          <p
            className={
              theme
                ? "delete-playlist-mid"
                : "delete-playlist-mid text-light-mode2"
            }
          >
            Are your sure you want to delete{" "}
            <b>{PlaylistName && PlaylistName}</b>?
          </p>
          <p
            className={
              theme
                ? "delete-playlist-mid2"
                : "delete-playlist-mid2 text-light-mode2"
            }
          >
            Note: Deleting playlists is a permanent action and cannot be undone.
          </p>
        </div>
        <div className="delete-playlist-bottom">
          <button
            className={
              theme
                ? "delete-playlist-cancel"
                : "delete-playlist-cancel delete-playlist-cancel-light"
            }
            onClick={() => {
              setDeleteClicked(false);
              document.body.classList.remove("bg-css");
            }}
          >
            Cancel
          </button>
          <button
            className={
              theme ? "delete-playlist-ok" : "delete-playlist-ok blue-txt"
            }
            onClick={() => {
              DeletePlaylist();
              setTimeout(() => {
                window.location.href = "/";
              }, 400);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  );
}

export default Playlists;
