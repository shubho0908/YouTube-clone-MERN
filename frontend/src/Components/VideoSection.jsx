import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Plyr from "plyr";
import Navbar from "./Navbar";
import Share from "./Share";
import "../Css/videoSection.css";
import ReactLoading from "react-loading";
import "plyr/dist/plyr.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ReplyIcon from "@mui/icons-material/Reply";
import { TfiDownload } from "react-icons/Tfi";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import SortOutlinedIcon from "@mui/icons-material/SortOutlined";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";

function VideoSection() {
  const { id } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [email, setEmail] = useState();
  const [channelName, setChannelName] = useState();
  const [plyrInitialized, setPlyrInitialized] = useState(false);
  const [Display, setDisplay] = useState("none");
  const [comment, setComment] = useState();
  const [comments, setComments] = useState([]);
  const [isChannel, setisChannel] = useState();
  const [shareClicked, setShareClicked] = useState(false);
  const videoRef = useRef(null);
  const token = localStorage.getItem("userToken");

  const navigate = useNavigate();

  //EXTRAS

  const [videos, setVideos] = useState();
  const [thumbnails, setThumbnails] = useState();
  const [Titles, setTitles] = useState();
  const [Uploader, setUploader] = useState();
  const [duration, setDuration] = useState();
  const [VideoID, setVideoID] = useState();
  const [Views, SetViews] = useState();
  const [publishdate, setPublishDate] = useState();
  const [VideoLikes, setVideoLikes] = useState();
  const [CommentLikes, setCommentLikes] = useState();
  const [isLiked, setIsLiked] = useState();
  const [isSaved, setIsSaved] = useState();

  //Signup user Profile Pic
  const [userProfile, setUserProfile] = useState();

  useEffect(() => {
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

  useEffect(() => {
    const handleClick = () => {
      setShareClicked(false);
      document.body.classList.remove("bg-css");
    };

    const cancelShare = document.querySelector(".cancel-share");

    if (cancelShare) {
      cancelShare.addEventListener("click", handleClick);
    }

    return () => {
      if (cancelShare) {
        cancelShare.removeEventListener("click", handleClick);
      }
    };
  });

  useEffect(() => {
    const checkChannel = async () => {
      try {
        if (!email) {
          setChannelName(null);
          return;
        }

        const response = await fetch(
          `http://localhost:3000/checkchannel/${email}`
        );
        const channel = await response.json();
        setChannelName(channel);
      } catch (error) {
        console.log(error.message);
      }
    };

    checkChannel();
  }, [email]);

  useEffect(() => {
    const getChannel = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getchannel/${email}`
        );
        const { channel, profile } = await response.json();
        setisChannel(channel);
        setUserProfile(profile);
      } catch (error) {
        console.log(error.message);
      }
    };
    const interval = setInterval(getChannel, 100);

    return () => clearInterval(interval);
  }, [email]);

  useEffect(() => {
    const getVideoData = async () => {
      try {
        const response = await fetch(`http://localhost:3000/videodata/${id}`);
        const video = await response.json();
        setVideoData(video);
      } catch (error) {
        console.log(error.message);
      }
    };

    getVideoData();
  }, [id]);

  useEffect(() => {
    const getVideos = async () => {
      try {
        const response = await fetch("http://localhost:3000/getvideos");
        const {
          videoURLs,
          thumbnailURLs,
          titles,
          Uploader,
          Duration,
          videoID,
          views,
          uploadDate,
        } = await response.json();
        setVideos(videoURLs);
        setThumbnails(thumbnailURLs);
        setTitles(titles);
        setUploader(Uploader);
        setDuration(Duration);
        setVideoID(videoID);
        SetViews(views);
        setPublishDate(uploadDate);
      } catch (error) {
        console.log(error.message);
      }
    };

    getVideos();
  }, []);

  useEffect(() => {
    const initializePlyr = () => {
      if (!plyrInitialized && videoRef.current) {
        const player = new Plyr(videoRef.current, {
          background: "red",
          ratio: null,
        });
        setPlyrInitialized(true);
      }
    };

    if (videoData && videoData.VideoData) {
      initializePlyr();
    }
  }, [plyrInitialized, videoData]);

  useEffect(() => {
    const getLikes = async () => {
      try {
        const response = await fetch(`http://localhost:3000/getlike/${id}/`);
        const likes = await response.json();
        setVideoLikes(likes);
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getLikes, 200);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const LikeExists = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getuserlikes/${id}/${email}`
        );
        const { existingLikedVideo } = await response.json();
        if (!existingLikedVideo) {
          setIsLiked(false);
        } else {
          setIsLiked(true);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const interval = setInterval(LikeExists, 200);

    return () => clearInterval(interval);
  }, [email, id]);

  useEffect(() => {
    const CommentLikes = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/likecomment/${id}/${email}`
        );
        const result = await response.json();
        setCommentLikes(result);
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(CommentLikes, 200);

    return () => clearInterval(interval);
  }, [email, id]);

  useEffect(() => {
    const getWatchlater = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/checkwatchlater/${id}/${email}`
        );
        const savedID = await response.json();
        if (savedID.length === 0) {
          setIsSaved(false);
        } else if (savedID.length > 0 && savedID === id) {
          setIsSaved(true);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getWatchlater, 200);

    return () => clearInterval(interval);
  }, [id, email]);

  useEffect(() => {
    const getComments = async () => {
      try {
        const response = await fetch(`http://localhost:3000/getcomments/${id}`);
        const result = await response.json();
        setComments(result);
      } catch (error) {
        console.log(error.message);
      }
    };
    const interval = setInterval(getComments, 200);

    return () => clearInterval(interval);
  }, [id]);

  //POST REQUESTS

  const uploadComment = async () => {
    try {
      const data = {
        comment,
        email,
      };
      const response = await fetch(`http://localhost:3000/comments/${id}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      await response.json();
    } catch (error) {
      console.log(error.message);
    }
  };

  if (!videoData) {
    return (
      <>
        <div className="main-video-section2">
          <div className="spin2" style={{ height: "100vh" }}>
            <ReactLoading
              type={"spin"}
              color={"white"}
              height={50}
              width={50}
            />
          </div>
        </div>
      </>
    );
  }

  const { VideoData } = videoData;
  const matchedVideo = VideoData.find((item) => item._id === id);

  if (!matchedVideo) {
    return (
      <>
        <div className="main-video-section2">
          <div className="spin2" style={{ height: "100vh" }}>
            <ReactLoading
              type={"spin"}
              color={"white"}
              height={50}
              width={50}
            />
          </div>
        </div>
      </>
    );
  }

  const {
    videoURL,
    Title,
    thumbnailURL,
    ChannelProfile,
    uploader,
    Description,
    views,
    uploaded_date,
  } = matchedVideo;

  const likeVideo = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/like/${id}/${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
    } catch (error) {
      console.log(error.message);
    }
  };

  const LikeComment = async (commentIndex) => {
    try {
      const response = await fetch(
        `http://localhost:3000/likecomment/${id}/${commentIndex}/${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
    } catch (error) {
      console.log(error.message);
    }
  };

  const DeleteComment = async (commentIndex) => {
    try {
      const response = await fetch(
        `http://localhost:3000/deletecomment/${id}/${commentIndex}/${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
      // window.location.reload();
    } catch (error) {
      console.log(error.message);
    }
  };

  const DislikeVideo = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/dislikevideo/${id}/${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
      console.log("disliked");
    } catch (error) {
      console.log(error.message);
    }
  };

  const downloadVideo = () => {
    const link = document.createElement("a");
    link.href = videoURL;
    link.download = "video.mp4";
    link.click();
  };

  const saveVideo = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/watchlater/${id}/${email}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="main-video-section">
        <div className="left-video-section2">
          <div className="videoframe">
            <video
              className="play-video"
              controls
              ref={videoRef}
              poster={thumbnailURL}
            >
              <source src={videoURL} type="video/mp4" />
            </video>
          </div>
          <p className="vid-title">{Title}</p>
          <div className="some-channel-data">
            <div className="channel-left-data">
              <img
                src={ChannelProfile}
                alt="channelDP"
                className="channelDP"
                loading="lazy"
              />
              <div className="channel-data2">
                <div className="creator">
                  <p style={{ fontSize: "17px" }}>{uploader}</p>
                  <Tooltip
                    TransitionComponent={Zoom}
                    title="Verified"
                    placement="right"
                  >
                    <CheckCircleIcon
                      fontSize="100px"
                      style={{
                        color: "rgb(138, 138, 138)",
                        marginLeft: "4px",
                      }}
                    />
                  </Tooltip>
                </div>
                <p className="channel-subs">10M subscribers</p>
              </div>
              <button
                className="subscribe"
                disabled={uploader === channelName ? true : false}
              >
                Subscribe
              </button>
            </div>
            <div className="channel-right-data">
              <div className="like-dislike">
                <Tooltip
                  TransitionComponent={Zoom}
                  title="I like this"
                  placement="top"
                >
                  <div className="like-data" onClick={likeVideo}>
                    {isLiked === true && token ? (
                      <ThumbUpIcon
                        fontSize="medium"
                        style={{ color: "white" }}
                        className="like-icon"
                      />
                    ) : (
                      <ThumbUpAltOutlinedIcon
                        fontSize="medium"
                        style={{ color: "white" }}
                        className="like-icon"
                      />
                    )}

                    <p className="like-count">{VideoLikes}</p>
                  </div>
                </Tooltip>
                <div className="vl"></div>
                <Tooltip
                  TransitionComponent={Zoom}
                  title="I dislike this"
                  placement="top"
                >
                  <div className="dislike-data" onClick={DislikeVideo}>
                    <ThumbDownOutlinedIcon
                      fontSize="medium"
                      style={{ color: "white" }}
                    />
                  </div>
                </Tooltip>
              </div>
              <Tooltip
                TransitionComponent={Zoom}
                title="Share this video"
                placement="top"
              >
                <div
                  className="share"
                  onClick={() => {
                    if (shareClicked === false) {
                      setShareClicked(true);
                      document.body.classList.add("bg-css");
                    } else {
                      setShareClicked(false);
                      document.body.classList.remove("bg-css");
                    }
                  }}
                >
                  <ReplyIcon
                    fontSize="medium"
                    style={{ color: "white", transform: "rotateY(180deg)" }}
                  />
                  <p className="share-txt">Share</p>
                </div>
              </Tooltip>
              <Tooltip
                TransitionComponent={Zoom}
                title="Download this video"
                placement="top"
              >
                <div className="download-btn" onClick={downloadVideo}>
                  <h3>
                    <TfiDownload />
                  </h3>
                  <p>Download</p>
                </div>
              </Tooltip>
              <Tooltip
                TransitionComponent={Zoom}
                title="Watch Later"
                placement="top"
              >
                <div className="save-later" onClick={saveVideo}>
                  {isSaved === true ? (
                    <BookmarkAddedIcon
                      fontSize="medium"
                      style={{ color: "white" }}
                    />
                  ) : (
                    <BookmarkAddOutlinedIcon
                      fontSize="medium"
                      style={{ color: "white" }}
                    />
                  )}
                  <p>Save</p>
                </div>
              </Tooltip>
            </div>
          </div>
          <div className="description-section2">
            <div className="views-date">
              <p>
                {views >= 1e9
                  ? `${(views / 1e9).toFixed(1)}B`
                  : views >= 1e6
                  ? `${(views / 1e6).toFixed(1)}M`
                  : views >= 1e3
                  ? `${(views / 1e3).toFixed(1)}K`
                  : views}{" "}
                views
              </p>
              <p style={{ marginLeft: "10px" }}>
                {(() => {
                  const timeDifference = new Date() - new Date(uploaded_date);
                  const minutes = Math.floor(timeDifference / 60000);
                  const hours = Math.floor(timeDifference / 3600000);
                  const days = Math.floor(timeDifference / 86400000);
                  const weeks = Math.floor(timeDifference / 604800000);
                  const years = Math.floor(timeDifference / 31536000000);

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
            <div className="desc-data">
              <p style={{ marginTop: "10px" }}>{Description}</p>
            </div>
          </div>
          <div className="comments-section">
            <div className="total-comments">
              <p>
                {comments && comments.length}{" "}
                {comments && comments.length > 1 ? "Comments" : "Comment"}
              </p>
              <div className="sorting">
                <SortOutlinedIcon
                  fontSize="medium"
                  style={{ color: "white" }}
                />
                <p style={{ marginLeft: "15px" }}>Sort by</p>
              </div>
            </div>
            <div className="my-comment-area">
              <img
                src={userProfile && userProfile}
                alt="channelDP"
                className="channelDP"
                loading="lazy"
              />
              <input
                className="comment-input"
                type="text"
                name="myComment"
                placeholder="Add a comment..."
                onClick={() => {
                  setDisplay((prevDisplay) =>
                    prevDisplay === "none" ? "block" : "block"
                  );
                }}
                onChange={(e) => {
                  setComment(e.target.value);
                }}
              />
            </div>
            <div className="comment-btns" style={{ display: Display }}>
              <button
                className="cancel-comment"
                onClick={() => {
                  setDisplay((prevDisplay) =>
                    prevDisplay === "none" ? "block" : "none"
                  );
                }}
              >
                Cancel
              </button>
              <button
                className="upload-comment"
                onClick={() => {
                  if (token && isChannel === true) {
                    setComment(" ")
                    uploadComment();
                  } else if (token && isChannel !== true) {
                    alert("Create a channel first");
                  } else {
                    alert("Login First");
                  }
                }}
              >
                Comment
              </button>
            </div>

            <div className="video-comments">
              {comments.map((element, index) => {
                return (
                  <>
                    <div className="comment-data" key={index}>
                      <div className="comment-left-data">
                        <img
                          src={element.user_profile}
                          alt="commentDP"
                          className="commentDP"
                          loading="lazy"
                        />
                      </div>
                      <div className="comment-right-data">
                        <div className="comment-row1">
                          <p>{element.username}</p>
                          <p className="comment-time">
                            {(() => {
                              const timeDifference =
                                new Date() - new Date(element.time);
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
                        <p className="main-comment">{element.comment}</p>
                        <div className="comment-interaction">
                          <ThumbUpAltOutlinedIcon
                            fontSize="small"
                            style={{ color: "white", cursor: "pointer" }}
                            onClick={() => LikeComment(index)}
                          />
                          <p style={{ marginLeft: "16px" }}>
                            {CommentLikes &&
                              CommentLikes[index] &&
                              CommentLikes[index].likes}
                          </p>
                          <ThumbDownOutlinedIcon
                            fontSize="small"
                            style={{
                              color: "white",
                              marginLeft: "16px",
                              cursor: "pointer",
                            }}
                          />
                          {element.user_email === email ? (
                            <button
                              className="delete-comment-btn"
                              style={{ marginLeft: "25px" }}
                              onClick={() => DeleteComment(index)}
                            >
                              Delete
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
          </div>
        </div>
        <div className="recommended-section">
          <div className="recommend-tags">
            <div className="top-tags tag-one">
              <p>All</p>
            </div>
            <div className="top-tags tag-two" style={{ marginLeft: "10px" }}>
              <p>From {uploader}</p>
            </div>
          </div>
          <div className="video-section2">
            {thumbnails &&
              thumbnails.map((element, index) => {
                return (
                  <div
                    className="video-data12"
                    style={
                      element === thumbnailURL
                        ? { display: "none" }
                        : { display: "flex" }
                    }
                    key={index}
                    onClick={() => {
                      navigate(`/video/${VideoID[index]}`);
                      window.location.reload();
                    }}
                  >
                    <div className="video-left-side">
                      <img
                        src={element}
                        alt=""
                        className="recommend-thumbnails"
                        loading="lazy"
                      />
                      <p className="duration duration2">
                        {Math.floor(duration[index] / 60) +
                          ":" +
                          (Math.round(duration[index] % 60) < 10
                            ? "0" + Math.round(duration[index] % 60)
                            : Math.round(duration[index] % 60))}
                      </p>
                    </div>
                    <div className="video-right-side">
                      <p className="recommend-vid-title">{Titles[index]}</p>
                      <div className="recommend-uploader">
                        <p className="recommend-vid-uploader uploader">
                          {Uploader[index]}
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
                              marginLeft: "4px",
                            }}
                          />
                        </Tooltip>
                      </div>
                      <div className="view-time">
                        <p className="views">
                          {Views[index] >= 1e9
                            ? `${(Views[index] / 1e9).toFixed(1)}B`
                            : Views[index] >= 1e6
                            ? `${(Views[index] / 1e6).toFixed(1)}M`
                            : Views[index] >= 1e3
                            ? `${(Views[index] / 1e3).toFixed(1)}K`
                            : Views[index]}{" "}
                          views
                        </p>
                        <p
                          className="upload-time"
                          style={{ marginLeft: "4px" }}
                        >
                          &#x2022;{" "}
                          {(() => {
                            const timeDifference =
                              new Date() - new Date(publishdate[index]);
                            const minutes = Math.floor(timeDifference / 60000);
                            const hours = Math.floor(timeDifference / 3600000);
                            const days = Math.floor(timeDifference / 86400000);
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
                );
              })}
          </div>
        </div>
      </div>
      <div
        className="share-clicked"
        style={
          shareClicked === true ? { display: "block" } : { display: "none" }
        }
      >
        <Share />
      </div>
    </>
  );
}

export default VideoSection;
