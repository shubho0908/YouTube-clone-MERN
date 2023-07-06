import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import "../Css/browse.css";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { useNavigate } from "react-router-dom";

function Browse() {
  const [videos, setVideos] = useState("");
  const [thumbnails, setThumbnails] = useState();
  const [Titles, setTitles] = useState();
  const [uploader, setUploader] = useState();
  const [ProfilePic, setProfilePic] = useState();
  const [duration, setDuration] = useState();
  const [VideoID, setVideoID] = useState();
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const [scrollPosition, setScrollPosition] = useState(0);
  const [VideoViews, setVideoViews] = useState();
  const [publishDate, setPublishDate] = useState();

  const token = localStorage.getItem("userToken");

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentPosition =
        window.pageYOffset || document.documentElement.scrollTop;

      setScrollPosition(currentPosition);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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

  useEffect(() => {
    localStorage.setItem("menuClicked", JSON.stringify(menuClicked));
  }, [menuClicked]);

  const Tags = [
    "All",
    "Music",
    "Tutorial",
    "Vlog",
    "Gaming",
    "Comedy",
    "Beauty",
    "Travel",
    "Food",
    "Fashion",
    "Tutorial",
    "Vlog",
    "Gaming",
    "Comedy",
    "Beauty",
    "Travel",
    "Food",
    "Fashion",
    "Travel",
    "Food",
    "Fashion",
    "Tutorial",
    "Vlog",
    "Gaming",
    "Comedy",
    "Beauty",
    "Travel",
    "Food",
    "Fashion",
  ];

  useEffect(() => {
    const getVideos = async () => {
      try {
        const response = await fetch("http://localhost:3000/getvideos");
        const {
          videoURLs,
          thumbnailURLs,
          titles,
          Uploader,
          Profile,
          Duration,
          videoID,
          views,
          uploadDate,
        } = await response.json();
        setVideos(videoURLs);
        setThumbnails(thumbnailURLs);
        setTitles(titles);
        setUploader(Uploader);
        setProfilePic(Profile);
        setDuration(Duration);
        setVideoID(videoID);
        setVideoViews(views);
        setPublishDate(uploadDate);
      } catch (error) {
        console.log(error.message);
      }
    };

    getVideos();
  }, []);

  //UPDATE VIEWS

  const updateViews = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/updateview/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="browse">
        <LeftPanel />
        <div
          className="browse-data"
          style={
            menuClicked === false
              ? { left: "80px", width: "100%" }
              : { left: "250px" }
          }
        >
          <div className="popular-categories">
            {Tags.map((element, index) => {
              return (
                <div className={`top-tags tag-${index}`} key={index}>
                  <p>{element}</p>
                </div>
              );
            })}
          </div>
          {thumbnails ? (
            <div
              className="video-section"
              style={{
                height: scrollPosition > 110 ? "auto" : "100vh",
                marginLeft: menuClicked ? "40px" : "80px",
              }}
            >
              <div
                className="uploaded-videos"
                style={
                  menuClicked === true
                    ? { paddingRight: "50px" }
                    : { paddingRight: "0px" }
                }
              >
                {thumbnails &&
                  thumbnails.map((element, index) => {
                    return (
                      <div
                        className="video-data"
                        key={index}
                        onClick={() => {
                          navigate(`/video/${VideoID[index]}`);
                          window.location.reload();
                          if (token) {
                            updateViews(VideoID[index]);
                          }
                        }}
                      >
                        <img
                          style={{ width: "330px", borderRadius: "10px" }}
                          src={element}
                          loading="lazy"
                          alt="thumbnails"
                        />
                        <p className="duration">
                          {Math.floor(duration[index] / 60) +
                            ":" +
                            (Math.round(duration[index] % 60) < 10
                              ? "0" + Math.round(duration[index] % 60)
                              : Math.round(duration[index] % 60))}
                        </p>

                        <div className="channel-basic-data">
                          <div className="channel-pic">
                            <img
                              className="channel-profile"
                              src={ProfilePic[index]}
                              alt="channel-profile"
                            />
                          </div>
                          <div className="channel-text-data">
                            <p className="title" style={{ marginTop: "10px" }}>
                              {Titles[index]}
                            </p>
                            <div className="video-uploader">
                              <p
                                className="uploader"
                                style={{ marginTop: "10px" }}
                              >
                                {uploader[index]}
                              </p>
                              <Tooltip
                                TransitionComponent={Zoom}
                                title="Verified"
                                placement="right"
                              >
                                <CheckCircleIcon
                                  fontSize="100px"
                                  style={{
                                    color: "rgb(138, 138, 138)",
                                    marginTop: "8px",
                                    marginLeft: "4px",
                                  }}
                                />
                              </Tooltip>
                            </div>
                            <div className="view-time">
                              <p className="views">
                                {VideoViews[index] >= 1e9
                                  ? `${(VideoViews[index] / 1e9).toFixed(1)}B`
                                  : VideoViews[index] >= 1e6
                                  ? `${(VideoViews[index] / 1e6).toFixed(1)}M`
                                  : VideoViews[index] >= 1e3
                                  ? `${(VideoViews[index] / 1e3).toFixed(1)}K`
                                  : VideoViews[index]}{" "}
                                views
                              </p>
                              <p
                                className="upload-time"
                                style={{ marginLeft: "4px" }}
                              >
                                &#x2022;{" "}
                                {(() => {
                                  const timeDifference =
                                    new Date() - new Date(publishDate[index]);
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
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="spinner" style={{ height: "100vh" }}>
              <ReactLoading
                type={"spin"}
                color={"white"}
                height={50}
                width={50}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Browse;
