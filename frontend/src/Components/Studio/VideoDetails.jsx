import LeftPanel3 from "../LeftPanel3";
import Navbar2 from "../Navbar2";
import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import "../../Css/Studio/videodetails.css";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import HdIcon from "@mui/icons-material/Hd";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import KeyboardTabOutlinedIcon from "@mui/icons-material/KeyboardTabOutlined";
import UndoOutlinedIcon from "@mui/icons-material/UndoOutlined";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ArrowDropDownOutlinedIcon from "@mui/icons-material/ArrowDropDownOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import WestIcon from "@mui/icons-material/West";
import { storage } from "../../Firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GrUndo } from "react-icons/gr";

function VideoDetails() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000";
  const { id } = useParams();
  const [videodata, setVideoData] = useState();
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewDescription, setPreviewDescription] = useState("");
  const [previewTags, setPreviewTags] = useState("");
  const videolink = "https://shubho-youtube-mern.netlify.app/video";
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [thumbnailSelected, setThumbnailSelected] = useState(false);
  const [finalThumbnail, setFinalThumbnail] = useState(null);
  const [OptionClicked, setOptionClicked] = useState(false);
  const [changes, setChanges] = useState(false);
  const [privacyClicked, setprivacyClicked] = useState(false);
  const [updatePrivacy, setprivacy] = useState(null);
  const [loading, setLoading] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [fakeLoading, setFakeLoading] = useState(true);
  const [menu, setmenu] = useState(() => {
    const menu = localStorage.getItem("studioMenuClicked2");
    return menu ? JSON.parse(menu) : false;
  });
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const optionRef = useRef();

  document.title = "Video details - YouTube Studio";

  //TOASTS

  const WarningNotify = () =>
    toast.error("Input fields can't be empty!", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

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
    localStorage.setItem("studioMenuClicked2", JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    const GetVideoData = async () => {
      try {
        if (id) {
          const response = await fetch(
            `${backendURL}/getvideodata/${id}`
          );
          const data = await response.json();
          setVideoData(data);
          setPreviewTitle(data.Title);
          setPreviewDescription(data.Description);
          setPreviewTags(data.Tags);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    GetVideoData();
  }, [id]);

  useEffect(() => {
    setTimeout(() => {
      setFakeLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!optionRef.current.contains(e.target)) {
        setOptionClicked(false);
      }
    };

    document.addEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (loading === true) {
      setOpacity(0.4);
    } else {
      setOpacity(1);
    }
  }, [loading]);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(`${videolink}/${videodata && videodata._id}`)
      .then(() => {
        CopiedNotify();
      })
      .catch((error) => {
        console.log("Error copying link to clipboard:", error);
      });
  };

  useEffect(() => {
    const handleClick = () => {
      document
        .querySelector(".main-video-details-section")
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
        .querySelector(".main-video-details-section")
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

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.width / img.height;
        if (Math.abs(aspectRatio - 16 / 9) < 0.01) {
          setThumbnailImage(file);
          setThumbnailSelected(true);
          setFinalThumbnail(file);
          setChanges(true);
        } else {
          alert("Please upload an image with a 16:9 aspect ratio.");
        }
      };
      img.src = reader.result;
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleThumbnailDownload = () => {
    if (thumbnailImage) {
      const anchor = document.createElement("a");
      anchor.href = URL.createObjectURL(thumbnailImage);
      anchor.download = "thumbnail.png"; //
      anchor.click();
    }
  };

  const confirmReload = () => {
    if (changes) {
      const userConfirmation = window.confirm(
        "Changes you made may not be saved. Do you want to continue?"
      );
      if (userConfirmation) {
        window.location.reload();
      } else {
        // User clicked on "Cancel", do nothing
      }
    }
  };

  const UploadThumbnail = async () => {
    try {
      if (
        !finalThumbnail ||
        (videodata && finalThumbnail === videodata.thumbnailURL)
      ) {
        return videodata.thumbnailURL;
      }

      const fileReference = ref(storage, `thumbnail/${finalThumbnail.name}`);
      const uploadData = uploadBytesResumable(fileReference, finalThumbnail);

      return new Promise((resolve, reject) => {
        uploadData.on(
          "state_changed",
          null,
          (error) => {
            console.log(error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadData.snapshot.ref);
              resolve(downloadURL);
            } catch (error) {
              console.log(error);
              reject(error);
            }
          }
        );
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const SaveData = async () => {
    try {
      setLoading(true);
      let img = await UploadThumbnail();
      let newPrivacy =
        updatePrivacy === null ? videodata.visibility : updatePrivacy;

      const data = {
        thumbnail: img,
        title: previewTitle,
        desc: previewDescription,
        tags: previewTags,
        privacy: newPrivacy,
      };

      const response = await fetch(
        `${backendURL}/savevideoeditdetails/${id}`,
        {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const Data = await response.json();
      if (Data) {
        setLoading(false);
        window.location.reload();
      }
    } catch (error) {
      // console.log(error);
      setLoading(true);
    }
  };

  return (
    <>
      <Navbar2 />
      <LeftPanel3 />

      <div
        className="back-menu-edit"
        onClick={() => (window.location.href = "/studio/video")}
      >
        <WestIcon fontSize="medium" style={{ color: "#aaa" }} />
      </div>

      <div
        className="main-video-details-section"
        style={{
          opacity: opacity,
          pointerEvents: loading ? "none" : "auto",
          left: menu ? "115px" : "300px",
          transition: menu ? "all .12s ease" : "none",
          cursor: loading ? "wait" : "auto",
        }}
      >
        <div className="current-editvideodata">
          <p
            className={
              theme ? "current-tophead" : "current-tophead text-light-mode"
            }
          >
            Video details
          </p>
          <div className="thissection-btns">
            <button
              className={changes === false ? "disabled-btn" : "video-editbtnss"}
              disabled={changes === false ? true : false}
              onClick={confirmReload}
            >
              UNDO CHANGES
            </button>
            <GrUndo
              fontSize="24px"
              color="white"
              className="undo-edit"
              onClick={confirmReload}
            />
            <button
              className={
                changes === false ? "disabled-btn2" : "video-editbtnss"
              }
              onClick={() => {
                if (
                  previewTitle === "" ||
                  previewDescription === "" ||
                  previewTags === ""
                ) {
                  WarningNotify();
                } else {
                  SaveData();
                }
              }}
              disabled={changes === false ? true : false}
            >
              SAVE
            </button>
          </div>
        </div>
        <div className="current-editvideo-data">
          <div className="video-details-left">
            <div className="current-video-editable-section">
              <div className="currentvideo-title">
                <input
                  type="text"
                  name="video-title"
                  className={
                    theme
                      ? "currentvideo-title-inp"
                      : "currentvideo-title-inp text-light-mode new-light-border"
                  }
                  value={previewTitle}
                  required
                  onChange={(e) => {
                    setPreviewTitle(e.target.value);
                    setChanges(true);
                  }}
                  placeholder="Add a title that describes your video"
                  maxLength={100}
                />
                <p className="title-sample-txt">Title (required)</p>
              </div>
              <div className="currentvideo-desc">
                <textarea
                  type="text"
                  name="video-desc"
                  required
                  className={
                    theme
                      ? "currentvideo-desc-inp"
                      : "currentvideo-desc-inp new-light-border text-light-mode"
                  }
                  onChange={(e) => {
                    setPreviewDescription(e.target.value);
                    setChanges(true);
                  }}
                  placeholder="Tell viewers about your video"
                  value={previewDescription}
                  maxLength={5000}
                />
                <p
                  className={
                    theme
                      ? "desc-sample-txt"
                      : "desc-sample-txt desc-light-mode"
                  }
                >
                  Description
                </p>
              </div>
              <div className="currentvideo-thumbnailedit">
                <p className={theme ? "" : "text-light-mode"}>Thumbnail</p>
                <p className={theme ? "" : "text-light-mode2"}>
                  Select or upload a picture that shows what&apos;s in your
                  video. A good thumbnail stands out and draws viewers&apos;
                  attention.
                </p>
                <div className="mythumbnails-sectionn">
                  {thumbnailImage ? (
                    <div
                      className="currentthumbnail-data choosed-one"
                      style={{ bottom: thumbnailSelected ? "25px" : "0px" }}
                    >
                      <img
                        src={URL.createObjectURL(thumbnailImage)}
                        alt="thumbnail"
                        className="currnt-tbimg2"
                        style={
                          thumbnailSelected === true && videodata
                            ? {
                                border: `2.2px solid ${
                                  theme ? "white" : "#606060"
                                }`,
                                borderRadius: "3px",
                                opacity: "1",
                              }
                            : { border: "none", opacity: ".4" }
                        }
                        onClick={() => {
                          setThumbnailSelected(true);
                          setFinalThumbnail(thumbnailImage);
                        }}
                      />
                    </div>
                  ) : (
                    <label
                      htmlFor="thumbnail-upload"
                      className={
                        theme
                          ? "uploadnew-thumbnaill"
                          : "uploadnew-thumbnaill new-light-border2"
                      }
                    >
                      <AddPhotoAlternateOutlinedIcon
                        fontSize="medium"
                        style={{ color: "#aaa" }}
                      />
                      <p>Upload thumbnail</p>
                    </label>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    id="thumbnail-upload"
                    style={{ display: "none" }}
                    onChange={handleThumbnailUpload}
                  />
                  <div className="currentthumbnail-data">
                    {fakeLoading === true ? (
                      <div
                        className="spin32"
                        style={{
                          position: "relative",
                          left: "50px",
                          top: "10px",
                        }}
                      >
                        <span
                          className={theme ? "loader2" : "loader2-light"}
                        ></span>
                      </div>
                    ) : (
                      <img
                        src={videodata && videodata.thumbnailURL}
                        alt="thumbnail"
                        className="currnt-tbimg"
                        style={
                          videodata && thumbnailSelected === false
                            ? {
                                border: `2.2px solid ${
                                  theme ? "white" : "#606060"
                                }`,
                                borderRadius: "3px",
                                opacity: "1",
                              }
                            : { border: "none", opacity: ".4" }
                        }
                        onClick={() => {
                          setThumbnailSelected(false);
                          setFinalThumbnail(videodata.thumbnailURL);
                        }}
                      />
                    )}
                    <div
                      className="img-optionss"
                      style={
                        thumbnailImage && thumbnailSelected === true
                          ? { display: "block" }
                          : { display: "none" }
                      }
                      onClick={() => setOptionClicked(!OptionClicked)}
                    >
                      <MoreVertOutlinedIcon
                        fontSize="small"
                        className="extra-optn"
                        style={{ color: "white" }}
                      />
                    </div>
                    <div
                      className="extra-img-options"
                      ref={optionRef}
                      style={
                        OptionClicked === true
                          ? { display: "flex" }
                          : { display: "none" }
                      }
                    >
                      <label
                        htmlFor="thumbnail-upload"
                        className="change-thumbnail-img"
                        onClick={() => setOptionClicked(false)}
                      >
                        <AddPhotoAlternateOutlinedIcon
                          fontSize="medium"
                          style={{ color: "#aaa" }}
                        />
                        <p>Change</p>
                      </label>
                      <div
                        className="download-thumbnail"
                        onClick={() => {
                          handleThumbnailDownload();
                          setOptionClicked(false);
                        }}
                      >
                        <KeyboardTabOutlinedIcon
                          className="video-edit-icons"
                          fontSize="medium"
                          style={{
                            color: "#aaa",
                            transform: "rotate(90deg)",
                          }}
                        />
                        <p>Download</p>
                      </div>
                      <div
                        className="undo-thumbnail"
                        onClick={() => {
                          setThumbnailImage(null);
                          setOptionClicked(false);
                          setThumbnailSelected(false);
                        }}
                      >
                        <UndoOutlinedIcon
                          fontSize="medium"
                          style={{ color: "#aaa" }}
                        />
                        <p>Undo</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="currnt-video-tags-section"
                  style={{ marginTop: thumbnailSelected ? "0px" : "30px" }}
                >
                  <p className={theme ? "" : "text-light-mode"}>Tags</p>
                  <p className={theme ? "" : "text-light-mode2"}>
                    Tags can be useful if content in your video is commonly
                    misspelled. Otherwise, tags play a minimal role in helping
                    viewers find your video.
                  </p>
                  <input
                    type="text"
                    name="video-title"
                    className={
                      theme
                        ? "currentvid-tagsinp"
                        : "currentvid-tagsinp new-light-border text-light-mode"
                    }
                    value={previewTags}
                    required
                    onChange={(e) => {
                      setPreviewTags(e.target.value);
                      setChanges(true);
                    }}
                    placeholder="Add tags to rank your video up"
                    maxLength={200}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="video-details-right">
            <div className="preview-current-video">
              <iframe
                width="360"
                height="220"
                className="playable-videoedit"
                src={videodata && videodata.videoURL}
                title="YouTube video player"
                frameBorder="0"
                allowFullScreen
              ></iframe>
              <div
                className={
                  theme
                    ? "preview-data-details"
                    : "preview-data-details preview-light2 text-light-mode"
                }
              >
                <div className="preview-part1">
                  <div className="video-linkleft">
                    <p className={theme ? "" : "text-light-mode2"}>
                      Video link
                    </p>
                    <p
                      className="current-videolink"
                      onClick={() => {
                        if (videodata) {
                          window.location.href = `${videolink}/${videodata._id}`;
                        }
                      }}
                    >
                      {videolink +
                        `/${
                          videodata && videodata._id.length <= 5
                            ? videodata && videodata._id
                            : `${videodata && videodata._id.slice(0, 5)}...`
                        }`}
                    </p>
                  </div>
                  <ContentCopyIcon
                    fontSize="medium"
                    className={theme ? "copythis-btn" : "copy-light-btn"}
                    style={{ color: "#aaaaaab0" }}
                    onClick={handleCopyLink}
                  />
                  <div className="copyvideokalink">
                    <ContentCopyIcon
                      fontSize="medium"
                      className={theme ? "copythis-btn-new" : "copy-light-btn2"}
                      style={{ color: "#aaaaaab0" }}
                      onClick={handleCopyLink}
                    />
                    <p>Copy Link</p>
                  </div>
                </div>
                <div className="preview-part2">
                  <p className={theme ? "" : "text-light-mode2"}>Filename</p>
                  <p>
                    {videodata && videodata.Title.length <= 35
                      ? videodata && videodata.Title
                      : `${videodata && videodata.Title.slice(0, 35)}...`}
                  </p>
                </div>
                <div className="preview-part3">
                  <p className={theme ? "" : "text-light-mode2"}>
                    Video quality
                  </p>
                  <HdIcon
                    fontSize="large"
                    style={{ color: "#3ea6ff", marginTop: "6px" }}
                  />
                </div>
              </div>
            </div>
            <div
              className={
                theme
                  ? "video-visibility-section"
                  : "video-visibility-section new-light-border"
              }
              onClick={() => {
                setprivacyClicked(!privacyClicked);
              }}
            >
              <p className={theme ? "" : "text-light-mode2"}>Visibility</p>
              <div className="visibility-current-data">
                <div className="privacy-current">
                  {updatePrivacy === "Public" ||
                  (updatePrivacy === null &&
                    videodata &&
                    videodata.visibility === "Public") ? (
                    <RemoveRedEyeOutlinedIcon
                      fontSize="small"
                      style={{ color: "#2ba640" }}
                    />
                  ) : (
                    <VisibilityOffOutlinedIcon
                      fontSize="small"
                      style={{
                        color: theme ? "rgb(170 170 170 / 53%)" : "#606060",
                      }}
                    />
                  )}

                  {updatePrivacy === null ? (
                    <p className={theme ? "" : "text-light-mode"}>
                      {videodata && videodata.visibility}
                    </p>
                  ) : (
                    <p className={theme ? "" : "text-light-mode"}>
                      {updatePrivacy}
                    </p>
                  )}
                </div>
                <ArrowDropDownOutlinedIcon
                  fontSize="medium"
                  style={{ color: "#aaa" }}
                />
              </div>
            </div>
            <div
              className={
                theme
                  ? "select-any-visibility"
                  : "select-any-visibility light-mode"
              }
              style={
                privacyClicked === true
                  ? { display: "block" }
                  : { display: "none" }
              }
            >
              <div
                className={
                  theme
                    ? "thispublic-visibility"
                    : "thispublic-visibility preview-lightt"
                }
                onClick={() => {
                  setprivacy("Public");
                  setprivacyClicked(false);
                  setChanges(true);
                }}
              >
                <RemoveRedEyeOutlinedIcon
                  fontSize="small"
                  style={{ color: "#2ba640" }}
                />
                <p className={theme ? "" : "text-light-mode"}>Public</p>
              </div>
              <div
                className={
                  theme
                    ? "thisprivate-visibility"
                    : "thisprivate-visibility preview-lightt"
                }
                onClick={() => {
                  setprivacy("Private");
                  setprivacyClicked(false);
                  setChanges(true);
                }}
              >
                <VisibilityOffOutlinedIcon
                  fontSize="small"
                  style={{
                    color: theme ? "rgb(170 170 170 / 53%)" : "#606060",
                  }}
                />
                <p className={theme ? "" : "text-light-mode"}>Private</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoDetails;
