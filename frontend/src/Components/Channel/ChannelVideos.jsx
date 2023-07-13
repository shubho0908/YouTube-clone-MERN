import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

function ChannelVideos(prop) {
  const [myVideos, setMyVideos] = useState([]);
  const [Email, setEmail] = useState();
  const [videosort, setVideoSort] = useState();
  const token = localStorage.getItem("userToken");

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

  useEffect(() => {
    const getUserVideos = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getuservideos/${Email || prop.newmail}`
        );

        const myvideos = await response.json();
        setMyVideos(myvideos);
      } catch (error) {
        console.log(error.message);
      }
    };

    getUserVideos();
  }, [Email, prop.newmail]);

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
              videosort === "Latest" ? "latest-video active" : "latest-video"
            }
            onClick={() => {
              setVideoSort("Latest");
            }}
          >
            Latest
          </button>
          <button
            className={
              videosort === "Popular" ? "Popular-video active" : "Popular-video"
            }
            onClick={() => {
              setVideoSort("Popular");
            }}
          >
            Popular
          </button>
          <button
            className={
              videosort === "Oldest" ? "Oldest-video active" : "Oldest-video"
            }
            onClick={() => {
              setVideoSort("Oldest");
            }}
          >
            Oldest
          </button>
        </div>
        <div className="uploadedvideos-sectionall">
          {myVideos.length > 0 &&
            myVideos.map((element, index) => {
              return (
                <div
                  className="uploaded-video-contents"
                  key={index}
                  onClick={() => {
                    navigate(`/video/${element._id}`);
                    window.location.reload();
                    if (token) {
                      updateViews(element._id);
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
                  <div className="videos-metadataa">
                    <p>{element.Title}</p>
                    <div className="views-and-time">
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
                      <p className="video_published-date">
                        &#x2022;{" "}
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
