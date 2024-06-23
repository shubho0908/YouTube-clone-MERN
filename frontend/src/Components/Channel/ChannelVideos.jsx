import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSelector } from "react-redux";

function ChannelVideos(prop) {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000"
  const [myVideos, setMyVideos] = useState([]);
  const [videosort, setVideoSort] = useState();
  const [loading, setLoading] = useState(true);
  const [showDiv, setShowDiv] = useState(false);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const User = useSelector((state) => state.user.user);
  const { user } = User;
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    function handleResize() {
      setShowDiv(window.innerWidth <= 600);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const getUserVideos = async () => {
      try {
        if (user?.email === prop?.newmail) {
          const response = await fetch(
            `${backendURL}/getuservideos/${user?.email}`
          );
          const myvideos = await response.json();
          setMyVideos(myvideos);
        } else {
          const response = await fetch(
            `${backendURL}/getuservideos/${prop?.newmail}`
          );
          const myvideos = await response.json();
          setMyVideos(myvideos);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    getUserVideos();
  }, [user?.email, prop?.newmail]);

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

  useEffect(() => {
    const sortVideos = () => {
      switch (videosort) {
        case "Latest":
          setMyVideos((prevVideos) =>
            [...prevVideos].sort(
              (a, b) => new Date(b.uploaded_date) - new Date(a.uploaded_date)
            )
          );
          break;
        case "Popular":
          setMyVideos((prevVideos) =>
            [...prevVideos].sort((a, b) => b.views - a.views)
          );
          break;
        case "Oldest":
          setMyVideos((prevVideos) =>
            [...prevVideos].sort(
              (a, b) => new Date(a.uploaded_date) - new Date(b.uploaded_date)
            )
          );
          break;
        default:
          break;
      }
    };

    sortVideos();
  }, [videosort]);

  return (
    <>
      <div className="allvideo-sectionn">
        <div className="video-sorting">
          <button
            className={
              videosort === "Latest"
                ? `latest-video ${theme ? "" : "btn-light-mode"} active${
                    theme ? "" : "-light"
                  }`
                : `latest-video ${theme ? "" : "btn-light-mode"}`
            }
            onClick={() => {
              setVideoSort("Latest");
            }}
          >
            Latest
          </button>
          <button
            className={
              videosort === "Popular"
                ? `Popular-video ${theme ? "" : "btn-light-mode"} active${
                    theme ? "" : "-light"
                  }`
                : `Popular-video ${theme ? "" : "btn-light-mode"}`
            }
            onClick={() => {
              setVideoSort("Popular");
            }}
          >
            Popular
          </button>
          <button
            className={
              videosort === "Oldest"
                ? `Oldest-video ${theme ? "" : "btn-light-mode"} active${
                    theme ? "" : "-light"
                  }`
                : `Oldest-video ${theme ? "" : "btn-light-mode"}`
            }
            onClick={() => {
              setVideoSort("Oldest");
            }}
          >
            Oldest
          </button>
        </div>
        <SkeletonTheme
          baseColor={theme ? "#353535" : "#aaaaaa"}
          highlightColor={theme ? "#444" : "#b6b6b6"}
        >
          <div
            className="sk-uploadedvideos-sectionall"
            style={loading === true ? { display: "grid" } : { display: "none" }}
          >
            {myVideos.length > 0 &&
              myVideos.map((element, index) => {
                return (
                  <div
                    className="uploaded-video-contents sk-uploadcontent"
                    key={index}
                    style={{
                      display:
                        element.visibility === "Public" ? "block" : "none",
                    }}
                  >
                    <Skeleton
                      count={1}
                      width={300}
                      height={169}
                      style={{ borderRadius: "10px" }}
                      className="sk-video-sec-thumbnail"
                    />
                    <div
                      className="videos-metadataa sk-videosmeta"
                      style={{ position: "relative", top: "15px" }}
                    >
                      <Skeleton
                        count={2}
                        width={280}
                        height={18}
                        style={{ borderRadius: "4px" }}
                        className="sk-video-sec-title"
                      />
                      <div className="views-and-time">
                        <Skeleton
                          count={1}
                          width={170}
                          height={15}
                          style={{ borderRadius: "4px" }}
                          className="sk-video-sec-extra"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
          <div
            className="sk-uploadedvideos-sectionall2"
            style={
              loading === true && showDiv
                ? { display: "flex" }
                : { display: "none" }
            }
          >
            {myVideos.length > 0 &&
              myVideos.map((element, index) => {
                return (
                  <div
                    className="uploaded-video-contents sk-uploadcontent"
                    key={index}
                    style={{
                      display:
                        element.visibility === "Public" ? "block" : "none",
                    }}
                  >
                    <Skeleton
                      count={1}
                      width={300}
                      height={169}
                      style={{ borderRadius: "10px" }}
                      className="sk-video-sec-thumbnail"
                    />
                    <div
                      className="videos-metadataa sk-videosmeta"
                      style={{ position: "relative", top: "15px" }}
                    >
                      <Skeleton
                        count={2}
                        width={280}
                        height={18}
                        style={{ borderRadius: "4px" }}
                        className="sk-video-sec-title"
                      />
                      <div className="views-and-time">
                        <Skeleton
                          count={1}
                          width={170}
                          height={15}
                          style={{ borderRadius: "4px" }}
                          className="sk-video-sec-extra"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </SkeletonTheme>
        <div
          className="uploadedvideos-sectionall"
          style={
            loading === true
              ? { visibility: "hidden", display: "none" }
              : { visibility: "visible", display: "grid" }
          }
        >
          {myVideos.length > 0 &&
            myVideos.map((element, index) => {
              return (
                <div
                  className={`${
                    element.visibility === "Private"
                      ? "not-thiss"
                      : "uploaded-video-contents"
                  }`}
                  key={index}
                  style={{
                    display: element.visibility === "Public" ? "block" : "none",
                  }}
                  onClick={() => {
                    if (user?.email) {
                      updateViews(element._id);
                      setTimeout(() => {
                        navigate(`/video/${element._id}`);
                        window.location.reload();
                      }, 400);
                    } else {
                      navigate(`/video/${element._id}`);
                      window.location.reload();
                    }
                  }}
                >
                  <img
                    src={element.thumbnailURL}
                    alt="Thumbnail"
                    className="myvidthumbnail"
                    loading="lazy"
                  />
                  <p className="myvideo-duration2 duration-new">
                    {Math.floor(element.videoLength / 60) +
                      ":" +
                      (Math.round(element.videoLength % 60) < 10
                        ? "0" + Math.round(element.videoLength % 60)
                        : Math.round(element.videoLength % 60))}
                  </p>
                  <div
                    className={
                      theme
                        ? "videos-metadataa"
                        : "videos-metadataa text-light-mode"
                    }
                  >
                    <p>
                      {element.Title.length <= 50
                        ? element.Title
                        : `${element.Title.slice(0, 50)}...`}
                    </p>
                    <div
                      className={
                        theme
                          ? "views-and-time"
                          : "views-and-time text-light-mode2"
                      }
                    >
                      <p className="myviews">
                        {element.views >= 1e9
                          ? `${(element.views / 1e9).toFixed(1)}B`
                          : element.views >= 1e6
                          ? `${(element.views / 1e6).toFixed(1)}M`
                          : element.views >= 1e3
                          ? `${(element.views / 1e3).toFixed(1)}K`
                          : element.views}{" "}
                        views
                      </p>
                      <p>&#x2022;</p>
                      <p className="video_published-date">
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
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default ChannelVideos;
