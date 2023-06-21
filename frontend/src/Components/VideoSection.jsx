import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Plyr from "plyr";
import Navbar from "./Navbar";
import "../Css/videoSection.css";
import ReactLoading from "react-loading";
import "plyr/dist/plyr.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ReplyIcon from "@mui/icons-material/Reply";
import { TfiDownload } from "react-icons/Tfi";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import jwtDecode from "jwt-decode";

function VideoSection() {
  const { id } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [email, setEmail] = useState();
  const [channelName, setChannelName] = useState();
  const [plyrInitialized, setPlyrInitialized] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const videoRef = useRef(null);
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    setEmail(jwtDecode(token).email);
  }, [token]);

  useEffect(() => {
    const checkChannel = async () => {
      try {
        const response = await fetch(`http://localhost:3000/checkchannel/${email}`);
        const channel = await response.json();
        setChannelName(channel);
      } catch (error) {
        console.log(error.message);
      }
    };
    checkChannel();
  });

  useEffect(() => {
    const getVideoData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/videodata/${id}`);
        const video = await response.json();
        setVideoData(video);
      } catch (error) {
        console.log(error.message);
      }
    };

    getVideoData();
  }, [id]);

  useEffect(() => {
    const initializePlyr = () => {
      if (!plyrInitialized && videoRef.current) {
        const player = new Plyr(videoRef.current, {
          background: "red",
          ratio: null,
        });
        setPlyrInitialized(true);
      }
    };

    if (videoData && videoData.VideoData) {
      initializePlyr();
    }
  }, [plyrInitialized, videoData]);

  if (!videoData) {
    return (
      <>
        <div className="main-video-section2">
          <div className="spin2" style={{ height: "100vh" }}>
            <ReactLoading
              type={"spin"}
              color={"white"}
              height={50}
              width={50}
            />
          </div>
        </div>
      </>
    );
  }

  const { VideoData } = videoData;
  const matchedVideo = VideoData.find((item) => item._id === id);

  if (!matchedVideo) {
    return <div>Video not found</div>;
  }

  const {
    videoURL,
    Title,
    thumbnailURL,
    ChannelProfile,
    uploader,
    Description,
  } = matchedVideo;

  return (
    <>
      <Navbar />
      <div className="main-video-section">
        <div className="left-video-section">
          <div className="videoframe">
            <video
              className="play-video"
              controls
              ref={videoRef}
              poster={thumbnailURL}
            >
              <source src={videoURL} type="video/mp4" />
            </video>
          </div>
          <p className="vid-title">{Title}</p>
          <div className="some-channel-data">
            <div className="channel-left-data">
              <img src={ChannelProfile} alt="channelDP" className="channelDP" />
              <div className="channel-data2">
                <div className="creator">
                  <p style={{ fontSize: "17px" }}>{uploader}</p>
                  <Tooltip
                    TransitionComponent={Zoom}
                    title="Verified"
                    placement="right"
                  >
                    <CheckCircleIcon
                      fontSize="100px"
                      style={{
                        color: "rgb(138, 138, 138)",
                        marginLeft: "4px",
                      }}
                    />
                  </Tooltip>
                </div>
                <p className="channel-subs">10M subscribers</p>
              </div>
              <button
                className="subscribe"
                disabled={uploader === channelName ? true : false}
              >
                Subscribe
              </button>
            </div>
            <div className="channel-right-data">
              <div className="like-dislike">
                <div className="like-data">
                  <ThumbUpAltOutlinedIcon
                    fontSize="medium"
                    style={{ color: "white" }}
                  />
                  <p className="like-count">250K</p>
                </div>
                <div className="vl"></div>
                <div className="dislike-data">
                  <ThumbDownOutlinedIcon
                    fontSize="medium"
                    style={{ color: "white" }}
                  />
                </div>
              </div>
              <div className="share">
                <ReplyIcon
                  fontSize="medium"
                  style={{ color: "white", transform: "rotateY(180deg)" }}
                />
                <p className="share-txt">Share</p>
              </div>
              <div className="download-btn">
                <h3>
                  <TfiDownload />
                </h3>
                <p>Download</p>
              </div>
              <div className="save-later">
                <BookmarkAddOutlinedIcon
                  fontSize="medium"
                  style={{ color: "white" }}
                />
                <p>Save</p>
              </div>
            </div>
          </div>
          <div className="description-section2">
            <div className="views-date">
              <p>10M views</p>
              <p>3 days ago</p>
            </div>
            <div className="desc-data">
              <p style={{ marginTop: "10px" }}>{Description}</p>
            </div>
          </div>
        </div>
        <div className="recommended-section"></div>
      </div>
    </>
  );
}

export default VideoSection;
