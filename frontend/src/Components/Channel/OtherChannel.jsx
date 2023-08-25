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
import jwtDecode from "jwt-decode";
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

function OtherChannel() {
  const { id } = useParams();
  const [Email, setEmail] = useState();
  const [newEmail, setnewEmail] = useState();
  const [channelName, setChannelname] = useState();
  const [ChannelProfile, setChannelProfile] = useState();
  const [myVideos, setMyVideos] = useState([]);
  const [isbtnClicked, setisbtnClicked] = useState(false);
  const [isSwitch, setisSwitched] = useState(false);
  const Section = localStorage.getItem("Section") || "Home";
  const token = localStorage.getItem("userToken");
  const [isSubscribed, setIsSubscribed] = useState();
  const [Subscribers, setSubscribers] = useState();
  const [Top, setTop] = useState("155px");
  const [coverIMG, setCoverIMG] = useState("");
  const [loading, setLoading] = useState(true);

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
      theme: "dark",
    });

  //USE EFFECTS

  useEffect(() => {
    if (token) {
      setnewEmail(jwtDecode(token).email);
    }
  }, [token]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3200);
  }, []);

  useEffect(() => {
    const getUserMail = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getotherchannel/${id}`
        );
        const userEmail = await response.json();
        setEmail(userEmail);
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getUserMail, 200);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const getChannelData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getchannel/${Email}`
        );
        const data = await response.json();
        const { profile, ChannelName } = data;
        setChannelProfile(profile);
        setChannelname(ChannelName);
      } catch (error) {
        console.log(error.message);
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
        const response = await fetch(`http://localhost:3000/getcover/${Email}`);
        const coverimg = await response.json();
        setCoverIMG(coverimg);
      } catch (error) {
        console.log(error.message);
      }
    };

    getChannelCover();
  }, [Email]);

  useEffect(() => {
    const getSubscribers = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getchannelid/${Email}`
        );
        const { subscribers } = await response.json();
        setSubscribers(subscribers);
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getSubscribers, 200);

    return () => clearInterval(interval);
  }, [Email]);

  useEffect(() => {
    const getUserVideos = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getuservideos/${Email}`
        );
        const myvideos = await response.json();
        setMyVideos(myvideos);
      } catch (error) {
        console.log(error.message);
      }
    };
    getUserVideos();
  }, [Email]);

  useEffect(() => {
    if (Section === "Home" && coverIMG !== "No data") {
      setTop("31%");
    } else if (Section === "Home" && coverIMG === "No data") {
      setTop("0%");
    } else if (Section === "Videos" && coverIMG !== "No data") {
      setTop("31%");
    } else if (Section === "Videos" && coverIMG === "No data") {
      setTop("4%");
    } else if (
      (Section !== "Videos" && coverIMG === "No data") ||
      (Section !== "Home" && coverIMG === "No data")
    ) {
      setTop("4%");
    } else if (
      (Section !== "Videos" && coverIMG !== "No data") ||
      (Section !== "Home" && coverIMG !== "No data")
    ) {
      setTop("31%");
    }
  }, [Section, coverIMG]);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/checksubscription/${id}/${newEmail}`
        );
        const { existingChannelID } = await response.json();
        if (existingChannelID !== undefined) {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(checkSubscription, 200);

    return () => clearInterval(interval);
  }, [id, newEmail]);

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
        `http://localhost:3000/subscribe/${id}/${newEmail}/${Email}`,
        {
          method: "POST",
          body: JSON.stringify(channelData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      if (data === "Subscribed") {
        SubscribeNotify();
      }
    } catch (error) {
      console.log(error.message);
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
        <div className="channel-main-content" style={{ top: Top }}>
          <SkeletonTheme baseColor="#353535" highlightColor="#444">
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
                        width={250}
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
                  {newEmail === Email ? (
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
            <div className="channel-left-content">
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
                  <div className="channel-extra">
                    <p className="channeluser">@{username && username}</p>
                    <p className="my-subs">
                      {Subscribers && Subscribers} subscribers
                    </p>
                    <p className="my-videoscount">
                      {myVideos && myVideos.length} videos
                    </p>
                  </div>
                  <div
                    className="more-about"
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
                {newEmail === Email ? (
                  <div className="channel-right-content channel-dualbtns">
                    <button
                      className="customize-channel"
                      onClick={() => {
                        window.location.href = "/studio/customize";
                      }}
                    >
                      Customize channel
                    </button>
                    <button
                      className="manage-videos"
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
                        color="white"
                        className="channel-settings"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="channel-right-content">
                    <button
                      className="subscribethis-channel"
                      style={
                        isSubscribed === true
                          ? { display: "none" }
                          : { display: "block" }
                      }
                      onClick={() => {
                        if (token) {
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
                      className="subscribethis-channel2"
                      style={
                        isSubscribed === true
                          ? { display: "block" }
                          : { display: "none" }
                      }
                      onClick={() => {
                        if (token) {
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
                  className="channel-home1"
                  onClick={() => {
                    localStorage.setItem("Section", "Home");
                    window.location.reload();
                  }}
                >
                  HOME
                </p>
              ) : (
                <p
                  className="channel-home"
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
                  className="channel-videos1"
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
                  className="channel-videos"
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
                  className="channel-playlists1"
                  onClick={() => {
                    localStorage.setItem("Section", "Playlists");
                    window.location.reload();
                  }}
                >
                  PLAYLISTS
                </p>
              ) : (
                <p
                  className="channel-playlists"
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
                  className="channel-subscriptions1"
                  onClick={() => {
                    localStorage.setItem("Section", "Subscriptions");
                    window.location.reload();
                  }}
                >
                  CHANNELS
                </p>
              ) : (
                <p
                  className="channel-subscriptions"
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
                  className="channel-about1"
                  onClick={() => {
                    localStorage.setItem("Section", "About");
                    window.location.reload();
                  }}
                >
                  ABOUT
                </p>
              ) : (
                <p
                  className="channel-about"
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
          <hr className="seperate seperate-new" />
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
            <span className="loader2"></span>
          </div>
        </div>
      )}

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
    </>
  );
}

export default OtherChannel;
