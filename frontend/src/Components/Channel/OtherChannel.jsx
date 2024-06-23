import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import LeftPanel from "../LeftPanel";
import "../../Css/channel.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChannelHome from "./ChannelHome";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ChannelVideos from "./ChannelVideos";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import Tooltip from "@mui/material/Tooltip";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Zoom from "@mui/material/Zoom";
import Signup from "../Signup";
import Signin from "../Signin";
import ChannelAbout from "./ChannelAbout";
import ChannelPlaylists from "./ChannelPlaylists";
import FeaturedChannels from "./FeaturedChannels";
import { RiUserSettingsLine } from "react-icons/ri";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
function OtherChannel() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000";
  const { id } = useParams();
  const [Email, setEmail] = useState();
  const [channelName, setChannelname] = useState();
  const [ChannelProfile, setChannelProfile] = useState();
  const [myVideos, setMyVideos] = useState([]);
  const [isbtnClicked, setisbtnClicked] = useState(false);
  const [isSwitch, setisSwitched] = useState(false);
  const Section = localStorage.getItem("Section") || "Home";
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [Subscribers, setSubscribers] = useState();
  const [Top, setTop] = useState("155px");
  const [coverIMG, setCoverIMG] = useState("");
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const User = useSelector((state) => state.user.user);
  const { user } = User;
  //TOAST FUNCTIONS

  const SubscribeNotify = () =>
    toast.success("Channel subscribed!", {
      position: "bottom-center",
      autoClose: 2000,
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
    const getUserMail = async () => {
      try {
        const response = await fetch(`${backendURL}/getotherchannel/${id}`);
        const userEmail = await response.json();
        setEmail(userEmail);
      } catch (error) {
        // console.log(error.message);
      }
    };

    getUserMail();
  }, [id]);

  useEffect(() => {
    const getChannelData = async () => {
      try {
        if (Email) {
          const response = await fetch(`${backendURL}/getchannel/${Email}`);
          const data = await response.json();
          const { userProfile, ChannelName } = data;
          setChannelProfile(userProfile);
          setChannelname(ChannelName);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    getChannelData();
  }, [Email]);

  document.title =
    channelName && channelName !== undefined
      ? `${channelName} - YouTube`
      : "YouTube";

  useEffect(() => {
    const getChannelCover = async () => {
      try {
        if (Email) {
          const response = await fetch(`${backendURL}/getcover/${Email}`);
          const coverimg = await response.json();
          setCoverIMG(coverimg);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    getChannelCover();
  }, [Email]);

  useEffect(() => {
    const getSubscribers = async () => {
      try {
        if (Email) {
          const response = await fetch(`${backendURL}/getchannelid/${Email}`);
          const { subscribers } = await response.json();
          setSubscribers(subscribers);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    getSubscribers();
  }, [Email]);

  useEffect(() => {
    const getUserVideos = async () => {
      try {
        if (Email) {
          const response = await fetch(`${backendURL}/getuservideos/${Email}`);
          const myvideos = await response.json();
          setMyVideos(myvideos);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };
    getUserVideos();
  }, [Email]);

  useEffect(() => {
    if (Section === "Home" && coverIMG !== "No data") {
      setTop("31%");
    } else if (Section === "Home" && coverIMG === "No data") {
      setTop("2%");
    } else if (Section === "Videos" && coverIMG !== "No data") {
      setTop("31%");
    } else if (Section === "Videos" && coverIMG === "No data") {
      setTop("2%");
    } else if (
      (Section !== "Videos" && coverIMG === "No data") ||
      (Section !== "Home" && coverIMG === "No data")
    ) {
      setTop("2%");
    } else if (
      (Section !== "Videos" && coverIMG !== "No data") ||
      (Section !== "Home" && coverIMG !== "No data")
    ) {
      setTop("31%");
    }
  }, [Section, coverIMG]);

  useEffect(() => {
    if (theme === false && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "white";
    } else if (theme === true && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "0f0f0f";
    }
  }, [theme]);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/checksubscription/${id}/${user?.email}`
          );
          const { message } = await response.json();
          if (message === true) {
            setIsSubscribed(true);
          } else {
            setIsSubscribed(false);
          }
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    checkSubscription();
  }, [id, user?.email]);

  const getUsername = (email) => {
    return email.split("@")[0];
  };

  const username = Email && getUsername(Email);

  //POST REQUESTS

  const SubscribeChannel = async () => {
    try {
      const channelData = {
        youtuberName: channelName,
        youtuberProfile: ChannelProfile,
        youtubeChannelID: id,
      };

      const response = await fetch(
        `${backendURL}/subscribe/${id}/${user?.email}/${Email}`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(channelData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data === "Subscribed") {
        SubscribeNotify();
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      // console.log(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <LeftPanel />
      {coverIMG !== "No data" ? (
        <div className="channel-cover">
          <img
            src={coverIMG}
            alt="Banner"
            loading="lazy"
            className="channel-cover-img"
          />
        </div>
      ) : (
        ""
      )}
      {ChannelProfile ? (
        <div
          className={
            Top === "2%"
              ? "channel-main-content-nocover"
              : "channel-main-content"
          }
          style={{ top: Top }}
        >
          <SkeletonTheme
            baseColor={theme ? "#353535" : "#aaaaaa"}
            highlightColor={theme ? "#444" : "#b6b6b6"}
          >
            <div
              className="channel-top-content"
              style={
                loading === true ? { display: "flex" } : { display: "none" }
              }
            >
              <div className="channel-left-content">
                <Skeleton
                  count={1}
                  width={130}
                  height={130}
                  style={{ borderRadius: "100%" }}
                  className="sk-channel-profile"
                />
                <div className="channel-topleft-data">
                  <div className="channel-left">
                    <div className="channel-name-verified">
                      <Skeleton
                        count={1}
                        width={200}
                        height={20}
                        style={{ borderRadius: "4px" }}
                        className="sk-channel-main-name"
                      />
                    </div>
                    <div className="channel-extra">
                      <Skeleton
                        count={1}
                        width={220}
                        height={15}
                        style={{ borderRadius: "4px" }}
                        className="sk-channel-liner"
                      />
                    </div>
                    <div className="more-about">
                      <Skeleton
                        count={1}
                        width={200}
                        height={14}
                        style={{ borderRadius: "4px" }}
                        className="sk-channel-more"
                      />
                    </div>
                  </div>
                  {user?.email === Email ? (
                    <div className="channel-right-content channel-dualbtns">
                      <Skeleton
                        count={1}
                        width={160}
                        height={38}
                        style={{ borderRadius: "20px" }}
                        className="sk-channel-customize"
                      />
                      <Skeleton
                        count={1}
                        width={160}
                        height={38}
                        style={{
                          borderRadius: "20px",
                          position: "relative",
                          left: "25px",
                        }}
                        className="sk-channel-manage"
                      />
                    </div>
                  ) : (
                    <div className="channel-right-content">
                      <Skeleton
                        count={1}
                        width={125}
                        height={38}
                        style={{ borderRadius: "20px" }}
                        className="sk-channel-subscribe"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </SkeletonTheme>
          <div
            className="channel-top-content"
            style={
              loading === true
                ? { visibility: "hidden", display: "none" }
                : { visibility: "visible", display: "flex" }
            }
          >
            <div
              className={
                theme
                  ? "channel-left-content"
                  : "channel-left-content text-light-mode"
              }
            >
              <img
                src={ChannelProfile}
                alt="channelDP"
                className="channel_profile"
              />
              <div className="channel-topleft-data">
                <div className="channel-left">
                  <div className="channel-name-verified">
                    <p className="channelname">{channelName && channelName}</p>
                    <Tooltip
                      TransitionComponent={Zoom}
                      title="Verified"
                      placement="right"
                    >
                      <CheckCircleIcon
                        fontSize="small"
                        style={{
                          color: "rgb(138, 138, 138)",
                          marginLeft: "6px",
                        }}
                      />
                    </Tooltip>
                  </div>
                  <div
                    className={
                      theme ? "channel-extra" : "channel-extra text-light-mode2"
                    }
                  >
                    <p className="channeluser">@{username && username}</p>
                    <p className="my-subs">
                      {Subscribers && Subscribers} subscribers
                    </p>
                    {myVideos && myVideos.message !== "USER DOESN'T EXIST" ? (
                      <p className="my-videoscount">
                        {myVideos && myVideos.length} videos
                      </p>
                    ) : (
                      <p className="my-videoscount">0 videos</p>
                    )}
                  </div>
                  <div
                    className={
                      theme ? "more-about" : "more-about text-light-mode2"
                    }
                    onClick={() => {
                      localStorage.setItem("Section", "About");
                      window.location.reload();
                    }}
                  >
                    <p className="more-text">More about this channel</p>
                    <ArrowForwardIosIcon
                      fontSize="15px"
                      style={{ color: "#aaa", marginLeft: "7px" }}
                    />
                  </div>
                </div>
                {user?.email === Email ? (
                  <div className="channel-right-content channel-dualbtns">
                    <button
                      className={
                        theme
                          ? "customize-channel"
                          : "customize-channel btn-light-mode"
                      }
                      onClick={() => {
                        window.location.href = "/studio/customize";
                      }}
                    >
                      Customize channel
                    </button>
                    <button
                      className={
                        theme ? "manage-videos" : "manage-videos btn-light-mode"
                      }
                      onClick={() => {
                        window.location.href = "/studio/video";
                      }}
                    >
                      Manage videos
                    </button>
                    <div
                      className="setting-btn"
                      onClick={() => {
                        window.location.href = "/studio/video";
                      }}
                    >
                      <RiUserSettingsLine
                        fontSize="28px"
                        color={theme ? "white" : "black"}
                        className={
                          theme
                            ? "channel-settings"
                            : "channel-settings channel-settings-light"
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="channel-right-content">
                    <button
                      className={
                        theme
                          ? "subscribethis-channel"
                          : "subscribethis-channel-light text-dark-mode"
                      }
                      style={
                        isSubscribed === true
                          ? { display: "none" }
                          : { display: "block" }
                      }
                      onClick={() => {
                        if (user?.email) {
                          SubscribeChannel();
                        } else {
                          setisbtnClicked(true);
                          document.body.classList.add("bg-css");
                        }
                      }}
                    >
                      Subscribe
                    </button>
                    <button
                      className={
                        theme
                          ? "subscribethis-channel2"
                          : "subscribethis-channel2-light"
                      }
                      style={
                        isSubscribed === true
                          ? { display: "block" }
                          : { display: "none" }
                      }
                      onClick={() => {
                        if (user?.email) {
                          SubscribeChannel();
                        } else {
                          setisbtnClicked(true);
                          document.body.classList.add("bg-css");
                        }
                      }}
                    >
                      Subscribed
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="channel-mid-content">
            <div className="different-sections">
              {Section === "Home" ? (
                <p
                  className={theme ? "channel-home1" : "channel-home2"}
                  onClick={() => {
                    localStorage.setItem("Section", "Home");
                    window.location.reload();
                  }}
                >
                  HOME
                </p>
              ) : (
                <p
                  className={
                    theme ? "channel-home" : "channel-home text-light-mode2"
                  }
                  onClick={() => {
                    localStorage.setItem("Section", "Home");
                    window.location.reload();
                  }}
                >
                  HOME
                </p>
              )}
              {Section === "Videos" ? (
                <p
                  className={theme ? "channel-videos1" : "channel-videos2"}
                  style={
                    myVideos && myVideos.message === "USER DOESN'T EXIST"
                      ? { display: "none" }
                      : { display: "block" }
                  }
                  onClick={() => {
                    localStorage.setItem("Section", "Videos");
                    window.location.reload();
                  }}
                >
                  VIDEOS
                </p>
              ) : (
                <p
                  className={
                    theme ? "channel-videos" : "channel-videos text-light-mode2"
                  }
                  style={
                    myVideos && myVideos.message === "USER DOESN'T EXIST"
                      ? { display: "none" }
                      : { display: "block" }
                  }
                  onClick={() => {
                    localStorage.setItem("Section", "Videos");
                    window.location.reload();
                  }}
                >
                  VIDEOS
                </p>
              )}
              {Section === "Playlists" ? (
                <p
                  className={
                    theme ? "channel-playlists1" : "channel-playlists2"
                  }
                  onClick={() => {
                    localStorage.setItem("Section", "Playlists");
                    window.location.reload();
                  }}
                >
                  PLAYLISTS
                </p>
              ) : (
                <p
                  className={
                    theme
                      ? "channel-playlists"
                      : "channel-playlists text-light-mode2"
                  }
                  onClick={() => {
                    localStorage.setItem("Section", "Playlists");
                    window.location.reload();
                  }}
                >
                  PLAYLISTS
                </p>
              )}
              {Section === "Subscriptions" ? (
                <p
                  className={
                    theme ? "channel-subscriptions1" : "channel-subscriptions2"
                  }
                  onClick={() => {
                    localStorage.setItem("Section", "Subscriptions");
                    window.location.reload();
                  }}
                >
                  CHANNELS
                </p>
              ) : (
                <p
                  className={
                    theme
                      ? "channel-subscriptions"
                      : "channel-subscriptions text-light-mode2"
                  }
                  onClick={() => {
                    localStorage.setItem("Section", "Subscriptions");
                    window.location.reload();
                  }}
                >
                  CHANNELS
                </p>
              )}
              {Section === "About" ? (
                <p
                  className={theme ? "channel-about1" : "channel-about2"}
                  onClick={() => {
                    localStorage.setItem("Section", "About");
                    window.location.reload();
                  }}
                >
                  ABOUT
                </p>
              ) : (
                <p
                  className={
                    theme ? "channel-about" : "channel-about text-light-mode2"
                  }
                  onClick={() => {
                    localStorage.setItem("Section", "About");
                    window.location.reload();
                  }}
                >
                  ABOUT
                </p>
              )}
            </div>
          </div>
          <br />
          <hr
            className={
              theme
                ? "seperate seperate-new"
                : "seperate seperate-new seperate-light"
            }
          />
          {Section === "Home" || Section === "" ? (
            <ChannelHome newmail={Email} />
          ) : (
            ""
          )}
          {Section === "Videos" &&
          myVideos &&
          myVideos.message !== "USER DOESN'T EXIST" ? (
            <ChannelVideos newmail={Email} />
          ) : (
            ""
          )}
          {Section === "Playlists" ? <ChannelPlaylists newmail={Email} /> : ""}
          {Section === "Subscriptions" ? (
            <FeaturedChannels newmail={Email} />
          ) : (
            ""
          )}

          {Section === "About" ? (
            <ChannelAbout newmail={Email} channelid={id} />
          ) : (
            ""
          )}
        </div>
      ) : (
        <div className="main-trending-section">
          <div className="spin23" style={{ top: "200px" }}>
            <span className={theme ? "loader2" : "loader2-light"}></span>
          </div>
        </div>
      )}

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
    </>
  );
}

export default OtherChannel;
