import "../Css/leftpanel.css";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import PlaylistPlayOutlinedIcon from "@mui/icons-material/PlaylistPlayOutlined";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { useEffect, useState } from "react";
import Logo from "../img/logo1.png";
import Logo2 from "../img/logo2.png";
import Signup from "./Signup";
import Signin from "./Signin";
import { useLocation } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import CodeIcon from "@mui/icons-material/Code";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import { GoHome } from "react-icons/go";
import { GoHomeFill } from "react-icons/go";
import { HiOutlineFire } from "react-icons/hi";
import { HiMiniFire } from "react-icons/hi2";
import { IoAddCircleOutline } from "react-icons/io5";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdSubscriptions } from "react-icons/md";
import { MdOutlineVideoLibrary } from "react-icons/md";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import SubscriptionsIcon from "@mui/icons-material/Subscriptions";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { MdVideoLibrary } from "react-icons/md";
import { useSelector } from "react-redux";

function LeftPanel() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000";
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const location = useLocation();
  const [Subscriptions, setSubscriptions] = useState([]);
  const [PlaylistData, setPlaylistData] = useState([]);
  const [isbtnClicked, setisbtnClicked] = useState(false);
  const [isSwitch, setisSwitched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedPlaylist, setSavedPlaylist] = useState([]);
  const [togglepanel, setTogglePannel] = useState(false);
  const [closePanel, setClosePanel] = useState(false);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  const User = useSelector((state) => state.user.user);
  const { user } = User;

  useEffect(() => {
    const handleMenuButtonClick = () => {
      if (window.innerWidth >= 860) {
        setMenuClicked((prevMenuClicked) => !prevMenuClicked);
      } else {
        document.body.classList.add("bg-css");
        setTogglePannel(true);
      }
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
      if (window.innerWidth >= 860) {
        setMenuClicked((prevMenuClicked) => !prevMenuClicked);
      } else {
        document.body.classList.add("bg-css");
        setTogglePannel(true);
      }
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
    localStorage.setItem("menuClicked", JSON.stringify(menuClicked));
  }, [menuClicked]);

  const selected = localStorage.getItem("selected");

  useEffect(() => {
    const currentUrl = location.pathname;
    let selected = "";

    if (currentUrl === "/") {
      selected = "home";
    } else if (currentUrl === "/trending") {
      selected = "trending";
    } else if (currentUrl === "/watchlater") {
      selected = "watch-later";
    } else if (currentUrl === "/subscriptions") {
      selected = "subscription";
    } else if (currentUrl === "/likedVideos") {
      selected = "liked-video";
    } else if (currentUrl === "/library") {
      selected = "library";
    } else {
      selected = "other";
    }

    localStorage.setItem("selected", selected);
  }, [location]);

  useEffect(() => {
    const getSubscriptions = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getsubscriptions/${user?.email}`
          );
          const result = await response.json();
          setSubscriptions(result);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    return () => getSubscriptions();
  }, [user?.email]);

  useEffect(() => {
    const getPlaylistData = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getplaylistdata/${user?.email}`
          );
          const playlistData = await response.json();
          setPlaylistData(playlistData);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };
    return () => getPlaylistData();
  }, [user?.email]);

  useEffect(() => {
    const GetSavedPlaylist = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getsavedplaylist/${user?.email}`
          );
          const matchingPlaylists = await response.json();
          setSavedPlaylist(matchingPlaylists);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    return () => GetSavedPlaylist();
  }, [user?.email]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  return (
    <>
      <div
        className={theme ? "main-left-section" : "main-left-section light-mode"}
        style={
          menuClicked === false ? { display: "none" } : { display: "block" }
        }
      >
        <div className="first-section ">
          <div
            className={
              selected === "home"
                ? `home sec-data ${theme ? "changeBG" : "changeBG-light"}`
                : "home sec-data"
            }
            onClick={() => {
              localStorage.setItem("selected", "home");
              window.location.href = "/";
            }}
          >
            {selected === "home" ? (
              <HomeIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            ) : (
              <HomeOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            )}

            <p>Home</p>
          </div>
          <div
            className={
              selected === "trending"
                ? `trending sec-data ${theme ? "changeBG" : "changeBG-light"}`
                : "trending sec-data"
            }
            onClick={() => {
              localStorage.setItem("selected", "trending");
              window.location.href = "/trending";
            }}
          >
            {selected === "trending" ? (
              <WhatshotIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            ) : (
              <WhatshotOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            )}
            <p>Trending</p>
          </div>
          <div
            className={
              selected === "subscription"
                ? `subscription sec-data ${
                    theme ? "changeBG" : "changeBG-light"
                  }`
                : "subscription sec-data"
            }
            onClick={() => {
              if (user?.email) {
                localStorage.setItem("selected", "subscription");
                window.location.href = "/subscriptions";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            {selected === "subscription" ? (
              <SubscriptionsIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            ) : (
              <SubscriptionsOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            )}
            <p>Subscriptions</p>
          </div>
          <div
            className="subscribed-channels"
            style={
              Subscriptions && Subscriptions.length > 0
                ? { display: "block" }
                : { display: "none" }
            }
          >
            {Subscriptions &&
              Subscriptions.length > 0 &&
              Subscriptions.map((element, index) => {
                return (
                  <>
                    <SkeletonTheme
                      baseColor={theme ? "#353535" : "#aaaaaa"}
                      highlightColor={theme ? "#444" : "#b6b6b6"}
                    >
                      <div
                        className="mysubscriptions"
                        key={index}
                        style={
                          loading === true
                            ? { visibility: "visible" }
                            : { display: "none" }
                        }
                      >
                        <Skeleton
                          count={1}
                          width={35}
                          height={35}
                          style={{ borderRadius: "100%" }}
                        />
                        <Skeleton
                          count={1}
                          width={122}
                          height={16}
                          style={{
                            position: "relative",
                            left: "10px",
                            top: "5px",
                          }}
                        />
                      </div>
                    </SkeletonTheme>
                    <div
                      className="mysubscriptions"
                      key={index}
                      onClick={() => {
                        window.location.href = `/channel/${element.channelID}`;
                      }}
                      style={
                        loading === false
                          ? { display: "flex" }
                          : { display: "none" }
                      }
                    >
                      <img
                        src={element.channelProfile}
                        alt="channel profile"
                        className="channel-profilee"
                      />
                      <Tooltip
                        TransitionComponent={Zoom}
                        title={`${element.channelname}`}
                        placement="right"
                      >
                        <p className="sub-channelnamee">
                          {element.channelname.length <= 7
                            ? element.channelname
                            : `${element.channelname.slice(0, 7)}..`}
                        </p>
                      </Tooltip>
                    </div>
                  </>
                );
              })}
          </div>
        </div>
        <hr className={theme ? "seperate" : "seperate-light"} />
        <div className="second-section">
          <div
            className={
              selected === "library"
                ? `library sec-data ${theme ? "changeBG" : "changeBG-light"}`
                : "library sec-data"
            }
            onClick={() => {
              if (user?.email) {
                localStorage.setItem("selected", "library");
                window.location.href = "/library";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            {selected === "library" ? (
              <VideoLibraryIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            ) : (
              <VideoLibraryOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            )}
            <p>Library</p>
          </div>

          <div
            className={
              selected === "watch-later"
                ? `watch-later sec-data ${
                    theme ? "changeBG" : "changeBG-light"
                  }`
                : "watch-later sec-data"
            }
            onClick={() => {
              if (user?.email) {
                localStorage.setItem("selected", "watch-later");
                window.location.href = "/watchlater";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            {selected === "watch-later" ? (
              <WatchLaterIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            ) : (
              <WatchLaterOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            )}
            <p>Watch later</p>
          </div>
          <div
            className={
              selected === "liked-video"
                ? `liked-video sec-data ${
                    theme ? "changeBG" : "changeBG-light"
                  }`
                : "liked-video sec-data"
            }
            onClick={() => {
              if (user?.email) {
                localStorage.setItem("selected", "liked-video");

                window.location.href = "/likedVideos";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            {selected === "liked-video" ? (
              <ThumbUpIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            ) : (
              <ThumbUpOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            )}
            <p>Liked videos</p>
          </div>
          <div className="my-playlists-sectionn">
            {PlaylistData &&
              PlaylistData !== "No playlists available..." &&
              PlaylistData.length > 0 &&
              PlaylistData.map((element, index) => {
                return (
                  <div
                    className="my-playlist-data"
                    key={index}
                    onClick={() => {
                      window.location.href = `/playlist/${element._id}`;
                    }}
                  >
                    <PlaylistPlayOutlinedIcon
                      fontSize="medium"
                      style={{ color: theme ? "white" : "black" }}
                    />
                    <Tooltip
                      TransitionComponent={Zoom}
                      title={`${element.playlist_name}`}
                      placement="right"
                    >
                      <p>
                        {element.playlist_name.length <= 8
                          ? element.playlist_name
                          : `${element.playlist_name.slice(0, 8)}..`}
                      </p>
                    </Tooltip>
                  </div>
                );
              })}
            {savedPlaylist &&
              savedPlaylist.length > 0 &&
              savedPlaylist.map((element, index) => {
                return (
                  <div
                    className="my-playlist-data"
                    key={index}
                    onClick={() => {
                      window.location.href = `/playlist/${element._id}`;
                    }}
                  >
                    <PlaylistPlayOutlinedIcon
                      fontSize="medium"
                      style={{ color: theme ? "white" : "black" }}
                    />
                    <Tooltip
                      TransitionComponent={Zoom}
                      title={`${element.playlist_name}`}
                      placement="right"
                    >
                      <p>
                        {element.playlist_name.length <= 8
                          ? element.playlist_name
                          : `${element.playlist_name.slice(0, 8)}..`}
                      </p>
                    </Tooltip>
                  </div>
                );
              })}
          </div>
          <hr className={theme ? "seperate" : "seperate-light"} />
          <Tooltip
            TransitionComponent={Zoom}
            title="Made with 💖 by Shubhojeet"
            placement="bottom"
          >
            <div className="developer">
              <CodeIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
              <a
                href="https://github.com/shubho0908"
                target="_blank"
                rel="noreferrer"
              >
                Shubhojeet Bera 🚀
              </a>
            </div>
          </Tooltip>
        </div>
      </div>

      {/* SHORT HAND  */}
      <div
        className={
          theme
            ? "main-left-section main-2"
            : "main-left-section main-2 light-mode"
        }
        style={
          menuClicked === false ? { display: "flex" } : { display: "none" }
        }
      >
        <div className="first-section ">
          <div
            className={
              selected === "home"
                ? `home sec-data sec-data2 ${
                    theme ? "changeBG" : "changeBG-light"
                  }`
                : "home sec-data sec-data2"
            }
            onClick={() => {
              localStorage.setItem("selected", "home");

              window.location.href = "/";
            }}
          >
            {selected === "home" ? (
              <HomeIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            ) : (
              <HomeOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            )}
          </div>
          <div
            className={
              selected === "trending"
                ? `trending trending2 sec-data sec-data2 ${
                    theme ? "changeBG" : "changeBG-light"
                  }`
                : "trending trending2 sec-data sec-data2"
            }
            onClick={() => {
              localStorage.setItem("selected", "trending");

              window.location.href = "/trending";
            }}
          >
            {selected === "trending" ? (
              <WhatshotIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            ) : (
              <WhatshotOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            )}
          </div>
          <div
            className={
              selected === "subscription"
                ? `subscription subscription2 sec-data sec-data2 ${
                    theme ? "changeBG" : "changeBG-light"
                  }`
                : "subscription subscription2 sec-data sec-data2"
            }
            onClick={() => {
              if (user?.email) {
                localStorage.setItem("selected", "subscription");
                window.location.href = "/subscriptions";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            {selected === "subscription" ? (
              <SubscriptionsIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            ) : (
              <SubscriptionsOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            )}
          </div>
        </div>
        {/* <hr className="seperate" /> */}
        <div className="second-section">
          <div
            className={
              selected === "library"
                ? `library library2 sec-data sec-data2 ${
                    theme ? "changeBG" : "changeBG-light"
                  }`
                : "library library2 sec-data sec-data2"
            }
            onClick={() => {
              if (user?.email) {
                localStorage.setItem("selected", "library");
                window.location.href = "/library";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            {selected === "library" ? (
              <VideoLibraryIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            ) : (
              <VideoLibraryOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            )}
          </div>
          <div
            className={
              selected === "watch-later"
                ? `watch-later watch-later2 sec-data sec-data2 ${
                    theme ? "changeBG" : "changeBG-light"
                  }`
                : "watch-later watch-later2 sec-data sec-data2"
            }
            onClick={() => {
              if (user?.email) {
                localStorage.setItem("selected", "watch-later");
                window.location.href = "/watchlater";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            {selected === "watch-later" ? (
              <WatchLaterIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            ) : (
              <WatchLaterOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            )}
          </div>
          <div
            className={
              selected === "liked-video"
                ? `liked-video liked-video2 sec-data sec-data2 ${
                    theme ? "changeBG" : "changeBG-light"
                  }`
                : "liked-video liked-video2 sec-data sec-data2"
            }
            onClick={() => {
              if (user?.email) {
                localStorage.setItem("selected", "liked-video");

                window.location.href = "/likedVideos";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            {selected === "liked-video" ? (
              <ThumbUpIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            ) : (
              <ThumbUpOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            )}
          </div>
        </div>
      </div>

      {/* SHORT HAND - 2 */}
      <div
        className={
          theme
            ? "main-left-section main-2 main-3"
            : "main-left-section main-2 main-3 light-mode"
        }
        style={{ display: "none" }}
      >
        <div className="first-section ">
          <div
            className={
              selected === "home"
                ? `home sec-data sec-data2 ${
                    theme ? "changeBG" : "changeBG-light"
                  }`
                : "home sec-data sec-data2"
            }
            onClick={() => {
              localStorage.setItem("selected", "home");

              window.location.href = "/";
            }}
          >
            {selected === "home" ? (
              <HomeIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            ) : (
              <HomeOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            )}
          </div>
          <div
            className={
              selected === "trending"
                ? `trending trending2 sec-data sec-data2 ${
                    theme ? "changeBG" : "changeBG-light"
                  }`
                : "trending trending2 sec-data sec-data2"
            }
            onClick={() => {
              localStorage.setItem("selected", "trending");

              window.location.href = "/trending";
            }}
          >
            {selected === "trending" ? (
              <WhatshotIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            ) : (
              <WhatshotOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            )}
          </div>
          <div
            className={
              selected === "subscription"
                ? `subscription subscription2 sec-data sec-data2 ${
                    theme ? "changeBG" : "changeBG-light"
                  }`
                : "subscription subscription2 sec-data sec-data2"
            }
            onClick={() => {
              if (user?.email) {
                localStorage.setItem("selected", "subscription");
                window.location.href = "/subscriptions";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            {selected === "subscription" ? (
              <SubscriptionsIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            ) : (
              <SubscriptionsOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            )}
          </div>
        </div>
        {/* <hr className="seperate" /> */}
        <div className="second-section">
          <div
            className={
              selected === "library"
                ? `library library2 sec-data sec-data2 ${
                    theme ? "changeBG" : "changeBG-light"
                  }`
                : "library library2 sec-data sec-data2"
            }
            onClick={() => {
              if (user?.email) {
                localStorage.setItem("selected", "library");
                window.location.href = "/library";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            {selected === "library" ? (
              <VideoLibraryIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            ) : (
              <VideoLibraryOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            )}
          </div>
          <div
            className={
              selected === "watch-later"
                ? `watch-later watch-later2 sec-data sec-data2 ${
                    theme ? "changeBG" : "changeBG-light"
                  }`
                : "watch-later watch-later2 sec-data sec-data2"
            }
            onClick={() => {
              if (user?.email) {
                localStorage.setItem("selected", "watch-later");
                window.location.href = "/watchlater";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            {selected === "watch-later" ? (
              <WatchLaterIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            ) : (
              <WatchLaterOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            )}
          </div>
          <div
            className={
              selected === "liked-video"
                ? `liked-video liked-video2 sec-data sec-data2 ${
                    theme ? "changeBG" : "changeBG-light"
                  }`
                : "liked-video liked-video2 sec-data sec-data2"
            }
            onClick={() => {
              if (user?.email) {
                localStorage.setItem("selected", "liked-video");

                window.location.href = "/likedVideos";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            {selected === "liked-video" ? (
              <ThumbUpIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            ) : (
              <ThumbUpOutlinedIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
            )}
          </div>
        </div>
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

      {/* SECONDARY PANEL  */}
      <div
        className={
          closePanel === true
            ? `secondary-panel moveout ${theme ? "" : "light-mode"}`
            : `secondary-panel ${theme ? "" : "light-mode"}`
        }
        style={{ display: togglepanel ? "block" : "none" }}
      >
        <div className={theme ? "panel-topdata" : "panel-topdata light-mode"}>
          <MenuRoundedIcon
            fontSize="large"
            style={{ color: theme ? "white" : "black" }}
            className="close-sidepanel"
            onClick={() => {
              setClosePanel(true);
              setTimeout(() => {
                document.body.classList.remove("bg-css");
              }, 250);
              setTimeout(() => {
                setClosePanel(false);

                setTogglePannel(false);
              }, 800);
            }}
          />
          <img
            src={theme ? Logo : Logo2}
            alt="logo"
            loading="lazy"
            style={{ marginLeft: "5px" }}
            className="youtubeLogo"
            onClick={() => {
              window.location.href = "/";
            }}
          />
        </div>
        <div
          className={
            theme ? "main-left-section-new" : "main-left-section-new light-mode"
          }
        >
          <div className="first-section ">
            <div
              className={
                selected === "home"
                  ? `home sec-data ${theme ? "changeBG" : "changeBG-light"}`
                  : "home sec-data"
              }
              onClick={() => {
                localStorage.setItem("selected", "home");
                window.location.href = "/";
              }}
            >
              {selected === "home" ? (
                <HomeIcon
                  fontSize="medium"
                  style={{ color: theme ? "white" : "black" }}
                />
              ) : (
                <HomeOutlinedIcon
                  fontSize="medium"
                  style={{ color: theme ? "white" : "black" }}
                />
              )}
              <p>Home</p>
            </div>
            <div
              className={
                selected === "trending"
                  ? `trending sec-data ${theme ? "changeBG" : "changeBG-light"}`
                  : "trending sec-data"
              }
              onClick={() => {
                localStorage.setItem("selected", "trending");
                window.location.href = "/trending";
              }}
            >
              {selected === "trending" ? (
                <WhatshotIcon
                  fontSize="medium"
                  style={{ color: theme ? "white" : "black" }}
                />
              ) : (
                <WhatshotOutlinedIcon
                  fontSize="medium"
                  style={{ color: theme ? "white" : "black" }}
                />
              )}
              <p>Trending</p>
            </div>
            <div
              className={
                selected === "subscription"
                  ? `subscription sec-data ${
                      theme ? "changeBG" : "changeBG-light"
                    }`
                  : "subscription sec-data"
              }
              onClick={() => {
                if (user?.email) {
                  localStorage.setItem("selected", "subscription");
                  window.location.href = "/subscriptions";
                } else {
                  setisbtnClicked(true);
                  document.body.classList.add("bg-css");
                }
              }}
            >
              {selected === "subscription" ? (
                <SubscriptionsIcon
                  fontSize="medium"
                  style={{ color: theme ? "white" : "black" }}
                />
              ) : (
                <SubscriptionsOutlinedIcon
                  fontSize="medium"
                  style={{ color: theme ? "white" : "black" }}
                />
              )}
              <p>Subscriptions</p>
            </div>
            <div
              className="subscribed-channels"
              style={
                Subscriptions && Subscriptions.length > 0
                  ? { display: "block" }
                  : { display: "none" }
              }
            >
              {Subscriptions &&
                Subscriptions.length > 0 &&
                Subscriptions.map((element, index) => {
                  return (
                    <>
                      <SkeletonTheme
                        baseColor={theme ? "#353535" : "#aaaaaa"}
                        highlightColor={theme ? "#444" : "#b6b6b6"}
                      >
                        <div
                          className="mysubscriptions"
                          key={index}
                          style={
                            loading === true
                              ? { visibility: "visible" }
                              : { display: "none" }
                          }
                        >
                          <Skeleton
                            count={1}
                            width={40}
                            height={40}
                            style={{ borderRadius: "100%" }}
                          />
                          <Skeleton
                            count={1}
                            width={122}
                            height={20}
                            style={{
                              position: "relative",
                              left: "10px",
                              top: "5px",
                            }}
                          />
                        </div>
                      </SkeletonTheme>
                      <div
                        className="mysubscriptions"
                        key={index}
                        onClick={() => {
                          window.location.href = `/channel/${element.channelID}`;
                        }}
                        style={
                          loading === false
                            ? { display: "flex" }
                            : { display: "none" }
                        }
                      >
                        <img
                          src={element.channelProfile}
                          alt="channel profile"
                          className="channel-profilee"
                        />
                        <Tooltip
                          TransitionComponent={Zoom}
                          title={`${element.channelname}`}
                          placement="right"
                        >
                          <p className="sub-channelnamee">
                            {element.channelname.length <= 7
                              ? element.channelname
                              : `${element.channelname.slice(0, 7)}..`}
                          </p>
                        </Tooltip>
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
          <hr className={theme ? "seperate" : "seperate-light"} />
          <div className="second-section">
            <div
              className={
                selected === "library"
                  ? `library sec-data ${theme ? "changeBG" : "changeBG-light"}`
                  : "library sec-data"
              }
              onClick={() => {
                if (user?.email) {
                  localStorage.setItem("selected", "library");
                  window.location.href = "/library";
                } else {
                  setisbtnClicked(true);
                  document.body.classList.add("bg-css");
                }
              }}
            >
              {selected === "library" ? (
                <VideoLibraryIcon
                  fontSize="medium"
                  style={{ color: theme ? "white" : "black" }}
                />
              ) : (
                <VideoLibraryOutlinedIcon
                  fontSize="medium"
                  style={{ color: theme ? "white" : "black" }}
                />
              )}
              <p>Library</p>
            </div>

            <div
              className={
                selected === "watch-later"
                  ? `watch-later sec-data ${
                      theme ? "changeBG" : "changeBG-light"
                    }`
                  : "watch-later sec-data"
              }
              onClick={() => {
                if (user?.email) {
                  localStorage.setItem("selected", "watch-later");
                  window.location.href = "/watchlater";
                } else {
                  setisbtnClicked(true);
                  document.body.classList.add("bg-css");
                }
              }}
            >
              {selected === "watch-later" ? (
                <WatchLaterIcon
                  fontSize="medium"
                  style={{ color: theme ? "white" : "black" }}
                />
              ) : (
                <WatchLaterOutlinedIcon
                  fontSize="medium"
                  style={{ color: theme ? "white" : "black" }}
                />
              )}
              <p>Watch later</p>
            </div>
            <div
              className={
                selected === "liked-video"
                  ? `liked-video sec-data ${
                      theme ? "changeBG" : "changeBG-light"
                    }`
                  : "liked-video sec-data"
              }
              onClick={() => {
                if (user?.email) {
                  localStorage.setItem("selected", "liked-video");

                  window.location.href = "/likedVideos";
                } else {
                  setisbtnClicked(true);
                  document.body.classList.add("bg-css");
                }
              }}
            >
              {selected === "liked-video" ? (
                <ThumbUpIcon
                  fontSize="medium"
                  style={{ color: theme ? "white" : "black" }}
                />
              ) : (
                <ThumbUpOutlinedIcon
                  fontSize="medium"
                  style={{ color: theme ? "white" : "black" }}
                />
              )}
              <p>Liked videos</p>
            </div>
            <div className="my-playlists-sectionn">
              {PlaylistData &&
                PlaylistData !== "No playlists available..." &&
                PlaylistData.length > 0 &&
                PlaylistData.map((element, index) => {
                  return (
                    <div
                      className="my-playlist-data"
                      key={index}
                      onClick={() => {
                        window.location.href = `/playlist/${element._id}`;
                      }}
                    >
                      <PlaylistPlayOutlinedIcon
                        fontSize="medium"
                        style={{ color: theme ? "white" : "black" }}
                      />
                      <Tooltip
                        TransitionComponent={Zoom}
                        title={`${element.playlist_name}`}
                        placement="right"
                      >
                        <p>
                          {element.playlist_name.length <= 8
                            ? element.playlist_name
                            : `${element.playlist_name.slice(0, 8)}..`}
                        </p>
                      </Tooltip>
                    </div>
                  );
                })}
              {savedPlaylist &&
                savedPlaylist.length > 0 &&
                savedPlaylist.map((element, index) => {
                  return (
                    <div
                      className="my-playlist-data"
                      key={index}
                      onClick={() => {
                        window.location.href = `/playlist/${element._id}`;
                      }}
                    >
                      <PlaylistPlayOutlinedIcon
                        fontSize="medium"
                        style={{ color: theme ? "white" : "black" }}
                      />
                      <Tooltip
                        TransitionComponent={Zoom}
                        title={`${element.playlist_name}`}
                        placement="right"
                      >
                        <p>
                          {element.playlist_name.length <= 8
                            ? element.playlist_name
                            : `${element.playlist_name.slice(0, 8)}..`}
                        </p>
                      </Tooltip>
                    </div>
                  );
                })}
            </div>
            <hr className={theme ? "seperate" : "seperate-light"} />
            <Tooltip
              TransitionComponent={Zoom}
              title="Made with 💖 by Shubhojeet"
              placement="bottom"
            >
              <div className="developer">
                <CodeIcon
                  fontSize="medium"
                  style={{ color: theme ? "white" : "black" }}
                />
                <a
                  href="https://github.com/shubho0908"
                  target="_blank"
                  rel="noreferrer"
                >
                  Shubhojeet Bera 🚀
                </a>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* HORIZONTAL PANEL */}

      <div
        className={theme ? "horizontal-panel" : "horizontal-panel light-mode"}
      >
        <div className="horizontal-main-section">
          <div
            className={
              theme ? "home-hori hori" : "home-hori hori text-light-mode"
            }
            onClick={() => {
              localStorage.setItem("selected", "home");
              window.location.href = "/";
            }}
          >
            {selected === "home" ? (
              <GoHomeFill
                fontSize="28px"
                color={theme ? "white" : "black"}
                className="hor-icons"
              />
            ) : (
              <GoHome
                fontSize="28px"
                color={theme ? "white" : "black"}
                className="hor-icons"
              />
            )}

            <p>Home</p>
          </div>
          <div
            className={
              theme
                ? "trending-hori hori"
                : "trending-hori hori text-light-mode"
            }
            onClick={() => {
              localStorage.setItem("selected", "trending");
              window.location.href = "/trending";
            }}
          >
            {selected === "trending" ? (
              <HiMiniFire
                fontSize="28px"
                color={theme ? "white" : "black"}
                className="hor-icons"
              />
            ) : (
              <HiOutlineFire
                fontSize="28px"
                color={theme ? "white" : "black"}
                className="hor-icons"
              />
            )}
            <p>Trending</p>
          </div>
          <IoAddCircleOutline
            fontSize="50px"
            color={theme ? "white" : "black"}
            className="addvid-icon"
            onClick={() => {
              if (user?.email) {
                window.location.href = "/studio";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          />
          <div
            className={
              theme
                ? "subscriptions-hori hori"
                : "subscriptions-hori hori text-light-mode"
            }
            onClick={() => {
              if (user?.email) {
                localStorage.setItem("selected", "subscription");
                window.location.href = "/subscriptions";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            {selected === "subscription" ? (
              <MdSubscriptions
                fontSize="28px"
                color={theme ? "white" : "black"}
                className="hor-icons"
              />
            ) : (
              <MdOutlineSubscriptions
                fontSize="28px"
                color={theme ? "white" : "black"}
                className="hor-icons"
              />
            )}
            <p>Subscriptions</p>
          </div>
          <div
            className={
              theme ? "library-hori hori" : "library-hori hori text-light-mode"
            }
            onClick={() => {
              if (user?.email) {
                localStorage.setItem("selected", "library");
                window.location.href = "/library";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            {selected === "library" ? (
              <MdVideoLibrary
                fontSize="28px"
                color={theme ? "white" : "black"}
                className="hor-icons"
              />
            ) : (
              <MdOutlineVideoLibrary
                fontSize="28px"
                color={theme ? "white" : "black"}
                className="hor-icons"
              />
            )}
            <p>Library</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LeftPanel;
