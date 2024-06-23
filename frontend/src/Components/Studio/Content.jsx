import LeftPanel2 from "../LeftPanel2";
import Navbar2 from "../Navbar2";
import "../../Css/Studio/content.css";
import SouthIcon from "@mui/icons-material/South";
import { useEffect, useState } from "react";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import NorthOutlinedIcon from "@mui/icons-material/NorthOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import KeyboardTabOutlinedIcon from "@mui/icons-material/KeyboardTabOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import noImage from "../../img/no-video2.png";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

function Content() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000";
  const [userVideos, setUserVideos] = useState([]);
  const [sortByDateAsc, setSortByDateAsc] = useState(true);
  const [changeSort, setChangeSort] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [DeleteVideoID, setDeleteVideoID] = useState();
  const [isDeleteClicked, setIsDeleteClicked] = useState(false);
  const [DeleteVideoData, setDeleteVideoData] = useState();
  const [boxclicked, setBoxClicked] = useState(false);
  const videoUrl = "https://shubho-youtube-mern.netlify.app/video";
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

  document.title = "Channel content - YouTube Studio";

  //TOASTS

  const CopiedNotify = () =>
    toast.success("Link Copied!", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  //USE EFFECTS

  useEffect(() => {
    if (theme === false && window.location.href.includes("/studio/video")) {
      document.body.style.backgroundColor = "white";
    } else if (
      theme === true &&
      window.location.href.includes("/studio/video")
    ) {
      document.body.style.backgroundColor = "#282828";
    }
  }, [theme]);

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
    const handleClick = () => {
      document
        .querySelector(".channel-content-section")
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
        .querySelector(".channel-content-section")
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
    const GetUserVideos = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getuservideos/${user?.email}`
          );

          const data = await response.json();
          setUserVideos(data);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    GetUserVideos();
  }, [user?.email]);

  useEffect(() => {
    const GetDeleteVideoData = async () => {
      try {
        if (DeleteVideoID) {
          const response = await fetch(
            `${backendURL}/getdeletevideodata/${DeleteVideoID}`
          );

          const data = await response.json();
          setDeleteVideoData(data);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    GetDeleteVideoData();
  }, [DeleteVideoID]);

  const handleSortByDate = () => {
    setSortByDateAsc((prevState) => !prevState);
    setChangeSort(!changeSort);
  };

  const sortedUserVideos =
    userVideos &&
    userVideos.length > 0 &&
    userVideos.sort((a, b) => {
      if (sortByDateAsc) {
        return new Date(a.uploaded_date) - new Date(b.uploaded_date);
      } else {
        return new Date(b.uploaded_date) - new Date(a.uploaded_date);
      }
    });

  //POST REQUESTS

  const DeleteVideo = async (id) => {
    try {
      if (id) {
        const response = await fetch(`${backendURL}/deletevideo/${id}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        await response.json();
      }
    } catch (error) {
      // console.log(error.message);
    }
  };

  const handleCopyLink = (id) => {
    navigator.clipboard
      .writeText(`${videoUrl}/${id}`)
      .then(() => {
        CopiedNotify();
      })
      .catch((error) => {
        console.log("Error copying link to clipboard:", error);
      });
  };

  const downloadVideo = (url) => {
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = "video.mp4";
    link.click();
  };

  const DeleteVideoUploadDate = new Date(
    DeleteVideoData && DeleteVideoData.uploaded_date
  );

  return (
    <>
      <Navbar2 />
      <LeftPanel2 />
      <div className="channel-content-section">
        <div
          className="channel-content-top"
          style={{ left: menu ? "125px" : "310px" }}
        >
          <p className={theme ? "" : "text-light-mode"}>Channel content</p>
          <p
            className={theme ? "channel-videosss" : "channel-videosss blue-txt"}
          >
            Videos
          </p>
        </div>
        <hr
          className="breakk2 breakkk"
          style={{ left: menu ? "88px" : "262px" }}
        />
        <div
          className="channels-uploaded-videos-section"
          style={{ left: menu ? "90px" : "270px" }}
        >
          {sortedUserVideos && sortedUserVideos.length > 0 && (
            <table className="videos-table">
              <thead>
                <tr
                  style={{ color: theme ? "#aaa" : "black", fontSize: "14px" }}
                >
                  <th
                    style={{
                      textAlign: "left",
                      paddingLeft: "40px",
                      width: "45%",
                    }}
                  >
                    Video
                  </th>
                  <th>Visibility</th>
                  <th onClick={handleSortByDate} className="date-table-head">
                    <div className="table-row">
                      <p className={theme ? "" : "text-light-mode"}>Date</p>
                      {changeSort === false ? (
                        <SouthIcon
                          fontSize="200px"
                          style={{
                            color: theme ? "white" : "black",
                            marginLeft: "5px",
                          }}
                        />
                      ) : (
                        <NorthOutlinedIcon
                          fontSize="200px"
                          style={{
                            color: theme ? "white" : "black",
                            marginLeft: "5px",
                          }}
                        />
                      )}
                    </div>
                  </th>
                  <th>Views</th>
                  <th>Comments</th>
                  <th>Likes</th>
                </tr>
              </thead>
              <tbody>
                {sortedUserVideos.map((element, index) => {
                  const uploaded = new Date(element.uploaded_date);
                  return (
                    <tr
                      key={index}
                      className={
                        theme ? "table-roww" : "table-roww preview-lightt"
                      }
                      style={
                        loading === true
                          ? { pointerEvents: "none" }
                          : { pointerEvents: "auto" }
                      }
                    >
                      <td className="video-cell">
                        <SkeletonTheme
                          baseColor={theme ? "#353535" : "#aaaaaa"}
                          highlightColor={theme ? "#444" : "#b6b6b6"}
                        >
                          <div
                            className="no-skeleton"
                            style={
                              loading === true
                                ? { display: "flex" }
                                : { display: "none" }
                            }
                          >
                            <Skeleton
                              count={1}
                              width={150}
                              height={84}
                              style={{ marginLeft: "30px" }}
                            />
                          </div>
                        </SkeletonTheme>
                        <div
                          className="no-skeleton"
                          style={
                            loading === true
                              ? { visibility: "hidden", display: "none" }
                              : { visibility: "visible", display: "flex" }
                          }
                        >
                          <img
                            src={element.thumbnailURL}
                            alt="thumbnail"
                            className="studio-video-thumbnail"
                            onClick={() => {
                              window.location.href = `/studio/video/edit/${element._id}`;
                            }}
                          />
                          <p className="video-left-duration">
                            {Math.floor(element.videoLength / 60) +
                              ":" +
                              (Math.round(element.videoLength % 60) < 10
                                ? "0" + Math.round(element.videoLength % 60)
                                : Math.round(element.videoLength % 60))}
                          </p>
                        </div>
                        <div className="studio-video-details">
                          <SkeletonTheme
                            baseColor={theme ? "#353535" : "#aaaaaa"}
                            highlightColor={theme ? "#444" : "#b6b6b6"}
                          >
                            <div
                              className="no-skeleton2"
                              style={
                                loading === true
                                  ? { display: "flex" }
                                  : { display: "none" }
                              }
                            >
                              <Skeleton
                                count={1}
                                width={250}
                                height={14}
                                style={{
                                  borderRadius: "3px",
                                  position: "relative",
                                  left: "25px",
                                }}
                              />
                              <Skeleton
                                count={1}
                                width={180}
                                height={10}
                                style={{
                                  borderRadius: "3px",
                                  position: "relative",
                                  top: "15px",
                                  left: "25px",
                                }}
                              />
                              <Skeleton
                                count={1}
                                width={140}
                                height={10}
                                style={{
                                  borderRadius: "3px",
                                  position: "relative",
                                  top: "18px",
                                  left: "25px",
                                }}
                              />
                            </div>
                          </SkeletonTheme>
                          <div
                            className="no-skeleton2"
                            style={
                              loading === true
                                ? { visibility: "hidden", display: "none" }
                                : { visibility: "visible", display: "flex" }
                            }
                          >
                            <p
                              className={
                                theme
                                  ? "studio-video-title"
                                  : "studio-video-title text-light-mode"
                              }
                              onClick={() => {
                                window.location.href = `/studio/video/edit/${element._id}`;
                              }}
                            >
                              {element.Title.length <= 40
                                ? element.Title
                                : `${element.Title.slice(0, 40)}...`}
                            </p>
                            {element.Description ? (
                              <p
                                className={
                                  theme
                                    ? "studio-video-desc"
                                    : "studio-video-desc text-light-mode2"
                                }
                              >
                                {element.Description.length <= 85
                                  ? element.Description
                                  : `${element.Description.slice(0, 85)}...`}
                              </p>
                            ) : (
                              <p>Add description</p>
                            )}
                          </div>
                          <div className="video-editable-section">
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Details"
                              placement="bottom"
                            >
                              <ModeEditOutlineOutlinedIcon
                                className={
                                  theme
                                    ? "video-edit-icons"
                                    : "video-edit-icons-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => {
                                  window.location.href = `/studio/video/edit/${element._id}`;
                                }}
                              />
                            </Tooltip>
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Comments"
                              placement="bottom"
                            >
                              <ChatOutlinedIcon
                                className={
                                  theme
                                    ? "video-edit-icons"
                                    : "video-edit-icons-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => {
                                  window.location.href = `/studio/video/comments/${element._id}`;
                                }}
                              />
                            </Tooltip>
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="View on YouTube"
                              placement="bottom"
                            >
                              <YouTubeIcon
                                className={
                                  theme
                                    ? "video-edit-icons"
                                    : "video-edit-icons-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => {
                                  window.location.href = `/video/${element._id}`;
                                }}
                              />
                            </Tooltip>
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Options"
                              placement="bottom"
                            >
                              <MoreVertOutlinedIcon
                                className={
                                  theme
                                    ? "video-edit-icons"
                                    : "video-edit-icons-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => setShowOptions(!showOptions)}
                              />
                            </Tooltip>
                            <div
                              className={
                                theme
                                  ? "extra-options-menu"
                                  : "extra-options-menu light-mode"
                              }
                              style={
                                showOptions === true
                                  ? { display: "flex" }
                                  : { display: "none" }
                              }
                            >
                              <div
                                className={
                                  theme
                                    ? "edit-video-data-row option-row"
                                    : "edit-video-data-row option-row preview-lightt"
                                }
                                onClick={() => {
                                  window.location.href = `/studio/video/edit/${element._id}`;
                                }}
                              >
                                <ModeEditOutlineOutlinedIcon
                                  className={
                                    theme
                                      ? "video-edit-icons"
                                      : "video-edit-icons-light"
                                  }
                                  fontSize="medium"
                                  style={{ color: theme ? "#aaa" : "#606060" }}
                                />
                                <p>Edit title and description</p>
                              </div>
                              {element.visibility === "Public" ? (
                                <div
                                  className={
                                    theme
                                      ? "share-video-data-row option-row"
                                      : "share-video-data-row option-row preview-lightt"
                                  }
                                  onClick={() => {
                                    handleCopyLink(element._id);
                                    setShowOptions(false);
                                  }}
                                >
                                  <ShareOutlinedIcon
                                    className={
                                      theme
                                        ? "video-edit-icons"
                                        : "video-edit-icons-light"
                                    }
                                    fontSize="medium"
                                    style={{
                                      color: theme ? "#aaa" : "#606060",
                                    }}
                                  />
                                  <p>Get shareable link</p>
                                </div>
                              ) : null}
                              <div
                                className={
                                  theme
                                    ? "download-video-data-row option-row"
                                    : "download-video-data-row option-row preview-lightt"
                                }
                                onClick={() => {
                                  downloadVideo(element.videoURL);
                                  setShowOptions(false);
                                }}
                              >
                                <KeyboardTabOutlinedIcon
                                  className={
                                    theme
                                      ? "video-edit-icons"
                                      : "video-edit-icons-light"
                                  }
                                  fontSize="medium"
                                  style={{
                                    color: theme ? "#aaa" : "#606060",
                                    transform: "rotate(90deg)",
                                  }}
                                />
                                <p>Download</p>
                              </div>
                              <div
                                className={
                                  theme
                                    ? "delete-video-data-row option-row"
                                    : "delete-video-data-row option-row preview-lightt"
                                }
                                onClick={() => {
                                  setDeleteVideoID(element._id);
                                  if (element._id !== undefined) {
                                    setShowOptions(false);
                                    setIsDeleteClicked(true);
                                    document.body.classList.add("bg-css2");
                                  }
                                }}
                              >
                                <DeleteOutlineOutlinedIcon
                                  className={
                                    theme
                                      ? "video-edit-icons"
                                      : "video-edit-icons-light"
                                  }
                                  fontSize="medium"
                                  style={{ color: theme ? "#aaa" : "#606060" }}
                                />
                                <p>Delete forever</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="privacy-table">
                          {element.visibility === "Public" ? (
                            <RemoveRedEyeOutlinedIcon
                              fontSize="small"
                              style={{ color: "#2ba640" }}
                            />
                          ) : (
                            <VisibilityOffOutlinedIcon
                              fontSize="small"
                              style={{
                                color: theme
                                  ? "rgb(170 170 170 / 53%)"
                                  : "#909090",
                              }}
                            />
                          )}
                          <p
                            className={theme ? "" : "text-light-mode2"}
                            style={{ marginLeft: "8px" }}
                          >
                            {element.visibility}
                          </p>
                        </div>
                      </td>
                      <td>
                        <p className={theme ? "" : "text-light-mode2"}>
                          {uploaded.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </td>
                      <td>
                        <p className={theme ? "" : "text-light-mode2"}>
                          {element.views && element.views.toLocaleString()}
                        </p>
                      </td>
                      <td>
                        <p className={theme ? "" : "text-light-mode2"}>
                          {element.comments && element.comments.length}
                        </p>
                      </td>
                      <td>
                        <p className={theme ? "" : "text-light-mode2"}>
                          {element.likes}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <div
          className="novideo-available"
          style={
            userVideos && userVideos.message === "USER DOESN'T EXIST"
              ? { display: "flex" }
              : { display: "none" }
          }
        >
          <img src={noImage} alt="no-video" className="no-content-img" />
          <p>No content available</p>
        </div>
      </div>
      <div
        className={
          theme
            ? "last-delete-warning"
            : "last-delete-warning light-mode text-light-mode"
        }
        style={
          isDeleteClicked === true && DeleteVideoData
            ? { display: "block" }
            : { display: "none" }
        }
      >
        <div className="delete-question">
          <p>Permanently delete this video?</p>
        </div>
        <div className="deleted-video-data">
          <div
            className={
              theme ? "thisdelete-data" : "thisdelete-data social-lightt"
            }
          >
            <img
              src={DeleteVideoData && DeleteVideoData.thumbnailURL}
              alt="thumbnail"
              className="deletevideo-thumbnail"
            />
            <p className="thisdelete-duration">
              {Math.floor(DeleteVideoData && DeleteVideoData.videoLength / 60) +
                ":" +
                (Math.round(
                  DeleteVideoData && DeleteVideoData.videoLength % 60
                ) < 10
                  ? "0" +
                    Math.round(
                      DeleteVideoData && DeleteVideoData.videoLength % 60
                    )
                  : Math.round(
                      DeleteVideoData && DeleteVideoData.videoLength % 60
                    ))}
            </p>
            <div className="thisdelete-video-details">
              <p className="delete-title">
                {DeleteVideoData && DeleteVideoData.Title.length <= 15
                  ? DeleteVideoData.Title
                  : `${
                      DeleteVideoData && DeleteVideoData.Title.slice(0, 15)
                    }...`}
              </p>
              <p
                className={
                  theme ? "delete-uploaded" : "delete-uploaded text-light-mode2"
                }
              >
                {"Uploaded " +
                  DeleteVideoUploadDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
              </p>
              <p
                className={
                  theme ? "delete-views" : "delete-views text-light-mode2"
                }
              >
                {DeleteVideoData && DeleteVideoData.views + " views"}
              </p>
            </div>
          </div>
        </div>
        <div className="delete-consent">
          <CheckBoxOutlineBlankIcon
            onClick={() => {
              setBoxClicked(!boxclicked);
            }}
            fontSize="medium"
            style={
              boxclicked === false
                ? { color: theme ? "#aaa" : "#606060", cursor: "pointer" }
                : { display: "none" }
            }
          />
          <CheckBoxIcon
            onClick={() => {
              setBoxClicked(!boxclicked);
            }}
            fontSize="medium"
            style={
              boxclicked === true
                ? { color: theme ? "white" : "606060", cursor: "pointer" }
                : { display: "none" }
            }
          />
          <p>
            I understand that deleting a video from YouTube is permanent and
            cannot be undone.
          </p>
        </div>
        <div className="delete-video-buttons">
          <button
            className={
              theme
                ? "download-delete-video delete-css"
                : "download-delete-video delete-css blue-txt"
            }
            onClick={() => {
              if (DeleteVideoData) {
                downloadVideo(DeleteVideoData.videoURL);
              }
            }}
          >
            DOWNLOAD VIDEO
          </button>
          <div className="extra-two-delete-btns">
            <button
              className={
                theme
                  ? "cancel-delete delete-css"
                  : "cancel-delete delete-css blue-txt"
              }
              onClick={() => {
                setIsDeleteClicked(false);
                document.body.classList.remove("bg-css2");
                window.location.reload();
              }}
            >
              CANCEL
            </button>
            <button
              className={
                theme
                  ? "delete-video-btn delete-css"
                  : `delete-video-btn delete-css ${
                      !boxclicked ? "" : "blue-txt"
                    }`
              }
              disabled={!boxclicked}
              onClick={() => {
                if (boxclicked === true && DeleteVideoData) {
                  DeleteVideo(DeleteVideoData._id);
                  setTimeout(() => {
                    window.location.reload();
                  }, 300);
                }
              }}
              style={{
                opacity: boxclicked === false ? 0.7 : 1,
                color: boxclicked === false ? "#aaa" : "#3eaffe",
                cursor: boxclicked === false ? "not-allowed" : "pointer",
              }}
            >
              DELETE VIDEO
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Content;
