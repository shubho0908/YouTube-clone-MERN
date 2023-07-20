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
  const [Visibility, setVisibility] = useState();
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const [VideoViews, setVideoViews] = useState();
  const [VideoData, setVideoData] = useState([]);
  const [TagsSelected, setTagsSelected] = useState("All");
  const [publishDate, setPublishDate] = useState();
  const [FilteredVideos, setFilteredVideos] = useState([]);

  const token = localStorage.getItem("userToken");

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
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
    "Artificial Intelligence",
    "Comedy",
    "Coding",
    "Gaming",
    "Vlog",
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
          Visibility,
          videoData,
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
        setVisibility(Visibility);
        setVideoData(videoData);
      } catch (error) {
        console.log(error.message);
      }
    };

    getVideos();
  }, []);

  useEffect(() => {
    if (TagsSelected !== "All") {
      const tagsSelectedLower = TagsSelected.toLowerCase();
      const filteredVideos = VideoData.flatMap((item) =>
        item.VideoData.filter(
          (element) =>
            element.Tags.toLowerCase().includes(tagsSelectedLower) ||
            element.Title.toLowerCase().includes(tagsSelectedLower)
        )
      );
      setFilteredVideos(filteredVideos);
    } else {
      setFilteredVideos([]);
    }
  }, [TagsSelected, VideoData]);

  //UPDATE VIEWS

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
                <div
                  className={
                    TagsSelected === element ? `top-tags tag-color` : `top-tags`
                  }
                  key={index}
                >
                  <p
                    onClick={() => {
                      setTagsSelected(`${element}`);
                    }}
                  >
                    {element}
                  </p>
                </div>
              );
            })}
          </div>
          {thumbnails ? (
            <div
              className="video-section"
              style={{
                marginLeft: menuClicked ? "40px" : "80px",
              }}
            >
              <div
                className="uploaded-videos"
                style={
                  menuClicked === true
                    ? {
                        paddingRight: "50px",
                        display: TagsSelected === "All" ? "grid" : "none",
                      }
                    : {
                        paddingRight: "0px",
                        display: TagsSelected === "All" ? "grid" : "none",
                      }
                }
              >
                {thumbnails &&
                  thumbnails.map((element, index) => {
                    return (
                      <div
                        className="video-data"
                        key={index}
                        style={
                          Visibility[index] === "Public"
                            ? { display: "block" }
                            : { display: "none" }
                        }
                        onClick={() => {
                          if (token) {
                            updateViews(VideoID[index]);
                           setTimeout(() => {
                            navigate(`/video/${VideoID[index]}`);
                            window.location.reload();
                           }, 400);
                          }
                          navigate(`/video/${VideoID[index]}`);
                          window.location.reload();
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
              <div
                className="uploaded-videos"
                style={
                  menuClicked === true
                    ? {
                        paddingRight: "50px",
                        display: TagsSelected !== "All" ? "grid" : "none",
                      }
                    : {
                        paddingRight: "0px",
                        display: TagsSelected !== "All" ? "grid" : "none",
                      }
                }
              >
                {FilteredVideos &&
                  FilteredVideos.map((element, index) => {
                    return (
                      <div
                        className="video-data"
                        key={index}
                        style={
                          element.visibility === "Public"
                            ? { display: "block" }
                            : { display: "none" }
                        }
                        onClick={() => {
                          if (token) {
                            updateViews(element._id);
                           setTimeout(() => {
                            navigate(`/video/${element._id}`);
                            window.location.reload();
                           }, 400);
                          }
                          navigate(`/video/${element._id}`);
                          window.location.reload();
                        }}
                      >
                        <img
                          style={{ width: "330px", borderRadius: "10px" }}
                          src={element.thumbnailURL}
                          loading="lazy"
                          alt="thumbnails"
                        />
                        <p className="duration">
                          {Math.floor(element.videoLength / 60) +
                            ":" +
                            (Math.round(element.videoLength % 60) < 10
                              ? "0" + Math.round(element.videoLength % 60)
                              : Math.round(element.videoLength % 60))}
                        </p>

                        <div className="channel-basic-data">
                          <div className="channel-pic">
                            <img
                              className="channel-profile"
                              src={element.ChannelProfile}
                              alt="channel-profile"
                            />
                          </div>
                          <div className="channel-text-data">
                            <p className="title" style={{ marginTop: "10px" }}>
                              {element.Title}
                            </p>
                            <div className="video-uploader">
                              <p
                                className="uploader"
                                style={{ marginTop: "10px" }}
                              >
                                {element.uploader}
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
                                {element.views >= 1e9
                                  ? `${(element.views / 1e9).toFixed(1)}B`
                                  : element.views >= 1e6
                                  ? `${(element.views / 1e6).toFixed(1)}M`
                                  : element.views >= 1e3
                                  ? `${(element.views / 1e3).toFixed(1)}K`
                                  : element.views}{" "}
                                views
                              </p>
                              <p
                                className="upload-time"
                                style={{ marginLeft: "4px" }}
                              >
                                &#x2022;{" "}
                                {(() => {
                                  const timeDifference =
                                    new Date() -
                                    new Date(element.uploaded_date);
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
