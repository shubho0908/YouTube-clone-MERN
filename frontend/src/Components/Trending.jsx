import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import trending from "../img/trending.jpg";
import "../Css/trending.css";
import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import nothing from "../img/nothing.png";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSelector } from "react-redux";

function Trending() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app";
  // const backendURL = "http://localhost:3000";
  const [trendingVideos, setTrendingVideos] = useState([]);
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const User = useSelector((state) => state.user.user);
  const { user } = User;
  document.title = "Trending - YouTube";

  useEffect(() => {
    if (theme === false && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "white";
    } else if (theme === true && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "0f0f0f";
    }
  }, [theme]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    localStorage.setItem("menuClicked", JSON.stringify(menuClicked));
  }, [menuClicked]);

  useEffect(() => {
    const getTrending = async () => {
      try {
        const response = await fetch(
          "https://youtube-clone-mern-backend.vercel.app/gettrending"
        );
        const trending = await response.json();
        if (trending !== "NO DATA") {
          const sortedTrending = trending.sort((a, b) => b.views - a.views);

          setTrendingVideos(sortedTrending);
        } else {
          setTrendingVideos(trending);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };
    getTrending();
  }, []);

  useEffect(() => {
    const handleMenuButtonClick = () => {
      setMenuClicked((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".menu");
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
    const handleMenuButtonClick = () => {
      setMenuClicked((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".menu-light");
    if (menuButton) {
      menuButton.addEventListener("click", handleMenuButtonClick);
    }

    return () => {
      if (menuButton) {
        menuButton.removeEventListener("click", handleMenuButtonClick);
      }
    };
  }, []);

  //Update Views

  const updateViews = async (id) => {
    try {
      const response = await fetch(`${backendURL}/updateview/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      await response.json();
    } catch (error) {
      // console.log(error.message);
    }
  };

  if (trendingVideos === "NO DATA") {
    return (
      <>
        <Navbar />
        <LeftPanel />
        <div className="searched-content">
          <img src={nothing} alt="no results" className="nothing-found" />
          <p className={theme ? "no-results" : "no-results text-light-mode"}>
            No videos are currently trending!
          </p>
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
            <p style={{ color: theme ? "white" : "black" }}>Trending</p>
          </div>
          <hr
            className={
              theme
                ? "seperate seperate-three"
                : "seperate seperate-three seperate-light"
            }
          />

          <div className="trending-videos-section">
            {trendingVideos.length > 0 &&
              trendingVideos.map((element, index) => {
                return (
                  <>
                    <SkeletonTheme
                      baseColor={theme ? "#353535" : "#aaaaaa"}
                      highlightColor={theme ? "#444" : "#b6b6b6"}
                    >
                      <div
                        className="trending-video-data sk-trending-data"
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
                          className="sk-trend-thumbnail"
                        />
                        <div className="trending-video-texts sk-video-trend">
                          <Skeleton
                            count={1}
                            width={150}
                            height={20}
                            style={{
                              position: "relative",
                              left: "30px",
                              top: "10px",
                            }}
                            className="sk-trend-trending"
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
                            className="sk-trend-title"
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
                            className="sk-trend-extra1"
                          />
                        </div>
                      </div>
                    </SkeletonTheme>
                    <div
                      className="trending-video-data"
                      key={index}
                      onClick={() => {
                        if (user?.email) {
                          updateViews(element.videoid);
                          setTimeout(() => {
                            window.location.href = `/video/${element.videoid}`;
                          }, 400);
                        } else {
                          window.location.href = `/video/${element.videoid}`;
                        }
                      }}
                      style={
                        loading === false
                          ? { visibility: "visible", display: "flex" }
                          : { visibility: "hidden", display: "none" }
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
                        <p
                          className={
                            theme ? "trending-batch" : "trending-batch-light"
                          }
                        >
                          TRENDING #{index + 1}
                        </p>
                        <p
                          className={
                            theme
                              ? "trending-title"
                              : "trending-title text-light-mode"
                          }
                        >
                          {element.Title}
                        </p>
                        <div
                          className={
                            theme
                              ? "trending-oneliner"
                              : "trending-oneliner text-light-mode2"
                          }
                        >
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
                        <p
                          className={
                            theme
                              ? "trending-desc"
                              : "trending-desc text-light-mode2"
                          }
                        >
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
            <span className={theme ? "loader2" : "loader2-light"}></span>
          </div>
        </div>
      )}
    </>
  );
}

export default Trending;
