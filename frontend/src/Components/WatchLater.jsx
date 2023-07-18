import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import nothing from "../img/nothing.png";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import "../Css/likevideos.css";

function WatchLater() {
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const [watchlater, setWatchLater] = useState([]);
  const [VideoViews, setVideoViews] = useState();

  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setEmail(jwtDecode(token).email);
    setName(jwtDecode(token).name);
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
                        navigate(`/video/${watchlater[0].savedVideoID}`);
                      window.location.reload();
                      }
                      navigate(`/video/${watchlater[0].savedVideoID}`);
                      window.location.reload();
                    }}
                  >
                    <img
                      src={watchlater[0].thumbnailURL}
                      alt="first-like-thumbnail"
                      className="first-thumbnail"
                      loading="lazy"
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
                      navigate(`/video/${watchlater[0].savedVideoID}`);
                      window.location.reload();
                    }
                    navigate(`/video/${watchlater[0].savedVideoID}`);
                    window.location.reload();
                  }}
                >
                  <PlayArrowIcon fontSize="medium" style={{ color: "black" }} />
                  <p className="play-all">Play all</p>
                </div>
              </div>
            </div>
            <div className="like-right-section">
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
                              navigate(`/video/${element.savedVideoID}`);
                            window.location.reload();
                            }
                            navigate(`/video/${element.savedVideoID}`);
                            window.location.reload();
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
            <div className="spin2" style={{ height: "auto" }}>
              <ReactLoading
                type={"spin"}
                color={"white"}
                height={50}
                width={50}
              />
              <p style={{ marginTop: "15px" }}>
                Fetching the data, Hang tight...{" "}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default WatchLater;
