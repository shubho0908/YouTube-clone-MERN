import { useEffect, useState } from "react";
import "../Css/leftpanel3.css";
import { useLocation, useParams } from "react-router-dom";
import WestIcon from "@mui/icons-material/West";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';

function LeftPanel2() {
  const { id } = useParams();
  const token = localStorage.getItem("userToken");
  const [videodata, setVideoData] = useState();
  const [menuClicked, setMenuClicked] = useState(false);
  const VideoEditSection = localStorage.getItem("Video-Edit Section");
  const location = useLocation();

  useEffect(() => {
    const currentUrl = location.pathname;
    let selected = "";

    if (currentUrl === `/studio/video/edit/${id}`) {
      selected = "Details";
    } else if (currentUrl === "/studio/customize") {
      selected = "Customization";
    } else if (currentUrl === "/studio/video") {
      selected = "Content";
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
    const handleMenuButtonClick = () => {
      setMenuClicked((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".menu2");
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
    const GetVideoData = async () => {
      try {
        if (id !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getvideodata/${id}`
          );
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
        className="main-section3"
        style={menuClicked === true ? { display: "none" } : { display: "flex" }}
      >
        <div className="first-panel">
          <div className="about-video">
            <WestIcon fontSize="medium" style={{ color: "#aaa" }} />
            <p>Channel content</p>
          </div>
        </div>
        <div
          className="mid-panel"
          style={videodata ? { display: "block" } : { display: "none" }}
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
            <p className="current-video-title">
              {videodata && videodata.Title.length <= 38
                ? videodata && videodata.Title
                : `${videodata && videodata.Title.slice(0, 38)}...`}
            </p>
          </div>
        </div>
        <div className="second-panel">
          <div
            className={
              VideoEditSection === "Details"
                ? "studio-active panel"
                : "details panel"
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
              VideoEditSection === "Comments"
                ? "studio-active panel"
                : "comments panel"
            }
            onClick={() => {
              localStorage.setItem("Video-Edit Section", "Comments");
              window.location.href = `/studio/video/comments/${id}`;
            }}
          >
            <ChatOutlinedIcon
              className={
                VideoEditSection === "Comments" ? "studio-icon2" : "studio-icon"
              }
              fontSize="medium"
              style={{ color: "#A9A9A9", paddingLeft: "25px !important" }}
            />
            <p>Comments</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LeftPanel2;
