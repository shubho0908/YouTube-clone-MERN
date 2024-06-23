import { useEffect, useState } from "react";
import "../Css/leftpanel3.css";
import { useLocation, useParams } from "react-router-dom";
import WestIcon from "@mui/icons-material/West";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSelector } from "react-redux";
function LeftPanel2() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000";
  const { id } = useParams();
  const [videodata, setVideoData] = useState();
  const VideoEditSection = localStorage.getItem("Video-Edit Section");
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [studioMenuClicked, setstudioMenuClicked] = useState(() => {
    const menu = localStorage.getItem("studioMenuClicked2");
    return menu ? JSON.parse(menu) : false;
  });
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
      "studioMenuClicked2",
      JSON.stringify(studioMenuClicked)
    );
  }, [studioMenuClicked]);

  useEffect(() => {
    const currentUrl = location.pathname;
    let selected = "";

    if (currentUrl === `/studio/video/edit/${id}`) {
      selected = "Details";
    } else if (currentUrl === "/studio/customize") {
      selected = "Customization";
    } else if (currentUrl === "/studio/video") {
      selected = "Content";
    } else if (currentUrl === `/studio/video/comments/${id}`) {
      selected = "Video-Comments";
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

    localStorage.setItem("Video-Edit Section", selected);
  }, [location, id]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2800);
  }, []);

  useEffect(() => {
    const GetVideoData = async () => {
      try {
        if (id) {
          const response = await fetch(`${backendURL}/getvideodata/${id}`);
          const data = await response.json();
          setVideoData(data);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    GetVideoData();
  }, [id]);

  return (
    <>
      <div
        className={
          theme ? "main-section3" : "main-section3 light-mode text-light-mode"
        }
        style={
          studioMenuClicked === true ? { display: "none" } : { display: "flex" }
        }
      >
        <div
          className={
            theme
              ? "first-panel first-panel1"
              : "first-panel first-panel1 preview-lightt"
          }
          onClick={() => {
            if (window.location.href.includes(`/studio/video/edit/${id}`)) {
              window.location.href = "/studio/video";
            } else {
              window.location.href = "/studio/comments";
            }
          }}
        >
          <div className="about-video">
            <WestIcon fontSize="medium" style={{ color: "#aaa" }} />
            {window.location.href.includes(`/studio/video/edit/${id}`) ? (
              <p>Channel content</p>
            ) : (
              <p>Channel comments</p>
            )}
          </div>
        </div>
        {/* START HERE  */}
        <SkeletonTheme
          baseColor={theme ? "#353535" : "#aaaaaa"}
          highlightColor={theme ? "#444" : "#b6b6b6"}
        >
          <div
            className="mid-panel"
            style={
              loading === true ? { display: "block" } : { display: "none" }
            }
          >
            <div className="redirect-video">
              <Skeleton count={1} width={220} height={124} />
            </div>
            <div className="thisvideo-mg-data2" style={{ marginTop: "25px" }}>
              <Skeleton count={1} width={220} height={17} />
              <Skeleton count={1} width={150} height={13} />
            </div>
          </div>
        </SkeletonTheme>
        {/* END HERE  */}
        <div
          className="mid-panel"
          style={
            videodata && loading === false
              ? { visibility: "visible", display: "block" }
              : { visibility: "hidden", display: "none" }
          }
        >
          <div
            className="redirect-video"
            onClick={() => {
              if (videodata) {
                window.location.href = `/video/${videodata._id}`;
              }
            }}
          >
            <img
              src={videodata && videodata.thumbnailURL}
              alt="thumbnail"
              className="current-video-thumbnail"
            />
            <p className="current-video-duraation">
              {Math.floor(videodata && videodata.videoLength / 60) +
                ":" +
                (Math.round(videodata && videodata.videoLength % 60) < 10
                  ? "0" + Math.round(videodata && videodata.videoLength % 60)
                  : Math.round(videodata && videodata.videoLength % 60))}
            </p>
            <Tooltip
              TransitionComponent={Zoom}
              title="View on YouTube"
              placement="bottom"
            >
              <YouTubeIcon
                className="watch-video"
                fontSize="large"
                style={{ color: "white" }}
              />
            </Tooltip>
          </div>
          <div className="thisvideo-mg-data">
            <p className="ur-vid">Your video</p>
            <Tooltip
              TransitionComponent={Zoom}
              title={videodata && videodata?.Title}
              placement="bottom"
            >
              <p
                className={
                  theme
                    ? "current-video-title"
                    : "current-video-title text-light-mode2"
                }
              >
                {videodata && videodata?.Title?.length <= 38
                  ? videodata && videodata?.Title
                  : `${videodata && videodata?.Title?.slice(0, 38)}...`}
              </p>
            </Tooltip>
          </div>
        </div>
        <div className="second-panel">
          <div
            className={
              VideoEditSection === "Details"
                ? `${theme ? "studio-active" : "studio-active-light"} panel ${
                    theme ? "" : "panel-light"
                  }`
                : `details panel ${theme ? "" : "panel-light"}`
            }
            onClick={() => {
              localStorage.setItem("Video-Edit Section", "Details");
              window.location.href = `/studio/video/edit/${id}`;
            }}
          >
            <ModeEditOutlineOutlinedIcon
              className={
                VideoEditSection === "Details" ? "studio-icon2" : "studio-icon"
              }
              fontSize="medium"
              style={{ color: "#A9A9A9", paddingLeft: "25px !important" }}
            />
            <p>Details</p>
          </div>
          <div
            className={
              VideoEditSection === "Video-Comments"
                ? `${theme ? "studio-active" : "studio-active-light"} panel ${
                    theme ? "" : "panel-light"
                  }`
                : `comments panel ${theme ? "" : "panel-light"}`
            }
            onClick={() => {
              localStorage.setItem("Video-Edit Section", "Video-Comments");
              window.location.href = `/studio/video/comments/${id}`;
            }}
          >
            <ChatOutlinedIcon
              className={
                VideoEditSection === "Video-Comments"
                  ? "studio-icon2"
                  : "studio-icon"
              }
              fontSize="medium"
              style={{ color: "#A9A9A9", paddingLeft: "25px !important" }}
            />
            <p>Comments</p>
          </div>
        </div>
      </div>

      {/* SHORT HAND  */}

      <div
        className={theme ? "main-section3" : "main-section3 light-mode"}
        style={
          studioMenuClicked === false
            ? { display: "none" }
            : { display: "flex", width: "90px" }
        }
      >
        <div
          className={
            theme
              ? "first-panel first-panel1"
              : "first-panel first-panel1 preview-lightt"
          }
          onClick={() => {
            if (window.location.href.includes(`/studio/video/edit/${id}`)) {
              window.location.href = "/studio/video";
            } else {
              window.location.href = "/studio/comments";
            }
          }}
        >
          <div
            className="about-video"
            style={{ right: studioMenuClicked ? "0px" : "15px" }}
          >
            <WestIcon fontSize="medium" style={{ color: "#aaa" }} />
          </div>
        </div>
        {/* START HERE  */}
        <SkeletonTheme
          baseColor={theme ? "#353535" : "#aaaaaa"}
          highlightColor={theme ? "#444" : "#b6b6b6"}
        >
          <div
            className="mid-panel"
            style={
              loading === true ? { display: "block" } : { display: "none" }
            }
          >
            <div className="redirect-video">
              <Skeleton count={1} width={75} height={42} />
            </div>
          </div>
        </SkeletonTheme>
        {/* END HERE  */}
        <div
          className="mid-panel"
          style={
            videodata && loading === false
              ? { visibility: "visible", display: "block" }
              : { visibility: "hidden", display: "none" }
          }
        >
          <div
            className="redirect-video"
            onClick={() => {
              if (videodata) {
                window.location.href = `/video/${videodata._id}`;
              }
            }}
          >
            <img
              src={videodata && videodata.thumbnailURL}
              alt="thumbnail"
              className="current-video-thumbnail"
              style={{ width: studioMenuClicked ? "70px" : "220px" }}
            />
            <Tooltip
              TransitionComponent={Zoom}
              title="View on YouTube"
              placement="bottom"
            >
              <YouTubeIcon
                className="watch-video2"
                fontSize="medium"
                style={{ color: "white" }}
              />
            </Tooltip>
          </div>
        </div>
        <div className="second-panel">
          <div
            className={
              VideoEditSection === "Details"
                ? `${theme ? "studio-active" : "studio-active-light"} panel ${
                    theme ? "" : "panel-light"
                  }`
                : `details panel ${theme ? "" : "panel-light"}`
            }
            onClick={() => {
              localStorage.setItem("Video-Edit Section", "Details");
              window.location.href = `/studio/video/edit/${id}`;
            }}
          >
            <ModeEditOutlineOutlinedIcon
              className={
                VideoEditSection === "Details" ? "studio-icon2" : "studio-icon"
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
              VideoEditSection === "Video-Comments"
                ? `${theme ? "studio-active" : "studio-active-light"} panel ${
                    theme ? "" : "panel-light"
                  }`
                : `comments panel ${theme ? "" : "panel-light"}`
            }
            onClick={() => {
              localStorage.setItem("Video-Edit Section", "Video-Comments");
              window.location.href = `/studio/video/comments/${id}`;
            }}
          >
            <ChatOutlinedIcon
              className={
                VideoEditSection === "Video-Comments"
                  ? "studio-icon2"
                  : "studio-icon"
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
        </div>
      </div>

      {/* ANOTHER SHORT HAND  */}

      <div
        className={theme ? "main-section3-new" : "main-section3-new light-mode"}
      >
        <div
          className={
            theme
              ? "first-panel first-panel1"
              : "first-panel first-panel1 preview-lightt"
          }
          onClick={() => {
            if (window.location.href.includes(`/studio/video/edit/${id}`)) {
              window.location.href = "/studio/video";
            } else {
              window.location.href = "/studio/comments";
            }
          }}
        >
          <div className="about-video" style={{ right: "0px" }}>
            <WestIcon fontSize="medium" style={{ color: "#aaa" }} />
          </div>
        </div>
        {/* START HERE  */}
        <SkeletonTheme
          baseColor={theme ? "#353535" : "#aaaaaa"}
          highlightColor={theme ? "#444" : "#b6b6b6"}
        >
          <div
            className="mid-panel"
            style={
              loading === true ? { display: "block" } : { display: "none" }
            }
          >
            <div className="redirect-video">
              <Skeleton count={1} width={75} height={42} />
            </div>
          </div>
        </SkeletonTheme>
        {/* END HERE  */}
        <div
          className="mid-panel"
          style={
            videodata && loading === false
              ? { visibility: "visible", display: "block" }
              : { visibility: "hidden", display: "none" }
          }
        >
          <div
            className="redirect-video"
            onClick={() => {
              if (videodata) {
                window.location.href = `/video/${videodata._id}`;
              }
            }}
          >
            <img
              src={videodata && videodata.thumbnailURL}
              alt="thumbnail"
              className="current-video-thumbnail"
              style={{ width: "70px" }}
            />
            <Tooltip
              TransitionComponent={Zoom}
              title="View on YouTube"
              placement="bottom"
            >
              <YouTubeIcon
                className="watch-video2"
                fontSize="medium"
                style={{ color: "white" }}
              />
            </Tooltip>
          </div>
        </div>
        <div className="second-panel">
          <div
            className={
              VideoEditSection === "Details"
                ? `${theme ? "studio-active" : "studio-active-light"} panel ${
                    theme ? "" : "panel-light"
                  }`
                : `details panel ${theme ? "" : "panel-light"}`
            }
            onClick={() => {
              localStorage.setItem("Video-Edit Section", "Details");
              window.location.href = `/studio/video/edit/${id}`;
            }}
          >
            <ModeEditOutlineOutlinedIcon
              className={
                VideoEditSection === "Details" ? "studio-icon2" : "studio-icon"
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
              VideoEditSection === "Video-Comments"
                ? `${theme ? "studio-active" : "studio-active-light"} panel ${
                    theme ? "" : "panel-light"
                  }`
                : `comments panel ${theme ? "" : "panel-light"}`
            }
            onClick={() => {
              localStorage.setItem("Video-Edit Section", "Video-Comments");
              window.location.href = `/studio/video/comments/${id}`;
            }}
          >
            <ChatOutlinedIcon
              className={
                VideoEditSection === "Video-Comments"
                  ? "studio-icon2"
                  : "studio-icon"
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
        </div>
      </div>
    </>
  );
}

export default LeftPanel2;
