import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import nothing from "../img/nothing.png";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import "../Css/likevideos.css";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function WatchLater() {
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const [watchlater, setWatchLater] = useState([]);
  const [VideoViews, setVideoViews] = useState();
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setEmail(jwtDecode(token).email);
    setName(jwtDecode(token).name);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3600);
  }, []);

  useEffect(() => {
    localStorage.setItem("menuClicked", JSON.stringify(menuClicked));
  }, [menuClicked]);

  useEffect(() => {
    const getWatchLater = async () => {
      try {
        if (email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getwatchlater/${email}`
          );
          const savedData = await response.json();
          setWatchLater(savedData);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getWatchLater, 100);

    return () => clearInterval(interval);
  }, [email]);

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

  useEffect(() => {
    const getVideos = async () => {
      try {
        const response = await fetch("http://localhost:3000/getvideos");
        const { views } = await response.json();

        setVideoViews(views);
      } catch (error) {
        console.log(error.message);
      }
    };

    getVideos();
  }, []);

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

  if (watchlater.savedData === "NO DATA") {
    return (
      <>
        <Navbar />
        <LeftPanel />
        <div className="searched-content">
          <img src={nothing} alt="no results" className="nothing-found" />
          <p className="no-results">No videos found!</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <LeftPanel />
      <div className="liked-video-data">
        {watchlater.length > 0 ? (
          <div
            className="like-video-sections"
            style={
              menuClicked === false
                ? { left: "80px", width: "100%" }
                : { left: "255px" }
            }
          >
            <div
              className="like-left-section"
              style={{
                backgroundImage: `url(${watchlater[0]?.thumbnailURL})`,
              }}
            >
              <div className="page-cover">
                {watchlater && (
                  <div
                    className="firstvideo-thumbnail"
                    onClick={() => {
                      if (token) {
                        updateViews(watchlater[0].savedVideoID);
                        setTimeout(() => {
                          navigate(`/video/${watchlater[0].savedVideoID}`);
                          window.location.reload();
                        }, 400);
                      } else {
                        navigate(`/video/${watchlater[0].savedVideoID}`);
                        window.location.reload();
                      }
                    }}
                  >
                    <SkeletonTheme baseColor="#353535" highlightColor="#444">
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
                    <p className="sample-play">&#9654; PLAY ALL</p>
                  </div>
                )}
                <div className="last-like-section">
                  <p className="like-head">Watch later</p>
                  <div className="last-like2">
                    <p className="like-username">{name}</p>
                    <p className="like-total-videos">
                      {watchlater.length} videos
                    </p>
                  </div>
                </div>
                <div
                  className="playvideo-btn"
                  onClick={() => {
                    if (token) {
                      updateViews(watchlater[0].savedVideoID);
                      setTimeout(() => {
                        navigate(`/video/${watchlater[0].savedVideoID}`);
                        window.location.reload();
                      }, 400);
                    } else {
                      navigate(`/video/${watchlater[0].savedVideoID}`);
                      window.location.reload();
                    }
                  }}
                >
                  <PlayArrowIcon fontSize="medium" style={{ color: "black" }} />
                  <p className="play-all">Play all</p>
                </div>
              </div>
            </div>
            <SkeletonTheme baseColor="#353535" highlightColor="#444">
              <div
                className="like-right-section"
                style={
                  loading === true ? { display: "block" } : { display: "none" }
                }
              >
                {watchlater.length > 0
                  ? watchlater.map((element, index) => {
                      return (
                        <div className="liked-all-videos" key={index}>
                          <div className="liked-videos-all-data">
                            <Skeleton
                              count={1}
                              width={180}
                              height={101}
                              style={{ borderRadius: "12px" }}
                            />
                            <div
                              className="its-content"
                              style={{
                                position: "relative",
                                left: "10px",
                                top: "6px",
                              }}
                            >
                              <Skeleton count={1} width={450} height={20} />
                              <Skeleton
                                count={1}
                                width={250}
                                height={16}
                                style={{ position: "relative", top: "10px" }}
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
                  ? { visibility: "hidden" }
                  : { visibility: "visible" }
              }
            >
              {watchlater.length > 0
                ? watchlater.map((element, index) => {
                    return (
                      <div className="liked-all-videos" key={index}>
                        <p style={{ color: "#aaa" }}>{index + 1}</p>
                        <div
                          className="liked-videos-all-data"
                          onClick={() => {
                            if (token) {
                              updateViews(element.savedVideoID);
                              setTimeout(() => {
                                navigate(`/video/${element.savedVideoID}`);
                                window.location.reload();
                              }, 400);
                            } else {
                              navigate(`/video/${element.savedVideoID}`);
                              window.location.reload();
                            }
                          }}
                        >
                          <img
                            src={element.thumbnailURL}
                            alt="first-like-thumbnail"
                            loading="lazy"
                          />
                          <div className="its-content">
                            <p>{element.Title}</p>
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
              <span className="loader"></span>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default WatchLater;
