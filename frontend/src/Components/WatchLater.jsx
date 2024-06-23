import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import { useEffect, useState } from "react";
import nothing from "../img/nothing.png";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import "../Css/likevideos.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSelector } from "react-redux";

function WatchLater() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app";
  // const backendURL = "http://localhost:3000";
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const [watchlater, setWatchLater] = useState([]);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  const User = useSelector((state) => state.user.user);
  const { user } = User;

  document.title = "Watch later - YouTube";

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
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

  useEffect(() => {
    if (theme === false && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "white";
    } else if (theme === true && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "0f0f0f";
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("menuClicked", JSON.stringify(menuClicked));
  }, [menuClicked]);

  useEffect(() => {
    const getWatchLater = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getwatchlater/${user?.email}`
          );
          const savedData = await response.json();
          setWatchLater(savedData);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    getWatchLater();
  }, [user?.email]);


  const updateViews = async (id) => {
    try {
      const response = await fetch(
        `${backendURL}/updateview/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
    } catch (error) {
      // console.log(error.message);
    }
  };

  if (watchlater.savedData === "NO DATA") {
    return (
      <>
        <Navbar />
        <LeftPanel />
        <div className="searched-content">
          <img src={nothing} alt="no results" className="nothing-found" />
          <p className={theme ? "no-results" : "no-results text-light-mode"}>
            No videos found!
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <LeftPanel />
      <div
        className={
          theme
            ? "liked-video-data"
            : "liked-video-data light-mode text-light-mode"
        }
      >
        {watchlater.length > 0 ? (
          <div
            className="like-video-sections"
            style={menuClicked === false ? { left: "80px" } : { left: "255px" }}
          >
            <div
              className={
                theme ? "like-left-section" : "like-left-section-light"
              }
              style={{
                backgroundImage: `url(${watchlater[0]?.thumbnailURL})`,
              }}
            >
              <div className="page-cover">
                {watchlater && (
                  <div
                    className="firstvideo-thumbnail"
                    onClick={() => {
                      if (user?.email) {
                        updateViews(watchlater[0].savedVideoID);
                        setTimeout(() => {
                          window.location.href = `/video/${watchlater[0].savedVideoID}`;
                        }, 400);
                      } else {
                        window.location.href = `/video/${watchlater[0].savedVideoID}`;
                      }
                    }}
                  >
                    <SkeletonTheme
                      baseColor={theme ? "#353535" : "#aaaaaa"}
                      highlightColor={theme ? "#444" : "#b6b6b6"}
                    >
                      <div
                        className="thisimggg"
                        style={
                          loading === true
                            ? { display: "block" }
                            : { display: "none" }
                        }
                      >
                        <Skeleton
                          count={1}
                          width={310}
                          height={174}
                          style={{ borderRadius: "12px" }}
                          className="sk-watch-bigimg"
                        />
                      </div>
                    </SkeletonTheme>
                    <img
                      src={watchlater[0].thumbnailURL}
                      alt="first-like-thumbnail"
                      className="first-thumbnail"
                      loading="lazy"
                      style={
                        loading === true
                          ? { visibility: "hidden", display: "none" }
                          : { visibility: "visible", display: "block" }
                      }
                    />
                    <p
                      className="sample-play"
                      style={{ pointerEvents: "none" }}
                    >
                      &#9654; PLAY ALL
                    </p>
                  </div>
                )}
                <div className="last-like-section">
                  <p className="like-head">Watch later</p>
                  <div className="last-like2">
                    <p className="like-username">{user?.name}</p>
                    <p className="like-total-videos">
                      {watchlater.length} videos
                    </p>
                  </div>
                </div>
                <div
                  className="playvideo-btn"
                  onClick={() => {
                    if (user?.email) {
                      updateViews(watchlater[0].savedVideoID);
                      setTimeout(() => {
                        window.location.href = `/video/${watchlater[0].savedVideoID}`;
                      }, 400);
                    } else {
                      window.location.href = `/video/${watchlater[0].savedVideoID}`;
                    }
                  }}
                >
                  <PlayArrowIcon fontSize="medium" style={{ color: "black" }} />
                  <p className="play-all">Play all</p>
                </div>
              </div>
            </div>
            <SkeletonTheme
              baseColor={theme ? "#353535" : "#aaaaaa"}
              highlightColor={theme ? "#444" : "#b6b6b6"}
            >
              <div
                className="like-right-section sk-right-like"
                style={
                  loading === true ? { display: "block" } : { display: "none" }
                }
              >
                {watchlater.length > 0
                  ? watchlater.map((element, index) => {
                      return (
                        <div
                          className={
                            theme
                              ? "liked-all-videos"
                              : "liked-all-videos liked-all-videos-light"
                          }
                          key={index}
                          style={{
                            display:
                              element.videoprivacy === "Public"
                                ? "flex"
                                : "none",
                          }}
                        >
                          <div className="liked-videos-all-data">
                            <Skeleton
                              count={1}
                              width={180}
                              height={101}
                              style={{ borderRadius: "12px" }}
                              className="sk-watch-thumbnail"
                            />
                            <div
                              className="its-content"
                              style={{
                                position: "relative",
                                left: "10px",
                                top: "6px",
                              }}
                            >
                              <Skeleton
                                count={1}
                                width={450}
                                height={20}
                                className="sk-watch-title"
                              />
                              <Skeleton
                                count={1}
                                width={250}
                                height={16}
                                style={{ position: "relative", top: "10px" }}
                                className="sk-watch-channel"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : ""}
              </div>
            </SkeletonTheme>
            <div
              className="like-right-section"
              style={
                loading === true
                  ? { visibility: "hidden", display: "none" }
                  : { visibility: "visible", display: "block" }
              }
            >
              {watchlater.length > 0
                ? watchlater.map((element, index) => {
                    return (
                      <div
                        className={
                          theme
                            ? "liked-all-videos"
                            : "liked-all-videos liked-all-videos-light text-light-mode"
                        }
                        key={index}
                        style={{
                          display:
                            element.videoprivacy === "Public" ? "flex" : "none",
                        }}
                      >
                        <p style={{ color: "#aaa" }}>{index + 1}</p>
                        <div
                          className="liked-videos-all-data"
                          onClick={() => {
                            if (user?.email) {
                              updateViews(element.savedVideoID);
                              setTimeout(() => {
                                window.location.href = `/video/${element.savedVideoID}`;
                              }, 400);
                            } else {
                              window.location.href = `/video/${element.savedVideoID}`;
                            }
                          }}
                        >
                          <img
                            src={element.thumbnailURL}
                            alt="first-like-thumbnail"
                            loading="lazy"
                          />
                          <p
                            className={
                              theme ? "durationn3" : "durationn3 text-dark-mode"
                            }
                          >
                            {Math.floor(element.videoLength / 60) +
                              ":" +
                              (Math.round(element.videoLength % 60) < 10
                                ? "0" + Math.round(element.videoLength % 60)
                                : Math.round(element.videoLength % 60))}
                          </p>
                          <div className="its-content">
                            {window.innerWidth <= 1000 ? (
                              <p>
                                {element.Title.length <= 50
                                  ? element.Title
                                  : `${element.Title.slice(0, 50)}..`}
                              </p>
                            ) : (
                              <p>{element.Title}</p>
                            )}

                            <p>{element.uploader}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
        ) : (
          <div className="main-trending-section">
            <div className="spin23" style={{ top: "200px" }}>
              <span className={theme ? "loader2" : "loader2-light"}></span>
            </div>
          </div>
        )}
      </div>

      {/* SECONDARY WATCH LATER */}

      <div
        className={
          theme
            ? "liked-video-data-new"
            : "liked-video-data-new light-mode text-light-mode"
        }
      >
        {watchlater.length > 0 ? (
          <div
            className="like-video-sections2"
            style={menuClicked === false ? { left: "80px" } : { left: "255px" }}
          >
            <div
              className={
                theme ? "like-left-section2" : "like-left-section2-light"
              }
              style={{
                backgroundImage: `url(${watchlater[0]?.thumbnailURL})`,
              }}
            >
              <div className="page-cover2">
                <div className="inside-cover">
                  {watchlater && (
                    <div
                      className="firstvideo-thumbnail"
                      onClick={() => {
                        if (user?.email) {
                          updateViews(watchlater[0].savedVideoID);
                          setTimeout(() => {
                            window.location.href = `/video/${watchlater[0].savedVideoID}`;
                          }, 400);
                        } else {
                          window.location.href = `/video/${watchlater[0].savedVideoID}`;
                        }
                      }}
                    >
                      <SkeletonTheme
                        baseColor={theme ? "#353535" : "#aaaaaa"}
                        highlightColor={theme ? "#444" : "#b6b6b6"}
                      >
                        <div
                          className="thisimggg"
                          style={
                            loading === true
                              ? { display: "block" }
                              : { display: "none" }
                          }
                        >
                          <Skeleton
                            count={1}
                            width={310}
                            height={174}
                            style={{ borderRadius: "12px" }}
                            className="sk-watch-bigimg"
                          />
                        </div>
                      </SkeletonTheme>
                      <img
                        src={watchlater[0].thumbnailURL}
                        alt="first-like-thumbnail"
                        className="first-thumbnail2"
                        loading="lazy"
                        style={
                          loading === true
                            ? { visibility: "hidden", display: "none" }
                            : { visibility: "visible", display: "block" }
                        }
                      />
                      <p
                        className="sample-play"
                        style={{ pointerEvents: "none" }}
                      >
                        &#9654; PLAY ALL
                      </p>
                    </div>
                  )}
                  <div className="last-like-section2">
                    <p className="like-head">Watch later</p>
                    <div className="last-like2">
                      <p className="like-username">{user?.name}</p>
                      <p className="like-total-videos">
                        {watchlater.length} videos
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className="playvideo-btn"
                  onClick={() => {
                    if (user?.email) {
                      updateViews(watchlater[0].savedVideoID);
                      setTimeout(() => {
                        window.location.href = `/video/${watchlater[0].savedVideoID}`;
                      }, 400);
                    } else {
                      window.location.href = `/video/${watchlater[0].savedVideoID}`;
                    }
                  }}
                >
                  <PlayArrowIcon fontSize="medium" style={{ color: "black" }} />
                  <p className="play-all">Play all</p>
                </div>
              </div>
            </div>
            <SkeletonTheme
              baseColor={theme ? "#353535" : "#aaaaaa"}
              highlightColor={theme ? "#444" : "#b6b6b6"}
            >
              <div
                className="like-right-section  sk-right-like"
                style={
                  loading === true ? { display: "block" } : { display: "none" }
                }
              >
                {watchlater.length > 0
                  ? watchlater.map((element, index) => {
                      return (
                        <div
                          className={
                            theme
                              ? "liked-all-videos"
                              : "liked-all-videos liked-all-videos-light text-light-mode"
                          }
                          key={index}
                          style={{
                            display:
                              element.videoprivacy === "Public"
                                ? "flex"
                                : "none",
                          }}
                        >
                          <div className="liked-videos-all-data">
                            <Skeleton
                              count={1}
                              width={180}
                              height={101}
                              style={{ borderRadius: "12px" }}
                              className="sk-watch-thumbnail"
                            />
                            <div
                              className="its-content"
                              style={{
                                position: "relative",
                                left: "10px",
                                top: "6px",
                              }}
                            >
                              <Skeleton
                                count={1}
                                width={450}
                                height={20}
                                className="sk-watch-title"
                              />
                              <Skeleton
                                count={1}
                                width={250}
                                height={16}
                                style={{ position: "relative", top: "10px" }}
                                className="sk-watch-channel"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : ""}
              </div>
            </SkeletonTheme>
            <div
              className="like-right-section2"
              style={
                loading === true
                  ? { visibility: "hidden", display: "none" }
                  : { visibility: "visible", display: "block" }
              }
            >
              {watchlater.length > 0
                ? watchlater.map((element, index) => {
                    return (
                      <div
                        className={
                          theme
                            ? "liked-all-videos"
                            : "liked-all-videos liked-all-videos-light text-light-mode"
                        }
                        key={index}
                        style={{
                          display:
                            element.videoprivacy === "Public" ? "flex" : "none",
                        }}
                      >
                        <p style={{ color: "#aaa" }}>{index + 1}</p>
                        <div
                          className="liked-videos-all-data2"
                          onClick={() => {
                            if (user?.email) {
                              updateViews(element.savedVideoID);
                              setTimeout(() => {
                                window.location.href = `/video/${element.savedVideoID}`;
                              }, 400);
                            } else {
                              window.location.href = `/video/${element.savedVideoID}`;
                            }
                          }}
                        >
                          <img
                            src={element.thumbnailURL}
                            alt="first-like-thumbnail"
                            loading="lazy"
                          />
                          <p
                            className={
                              theme ? "durationn3" : "durationn3 text-dark-mode"
                            }
                          >
                            {Math.floor(element.videoLength / 60) +
                              ":" +
                              (Math.round(element.videoLength % 60) < 10
                                ? "0" + Math.round(element.videoLength % 60)
                                : Math.round(element.videoLength % 60))}
                          </p>
                          <div className="its-content2">
                            {window.innerWidth <= 1000 ? (
                              <p>
                                {element.Title.length <= 50
                                  ? element.Title
                                  : `${element.Title.slice(0, 50)}..`}
                              </p>
                            ) : (
                              <p>{element.Title}</p>
                            )}

                            <p>{element.uploader}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : ""}
            </div>
          </div>
        ) : (
          <div className="main-trending-section">
            <div className="spin23" style={{ top: "200px" }}>
              <span className={theme ? "loader2" : "loader2-light"}></span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default WatchLater;
