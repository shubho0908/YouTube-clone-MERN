import "../Css/leftpanel.css";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import PlaylistPlayOutlinedIcon from "@mui/icons-material/PlaylistPlayOutlined";
import jwtDecode from "jwt-decode";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { useEffect, useState } from "react";
import Logo from "../img/logo1.png";
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
import { IoAddCircleOutline } from "react-icons/io5";
import { MdOutlineSubscriptions } from "react-icons/md";
import { MdOutlineVideoLibrary } from "react-icons/md";

function LeftPanel() {
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const [Email, setEmail] = useState();
  const location = useLocation();
  const [Subscriptions, setSubscriptions] = useState([]);
  const [PlaylistData, setPlaylistData] = useState([]);
  const [isbtnClicked, setisbtnClicked] = useState(false);
  const token = localStorage.getItem("userToken");
  const [isSwitch, setisSwitched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savedPlaylist, setSavedPlaylist] = useState([]);
  const [togglepanel, setTogglePannel] = useState(false);
  const [closePanel, setClosePanel] = useState(false);

  useEffect(() => {
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

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
    menuButton.addEventListener("click", handleMenuButtonClick);

    return () => {
      menuButton.removeEventListener("click", handleMenuButtonClick);
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
        if (Email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getsubscriptions/${Email}`
          );
          const result = await response.json();
          setSubscriptions(result);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const interval = setInterval(getSubscriptions, 100);

    return () => clearInterval(interval);
  }, [Email]);

  useEffect(() => {
    const getPlaylistData = async () => {
      try {
        if (Email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getplaylistdata/${Email}`
          );
          const playlistData = await response.json();
          setPlaylistData(playlistData);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const interval = setInterval(getPlaylistData, 100);

    return () => clearInterval(interval);
  }, [Email]);

  useEffect(() => {
    const GetSavedPlaylist = async () => {
      try {
        if (Email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getsavedplaylist/${Email}`
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
  }, [Email]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  return (
    <>
      <div
        className="main-left-section"
        style={
          menuClicked === false ? { display: "none" } : { display: "block" }
        }
      >
        <div className="first-section ">
          <div
            className={
              selected === "home" ? "home sec-data changeBG" : "home sec-data"
            }
            onClick={() => {
              localStorage.setItem("selected", "home");
              window.location.href = "/";
            }}
          >
            <HomeIcon fontSize="medium" style={{ color: "white" }} />
            <p>Home</p>
          </div>
          <div
            className={
              selected === "trending"
                ? "trending sec-data changeBG"
                : "trending sec-data"
            }
            onClick={() => {
              localStorage.setItem("selected", "trending");
              window.location.href = "/trending";
            }}
          >
            <WhatshotOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>Trending</p>
          </div>
          <div
            className={
              selected === "subscription"
                ? "subscription sec-data changeBG"
                : "subscription sec-data"
            }
            onClick={() => {
              if (token) {
                localStorage.setItem("selected", "subscription");
                window.location.href = "/subscriptions";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            <SubscriptionsOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
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
                    <SkeletonTheme baseColor="#353535" highlightColor="#444">
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
        <hr className="seperate" />
        <div className="second-section">
          <div
            className={
              selected === "library"
                ? "library sec-data changeBG"
                : "library sec-data"
            }
            onClick={() => {
              if (token) {
                localStorage.setItem("selected", "library");
                window.location.href = "/library";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            <VideoLibraryOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>Library</p>
          </div>

          <div
            className={
              selected === "watch-later"
                ? "watch-later sec-data changeBG"
                : "watch-later sec-data"
            }
            onClick={() => {
              if (token) {
                localStorage.setItem("selected", "watch-later");
                window.location.href = "/watchlater";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            <WatchLaterOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>Watch later</p>
          </div>
          <div
            className={
              selected === "liked-video"
                ? "liked-video sec-data changeBG"
                : "liked-video sec-data"
            }
            onClick={() => {
              if (token) {
                localStorage.setItem("selected", "liked-video");

                window.location.href = "/likedVideos";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            <ThumbUpOutlinedIcon fontSize="medium" style={{ color: "white" }} />
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
                      style={{ color: "white" }}
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
                      style={{ color: "white" }}
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
          <hr className="seperate" />
          <Tooltip
            TransitionComponent={Zoom}
            title="Made with 💖 by Shubhojeet"
            placement="bottom"
          >
            <div className="developer">
              <CodeIcon fontSize="medium" style={{ color: "white" }} />
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
        className="main-left-section main-2"
        style={
          menuClicked === false ? { display: "flex" } : { display: "none" }
        }
      >
        <div className="first-section ">
          <div
            className={
              selected === "home"
                ? "home sec-data sec-data2 changeBG"
                : "home sec-data sec-data2"
            }
            onClick={() => {
              localStorage.setItem("selected", "home");

              window.location.href = "/";
            }}
          >
            <HomeIcon fontSize="medium" style={{ color: "white" }} />
          </div>
          <div
            className={
              selected === "trending"
                ? "trending trending2 sec-data sec-data2 changeBG"
                : "trending trending2 sec-data sec-data2"
            }
            onClick={() => {
              localStorage.setItem("selected", "trending");

              window.location.href = "/trending";
            }}
          >
            <WhatshotOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
          </div>
          <div
            className={
              selected === "subscription"
                ? "subscription subscription2 sec-data sec-data2 changeBG"
                : "subscription subscription2 sec-data sec-data2"
            }
            onClick={() => {
              if (token) {
                localStorage.setItem("selected", "subscription");
                window.location.href = "/subscriptions";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            <SubscriptionsOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
          </div>
        </div>
        {/* <hr className="seperate" /> */}
        <div className="second-section">
          <div
            className="library library2 sec-data sec-data2"
            onClick={() => {
              if (token) {
                localStorage.setItem("selected", "library");
                window.location.href = "/library";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            <VideoLibraryOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
          </div>
          <div
            className={
              selected === "watch-later"
                ? "watch-later watch-later2 sec-data sec-data2 changeBG"
                : "watch-later watch-later2 sec-data sec-data2"
            }
            onClick={() => {
              if (token) {
                localStorage.setItem("selected", "watch-later");
                window.location.href = "/watchlater";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            <WatchLaterOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
          </div>
          <div
            className={
              selected === "liked-video"
                ? "liked-video liked-video2 sec-data sec-data2 changeBG"
                : "liked-video liked-video2 sec-data sec-data2"
            }
            onClick={() => {
              if (token) {
                localStorage.setItem("selected", "liked-video");

                window.location.href = "/likedVideos";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            <ThumbUpOutlinedIcon fontSize="medium" style={{ color: "white" }} />
          </div>
        </div>
      </div>

      {/* SHORT HAND - 2 */}
      <div
        className="main-left-section main-2 main-3"
        style={{ display: "none" }}
      >
        <div className="first-section ">
          <div
            className={
              selected === "home"
                ? "home sec-data sec-data2 changeBG"
                : "home sec-data sec-data2"
            }
            onClick={() => {
              localStorage.setItem("selected", "home");

              window.location.href = "/";
            }}
          >
            <HomeIcon fontSize="medium" style={{ color: "white" }} />
          </div>
          <div
            className={
              selected === "trending"
                ? "trending trending2 sec-data sec-data2 changeBG"
                : "trending trending2 sec-data sec-data2"
            }
            onClick={() => {
              localStorage.setItem("selected", "trending");

              window.location.href = "/trending";
            }}
          >
            <WhatshotOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
          </div>
          <div
            className={
              selected === "subscription"
                ? "subscription subscription2 sec-data sec-data2 changeBG"
                : "subscription subscription2 sec-data sec-data2"
            }
            onClick={() => {
              if (token) {
                localStorage.setItem("selected", "subscription");
                window.location.href = "/subscriptions";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            <SubscriptionsOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
          </div>
        </div>
        {/* <hr className="seperate" /> */}
        <div className="second-section">
          <div
            className="library library2 sec-data sec-data2"
            onClick={() => {
              if (token) {
                localStorage.setItem("selected", "library");
                window.location.href = "/library";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            <VideoLibraryOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
          </div>
          <div
            className={
              selected === "watch-later"
                ? "watch-later watch-later2 sec-data sec-data2 changeBG"
                : "watch-later watch-later2 sec-data sec-data2"
            }
            onClick={() => {
              if (token) {
                localStorage.setItem("selected", "watch-later");
                window.location.href = "/watchlater";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            <WatchLaterOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
          </div>
          <div
            className={
              selected === "liked-video"
                ? "liked-video liked-video2 sec-data sec-data2 changeBG"
                : "liked-video liked-video2 sec-data sec-data2"
            }
            onClick={() => {
              if (token) {
                localStorage.setItem("selected", "liked-video");

                window.location.href = "/likedVideos";
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            <ThumbUpOutlinedIcon fontSize="medium" style={{ color: "white" }} />
          </div>
        </div>
      </div>

      {/* SIGNUP/SIGNIN  */}

      <div
        className="auth-popup"
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
          closePanel === true ? "secondary-panel moveout" : "secondary-panel"
        }
        style={{ display: togglepanel ? "block" : "none" }}
      >
        <div className="panel-topdata">
          <MenuRoundedIcon
            fontSize="large"
            style={{ color: "white" }}
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
            src={Logo}
            alt="logo"
            loading="lazy"
            style={{ marginLeft: "5px" }}
            className="youtubeLogo"
            onClick={() => {
              window.location.href = "/";
            }}
          />
        </div>
        <div className="main-left-section-new">
          <div className="first-section ">
            <div
              className={
                selected === "home" ? "home sec-data changeBG" : "home sec-data"
              }
              onClick={() => {
                localStorage.setItem("selected", "home");
                window.location.href = "/";
              }}
            >
              <HomeIcon fontSize="medium" style={{ color: "white" }} />
              <p>Home</p>
            </div>
            <div
              className={
                selected === "trending"
                  ? "trending sec-data changeBG"
                  : "trending sec-data"
              }
              onClick={() => {
                localStorage.setItem("selected", "trending");
                window.location.href = "/trending";
              }}
            >
              <WhatshotOutlinedIcon
                fontSize="medium"
                style={{ color: "white" }}
              />
              <p>Trending</p>
            </div>
            <div
              className={
                selected === "subscription"
                  ? "subscription sec-data changeBG"
                  : "subscription sec-data"
              }
              onClick={() => {
                if (token) {
                  localStorage.setItem("selected", "subscription");
                  window.location.href = "/subscriptions";
                } else {
                  setisbtnClicked(true);
                  document.body.classList.add("bg-css");
                }
              }}
            >
              <SubscriptionsOutlinedIcon
                fontSize="medium"
                style={{ color: "white" }}
              />
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
                      <SkeletonTheme baseColor="#353535" highlightColor="#444">
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
          <hr className="seperate" />
          <div className="second-section">
            <div
              className={
                selected === "library"
                  ? "library sec-data changeBG"
                  : "library sec-data"
              }
              onClick={() => {
                if (token) {
                  localStorage.setItem("selected", "library");
                  window.location.href = "/library";
                } else {
                  setisbtnClicked(true);
                  document.body.classList.add("bg-css");
                }
              }}
            >
              <VideoLibraryOutlinedIcon
                fontSize="medium"
                style={{ color: "white" }}
              />
              <p>Library</p>
            </div>

            <div
              className={
                selected === "watch-later"
                  ? "watch-later sec-data changeBG"
                  : "watch-later sec-data"
              }
              onClick={() => {
                if (token) {
                  localStorage.setItem("selected", "watch-later");
                  window.location.href = "/watchlater";
                } else {
                  setisbtnClicked(true);
                  document.body.classList.add("bg-css");
                }
              }}
            >
              <WatchLaterOutlinedIcon
                fontSize="medium"
                style={{ color: "white" }}
              />
              <p>Watch later</p>
            </div>
            <div
              className={
                selected === "liked-video"
                  ? "liked-video sec-data changeBG"
                  : "liked-video sec-data"
              }
              onClick={() => {
                if (token) {
                  localStorage.setItem("selected", "liked-video");

                  window.location.href = "/likedVideos";
                } else {
                  setisbtnClicked(true);
                  document.body.classList.add("bg-css");
                }
              }}
            >
              <ThumbUpOutlinedIcon
                fontSize="medium"
                style={{ color: "white" }}
              />
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
                        style={{ color: "white" }}
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
                        style={{ color: "white" }}
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
            <hr className="seperate" />
            <Tooltip
              TransitionComponent={Zoom}
              title="Made with 💖 by Shubhojeet"
              placement="bottom"
            >
              <div className="developer">
                <CodeIcon fontSize="medium" style={{ color: "white" }} />
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

      <div className="horizontal-panel">
        <div className="horizontal-main-section">
          <div className="home-hori hori">
            {selected === "home" ? (
              <GoHomeFill fontSize="28px" color="white" className="hor-icons" />
            ) : (
              <GoHome fontSize="28px" color="white" className="hor-icons" />
            )}

            <p>Home</p>
          </div>
          <div className="trending-hori hori">
            <HiOutlineFire
              fontSize="28px"
              color="white"
              className="hor-icons"
            />
            <p>Trending</p>
          </div>
          <IoAddCircleOutline fontSize="50px" color="white" />
          <div className="subscriptions-hori hori">
            <MdOutlineSubscriptions
              fontSize="28px"
              color="white"
              className="hor-icons"
            />
            <p>Subscriptions</p>
          </div>
          <div className="library-hori hori">
            <MdOutlineVideoLibrary
              fontSize="28px"
              color="white"
              className="hor-icons"
            />
            <p>Library</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LeftPanel;
