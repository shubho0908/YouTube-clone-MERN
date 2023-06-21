import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Plyr from "plyr";
import Navbar from "./Navbar";
import "../Css/videoSection.css";
import "plyr/dist/plyr.css";

function VideoSection() {
  const { id } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [plyrInitialized, setPlyrInitialized] = useState(false);
  const videoRef = useRef(null);

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
        const player = new Plyr(videoRef.current, { background: "red" });
        setPlyrInitialized(true);
      }
    };

    if (videoData && videoData.VideoData) {
      initializePlyr();
    }
  }, [plyrInitialized, videoData]);

  if (!videoData) {
    return <div>Loading...</div>;
  }

  const { VideoData } = videoData;
  const matchedVideo = VideoData.find((item) => item._id === id);

  if (!matchedVideo) {
    return <div>Video not found</div>;
  }

  const { videoURL, Title } = matchedVideo;

  return (
    <>
      <Navbar />
      <div className="main-video-section">
        <div className="left-video-section">
          <div className="videoframe">
            <video className="play-video" controls ref={videoRef}>
              <source src={videoURL} type="video/mp4" />
            </video>
          </div>
        </div>
        <div className="recommended-section"></div>
      </div>
    </>
  );
}

export default VideoSection;
