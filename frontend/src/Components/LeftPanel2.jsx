import { useEffect, useState } from "react";
import "../Css/leftpanel2.css";
import jwtDecode from "jwt-decode";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import { useLocation } from "react-router-dom";
import avatar from "../img/avatar.png";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { CiShare1 } from "react-icons/ci";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

function LeftPanel2() {
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("userToken");
  const [profileIMG, setProfileIMG] = useState();
  const [channel, setChannel] = useState("");
  const [channelId, setChannelId] = useState();
  const [studioMenuClicked, setstudioMenuClicked] = useState(() => {
    const menu = localStorage.getItem("studioMenuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const StudioSection = localStorage.getItem("Studio-Section");
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleMenuButtonClick = () => {
      setstudioMenuClicked((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".menu2");
    menuButton.addEventListener("click", handleMenuButtonClick);

    return () => {
      menuButton.removeEventListener("click", handleMenuButtonClick);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "studioMenuClicked",
      JSON.stringify(studioMenuClicked)
    );
  }, [studioMenuClicked]);

  useEffect(() => {
    const currentUrl = location.pathname;
    let selected = "";

    if (currentUrl === "/studio") {
      selected = "Dashboard";
    } else if (currentUrl === "/studio/customize") {
      selected = "Customization";
    } else if (currentUrl === "/studio/video") {
      selected = "Content";
    } else if (currentUrl === "/studio/comments") {
      selected = "Comments";
    }
    // } else if (currentUrl === "/watchlater") {
    //   selected = "watch-later";
    // } else if (currentUrl === "/subscriptions") {
    //   selected = "subscription";
    // } else if (currentUrl === "/likedVideos") {
    //   selected = "liked-video";
    // } else {
    //   selected = "other";
    // }

    localStorage.setItem("Studio-Section", selected);
  }, [location]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2800);
  }, []);

  useEffect(() => {
    setEmail(jwtDecode(token).email);
  }, [token]);

  useEffect(() => {
    const getData = async () => {
      try {
        if (email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getchannel/${email}`
          );
          const { profile, ChannelName } = await response.json();
          setProfileIMG(profile);
          setChannel(ChannelName);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getData, 100);

    return () => {
      clearInterval(interval);
    };
  }, [email]);

  useEffect(() => {
    const getChannelId = async () => {
      try {
        if (email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getchannelid/${email}`
          );
          const { channelID } = await response.json();
          setChannelId(channelID);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getChannelId, 100);

    return () => {
      clearInterval(interval);
    };
  }, [email]);

  return (
    <>
      <div
        className="main-section2"
        style={
          studioMenuClicked === true
            ? { display: "none" }
            : { display: "flex", width: "270px" }
        }
      >
        <SkeletonTheme baseColor="#353535" highlightColor="#444">
          <div
            className="first-panel"
            style={
              loading === true ? { display: "block" } : { display: "none" }
            }
          >
            <Skeleton
              count={1}
              width={110}
              height={110}
              style={{ borderRadius: "100%" }}
            />
            <div className="about-channel">
              <p className="your-channel">Your Channel</p>
              <Skeleton
                count={1}
                width={150}
                height={20}
                style={{ borderRadius: "4px" }}
              />
            </div>
          </div>
        </SkeletonTheme>
        <div
          className="first-panel"
          style={
            loading === false
              ? { visibility: "visible", display: "block" }
              : { visibility: "hidden", display: "none" }
          }
        >
          <Tooltip
            TransitionComponent={Zoom}
            title="View channel on YouTube"
            placement="top"
          >
            <img
              src={profileIMG ? profileIMG : avatar}
              alt=""
              className="profile_img"
              onClick={() => {
                if (channelId !== undefined) {
                  window.location.href = `/channel/${channelId}`;
                }
              }}
            />
          </Tooltip>
          <CiShare1 className="view-channel2" fontSize="25px" />
          <div className="about-channel">
            <p className="your-channel">Your Channel</p>
            <p className="c-name">{channel}</p>
          </div>
        </div>
        <div className="second-panel">
          <div
            className={
              StudioSection === "Dashboard"
                ? "studio-active panel"
                : "dashboard panel"
            }
            onClick={() => {
              localStorage.setItem("Studio-Section", "Dashboard");
              window.location.href = "/studio";
            }}
          >
            <DashboardIcon
              className={
                StudioSection === "Dashboard" ? "studio-icon2" : "studio-icon"
              }
              fontSize="medium"
              style={{ color: "#A9A9A9", paddingLeft: "25px !important" }}
            />
            <p>Dashboard</p>
          </div>
          <div
            className={
              StudioSection === "Content"
                ? "studio-active panel"
                : "content panel"
            }
            onClick={() => {
              localStorage.setItem("Studio-Section", "Content");
              window.location.href = "/studio/video";
            }}
          >
            <VideoLibraryOutlinedIcon
              className={
                StudioSection === "Content" ? "studio-icon2" : "studio-icon"
              }
              fontSize="medium"
              style={{ color: "#A9A9A9" }}
            />
            <p>Content</p>
          </div>
          <div
            className={
              StudioSection === "Comments"
                ? "studio-active panel"
                : "comments panel"
            }
            onClick={() => {
              localStorage.setItem("Studio-Section", "Comments");
              window.location.href = "/studio/comments";
            }}
          >
            <ChatOutlinedIcon
              className={
                StudioSection === "Comments" ? "studio-icon2" : "studio-icon"
              }
              fontSize="medium"
              style={{ color: "#A9A9A9" }}
            />
            <p>Comments</p>
          </div>
          <div
            className={
              StudioSection === "Customization"
                ? "studio-active panel"
                : "customization panel"
            }
            onClick={() => {
              localStorage.setItem("Studio-Section", "Customization");
              window.location.href = "/studio/customize";
            }}
          >
            <AutoFixHighOutlinedIcon
              className={
                StudioSection === "Customization"
                  ? "studio-icon2"
                  : "studio-icon"
              }
              fontSize="medium"
              style={{ color: "#A9A9A9" }}
            />
            <p>Customization</p>
          </div>
        </div>
      </div>

      {/* SHORT HAND  */}

      <div
        className="main-section2"
        style={
          studioMenuClicked === false
            ? { display: "none" }
            : { display: "flex", width: "90px" }
        }
      >
        <SkeletonTheme baseColor="#353535" highlightColor="#444">
          <div
            className="first-panel"
            style={
              loading === true ? { display: "block" } : { display: "none" }
            }
          >
            <Skeleton
              count={1}
              width={50}
              height={50}
              style={{ borderRadius: "100%" }}
            />
          </div>
        </SkeletonTheme>
        <div
          className="first-panel"
          style={
            loading === false
              ? { visibility: "visible", display: "block" }
              : { visibility: "hidden", display: "none" }
          }
        >
          <Tooltip
            TransitionComponent={Zoom}
            title="View channel on YouTube"
            placement="top"
          >
            <img
              src={profileIMG ? profileIMG : avatar}
              alt=""
              className="profile_img"
              style={{ width: "50px", height: "50px" }}
              onClick={() => {
                if (channelId !== undefined) {
                  window.location.href = `/channel/${channelId}`;
                }
              }}
            />
          </Tooltip>
          <CiShare1 className="view-channel3" fontSize="20px" />
        </div>
        <div className="second-panel">
          <div
            className={
              StudioSection === "Dashboard"
                ? "studio-active panel"
                : "dashboard panel"
            }
            onClick={() => {
              localStorage.setItem("Studio-Section", "Dashboard");
              window.location.href = "/studio";
            }}
          >
            <DashboardIcon
              className={
                StudioSection === "Dashboard" ? "studio-icon2" : "studio-icon"
              }
              fontSize="medium"
              style={{
                color: "#A9A9A9",
                paddingLeft: "25px !important",
                paddingTop: "16px",
                paddingBottom: "16px",
              }}
            />
          </div>
          <div
            className={
              StudioSection === "Content"
                ? "studio-active panel"
                : "content panel"
            }
            onClick={() => {
              localStorage.setItem("Studio-Section", "Content");
              window.location.href = "/studio/video";
            }}
          >
            <VideoLibraryOutlinedIcon
              className={
                StudioSection === "Content" ? "studio-icon2" : "studio-icon"
              }
              fontSize="medium"
              style={{
                color: "#A9A9A9",
                paddingTop: "16px",
                paddingBottom: "16px",
              }}
            />
          </div>
          <div
            className={
              StudioSection === "Comments"
                ? "studio-active panel"
                : "comments panel"
            }
            onClick={() => {
              localStorage.setItem("Studio-Section", "Comments");
              window.location.href = "/studio/comments";
            }}
          >
            <ChatOutlinedIcon
              className={
                StudioSection === "Comments" ? "studio-icon2" : "studio-icon"
              }
              fontSize="medium"
              style={{
                color: "#A9A9A9",
                paddingTop: "16px",
                paddingBottom: "16px",
              }}
            />
          </div>
          <div
            className={
              StudioSection === "Customization"
                ? "studio-active panel"
                : "customization panel"
            }
            onClick={() => {
              localStorage.setItem("Studio-Section", "Customization");
              window.location.href = "/studio/customize";
            }}
          >
            <AutoFixHighOutlinedIcon
              className={
                StudioSection === "Customization"
                  ? "studio-icon2"
                  : "studio-icon"
              }
              fontSize="medium"
              style={{
                color: "#A9A9A9",
                paddingTop: "16px",
                paddingBottom: "16px",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default LeftPanel2;
