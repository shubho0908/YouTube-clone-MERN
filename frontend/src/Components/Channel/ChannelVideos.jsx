import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

function ChannelVideos() {
  const [myVideos, setMyVideos] = useState([]);
  const [Email, setEmail] = useState();
  const token = localStorage.getItem("userToken");

  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

  useEffect(() => {
    const getUserVideos = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getuservideos/${Email}`
        );
        const myvideos = await response.json();
        setMyVideos(myvideos);
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getUserVideos, 200);

    return () => clearInterval(interval);
  }, [Email]);

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
      <div className="allvideo-sectionn">
        <div className="video-sorting">
          <button className="latest-video">Latest</button>
          <button className="Popular-video">Popular</button>
          <button className="Oldest-video">Oldest</button>
        </div>
        <div className="uploadedvideos-sectionall">
          {myVideos &&
            myVideos.map((element, index) => {
              return (
                <div className="uploaded-video-contents" key={index} 
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
                  />
                  <p className="myvideo-duration2 duration-new">
                    {Math.floor(element.videoLength / 60) +
                      ":" +
                      (Math.round(element.videoLength % 60) < 10
                        ? "0" + Math.round(element.duration % 60)
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
