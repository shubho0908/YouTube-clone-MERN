import { useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import LeftPanel from "../LeftPanel";
import "../../Css/channel.css";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { useNavigate } from "react-router-dom";

function ChannelTop() {
  const { id } = useParams();
  const [Email, setEmail] = useState();
  const [channelName, setChannelname] = useState();
  const [ChannelProfile, setChannelProfile] = useState();
  const [myVideos, setMyVideos] = useState([]);
  const token = localStorage.getItem("userToken");

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

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

  const getUsername = (email) => {
    return email.split("@")[0];
  };

  const username = Email && getUsername(Email);

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

  const updateViews = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/updateview/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error.message);
    }
  };

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
            />
            <div className="channel-left">
              <p className="channelname">{channelName}</p>
              <div className="channel-extra">
                <p className="channeluser">@{username}</p>
                <p className="my-subs">100 subscribers</p>
                <p className="my-videoscount">5 videos</p>
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
          <div className="channel-right-content">
            <button className="customize-channel">Customize channel</button>
            <button className="manage-videos">Manage videos</button>
          </div>
        </div>
        <div className="channel-mid-content">
          <div className="different-sections">
            <p className="channel-home">HOME</p>
            <p className="channel-videos">VIDEOS</p>
            <p className="channel-playlists">PLAYLISTS</p>
            <p className="channel-subscriptions">CHANNELS</p>
            <p className="channel-about">ABOUT</p>
          </div>
        </div>
        <br />
        <hr className="seperate seperate-new" />
        <div className="myvideos-section">
          {myVideos &&
            myVideos.map((element, index) => {
              return (
                <div
                  className="user-video"
                  key={index}
                  onClick={() => {
                    navigate(`/video/${element._id}`);
                    window.location.reload();
                    if (token) {
                      updateViews(element._id);
                    }
                  }}
                >
                  <img
                    src={element.thumbnailURL}
                    alt="user-videos"
                    className="myvideos-thumbnail"
                  />
                  <div className="video-metadata">
                    <p className="myvideo-title">{element.Title}</p>
                    <div className="video-oneliner-data">
                      <p className="mychannelname">{element.uploader}</p>
                      <Tooltip
                        TransitionComponent={Zoom}
                        title="Verified"
                        placement="right"
                      >
                        <CheckCircleIcon
                          fontSize="100px"
                          style={{
                            color: "rgb(138, 138, 138)",
                            marginLeft: "6px",
                          }}
                        />
                      </Tooltip>
                      <div className="view-time2">
                        <p className="myviews">
                          {element.views >= 1e9
                            ? `${(element.views / 1e9).toFixed(1)}B`
                            : element.views >= 1e6
                            ? `${(element.views / 1e6).toFixed(1)}M`
                            : element.views >= 1e3
                            ? `${(element.views / 1e3).toFixed(1)}K`
                            : element.views}{" "}
                          views
                        </p>
                        <p className="video_published-date">
                          &#x2022;{" "}
                          {(() => {
                            const timeDifference =
                              new Date() - new Date(element.uploaded_date);
                            const minutes = Math.floor(timeDifference / 60000);
                            const hours = Math.floor(timeDifference / 3600000);
                            const days = Math.floor(timeDifference / 86400000);
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
                    <p className="myvideo-description">
                      {element.Description.length <= 250
                        ? element.Description
                        : `${element.Description.slice(0, 250)}...`}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default ChannelTop;
