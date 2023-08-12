import LeftPanel3 from "../LeftPanel3";
import Navbar2 from "../Navbar2";
import "../../Css/Studio/comments.css";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import noImage from "../../img/no-comment.png";
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";
import { useParams } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function VideoComments() {
  const { id } = useParams();
  const [Email, setEmail] = useState();
  const [videoComments, setVideoComments] = useState([]);
  const [Profile, setProfile] = useState();
  const [sorting, setSorting] = useState(false);
  const [sortData, setSortData] = useState();
  const [filterComment, setFilterComment] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setEmail(jwtDecode(token).email);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2800);
  }, []);

  useEffect(() => {
    const handleClick = () => {
      document
        .querySelector(".video-all-comments-section")
        .classList.add("channel-dark");
    };

    const searchInp = document.getElementById("searchType2");

    if (searchInp) {
      searchInp.addEventListener("click", handleClick);
    }

    return () => {
      if (searchInp) {
        searchInp.removeEventListener("click", handleClick);
      }
    };
  });

  useEffect(() => {
    const handleClick = () => {
      document
        .querySelector(".video-all-comments-section")
        .classList.remove("channel-dark");
    };

    const clearBtn = document.querySelector(".clear-search");

    if (clearBtn) {
      clearBtn.addEventListener("click", handleClick);
    }

    return () => {
      if (clearBtn) {
        clearBtn.removeEventListener("click", handleClick);
      }
    };
  });

  useEffect(() => {
    const getChannel = async () => {
      try {
        if (Email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getchannel/${Email}`
          );
          const { profile } = await response.json();
          setProfile(profile);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };
    const interval = setInterval(getChannel, 100);

    return () => clearInterval(interval);
  }, [Email]);

  useEffect(() => {
    const getComment = async () => {
      try {
        if (id !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getvideocommentsbyid/${id}`
          );
          const comments = await response.json();
          setVideoComments(comments);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };
    const interval = setInterval(getComment, 100);

    return () => clearInterval(interval);
  }, [id]);

  const LikeComment = async (id, commentId) => {
    try {
      if (commentId !== undefined && id !== undefined && Email !== undefined) {
        const response = await fetch(
          `http://localhost:3000/likecomment/${id}/${commentId}/${Email}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        await response.json();
      }
    } catch (error) {
      //console.log(error.message);
    }
  };

  const HeartComment = async (id, commentID) => {
    try {
      const response = await fetch(
        `http://localhost:3000/heartcomment/${id}/${commentID}`,
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

  const DeleteComment = async (id, commentId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/deletecomment/${id}/${commentId}/${Email}`,
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

  const filterComments =
    videoComments &&
    videoComments.filter(
      (item) =>
        item.comment
          .toLowerCase()
          .includes(
            filterComment !== undefined &&
              filterComment !== "" &&
              filterComment.toLowerCase()
          ) ||
        item.username
          .toLowerCase()
          .includes(
            filterComment !== undefined &&
              filterComment !== "" &&
              filterComment.toLowerCase()
          )
    );

  return (
    <>
      <Navbar2 />
      <LeftPanel3 />
      <div className="video-all-comments-section">
        <div className="channel-comments-top">
          <p>Video comments</p>
        </div>
        <div className="channel-comments-mid">
          <p>Comments</p>
        </div>
        <hr className="breakkk" />
        <div className="filter-comments">
          <FilterListOutlinedIcon
            fontSize="medium"
            style={{ color: "#aaa", cursor: "pointer" }}
            onClick={() => setSorting(!sorting)}
          />
          <div
            className="choosed-sorting-new"
            style={
              sortData === "New" ? { display: "flex" } : { display: "none" }
            }
          >
            <p>Newest first</p>
            <HighlightOffOutlinedIcon
              onClick={() => {
                setSortData(undefined);
              }}
              className="cancel-sort"
              fontSize="small"
              style={{ color: "#aaa", marginLeft: "5px" }}
            />
          </div>
          <div
            className="choosed-sorting-old"
            style={
              sortData === "Old" ? { display: "flex" } : { display: "none" }
            }
          >
            <p>Oldest first</p>
            <HighlightOffOutlinedIcon
              onClick={() => {
                setSortData(undefined);
              }}
              className="cancel-sort"
              fontSize="small"
              style={{ color: "#aaa", marginLeft: "5px" }}
            />
          </div>
          <input
            type="text"
            name="comment-search"
            value={filterComment}
            placeholder="Filter"
            onChange={(e) => setFilterComment(e.target.value)}
          />
          <div
            className="comment-sorting"
            style={
              sorting === true ? { display: "block" } : { display: "none" }
            }
          >
            <p
              onClick={() => {
                setSortData("Old");
                setSorting(false);
              }}
            >
              Oldest first
            </p>
            <p
              onClick={() => {
                setSortData("New");
                setSorting(false);
              }}
            >
              Newest first
            </p>
          </div>
        </div>
        <div className="channel-comments-list">
          <div className="overall-comments">
            {videoComments &&
              videoComments.length > 0 &&
              filterComment === "" &&
              videoComments.map((element, index) => {
                return (
                  <>
                    {/* START HERE  */}
                    <SkeletonTheme baseColor="#353535" highlightColor="#444">
                      <div
                        className="user-comment-data"
                        key={index}
                        style={
                          loading === true
                            ? { display: "flex" }
                            : { display: "none" }
                        }
                      >
                        <div className="leftside-viddata">
                          <Skeleton
                            count={1}
                            width={45}
                            height={45}
                            style={{
                              borderRadius: "100%",
                            }}
                          />
                          <div className="comment-rightt-data">
                            <div className="name-time">
                              <Skeleton
                                count={1}
                                width={200}
                                height={15}
                                style={{
                                  borderRadius: "3px",
                                  position: "relative",
                                }}
                              />
                            </div>
                            <Skeleton
                              count={1}
                              width={180}
                              height={22}
                              style={{
                                borderRadius: "3px",
                                position: "relative",
                                top: "6px",
                              }}
                            />
                            <div className="comment-all-btns">
                              <div className="cmmt-like">
                                <Tooltip
                                  TransitionComponent={Zoom}
                                  title="Like/Unlike"
                                  placement="bottom"
                                >
                                  <ThumbUpIcon
                                    fontSize="small"
                                    className="thiscomment-like-btn"
                                    style={{ color: "#white" }}
                                  />
                                </Tooltip>
                              </div>
                              {element.heartComment === true ? (
                                <Tooltip
                                  TransitionComponent={Zoom}
                                  title="Remove heart"
                                  placement="bottom"
                                >
                                  <div className="hearted-thiscomment">
                                    <Skeleton
                                      count={1}
                                      width={25}
                                      height={25}
                                      style={{
                                        borderRadius: "100%",
                                      }}
                                    />
                                  </div>
                                </Tooltip>
                              ) : (
                                <Tooltip
                                  TransitionComponent={Zoom}
                                  title="Heart"
                                  placement="bottom"
                                >
                                  <FavoriteBorderOutlinedIcon
                                    fontSize="small"
                                    className="heartcmmt-btn"
                                    style={{ color: "#aaa" }}
                                  />
                                </Tooltip>
                              )}

                              <Tooltip
                                TransitionComponent={Zoom}
                                title="Delete"
                                placement="bottom"
                              >
                                <DeleteOutlineOutlinedIcon
                                  fontSize="small"
                                  style={{ color: "#aaa" }}
                                  className="deletethis-cmmt"
                                />
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SkeletonTheme>

                    {/* END HERE  */}

                    <div
                      className="user-comment-data"
                      key={index}
                      style={
                        loading === false
                          ? { visibility: "visible", display: "flex" }
                          : { visibility: "hidden", display: "none" }
                      }
                    >
                      <div className="leftside-viddata">
                        <img
                          src={element.user_profile}
                          alt="profile"
                          className="user-channelprofileee"
                        />
                        <div className="comment-rightt-data">
                          <div className="name-time">
                            <p>{element.username}</p>
                            <FiberManualRecordIcon
                              className="dot-seperate"
                              style={{
                                color: "#aaa",
                                marginLeft: "6px",
                                marginRight: "6px",
                              }}
                            />
                            <p>
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
                          <p style={{ marginTop: "8px" }}>{element.comment}</p>
                          <div className="comment-all-btns">
                            <div className="cmmt-like">
                              <Tooltip
                                TransitionComponent={Zoom}
                                title="Like/Unlike"
                                placement="bottom"
                              >
                                <ThumbUpIcon
                                  fontSize="small"
                                  className="thiscomment-like-btn"
                                  style={{ color: "#white" }}
                                  onClick={() => {
                                    setSorting(false);
                                    setSortData(undefined);
                                    LikeComment(element.videoid, element._id);
                                  }}
                                />
                              </Tooltip>
                              <p style={{ marginLeft: "10px" }}>
                                {element.likes}
                              </p>
                            </div>
                            {element.heartComment === true ? (
                              <Tooltip
                                TransitionComponent={Zoom}
                                title="Remove heart"
                                placement="bottom"
                              >
                                <div
                                  className="hearted-thiscomment"
                                  onClick={() => {
                                    setSorting(false);
                                    setSortData(undefined);
                                    HeartComment(element.videoid, element._id);
                                  }}
                                >
                                  <img
                                    src={Profile && Profile}
                                    alt="profile"
                                    className="channelp"
                                  />

                                  <FavoriteIcon
                                    className="heartlike-this"
                                    fontSize="100px"
                                    style={{ color: "red" }}
                                  />
                                </div>
                              </Tooltip>
                            ) : (
                              <Tooltip
                                TransitionComponent={Zoom}
                                title="Heart"
                                placement="bottom"
                              >
                                <FavoriteBorderOutlinedIcon
                                  fontSize="small"
                                  className="heartcmmt-btn"
                                  style={{ color: "#aaa" }}
                                  onClick={() => {
                                    setSorting(false);
                                    setSortData(undefined);
                                    HeartComment(element.videoid, element._id);
                                  }}
                                />
                              </Tooltip>
                            )}

                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Delete"
                              placement="bottom"
                            >
                              <DeleteOutlineOutlinedIcon
                                fontSize="small"
                                style={{ color: "#aaa" }}
                                className="deletethis-cmmt"
                                onClick={() => {
                                  setSorting(false);
                                  setSortData(undefined);
                                  DeleteComment(element.videoid, element._id);
                                }}
                              />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}

            {filterComments &&
              filterComment !== "" &&
              filterComments.length > 0 &&
              filterComments.map((element, index) => {
                return (
                  <div className="user-comment-data" key={index}>
                    <div className="leftside-viddata">
                      <img
                        src={element.user_profile}
                        alt="profile"
                        className="user-channelprofileee"
                      />
                      <div className="comment-rightt-data">
                        <div className="name-time">
                          <p>{element.username}</p>
                          <FiberManualRecordIcon
                            className="dot-seperate"
                            style={{
                              color: "#aaa",
                              marginLeft: "6px",
                              marginRight: "6px",
                            }}
                          />
                          <p>
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
                        <p style={{ marginTop: "8px" }}>{element.comment}</p>
                        <div className="comment-all-btns">
                          <div className="cmmt-like">
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Like/Unlike"
                              placement="bottom"
                            >
                              <ThumbUpIcon
                                fontSize="small"
                                className="thiscomment-like-btn"
                                style={{ color: "#white" }}
                                onClick={() => {
                                  setSorting(false);
                                  setSortData(undefined);
                                  LikeComment(element.videoid, element._id);
                                }}
                              />
                            </Tooltip>
                            <p style={{ marginLeft: "10px" }}>
                              {element.likes}
                            </p>
                          </div>
                          {element.heartComment === true ? (
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Remove heart"
                              placement="bottom"
                            >
                              <div
                                className="hearted-thiscomment"
                                onClick={() => {
                                  setSorting(false);
                                  setSortData(undefined);
                                  HeartComment(element.videoid, element._id);
                                }}
                              >
                                <img
                                  src={Profile && Profile}
                                  alt="profile"
                                  className="channelp"
                                />

                                <FavoriteIcon
                                  className="heartlike-this"
                                  fontSize="100px"
                                  style={{ color: "red" }}
                                />
                              </div>
                            </Tooltip>
                          ) : (
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Heart"
                              placement="bottom"
                            >
                              <FavoriteBorderOutlinedIcon
                                fontSize="small"
                                className="heartcmmt-btn"
                                style={{ color: "#aaa" }}
                                onClick={() => {
                                  setSorting(false);
                                  setSortData(undefined);
                                  HeartComment(element.videoid, element._id);
                                }}
                              />
                            </Tooltip>
                          )}

                          <Tooltip
                            TransitionComponent={Zoom}
                            title="Delete"
                            placement="bottom"
                          >
                            <DeleteOutlineOutlinedIcon
                              fontSize="small"
                              style={{ color: "#aaa" }}
                              className="deletethis-cmmt"
                              onClick={() => {
                                setSorting(false);
                                setSortData(undefined);
                                DeleteComment(element.videoid, element._id);
                              }}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            {filterComments &&
              filterComment !== "" &&
              filterComments.length === 0 && (
                <div className="user-comment-data2">
                  <div className="no-comment-found">
                    <img src={noImage} alt="no-comment" className="nocmmt" />
                    <p>No comments found. Try searching for something else.</p>
                  </div>
                </div>
              )}
            {loading === false && videoComments &&
              videoComments.length === 0 &&
              filterComment === "" && (
                <div className="user-comment-data2">
                  <div className="no-comment-found">
                    <img src={noImage} alt="no-comment" className="nocmmt" />
                    <p>No comments found.</p>
                  </div>
                </div>
              )}

            {loading === true &&
              videoComments &&
              videoComments.length === 0 && (
                <div className="user-comment-data2" style={{ top: "60px" }}>
                  <div className="no-comment-found">
                    <div className="spin23">
                      <span className="loader2"></span>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoComments;
