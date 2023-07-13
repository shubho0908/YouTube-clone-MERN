import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import LeftPanel from "../LeftPanel";
import "../../Css/channel.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ChannelHome from "./ChannelHome";
import ReactLoading from "react-loading";
import ChannelVideos from "./ChannelVideos";
import jwtDecode from "jwt-decode";
import ChannelAbout from "./ChannelAbout";

function OtherChannel() {
  const { id } = useParams();
  const [Email, setEmail] = useState();
  const [newEmail, setnewEmail] = useState();
  const [channelName, setChannelname] = useState();
  const [ChannelProfile, setChannelProfile] = useState();
  const [myVideos, setMyVideos] = useState([]);
  const Section = localStorage.getItem("Section") || "Home";
  const token = localStorage.getItem("userToken");
  const [isSubscribed, setIsSubscribed] = useState();
  const [Subscribers, setSubscribers] = useState();

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

    const interval = setInterval(getChannelData, 200);

    return () => clearInterval(interval);
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

    const interval = setInterval(getUserVideos, 200);

    return () => clearInterval(interval);
  }, [Email]);

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

  if (!ChannelProfile) {
    return (
      <div className="spinner" style={{ height: "100vh" }}>
        <ReactLoading type={"spin"} color={"white"} height={50} width={50} />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <LeftPanel />
      <div className="channel-main-content">
        <div className="channel-top-content">
          <div className="channel-left-content">
            <img
              src={ChannelProfile}
              alt="channelDP"
              className="channel_profile"
              loading="lazy"
            />
            <div className="channel-left">
              <p className="channelname">{channelName && channelName}</p>
              <div className="channel-extra">
                <p className="channeluser">@{username && username}</p>
                <p className="my-subs">
                  {Subscribers && Subscribers} subscribers
                </p>
                <p className="my-videoscount">
                  {myVideos && myVideos.length} videos
                </p>
              </div>
              <div className="more-about">
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
        {Section === "About" ? (
          <ChannelAbout newmail={Email} channelid={id} />
        ) : (
          ""
        )}
      </div>
    </>
  );
}

export default OtherChannel;
