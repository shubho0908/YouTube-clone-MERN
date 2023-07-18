import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import nothing from "../img/nothing.png";
import "../Css/likevideos.css";

function LikeVideos() {
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const [videolike, setLikedVideos] = useState([]);

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
    const getLikeVideos = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getlikevideos/${email}`
        );
        const result = await response.json();
        setLikedVideos(result);
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getLikeVideos, 100);

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

  if (videolike === "NO DATA") {
    return (
      <>
        <Navbar />
        <LeftPanel />
        <div className="searched-content">
          <img src={nothing} alt="no results" className="nothing-found" />
          <p className="no-results">No liked videos found!</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <LeftPanel />
      <div className="liked-video-data">
        {videolike.length > 0 ? (
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
                backgroundImage: `url(${videolike[0]?.thumbnailURL})`,
              }}
            >
              <div className="page-cover">
                {videolike && (
                  <div
                    className="firstvideo-thumbnail"
                    onClick={() => {
                      if (token) {
                        updateViews(videolike[0].likedVideoID);
                        navigate(`/video/${videolike[0].likedVideoID}`);
                        window.location.reload();
                      }
                      navigate(`/video/${videolike[0].likedVideoID}`);
                      window.location.reload();
                    }}
                  >
                    <img
                      src={videolike[0].thumbnailURL}
                      alt="first-like-thumbnail"
                      className="first-thumbnail"
                      loading="lazy"
                    />
                    <p className="sample-play">&#9654; PLAY ALL</p>
                  </div>
                )}
                <div className="last-like-section">
                  <p className="like-head">Liked videos</p>
                  <div className="last-like2">
                    <p className="like-username">{name}</p>
                    <p className="like-total-videos">
                      {videolike.length} videos
                    </p>
                  </div>
                </div>
                <div
                  className="playvideo-btn"
                  onClick={() => {
                    if (token) {
                      updateViews(videolike[0].likedVideoID);
                      navigate(`/video/${videolike[0].likedVideoID}`);
                      window.location.reload();
                    }
                    navigate(`/video/${videolike[0].likedVideoID}`);
                    window.location.reload();
                  }}
                >
                  <PlayArrowIcon fontSize="medium" style={{ color: "black" }} />
                  <p className="play-all">Play all</p>
                </div>
              </div>
            </div>
            <div className="like-right-section">
              {videolike.length > 0
                ? videolike.map((element, index) => {
                    return (
                      <div className="liked-all-videos" key={index}>
                        <p style={{ color: "#aaa" }}>{index + 1}</p>
                        <div
                          className="liked-videos-all-data"
                          onClick={() => {
                            if (token) {
                              updateViews(element.likedVideoID);
                              navigate(`/video/${element.likedVideoID}`);
                              window.location.reload();
                            }
                            navigate(`/video/${element.likedVideoID}`);
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

export default LikeVideos;
