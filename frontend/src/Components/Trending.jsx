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
import nothing from "../img/nothing.png";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Trending() {
  const [Email, setEmail] = useState();
  const [trendingVideos, setTrendingVideos] = useState([]);
  const navigate = useNavigate();
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const token = localStorage.getItem("userToken");
  const [loading, setLoading] = useState(true);

  document.title = "Trending - YouTube";

  useEffect(() => {
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3200);
  }, []);

  useEffect(() => {
    localStorage.setItem("menuClicked", JSON.stringify(menuClicked));
  }, [menuClicked]);

  useEffect(() => {
    const getTrending = async () => {
      try {
        const response = await fetch("http://localhost:3000/gettrending");
        const trending = await response.json();
        if (trending !== "NO DATA") {
          const sortedTrending = trending.sort(
            (a, b) => new Date(b.uploaded_date) - new Date(a.uploaded_date)
          );

          setTrendingVideos(sortedTrending);
        } else {
          setTrendingVideos(trending);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getTrending, 100);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMenuButtonClick = () => {
      setMenuClicked((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".menu");
    menuButton.addEventListener("click", handleMenuButtonClick);

    return () => {
      menuButton.removeEventListener("click", handleMenuButtonClick);
    };
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

  if (trendingVideos === "NO DATA") {
    return (
      <>
        <Navbar />
        <LeftPanel />
        <div className="searched-content">
          <img src={nothing} alt="no results" className="nothing-found" />
          <p className="no-results">No videos are currently trending!</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <LeftPanel />
      {trendingVideos.length > 0 ? (
        <div className="main-trending-section2">
          <div className="trending-top">
            <img src={trending} alt="trending" className="trendingIMG" />
            <p>Trending</p>
          </div>
          <hr className="seperate seperate-three" />

          <div className="trending-videos-section">
            {trendingVideos.length > 0 &&
              trendingVideos.map((element, index) => {
                return (
                  <>
                    <SkeletonTheme baseColor="#353535" highlightColor="#444">
                      <div
                        className="trending-video-data"
                        style={
                          loading === true
                            ? { display: "flex" }
                            : { display: "none" }
                        }
                      >
                        <Skeleton
                          count={1}
                          width={250}
                          height={141}
                          style={{ borderRadius: "12px" }}
                        />
                        <div className="trending-video-texts">
                          <Skeleton
                            count={1}
                            width={150}
                            height={20}
                            style={{
                              position: "relative",
                              left: "30px",
                              top: "10px",
                            }}
                          />
                          <Skeleton
                            count={1}
                            width={400}
                            height={25}
                            style={{
                              position: "relative",
                              left: "30px",
                              top: "15px",
                            }}
                          />
                          <Skeleton
                            count={1}
                            width={220}
                            height={15}
                            style={{
                              position: "relative",
                              left: "30px",
                              top: "20px",
                            }}
                          />
                          <Skeleton
                            count={1}
                            width={500}
                            height={20}
                            style={{
                              position: "relative",
                              left: "30px",
                              top: "28px",
                            }}
                          />
                        </div>
                      </div>
                    </SkeletonTheme>
                    <div
                      className="trending-video-data"
                      key={index}
                      onClick={() => {
                        if (token) {
                          updateViews(element.videoid);
                          setTimeout(() => {
                            navigate(`/video/${element.videoid}`);
                            window.location.reload();
                          }, 400);
                        } else {
                          navigate(`/video/${element.videoid}`);
                          window.location.reload();
                        }
                      }}
                      style={
                        loading === false
                          ? { visibility: "visible" }
                          : { visibility: "hidden" }
                      }
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
                        <p className="trending-batch">TRENDING #{index + 1}</p>
                        <p className="trending-title">{element.Title}</p>
                        <div className="trending-oneliner">
                          <div className="trend-channel-name">
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
                          </div>
                          <div className="trend-channel-extras">
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
                                const minutes = Math.floor(
                                  timeDifference / 60000
                                );
                                const hours = Math.floor(
                                  timeDifference / 3600000
                                );
                                const days = Math.floor(
                                  timeDifference / 86400000
                                );
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
                        <p className="trending-desc">
                          {element.Description.length <= 140
                            ? element.Description
                            : `${element.Description.slice(0, 80)}...`}
                        </p>
                      </div>
                    </div>
                  </>
                );
              })}
          </div>
        </div>
      ) : (
        <div className="main-trending-section">
          <div className="spin23" style={{ top: "200px" }}>
            <span className="loader2"></span>
          </div>
        </div>
      )}
    </>
  );
}

export default Trending;
