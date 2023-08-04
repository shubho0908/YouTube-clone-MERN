import LeftPanel2 from "../LeftPanel2";
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

function Comments() {
  const [Email, setEmail] = useState();
  const [AllComments, setAllComments] = useState([]);
  const [videoId, setVideoId] = useState();
  const [Profile, setProfile] = useState();

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setEmail(jwtDecode(token).email);
  }, []);

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
    const getComments = async () => {
      try {
        if (Email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getallcomments/${Email}`
          );
          const { comments, videoid } = await response.json();
          setAllComments(comments);
          setVideoId(videoid);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    const interval = setInterval(getComments, 100);

    return () => clearInterval(interval);
  }, [Email]);

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

  const DeleteComment = async (id, commentIndex) => {
    try {
      const response = await fetch(
        `http://localhost:3000/deletecomment/${id}/${commentIndex}/${Email}`,
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

  return (
    <>
      <Navbar2 />
      <LeftPanel2 />
      <div className="video-all-comments-section">
        <div className="channel-comments-top">
          <p>Channel comments</p>
        </div>
        <div className="channel-comments-mid">
          <p>Comments</p>
        </div>
        <hr className="breakkk" />
        <div className="filter-comments">
          <FilterListOutlinedIcon fontSize="medium" style={{ color: "#aaa" }} />
          <input type="text" name="comment-search" placeholder="Filter" />
        </div>
        <div className="channel-comments-list">
          <div className="overall-comments"></div>
          {AllComments &&
            AllComments.length > 0 &&
            AllComments.map((element, index) => {
              return (
                <div className="user-comment-data" key={index}>
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
                    <p style={{ marginTop: "8px" }}>{element.comment}</p>
                    <div className="comment-all-btns">
                      <div className="cmmt-like">
                        <ThumbUpIcon
                          fontSize="small"
                          className="thiscomment-like-btn"
                          style={{ color: "#white" }}
                          onClick={() => {
                            LikeComment(element.videoid, element._id);
                          }}
                        />

                        <p style={{ marginLeft: "10px" }}>{element.likes}</p>
                      </div>
                      {element.heartComment === true ? (
                        <div
                          className="hearted-thiscomment"
                          onClick={() =>
                            HeartComment(element.videoid, element._id)
                          }
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
                      ) : (
                        <FavoriteBorderOutlinedIcon
                          fontSize="small"
                          className="heartcmmt-btn"
                          style={{ color: "#aaa" }}
                          onClick={() =>
                            HeartComment(element.videoid, element._id)
                          }
                        />
                      )}

                      <DeleteOutlineOutlinedIcon
                        fontSize="small"
                        style={{ color: "#aaa" }}
                        onClick={() =>
                          DeleteComment(element.videoid, element._id)
                        }
                      />
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

export default Comments;
