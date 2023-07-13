import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import trending from "../img/trending.jpg";
import "../Css/trending.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import jwtDecode from "jwt-decode";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

function Trending() {
  const [Email, setEmail] = useState();
  const [trendingVideos, setTrendingVideos] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

  useEffect(() => {
    const getTrending = async () => {
      try {
        const response = await fetch("http://localhost:3000/gettrending");
        const trending = await response.json();
        const sortedTrending = trending.sort(
          (a, b) => new Date(b.uploaded_date) - new Date(a.uploaded_date)
        );

        setTrendingVideos(sortedTrending);
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getTrending, 100);

    return () => clearInterval(interval);
  }, []);

  //Update Views

  const updateViews = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/updateview/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      await response.json();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <LeftPanel />
      <div className="main-trending-section">
        <div className="trending-top">
          <img src={trending} alt="trending" className="trendingIMG" />
          <p>Trending</p>
        </div>
        <hr className="seperate seperate-three" />

        <div className="trending-videos-section">
          {trendingVideos.length > 0 &&
            trendingVideos.map((element, index) => {
              return (
                <div
                  className="trending-video-data"
                  key={index}
                  onClick={() => {
                    navigate(`/video/${element.videoid}`);
                    window.location.reload();
                    if (token) {
                      updateViews(element.videoid);
                    }
                  }}
                >
                  <img
                    src={element.thumbnailURL}
                    alt="trending-thumbnail"
                    className="trending-thumbnail"
                  />
                  <p className="trending-duration">
                    {Math.floor(element.videoLength / 60) +
                      ":" +
                      (Math.round(element.videoLength % 60) < 10
                        ? "0" + Math.round(element.videoLength % 60)
                        : Math.round(element.videoLength % 60))}
                  </p>
                  <div className="trending-video-texts">
                    <p className="trending-title">{element.Title}</p>
                    <div className="trending-oneliner">
                      <p className="t-channelname">{element.uploader}</p>
                      <Tooltip
                        TransitionComponent={Zoom}
                        title="Verified"
                        placement="top"
                      >
                        <CheckCircleIcon
                          fontSize="100px"
                          style={{
                            color: "rgb(138, 138, 138)",
                            marginLeft: "6px",
                          }}
                        />
                      </Tooltip>
                      <p className="t-views">
                        {" "}
                        {element.views >= 1e9
                          ? `${(element.views / 1e9).toFixed(1)}B`
                          : element.views >= 1e6
                          ? `${(element.views / 1e6).toFixed(1)}M`
                          : element.views >= 1e3
                          ? `${(element.views / 1e3).toFixed(1)}K`
                          : element.views}{" "}
                        views
                      </p>
                      <p className="t-uploaded-date">
                        &#x2022;{" "}
                        {(() => {
                          const timeDifference =
                            new Date() - new Date(element.uploaded_date);
                          const minutes = Math.floor(timeDifference / 60000);
                          const hours = Math.floor(timeDifference / 3600000);
                          const days = Math.floor(timeDifference / 86400000);
                          const weeks = Math.floor(timeDifference / 604800000);
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
                    <p className="trending-desc">
                      {element.Description.length <= 180
                        ? element.Description
                        : `${element.Description.slice(0, 180)}...`}
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

export default Trending;
