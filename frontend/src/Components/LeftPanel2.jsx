import { useEffect, useState } from "react";
import "../Css/leftpanel2.css";
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
import { useSelector } from "react-redux";
// REACT ICONS

import { MdDashboard } from "react-icons/md";
import { MdOutlineVideoLibrary } from "react-icons/md";
import { BiCommentDetail } from "react-icons/bi";
import { MdOutlineAutoFixHigh } from "react-icons/md";

function LeftPanel2() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000";
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
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  const User = useSelector((state) => state.user.user);
  const { user } = User;

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
    const getData = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getchannel/${user?.email}`
          );
          const { userProfile, ChannelName } = await response.json();
          setProfileIMG(userProfile);
          setChannel(ChannelName);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    getData();
  }, [user?.email]);

  useEffect(() => {
    const getChannelId = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getchannelid/${user?.email}`
          );
          const { channelID } = await response.json();
          setChannelId(channelID);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    getChannelId();
  }, [user?.email]);

  return (
    <>
      <div
        className={
          theme
            ? "main-section2 long-left"
            : "main-section2 long-left light-mode text-light-mode"
        }
        style={
          studioMenuClicked === true
            ? { display: "none" }
            : { display: "flex", width: "270px" }
        }
      >
        <SkeletonTheme
          baseColor={theme ? "#353535" : "#aaaaaa"}
          highlightColor={theme ? "#444" : "#b6b6b6"}
        >
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
          <CiShare1 className="view-channel2" fontSize="25px" color="white" />
          <div className="about-channel">
            <p className="your-channel">Your Channel</p>
            <p className={theme ? "c-name" : "c-name text-light-mode2"}>
              {channel}
            </p>
          </div>
        </div>
        <div className="second-panel">
          <div
            className={
              StudioSection === "Dashboard"
                ? `${theme ? "studio-active" : "studio-active-light"} panel ${
                    theme ? "" : "panel-light"
                  }`
                : `dashboard panel ${theme ? "" : "panel-light"}`
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
                ? `${theme ? "studio-active" : "studio-active-light"} panel ${
                    theme ? "" : "panel-light"
                  }`
                : `content panel ${theme ? "" : "panel-light"}`
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
                ? `${theme ? "studio-active" : "studio-active-light"} panel ${
                    theme ? "" : "panel-light"
                  }`
                : `comments panel ${theme ? "" : "panel-light"}`
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
                ? `${theme ? "studio-active" : "studio-active-light"} panel ${
                    theme ? "" : "panel-light"
                  }`
                : `customization panel ${theme ? "" : "panel-light"}`
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
        className={
          theme
            ? "main-section2 short-left"
            : "main-section2 short-left light-mode text-light-mode"
        }
        style={
          studioMenuClicked === false
            ? { display: "none" }
            : { display: "flex", width: "90px" }
        }
      >
        <SkeletonTheme
          baseColor={theme ? "#353535" : "#aaaaaa"}
          highlightColor={theme ? "#444" : "#b6b6b6"}
        >
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
                ? `${theme ? "studio-active" : "studio-active-light"} panel ${
                    theme ? "" : "panel-light"
                  }`
                : `dashboard panel ${theme ? "" : "panel-light"}`
            }
            onClick={() => {
              localStorage.setItem("Studio-Section", "Dashboard");
              window.location.href = "/studio";
            }}
          >
            <Tooltip
              TransitionComponent={Zoom}
              title="Dashboard"
              placement="bottom"
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
            </Tooltip>
          </div>
          <div
            className={
              StudioSection === "Content"
                ? `${theme ? "studio-active" : "studio-active-light"} panel ${
                    theme ? "" : "panel-light"
                  }`
                : `content panel ${theme ? "" : "panel-light"}`
            }
            onClick={() => {
              localStorage.setItem("Studio-Section", "Content");
              window.location.href = "/studio/video";
            }}
          >
            <Tooltip
              TransitionComponent={Zoom}
              title="Content"
              placement="bottom"
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
            </Tooltip>
          </div>
          <div
            className={
              StudioSection === "Comments"
                ? `${theme ? "studio-active" : "studio-active-light"} panel ${
                    theme ? "" : "panel-light"
                  }`
                : `comments panel ${theme ? "" : "panel-light"}`
            }
            onClick={() => {
              localStorage.setItem("Studio-Section", "Comments");
              window.location.href = "/studio/comments";
            }}
          >
            <Tooltip
              TransitionComponent={Zoom}
              title="Comments"
              placement="bottom"
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
            </Tooltip>
          </div>
          <div
            className={
              StudioSection === "Customization"
                ? `${theme ? "studio-active" : "studio-active-light"} panel ${
                    theme ? "" : "panel-light"
                  }`
                : `customization panel ${theme ? "" : "panel-light"}`
            }
            onClick={() => {
              localStorage.setItem("Studio-Section", "Customization");
              window.location.href = "/studio/customize";
            }}
          >
            <Tooltip
              TransitionComponent={Zoom}
              title="Customization"
              placement="bottom"
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
            </Tooltip>
          </div>
        </div>
      </div>

      {/* SHORT HAND 2 */}

      <div
        className={
          theme
            ? "main-section2 short-left2"
            : "main-section2 short-left2 light-mode text-light-mode"
        }
      >
        <SkeletonTheme
          baseColor={theme ? "#353535" : "#aaaaaa"}
          highlightColor={theme ? "#444" : "#b6b6b6"}
        >
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
                ? `${theme ? "studio-active" : "studio-active-light"} panel ${
                    theme ? "" : "panel-light"
                  }`
                : `dashboard panel ${theme ? "" : "panel-light"}`
            }
            onClick={() => {
              localStorage.setItem("Studio-Section", "Dashboard");
              window.location.href = "/studio";
            }}
          >
            <Tooltip
              TransitionComponent={Zoom}
              title="Dashboard"
              placement="bottom"
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
            </Tooltip>
          </div>
          <div
            className={
              StudioSection === "Content"
                ? `${theme ? "studio-active" : "studio-active-light"} panel ${
                    theme ? "" : "panel-light"
                  }`
                : `content panel ${theme ? "" : "panel-light"}`
            }
            onClick={() => {
              localStorage.setItem("Studio-Section", "Content");
              window.location.href = "/studio/video";
            }}
          >
            <Tooltip
              TransitionComponent={Zoom}
              title="Content"
              placement="bottom"
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
            </Tooltip>
          </div>
          <div
            className={
              StudioSection === "Comments"
                ? `${theme ? "studio-active" : "studio-active-light"} panel ${
                    theme ? "" : "panel-light"
                  }`
                : `comments panel ${theme ? "" : "panel-light"}`
            }
            onClick={() => {
              localStorage.setItem("Studio-Section", "Comments");
              window.location.href = "/studio/comments";
            }}
          >
            <Tooltip
              TransitionComponent={Zoom}
              title="Comments"
              placement="bottom"
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
            </Tooltip>
          </div>
          <div
            className={
              StudioSection === "Customization"
                ? `${theme ? "studio-active" : "studio-active-light"} panel ${
                    theme ? "" : "panel-light"
                  }`
                : `customization panel ${theme ? "" : "panel-light"}`
            }
            onClick={() => {
              localStorage.setItem("Studio-Section", "Customization");
              window.location.href = "/studio/customize";
            }}
          >
            <Tooltip
              TransitionComponent={Zoom}
              title="Customization"
              placement="bottom"
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
            </Tooltip>
          </div>
        </div>
      </div>

      {/* HORIZONTAL MENU BAR */}

      <div
        className={
          theme
            ? "studio-horizontal-menu"
            : "studio-horizontal-menu light-mode text-light-mode"
        }
      >
        <div
          className="hori-dashboard"
          onClick={() => {
            localStorage.setItem("Studio-Section", "Dashboard");
            window.location.href = "/studio";
          }}
        >
          <Tooltip
            TransitionComponent={Zoom}
            title="Dashboard"
            placement="bottom"
          >
            <MdDashboard
              className={
                StudioSection === "Dashboard"
                  ? "studio-icon3"
                  : "studio-icon-new"
              }
              fontSize="26px"
              style={{
                color: "#A9A9A9",
              }}
            />
          </Tooltip>
        </div>
        <div
          className="hori-content"
          onClick={() => {
            localStorage.setItem("Studio-Section", "Content");
            window.location.href = "/studio/video";
          }}
        >
          <Tooltip
            TransitionComponent={Zoom}
            title="Content"
            placement="bottom"
          >
            <MdOutlineVideoLibrary
              className={
                StudioSection === "Content" ? "studio-icon3" : "studio-icon-new"
              }
              fontSize="26px"
              style={{
                color: "#A9A9A9",
              }}
            />
          </Tooltip>
        </div>
        <div
          className="hori-comments"
          onClick={() => {
            localStorage.setItem("Studio-Section", "Comments");
            window.location.href = "/studio/comments";
          }}
        >
          <Tooltip
            TransitionComponent={Zoom}
            title="Comments"
            placement="bottom"
          >
            <BiCommentDetail
              className={
                StudioSection === "Comments"
                  ? "studio-icon3"
                  : "studio-icon-new"
              }
              fontSize="26px"
              style={{
                color: "#A9A9A9",
              }}
            />
          </Tooltip>
        </div>
        <div
          className="hori-customize"
          onClick={() => {
            localStorage.setItem("Studio-Section", "Customization");
            window.location.href = "/studio/customize";
          }}
        >
          <Tooltip
            TransitionComponent={Zoom}
            title="Customization"
            placement="bottom"
          >
            <MdOutlineAutoFixHigh
              className={
                StudioSection === "Customization"
                  ? "studio-icon3"
                  : "studio-icon-new"
              }
              fontSize="26px"
              style={{
                color: "#A9A9A9",
              }}
            />
          </Tooltip>
        </div>
      </div>
    </>
  );
}

export default LeftPanel2;
