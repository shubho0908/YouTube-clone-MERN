import "../Css/browse.css";
import { useEffect, useState } from "react";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import LeftPanel from "./LeftPanel";
import Navbar from "./Navbar";
import "../Css/theme.css";
import { useSelector } from "react-redux";

function Browse() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000";
  const [thumbnails, setThumbnails] = useState([]);
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
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    window.scrollTo(0, 0);
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
    localStorage.setItem("menuClicked", JSON.stringify(menuClicked));
  }, [menuClicked]);

  const Tags = [
    "All",
    "Artificial Intelligence",
    "Comedy",
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
        const response = await fetch(`${backendURL}/getvideos`);
        const {
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
        // console.log(error.message);
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

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3600);
  }, []);

  useEffect(() => {
    if (theme === false && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "white";
    } else if (theme === true && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "0f0f0f";
    }
  }, [theme]);

  //UPDATE VIEWS

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

  return (
    <>
      <Navbar />
      <LeftPanel />
      <SkeletonTheme
        baseColor={theme ? "#353535" : "#aaaaaa"}
        highlightColor={theme ? "#444" : "#b6b6b6"}
      >
        <div
          className={theme ? "browse" : "browse light-mode"}
          style={loading === true ? { display: "flex" } : { display: "none" }}
        >
          <div
            className={
              menuClicked === true
                ? `browse-data ${theme ? "" : "light-mode"}`
                : `browse-data2 ${theme ? "" : "light-mode"}`
            }
            style={menuClicked === false ? { left: "74px" } : { left: "250px" }}
          >
            <div
              className={
                theme ? "popular-categories" : "popular-categories light-mode"
              }
            >
              {Tags.map((element, index) => {
                return (
                  <div
                    className={
                      TagsSelected === element
                        ? `top-tags ${theme ? "tag-color" : "tag-color-light"}`
                        : `top-tags ${theme ? "" : "tagcolor-newlight"}`
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
            <div
              className="video-section"
              style={{
                marginLeft: menuClicked ? "40px" : "40px",
              }}
            >
              <div className="uploaded-videos">
                {Array.from({ length: 16 }).map((_, index) => (
                  <>
                    <div className="video-data">
                      <Skeleton
                        key={index}
                        count={1}
                        width={330}
                        height={186}
                        style={{ borderRadius: "12px" }}
                        className="sk-browse-vid"
                      />
                      <div className="channel-basic-data">
                        <Skeleton
                          key={index}
                          count={1}
                          width={40}
                          height={40}
                          style={{ borderRadius: "100%", marginTop: "40px" }}
                          className="sk-browse-profile"
                        />
                        <Skeleton
                          key={index}
                          count={2}
                          width={250}
                          height={15}
                          style={{
                            position: "relative",
                            top: "40px",
                            left: "15px",
                          }}
                          className="sk-browse-title"
                        />
                      </div>
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </SkeletonTheme>
      <div
        className={theme ? "browse" : "browse light-mode"}
        style={
          loading === true
            ? { visibility: "hidden", display: "none" }
            : { visibility: "visible", display: "flex" }
        }
      >
        <div
          className={
            menuClicked === true
              ? `browse-data ${theme ? "" : "light-mode"}`
              : `browse-data2 ${theme ? "" : "light-mode"}`
          }
          style={menuClicked === false ? { left: "74px " } : { left: "250px " }}
        >
          <div
            className={
              theme ? "popular-categories" : "popular-categories light-mode"
            }
          >
            {Tags.map((element, index) => {
              return (
                <div
                  className={
                    TagsSelected === element
                      ? `top-tags ${theme ? "tag-color" : "tag-color-light"}`
                      : `top-tags ${theme ? "" : "tagcolor-newlight"}`
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

          <div
            className="video-section"
            style={{
              marginLeft: menuClicked ? "40px" : "40px",
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
                thumbnails.length > 0 &&
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
                        if (user?.success) {
                          updateViews(VideoID[index]);
                          setTimeout(() => {
                            window.location.href = `/video/${VideoID[index]}`;
                          }, 400);
                        }
                        window.location.href = `/video/${VideoID[index]}`;
                      }}
                    >
                      <img
                        style={{ width: "330px", borderRadius: "10px" }}
                        src={element}
                        alt="thumbnails"
                        className="browse-thumbnails"
                      />
                      <p className="duration">
                        {Math.floor(duration[index] / 60) +
                          ":" +
                          (Math.round(duration[index] % 60) < 10
                            ? "0" + Math.round(duration[index] % 60)
                            : Math.round(duration[index] % 60))}
                      </p>

                      <div
                        className={
                          theme === true
                            ? "channel-basic-data"
                            : "channel-basic-data text-light-mode"
                        }
                      >
                        <div className="channel-pic">
                          <img
                            className="channel-profile"
                            src={ProfilePic[index]}
                            alt="channel-profile"
                          />
                        </div>
                        <div className="channel-text-data">
                          <p className="title" style={{ marginTop: "10px" }}>
                            {Titles[index] && Titles[index].length <= 60
                              ? Titles[index]
                              : `${Titles[index].slice(0, 55)}..`}
                          </p>
                          <div className="video-uploader">
                            <Tooltip
                              TransitionComponent={Zoom}
                              title={uploader[index]}
                              placement="top"
                            >
                              <p
                                className={
                                  theme
                                    ? "uploader"
                                    : "uploader text-light-mode2"
                                }
                                style={{ marginTop: "10px" }}
                              >
                                {uploader[index]}
                              </p>
                            </Tooltip>
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
                          <div
                            className={
                              theme ? "view-time" : "view-time text-light-mode2"
                            }
                          >
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
              className="uploaded-videos2"
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
                        if (user?.success) {
                          updateViews(element._id);
                          setTimeout(() => {
                            window.location.href = `/video/${element._id}`;
                          }, 400);
                        }
                        window.location.href = `/video/${element._id}`;
                      }}
                    >
                      <img
                        style={{ width: "330px", borderRadius: "10px" }}
                        src={element.thumbnailURL}
                        alt="thumbnails"
                        className="browse-thumbnails"
                      />
                      <p className="duration">
                        {Math.floor(element.videoLength / 60) +
                          ":" +
                          (Math.round(element.videoLength % 60) < 10
                            ? "0" + Math.round(element.videoLength % 60)
                            : Math.round(element.videoLength % 60))}
                      </p>

                      <div
                        className={
                          theme === true
                            ? "channel-basic-data"
                            : "channel-basic-data text-light-mode"
                        }
                      >
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
                              className={
                                theme ? "uploader" : "uploader text-light-mode2"
                              }
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
                          <div
                            className={
                              theme ? "view-time" : "view-time text-light-mode2"
                            }
                          >
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
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Browse;
