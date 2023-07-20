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
import AddToPhotosOutlinedIcon from "@mui/icons-material/AddToPhotosOutlined";
import Zoom from "@mui/material/Zoom";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownOutlinedIcon from "@mui/icons-material/ThumbDownOutlined";
import ReplyIcon from "@mui/icons-material/Reply";
import { TfiDownload } from "react-icons/Tfi";
import BookmarkAddOutlinedIcon from "@mui/icons-material/BookmarkAddOutlined";
import avatar from "../img/avatar.png";
import BookmarkAddedIcon from "@mui/icons-material/BookmarkAdded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import Signin from "./Signin";
import Signup from "./Signup";

import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

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
  const [usermail, setUserMail] = useState();
  const [channelID, setChannelID] = useState();
  const [isSwitch, setisSwitched] = useState(false);
  const [isbtnClicked, setisbtnClicked] = useState(false);
  const videoRef = useRef(null);
  const [TagSelected, setTagSelected] = useState("All");
  const [userVideos, setUserVideos] = useState([]);
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
  const [createPlaylistClicked, setcreatePlaylistClicked] = useState(false);
  const [privacyClicked, setprivacyClicked] = useState(false);
  const [playlistClicked, setPlaylistClicked] = useState(false);

  //Get Channel Data
  const [youtuberName, setyoutuberName] = useState();
  const [youtuberProfile, setyoutuberProfile] = useState();
  const [youtubeChannelID, setyoutubeChannelID] = useState();
  const [isSubscribed, setIsSubscribed] = useState();
  const [Subscribers, setSubscribers] = useState();

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
        if (email === undefined) {
          setChannelName(null);
          return;
        }

        const response = await fetch(
          `http://localhost:3000/checkchannel/${email}`
        );
        const { channel } = await response.json();
        setChannelName(channel);
      } catch (error) {
        //console.log(error.message);
      }
    };

    checkChannel();
  }, [email]);

  useEffect(() => {
    const getChannel = async () => {
      try {
        if (email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getchannel/${email}`
          );
          const { channel, profile } = await response.json();
          setisChannel(channel);
          setUserProfile(profile);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };
    const interval = setInterval(getChannel, 100);

    return () => clearInterval(interval);
  }, [email]);

  useEffect(() => {
    const getVideoData = async () => {
      try {
        if (id !== undefined) {
          const response = await fetch(`http://localhost:3000/videodata/${id}`);
          const video = await response.json();
          setVideoData(video);
        }
      } catch (error) {
        //console.log(error.message);
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
        //console.log(error.message);
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
        if (id !== undefined) {
          const response = await fetch(`http://localhost:3000/getlike/${id}/`);
          const likes = await response.json();
          setVideoLikes(likes);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    const interval = setInterval(getLikes, 200);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const LikeExists = async () => {
      try {
        if (id !== undefined && email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getuserlikes/${id}/${email}`
          );
          const { existingLikedVideo } = await response.json();
          if (!existingLikedVideo) {
            setIsLiked(false);
          } else {
            setIsLiked(true);
          }
        }
      } catch (error) {
        //console.log(error.message);
      }
    };
    const interval = setInterval(LikeExists, 200);

    return () => clearInterval(interval);
  }, [email, id]);

  useEffect(() => {
    const CommentLikes = async () => {
      try {
        if (id !== undefined) {
          const response = await fetch(
            `http://localhost:3000/likecomment/${id}`
          );
          const result = await response.json();
          setCommentLikes(result);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    const interval = setInterval(CommentLikes, 200);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const getWatchlater = async () => {
      try {
        if (id !== undefined && email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/checkwatchlater/${id}/${email}`
          );
          const savedID = await response.json();
          if (savedID === id) {
            setIsSaved(true);
          } else if (savedID !== id) {
            setIsSaved(false);
          }
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    const interval = setInterval(getWatchlater, 200);

    return () => clearInterval(interval);
  });

  useEffect(() => {
    const getComments = async () => {
      try {
        if (id !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getcomments/${id}`
          );
          const result = await response.json();
          setComments(result);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };
    const interval = setInterval(getComments, 200);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const getOtherChannel = async () => {
      try {
        if (id !== undefined) {
          const response = await fetch(
            `http://localhost:3000/otherchannel/${id}`
          );
          const userEmail = await response.json();
          setUserMail(userEmail);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    const interval = setInterval(getOtherChannel, 200);

    return () => clearInterval(interval);
  }, [id]);

  useEffect(() => {
    const getChannelID = async () => {
      try {
        if (usermail !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getchannelid/${usermail}`
          );
          const { channelID, subscribers } = await response.json();
          setChannelID(channelID);
          setSubscribers(subscribers);
        }
      } catch (error) {
        console.log("Error fetching user data:", error.message);
      }
    };

    const interval = setInterval(getChannelID, 100);

    return () => clearInterval(interval);
  }, [usermail]);

  useEffect(() => {
    const GetChannelData = async () => {
      try {
        if (usermail !== undefined) {
          const response = await fetch(
            `http://localhost:3000/subscribe/${usermail}`
          );
          const { channel, profile, channelid } = await response.json();
          setyoutuberName(channel);
          setyoutuberProfile(profile);
          setyoutubeChannelID(channelid);
        }
      } catch (error) {
        console.log("Error fetching user data:", error.message);
      }
    };

    const interval = setInterval(GetChannelData, 100);

    return () => clearInterval(interval);
  }, [usermail]);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        if (email !== undefined && channelID !== undefined) {
          const response = await fetch(
            `http://localhost:3000/checksubscription/${channelID}/${email}`
          );
          const { existingChannelID } = await response.json();
          if (existingChannelID !== undefined) {
            setIsSubscribed(true);
          } else {
            setIsSubscribed(false);
          }
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    const interval = setInterval(checkSubscription, 100);

    return () => clearInterval(interval);
  }, [channelID, email]);

  useEffect(() => {
    const GetUserVideos = async () => {
      try {
        if (usermail !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getuservideos/${usermail}`
          );
          const myvideos = await response.json();
          setUserVideos(myvideos);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };

    GetUserVideos();
  }, [usermail]);

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
      //console.log(error.message);
    }
  };

  if (!videoData) {
    return (
      <>
        <div className="main-video-section2">
          <div className="spin2">
            <ReactLoading
              type={"spin"}
              color={"white"}
              height={50}
              width={50}
            />
            <p style={{ marginTop: "15px" }}>
              Fetching the data, Hang tight...{" "}
            </p>{" "}
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
          <div className="spin2">
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
      //console.log(error.message);
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
      //console.log(error.message);
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
      //console.log(error.message);
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
      //console.log(error.message);
    }
  };

  const downloadVideo = () => {
    const link = document.createElement("a");
    link.href = videoURL;
    link.target = "_blank";
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
      //console.log(error.message);
    }
  };

  const SubscribeChannel = async () => {
    try {
      const channelData = {
        youtuberName,
        youtuberProfile,
        youtubeChannelID,
      };
      const response = await fetch(
        `http://localhost:3000/subscribe/${channelID}/${email}/${usermail}`,
        {
          method: "POST",
          body: JSON.stringify(channelData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
    } catch (error) {
      //console.log(error.message);
    }
  };

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
      //console.log(error.message);
    }
  };

  const menu = document.querySelector(".menu");
  if (menu !== null) {
    menu.style.display = "none";
  }

  return (
    <>
      <div className="my-navbar">
        <Navbar />
      </div>
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
                  <p
                    style={{ fontSize: "17px", cursor: "pointer" }}
                    onClick={() => {
                      if (channelID !== undefined) {
                        navigate(`/channel/${channelID}`);
                      }
                    }}
                  >
                    {uploader}
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
                <p className="channel-subs">{Subscribers} subscribers</p>
              </div>
              {isSubscribed === false || !token ? (
                <button
                  className="subscribe"
                  disabled={email === usermail ? true : false}
                  onClick={() => {
                    if (token) {
                      SubscribeChannel();
                    } else {
                      setisbtnClicked(true);
                      document.body.classList.add("bg-css");
                    }
                  }}
                  style={
                    email === usermail
                      ? { cursor: "not-allowed" }
                      : { cursor: "pointer" }
                  }
                >
                  Subscribe
                </button>
              ) : (
                <button
                  className="subscribe subscribe2"
                  disabled={email === usermail ? true : false}
                  onClick={() => {
                    SubscribeChannel();
                  }}
                >
                  Subscribed
                </button>
              )}
            </div>
            <div className="channel-right-data">
              <div className="like-dislike">
                <Tooltip
                  TransitionComponent={Zoom}
                  title="I like this"
                  placement="top"
                >
                  <div
                    className="like-data"
                    onClick={() => {
                      if (token) {
                        likeVideo();
                      } else {
                        setisbtnClicked(true);
                        document.body.classList.add("bg-css");
                      }
                    }}
                  >
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
                  <div
                    className="dislike-data"
                    onClick={() => {
                      if (token) {
                        DislikeVideo();
                      } else {
                        setisbtnClicked(true);
                        document.body.classList.add("bg-css");
                      }
                    }}
                  >
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
                <div
                  className="save-later"
                  onClick={() => {
                    if (token) {
                      saveVideo();
                    } else {
                      setisbtnClicked(true);
                      document.body.classList.add("bg-css");
                    }
                  }}
                >
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
              <Tooltip
                TransitionComponent={Zoom}
                title="Add to playlist"
                placement="top"
              >
                <div
                  className="add-playlist"
                  onClick={() => {
                    if (playlistClicked === false) {
                      setPlaylistClicked(true);
                      document.body.classList.add("bg-css");
                    } else if (!token) {
                      setisbtnClicked(true);
                      document.body.classList.add("bg-css");
                    }
                  }}
                >
                  <PlaylistAddIcon
                    fontSize="medium"
                    style={{ color: "white" }}
                  />

                  <p>Playlist</p>
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
            </div>
            <div className="my-comment-area">
              <img
                src={userProfile ? userProfile : avatar}
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
                  if (token && isChannel === true && comment !== "") {
                    uploadComment();
                  } else if (token && isChannel !== true) {
                    alert("Create a channel first");
                  } else if (token && isChannel === true && comment === "") {
                    alert("Comment can't be empty");
                  } else {
                    setisbtnClicked(true);
                    document.body.classList.add("bg-css");
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
                          <ThumbUpIcon
                            fontSize="small"
                            style={{ color: "white", cursor: "pointer" }}
                            onClick={() => {
                              if (token) {
                                LikeComment(index);
                              } else {
                                setisbtnClicked(true);
                                document.body.classList.add("bg-css");
                              }
                            }}
                            className="comment-like"
                          />

                          <p style={{ marginLeft: "16px" }}>
                            {CommentLikes &&
                              CommentLikes[index] &&
                              CommentLikes[index].likes}
                          </p>

                          {element.user_email === email ||
                          email === usermail ? (
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
            <div
              className={
                TagSelected === "All"
                  ? `top-tags tag-one tag-color`
                  : `top-tags tag-one`
              }
            >
              <p onClick={() => setTagSelected("All")}>All</p>
            </div>
            <div
              className={
                TagSelected === uploader
                  ? `top-tags tag-two tag-color`
                  : `top-tags tag-two`
              }
              style={{ marginLeft: "10px" }}
            >
              <p onClick={() => setTagSelected(`${uploader}`)}>
                From {uploader}
              </p>
            </div>
          </div>
          <div
            className="video-section2"
            style={
              TagSelected === "All" ? { display: "block" } : { display: "none" }
            }
          >
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
                      if (token) {
                        updateViews(VideoID[index]);
                        setTimeout(() => {
                          navigate(`/video/${VideoID[index]}`);
                          window.location.reload();
                        }, 400);
                      } else {
                        navigate(`/video/${VideoID[index]}`);
                        window.location.reload();
                      }
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
          <div
            className="video-section2"
            style={
              TagSelected !== "All" ? { display: "block" } : { display: "none" }
            }
          >
            {userVideos &&
              userVideos.length > 0 &&
              userVideos.map((element, index) => {
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
                      if (token) {
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
                    <div className="video-left-side">
                      <img
                        src={element.thumbnailURL}
                        alt=""
                        className="recommend-thumbnails"
                        loading="lazy"
                      />
                      <p className="duration duration2">
                        {Math.floor(element.videoLength / 60) +
                          ":" +
                          (Math.round(element.videoLength % 60) < 10
                            ? "0" + Math.round(element.videoLength % 60)
                            : Math.round(element.videoLength % 60))}
                      </p>
                    </div>
                    <div className="video-right-side">
                      <p className="recommend-vid-title">{element.Title}</p>
                      <div className="recommend-uploader">
                        <p className="recommend-vid-uploader uploader">
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
                              new Date() - new Date(element.uploaded_date);
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

      {/* SIGNUP/SIGNIN  */}

      <div
        className="auth-popup"
        style={
          isbtnClicked === true ? { display: "block" } : { display: "none" }
        }
      >
        <ClearRoundedIcon
          onClick={() => {
            if (isbtnClicked === false) {
              setisbtnClicked(true);
            } else {
              setisbtnClicked(false);
              document.body.classList.remove("bg-css");
            }
          }}
          className="cancel"
          fontSize="large"
          style={{ color: "gray" }}
        />
        <div
          className="signup-last"
          style={
            isSwitch === false ? { display: "block" } : { display: "none" }
          }
        >
          <Signup />
          <div className="already">
            <p>Already have an account?</p>
            <p
              onClick={() => {
                if (isSwitch === false) {
                  setisSwitched(true);
                } else {
                  setisSwitched(false);
                }
              }}
            >
              Signin
            </p>
          </div>
        </div>
        <div
          className="signin-last"
          style={isSwitch === true ? { display: "block" } : { display: "none" }}
        >
          <Signin />
          <div className="already">
            <p>Don&apos;t have an account?</p>
            <p
              onClick={() => {
                if (isSwitch === false) {
                  setisSwitched(true);
                } else {
                  setisSwitched(false);
                }
              }}
            >
              Signup
            </p>
          </div>
        </div>
      </div>

      {/* PLAYLIST POPUP */}

      <div
        className="playlist-pop"
        style={{
          minHeight: createPlaylistClicked === false ? "200px" : "320px",
          display: playlistClicked === true ? "block" : "none",
        }}
      >
        <div className="this-top-section">
          <p>Save video to...</p>
          <ClearRoundedIcon
            fontSize="large"
            style={{ color: "white" }}
            onClick={() => {
              setPlaylistClicked(false);
              document.body.classList.remove("bg-css");
            }}
          />
        </div>
        <div
          className="this-middle-section"
          style={
            createPlaylistClicked === true ? { top: "40%" } : { top: "50%" }
          }
        >
          <p>No Playlists available...</p>
        </div>
        <div
          className="this-bottom-section"
          onClick={() => {
            if (createPlaylistClicked === false) {
              setcreatePlaylistClicked(true);
            }
          }}
          style={
            createPlaylistClicked === false
              ? { display: "flex" }
              : { display: "none" }
          }
        >
          <AddToPhotosOutlinedIcon
            fontSize="medium"
            style={{ color: "white" }}
          />
          <p style={{ marginLeft: "12px" }}>Create new playlist</p>
        </div>
        <div
          className="create-playlist-section"
          style={
            createPlaylistClicked === true
              ? { display: "block" }
              : { display: "none" }
          }
        >
          <div className="first-que">
            <p>Name</p>
            <input
              type="text"
              name="playlist_name"
              className="playlist-name"
              placeholder="Enter playlist name..."
            />
          </div>
          <div className="second-que">
            <p>Privacy</p>
            <div
              className="combine2"
              onClick={() => {
                if (privacyClicked === false) {
                  setprivacyClicked(true);
                }
              }}
            >
              <p>Private</p>
              <hr className="bottom-line" />
            </div>
          </div>
          <div
            className="choose-privacy"
            style={
              privacyClicked === true
                ? { display: "block" }
                : { display: "none" }
            }
          >
            <div className="first-privacy">
              <PublicOutlinedIcon
                fontSize="medium"
                style={{ color: "white" }}
              />
              <div className="right-privacy">
                <p>Public</p>
                <p>Anyone can view</p>
              </div>
            </div>
            <div className="second-privacy">
              <LockOutlinedIcon fontSize="medium" style={{ color: "white" }} />
              <div className="right-privacy">
                <p>Private</p>
                <p>Only you can view</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoSection;
