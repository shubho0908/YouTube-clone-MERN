import LeftPanel2 from "../LeftPanel2";
import Navbar2 from "../Navbar2";
import "../../Css/Studio/comments.css";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";
import { useEffect, useState } from "react";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import noImage from "../../img/no-comment.png";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSelector } from "react-redux";

function Comments() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000";
  const [AllComments, setAllComments] = useState([]);
  const [Profile, setProfile] = useState();
  const [filterComment, setFilterComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [menu, setmenu] = useState(() => {
    const menu = localStorage.getItem("studioMenuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const User = useSelector((state) => state.user.user);
  const { user } = User;

  document.title = "Channel comments - YouTube Studio";

  useEffect(() => {
    const handleMenuButtonClick = () => {
      setmenu((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".menu2");
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
    localStorage.setItem("studioMenuClicked", JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (theme === false && window.location.href.includes("/studio/comments")) {
      document.body.style.backgroundColor = "white";
    } else if (
      theme === true &&
      window.location.href.includes("/studio/comments")
    ) {
      document.body.style.backgroundColor = "#282828";
    }
  }, [theme]);

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
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getchannel/${user?.email}`
          );
          const { userProfile } = await response.json();
          setProfile(userProfile);
        }
      } catch (error) {
        //console.log(error.message);
      }
    };
    getChannel();
  }, [user?.email]);

  useEffect(() => {
    const getComments = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getallcomments/${user?.email}`
          );
          const { comments } = await response.json();

          // Fetch video data for each comment
          const commentsWithVideoData = await Promise.all(
            comments.map(async (comment) => {
              const videoResponse = await fetch(
                `${backendURL}/getdeletevideodata/${comment.videoid}`
              );
              const videoData = await videoResponse.json();

              return {
                ...comment,
                videoData: videoData, // Add video data to the comment object
              };
            })
          );

          setAllComments(commentsWithVideoData);
        }
      } catch (error) {
        // Handle error
      }
    };

    getComments();
  }, [user?.email]);

  const LikeComment = async (id, commentId) => {
    try {
      if (commentId && id && user?.email) {
        const response = await fetch(
          `${backendURL}/likecomment/${id}/${commentId}/${user?.email}`,
          {
            method: "POST",
            credentials: "include",
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
        `${backendURL}/heartcomment/${id}/${commentID}`,
        {
          method: "POST",
          credentials: "include",
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
        `${backendURL}/deletecomment/${id}/${commentId}/${user?.email}`,
        {
          method: "POST",
          credentials: "include",
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
    AllComments &&
    AllComments.filter(
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
      <LeftPanel2 />
      <div className="video-all-comments-section">
        <div
          className="channel-comments-top"
          style={{ left: menu ? "125px" : "310px" }}
        >
          <p className={theme ? "" : "text-light-mode"}>Channel comments</p>
        </div>
        <div
          className="channel-comments-mid"
          style={{ left: menu ? "128px" : "312px" }}
        >
          <p className={theme ? "" : "blue-txt"}>Comments</p>
        </div>
        <hr className="breakkk" style={{ left: menu ? "90px" : "262px" }} />
        <div
          className="filter-comments"
          style={{ left: menu ? "90px" : "270px" }}
        >
          <FilterListOutlinedIcon
            fontSize="medium"
            style={{ color: theme ? "#aaa" : "#606060", cursor: "pointer" }}
          />

          <input
            type="text"
            name="comment-search"
            className={theme ? "" : "text-light-mode"}
            value={filterComment}
            placeholder="Filter"
            onChange={(e) => setFilterComment(e.target.value)}
          />
        </div>
        <div
          className="channel-comments-list"
          style={{ left: menu ? "90px" : "270px" }}
        >
          <div className="overall-comments">
            {AllComments &&
              AllComments.length > 0 &&
              filterComment === "" &&
              AllComments.map((element, index) => {
                return (
                  <>
                    {/* START HERE  */}
                    <SkeletonTheme
                      baseColor={theme ? "#353535" : "#aaaaaa"}
                      highlightColor={theme ? "#444" : "#b6b6b6"}
                    >
                      <div
                        className={
                          theme
                            ? "user-comment-data"
                            : "user-comment-data preview-lightt"
                        }
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
                            <div
                              className={
                                theme
                                  ? "name-time"
                                  : "name-time text-light-mode2"
                              }
                            >
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
                                    style={{
                                      color: theme ? "white" : "#606060",
                                    }}
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
                                    style={{
                                      color: theme ? "#aaa" : "#606060",
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
                                  style={{ color: theme ? "#aaa" : "#606060" }}
                                  className="deletethis-cmmt"
                                />
                              </Tooltip>
                            </div>
                          </div>
                        </div>
                        <div
                          className="right-sidevideo"
                          key={index}
                          style={{ marginRight: "60px" }}
                        >
                          <Skeleton
                            count={1}
                            width={145}
                            height={82}
                            style={{
                              borderRadius: "3px",
                            }}
                          />
                          <div
                            className={
                              theme
                                ? "thiscomment-rightone"
                                : "thiscomment-rightone text-light-mode"
                            }
                          >
                            <Skeleton
                              count={1}
                              width={260}
                              height={15}
                              style={{
                                borderRadius: "3px",
                                marginLeft: "15px",
                              }}
                            />
                            <Skeleton
                              count={1}
                              width={180}
                              height={14}
                              style={{
                                borderRadius: "3px",
                                marginLeft: "15px",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </SkeletonTheme>

                    {/* END HERE  */}
                    <div
                      className={
                        theme
                          ? "user-comment-data"
                          : "user-comment-data preview-lightt"
                      }
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
                          <div
                            className={
                              theme ? "name-time" : "name-time text-light-mode2"
                            }
                          >
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
                          <p
                            className={theme ? "" : "text-light-mode"}
                            style={{ marginTop: "8px" }}
                          >
                            {element.comment}
                          </p>
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
                                  style={{ color: theme ? "white" : "#606060" }}
                                  onClick={() => {
                                    LikeComment(element.videoid, element._id);
                                  }}
                                />
                              </Tooltip>
                              <p
                                className={theme ? "" : "text-light-mode"}
                                style={{ marginLeft: "10px" }}
                              >
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
                                  style={{ color: theme ? "#aaa" : "#606060" }}
                                  onClick={() => {
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
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                className="deletethis-cmmt"
                                onClick={() => {
                                  DeleteComment(element.videoid, element._id);
                                }}
                              />
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                      <div
                        className="right-sidevideo"
                        key={index}
                        onClick={() => {
                          if (element.videoData._id !== undefined) {
                            window.location.href = `/studio/video/comments/${element.videoData._id}`;
                          }
                        }}
                      >
                        <img
                          src={
                            element.videoData && element.videoData.thumbnailURL
                          }
                          alt="thumbnail"
                          className="commentvideo-thumbnail"
                        />
                        <div
                          className={
                            theme
                              ? "thiscomment-rightone"
                              : "thiscomment-rightone text-light-mode"
                          }
                        >
                          <p>
                            {element.videoData &&
                            element.videoData.Title.length <= 40
                              ? element.videoData.Title
                              : `${element.videoData.Title.slice(0, 40)}...`}
                          </p>
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
                  <div
                    className={
                      theme
                        ? "user-comment-data"
                        : "user-comment-data preview-lightt"
                    }
                    key={index}
                  >
                    <div className="leftside-viddata">
                      <img
                        src={element.user_profile}
                        alt="profile"
                        className="user-channelprofileee"
                      />
                      <div className="comment-rightt-data">
                        <div
                          className={
                            theme ? "name-time" : "name-time text-light-mode2"
                          }
                        >
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
                        <p
                          className={theme ? "" : "text-light-mode"}
                          style={{ marginTop: "8px" }}
                        >
                          {element.comment}
                        </p>
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
                                style={{ color: theme ? "white" : "#606060" }}
                                onClick={() => {
                                  LikeComment(element.videoid, element._id);
                                }}
                              />
                            </Tooltip>
                            <p
                              className={theme ? "" : "text-light-mode"}
                              style={{ marginLeft: "10px" }}
                            >
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
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => {
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
                              style={{ color: theme ? "#aaa" : "#606060" }}
                              className="deletethis-cmmt"
                              onClick={() => {
                                DeleteComment(element.videoid, element._id);
                              }}
                            />
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                    <div
                      className="right-sidevideo"
                      key={index}
                      onClick={() => {
                        if (element.videoData._id !== undefined) {
                          window.location.href = `/studio/video/comments/${element.videoData._id}`;
                        }
                      }}
                    >
                      <img
                        src={
                          element.videoData && element.videoData.thumbnailURL
                        }
                        alt="thumbnail"
                        className="commentvideo-thumbnail"
                      />
                      <div
                        className={
                          theme
                            ? "thiscomment-rightone"
                            : "thiscomment-rightone text-light-mode"
                        }
                      >
                        <p>
                          {element.videoData &&
                          element.videoData.Title.length <= 40
                            ? element.videoData.Title
                            : `${element.videoData.Title.slice(0, 40)}...`}
                        </p>
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
                    <p className={theme ? "" : "text-light-mode2"}>
                      No comments found. Try searching for something else.
                    </p>
                  </div>
                </div>
              )}

            {loading === false && AllComments && AllComments.length === 0 && (
              <div className="user-comment-data2">
                <div className="no-comment-found">
                  <img src={noImage} alt="no-comment" className="nocmmt" />
                  <p className={theme ? "" : "text-light-mode2"}>
                    No comments found.
                  </p>
                </div>
              </div>
            )}

            {loading === true && AllComments && AllComments.length === 0 && (
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

export default Comments;
