import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import LeftPanel from "../LeftPanel";
import "../../Css/channel.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChannelHome from "./ChannelHome";
import ReactLoading from "react-loading";
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
  const [margintop, setMarginTop] = useState("155px");

  useEffect(() => {
    if (token) {
      setnewEmail(jwtDecode(token).email);
    }
  }, [token]);

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

    getSubscribers();
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
    if (Section === "Home") {
      setMarginTop("155px");
    } else if (Section === "Videos") {
      setMarginTop("135px");
    } else {
      setMarginTop("120px");
    }
  }, [Section])
  

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
      console.log(channelData);
      await response.json();
    } catch (error) {
      console.log(error.message);
    }
  };

 

  return (
    <>
      <Navbar />
      <LeftPanel />
      {ChannelProfile ? (
        <div className="channel-main-content" style={{ marginTop: margintop }}>
          <div className="channel-top-content">
            <div className="channel-left-content">
              <img
                src={ChannelProfile}
                alt="channelDP"
                className="channel_profile"
                loading="lazy"
              />
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
            </div>
            {newEmail === Email ? (
              <div className="channel-right-content">
                <button className="customize-channel">Customize channel</button>
                <button className="manage-videos">Manage videos</button>
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
          {Section === "Home" ? <ChannelHome newmail={Email} /> : ""}
          {Section === "Videos" ? <ChannelVideos newmail={Email} /> : ""}
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
          <div className="spin2" style={{ height: "auto" }}>
            <ReactLoading
              type={"spin"}
              color={"white"}
              height={50}
              width={50}
            />
            <p style={{ marginTop: "15px" }}>
              Fetching the data, Hang tight...{" "}
            </p>
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
