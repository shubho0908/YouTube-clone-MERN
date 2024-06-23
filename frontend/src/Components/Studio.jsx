import { useEffect, useState } from "react";
import Navbar2 from "./Navbar2";
import LeftPanel2 from "./LeftPanel2";
import avatar from "../img/avatar.png";
import "../Css/studio.css";
import { storage } from "../Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Upload from "../img/upload.png";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SdIcon from "@mui/icons-material/Sd";
import HdIcon from "@mui/icons-material/Hd";
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";
import LinkIcon from "@mui/icons-material/Link";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import ArrowDropDownRoundedIcon from "@mui/icons-material/ArrowDropDownRounded";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import Dashboard from "./Studio/Dashboard";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import { LiaUploadSolid } from "react-icons/lia";
import { useSelector } from "react-redux";

//SOCIALS

import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";

function Studio() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000";
  const [isChannel, setisChannel] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [previewImage, setPreviewImage] = useState(avatar);
  const [previewThumbnail, setPreviewThumbnail] = useState(null);
  const [ChannelName, setChannelName] = useState();
  const [ChannelAbout, setChannelAbout] = useState();
  const [isLoading, setisLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVideoSelected, setIsVideoSelected] = useState(false);
  const [isThumbnailSelected, setIsThumbnailSelected] = useState(false);
  const [videoName, setVideoName] = useState("Upload videos");
  const [VideoURL, setVideoURL] = useState("");
  const [Progress, setProgress] = useState(0);
  const [uploadTask, setUploadTask] = useState(null);
  const [videoDescription, setVideoDescription] = useState("");
  const [videoTags, setVideoTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(null);
  const [linksClicked, setLinksClicked] = useState(false);
  const [iconClicked, setIconClicked] = useState("");
  const [fblink, setfblink] = useState();
  const [instalink, setinstalink] = useState();
  const [twitterlink, settwitterlink] = useState();
  const [websitelink, setwebsitelink] = useState();
  const [visibility, setVisibility] = useState("Public");
  const [isVisibilityClicked, setisVisibilityClicked] = useState(false);
  const [myVideos, setMyVideos] = useState([]);
  const [isPublished, setIsPublished] = useState(false);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const User = useSelector((state) => state.user.user);
  const { user } = User;
  //TOAST FUNCTIONS

  const CancelNotify = () =>
    toast.warning("Video upload was cancelled!", {
      position: "bottom-center",
      autoClose: 950,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  const ErrorNotify = () =>
    toast.error("Image/Input can't be empty.", {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  const VideoErrorNotify = () =>
    toast.error("Input fields can't be empty.", {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  const ThumbnailNotify = () =>
    toast.warning("Please select a thumbnail!", {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  //USE EFFECTS

  useEffect(() => {
    if (theme === false && window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "#F9F9F9";
    } else if (theme === true && window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "rgb(31, 31, 31)";
    }
  }, [theme]);

  useEffect(() => {
    const getVideos = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getuservideos/${user?.email}`
          );
          const data = await response.json();
          setMyVideos(data);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    return () => getVideos();
  }, [user?.email]);

  useEffect(() => {
    const handleClick = () => {
      setIsClicked(true);
    };

    const uploadBtn = document.querySelector(".uploadnewone-video");
    if (uploadBtn) {
      uploadBtn.addEventListener("click", handleClick);

      return () => {
        if (uploadBtn) {
          uploadBtn.removeEventListener("click", handleClick);
        }
      };
    }
  }, []);

  useEffect(() => {
    const handleClick = () => {
      document.querySelector(".studio").classList.add("studio-dark");
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
      document.querySelector(".studio").classList.remove("studio-dark");
    };

    const crossBtn = document.querySelector(".clear-search");

    if (crossBtn) {
      crossBtn.addEventListener("click", handleClick);
    }

    return () => {
      if (crossBtn) {
        crossBtn.removeEventListener("click", handleClick);
      }
    };
  });

  useEffect(() => {
    if (isChannel === false) {
      document.body.classList.add("bg-css");
    } else {
      document.body.classList.remove("bg-css");
    }
  }, [isChannel]);

  useEffect(() => {
    if (isClicked === true) {
      document.body.classList.add("bg-css");
    } else {
      document.body.classList.remove("bg-css");
    }
  }, [isClicked]);

  //GET CHANNEL'S DATA

  useEffect(() => {
    const ChannelAvailable = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getchannel/${user?.email}`
          );
          const { hasChannel } = await response.json();
          setisChannel(hasChannel);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    ChannelAvailable();
  }, [user?.email]);

  //IMAGE UPLOAD

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleChannelname = (e) => {
    setChannelName(e.target.value);
  };

  const handleChannelabout = (e) => {
    setChannelAbout(e.target.value);
  };

  const handleFacebookLink = (e) => {
    setfblink(e.target.value);
  };

  const handleTwitterLink = (e) => {
    settwitterlink(e.target.value);
  };

  const handleInstagramLink = (e) => {
    setinstalink(e.target.value);
  };

  const handleWebsiteLink = (e) => {
    setwebsitelink(e.target.value);
  };

  const uploadPic = async () => {
    try {
      if (!selectedImage) {
        return null;
      }

      const fileReference = ref(storage, `profile/${selectedImage.name}`);
      const uploadData = uploadBytesResumable(fileReference, selectedImage);

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

  // UPLOAD VIDEO

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    const fileSizeInMB = file.size / (1024 * 1024); // Convert file size to MB

    if (fileSizeInMB > 30) {
      alert("Please select a video file with a size of up to 30MB.");
      return;
    }

    setSelectedVideo(file);
    setIsVideoSelected(true);

    if (file) {
      const fileName = file.name;
      setVideoName(fileName.substring(0, fileName.lastIndexOf(".")));
      uploadVideo(file);
    }
  };

  const ClearState = () => {
    setIsClicked(false);
    setIsVideoSelected(false);
    setIsThumbnailSelected(false);
    setVideoName("Upload videos");
    setVideoDescription("");
  };

  const uploadVideo = async (videoFile) => {
    try {
      const fileReference = ref(storage, `videos/${videoFile.name}`);
      const uploadTask = uploadBytesResumable(fileReference, videoFile);
      setUploadTask(uploadTask); // Store the upload task

      const videoElement = document.createElement("video");
      videoElement.preload = "metadata";

      videoElement.onloadedmetadata = async function () {
        const duration = videoElement.duration; // Duration in seconds
        // console.log("Video duration:", duration);
        setDuration(duration);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // Handle upload progress if needed
            let progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            progress = Math.round(progress);
            setProgress(progress);
          },
          (error) => {
            // Handle error during upload
            console.log(error);
          },
          async () => {
            // Handle successful upload
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              // console.log("Video download URL:", downloadURL);
              setVideoURL(downloadURL);
              // Do something with the download URL, e.g., save it to the database
            } catch (error) {
              console.log(error);
            }
          }
        );
      };

      videoElement.src = URL.createObjectURL(videoFile);
    } catch (error) {
      // console.log(error);
    }
  };

  //CANCEL VIDEO UPLOAD

  const cancelVideoUpload = () => {
    if (uploadTask) {
      uploadTask.cancel();
      setIsVideoSelected(false);
      setVideoName("Upload videos");
      setProgress(0);
    }
  };

  //SAVE DATA TO DB

  const saveChannelData = async (e) => {
    e.preventDefault();
    if (selectedImage === null || ChannelName === "" || ChannelAbout === "") {
      ErrorNotify();
      return;
    }

    try {
      setisLoading(true);
      const downloadURL = await uploadPic(); // Wait for the image upload to complete
      if (!downloadURL) {
        setisLoading(false);
        return; // Handle the case when no image is selected
      }

      const currentDate = new Date().toISOString();

      const data = {
        profileURL: downloadURL,
        ChannelName,
        ChannelAbout,
        fblink,
        instalink,
        twitterlink,
        websitelink,
        currentDate,
        email: user?.email,
      };

      // Proceed with saving the channel data
      const response = await fetch(`${backendURL}/savechannel`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { message } = await response.json();
      if (message === "Channel saved successfully") {
        setisChannel(true);
        window.location.reload();
      }
    } catch (error) {
      // console.log(error.message);
    } finally {
      setisLoading(false);
    }
  };

  //ON VIDEO DROP

  const handleUploadImageClick = () => {
    const fileInput = document.getElementById("videoFileInput");
    fileInput.click();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const fileSizeInMB = file.size / (1024 * 1024);

    if (fileSizeInMB > 30) {
      alert("Please select a video file with a size of up to 30MB.");
      return;
    }

    setSelectedVideo(file);
    setIsVideoSelected(true);
    const fileName = file.name;
    setVideoName(fileName.substring(0, fileName.lastIndexOf(".")));
    uploadVideo(file);
  };

  //VIDEO DETAILS SECTION

  const handleTitleChange = (e) => {
    setVideoName(e.target.value);
  };
  //UPLOAD THUMBNAIL

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];

    if (file && file.type.startsWith("image/")) {
      const img = new Image();
      img.onload = function () {
        const aspectRatio = img.width / img.height;
        if (Math.abs(aspectRatio - 16 / 9) < 0.01) {
          setSelectedThumbnail(file);
          setPreviewThumbnail(URL.createObjectURL(file));
          setIsThumbnailSelected(true);
        } else {
          setIsThumbnailSelected(false);
          setSelectedThumbnail(null);
          setPreviewThumbnail(null);
          alert("Please select a 16:9 aspect ratio image.");
        }
      };
      img.src = URL.createObjectURL(file);
    } else {
      setIsThumbnailSelected(false);
      setSelectedThumbnail(null);
      setPreviewThumbnail(null);
      alert("Please select an image file.");
    }
  };

  const uploadThumbnail = async () => {
    try {
      if (isThumbnailSelected === false) {
        return null;
      }

      const fileReference = ref(storage, `thumbnail/${selectedThumbnail.name}`);
      const uploadData = uploadBytesResumable(fileReference, selectedThumbnail);

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

  //SAVE UPLOAD DATA TO DATABASE

  const PublishData = async () => {
    if (videoName === "" || videoDescription === "" || videoTags === "") {
      VideoErrorNotify();
    } else if (selectedThumbnail === null) {
      ThumbnailNotify();
    } else {
      try {
        setLoading(true);
        // Upload the thumbnail
        const thumbnailURL = await uploadThumbnail();
        const currentDate = new Date().toISOString();
        // Proceed with saving the data
        const data = {
          videoTitle: videoName,
          videoDescription: videoDescription,
          tags: videoTags,
          videoLink: VideoURL,
          thumbnailLink: thumbnailURL,
          email: user?.email,
          video_duration: duration,
          publishDate: currentDate,
          Visibility: visibility,
        };
        // Send the POST request
        const response = await fetch(`${backendURL}/publish`, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Handle the response
        const Data = await response.json();
        if (Data === "Published") {
          setIsPublished(true);
          setLoading(false);
          setIsClicked(false);
          window.location.reload();
        } else {
          setLoading(true);
          setIsClicked(true);
          setTimeout(() => {
            alert("An unknown error occurred, Please try again!");
          }, 1500);
        }
      } catch (error) {
        // console.log(error.message);
      }
    }
  };

  return (
    <>
      <Navbar2 />
      <LeftPanel2 />
      <div className={theme ? "studio" : "studio studio-light"}>
        <div
          className={theme ? "create-btn" : "create-btn create-btn-light"}
          onClick={() => setIsClicked(true)}
          style={isChannel === true ? { display: "flex" } : { display: "none" }}
        >
          <VideoCallOutlinedIcon
            className=""
            fontSize="large"
            style={{ color: "#FF4E45" }}
          />
          <p className={theme ? "" : "text-light-mode"}>CREATE</p>
        </div>
        <div
          style={
            myVideos && myVideos.message === "USER DOESN'T EXIST"
              ? { display: "block" }
              : { display: "none" }
          }
          className={theme ? "create-btn2" : "create-btn2 create-btn-light"}
          onClick={() => setIsClicked(true)}
        >
          CREATE
        </div>
        <div
          style={isChannel === true ? { display: "flex" } : { display: "none" }}
          className={theme ? "create-btn-short" : "create-btn-short light-mode"}
          onClick={() => setIsClicked(true)}
        >
          <LiaUploadSolid
            fontSize="22px"
            color={theme ? "#b1b1b1" : "#606060"}
          />
        </div>
        <div
          className={
            theme
              ? "create-channel"
              : "create-channel light-mode text-light-mode"
          }
          style={
            isChannel === false ? { display: "flex" } : { display: "none" }
          }
        >
          <ClearRoundedIcon
            fontSize="large"
            className={theme ? "close-channel" : "close-channel-light"}
            style={{ color: theme ? "rgb(170 170 170 / 50%)" : "#606060" }}
            onClick={() => {
              window.location.href = "/";
            }}
          />
          <p className="channel-head">Create Your Channel</p>
          <p
            className={
              theme ? "channel-slogan" : "channel-slogan text-light-mode2"
            }
          >
            Share Your Story: Inspire and Connect with a YouTube Channel!
          </p>
          <form onSubmit={saveChannelData} className="channel-deatils">
            <div className="profile-pic-section">
              <img src={previewImage} alt="" className="selected-pic" />
              <div className="upload-btn-wrapper">
                <button className={theme ? "btn" : "btn text-dark-mode"}>
                  SELECT
                </button>
                <input
                  type="file"
                  name="myfile"
                  accept=".jpg, .png"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="channel-name">
              <input
                className={
                  theme
                    ? "channelName"
                    : "channelName light-mode text-light-mode new-light-border"
                }
                type="text"
                name="channelname"
                placeholder="Channel Name"
                maxLength={25}
                onChange={handleChannelname}
                required
              />
              <textarea
                className={
                  theme
                    ? "channelAbout"
                    : "channelAbout light-mode text-light-mode new-light-border"
                }
                type="text"
                name="channelAbout"
                placeholder="About channel"
                onChange={handleChannelabout}
                style={{ width: "93%", resize: "vertical" }}
                required
              />
              <Tooltip
                TransitionComponent={Zoom}
                title="Add links"
                placement="top"
              >
                <div
                  className={
                    theme
                      ? "add-links"
                      : "add-links light-mode new-light-border"
                  }
                  onClick={() => {
                    if (linksClicked === false) {
                      setLinksClicked(true);
                    } else {
                      setLinksClicked(false);
                    }
                  }}
                >
                  <LinkIcon
                    fontSize="medium"
                    style={{ color: theme ? "white" : "black" }}
                  />
                </div>
              </Tooltip>
              <div
                className={
                  theme
                    ? "social-icons-links"
                    : "social-icons-links add-social-light"
                }
                style={
                  linksClicked === true
                    ? { display: "block" }
                    : { display: "none" }
                }
              >
                <FacebookIcon
                  fontSize="large"
                  className={theme ? "social_links" : "social_links-light"}
                  style={{
                    color: theme ? "white" : "#606060",
                    marginRight: "15px",
                  }}
                  onClick={() => {
                    if (iconClicked !== "Facebook") {
                      setIconClicked("Facebook");
                    } else {
                      setIconClicked("");
                    }
                  }}
                />
                <InstagramIcon
                  fontSize="large"
                  className={theme ? "social_links" : "social_links-light"}
                  style={{
                    color: theme ? "white" : "#606060",
                    marginRight: "15px",
                  }}
                  onClick={() => {
                    if (iconClicked !== "Instagram") {
                      setIconClicked("Instagram");
                    } else {
                      setIconClicked("");
                    }
                  }}
                />
                <TwitterIcon
                  fontSize="large"
                  className={theme ? "social_links" : "social_links-light"}
                  style={{
                    color: theme ? "white" : "#606060",
                    marginRight: "15px",
                  }}
                  onClick={() => {
                    if (iconClicked !== "Twitter") {
                      setIconClicked("Twitter");
                    } else {
                      setIconClicked("");
                    }
                  }}
                />
                <LanguageIcon
                  fontSize="large"
                  className={theme ? "social_links" : "social_links-light"}
                  style={{ color: theme ? "white" : "#606060" }}
                  onClick={() => {
                    if (iconClicked !== "Website") {
                      setIconClicked("Website");
                    } else {
                      setIconClicked("");
                    }
                  }}
                />
              </div>
              <div
                className="edit-links"
                style={
                  linksClicked === true
                    ? { display: "block" }
                    : { display: "none" }
                }
              >
                <div
                  className="fb-link"
                  style={
                    iconClicked === "Facebook"
                      ? { display: "flex" }
                      : { display: "none" }
                  }
                >
                  <FacebookIcon
                    fontSize="large"
                    style={{ color: theme ? "white" : "#606060" }}
                    className={
                      theme
                        ? "fb-input-icon"
                        : "fb-input-icon social-lightt new-light-border"
                    }
                  />
                  <input
                    type="text"
                    name="fb-link"
                    className={
                      theme
                        ? "fb-input"
                        : "fb-input light-mode text-light-mode new-light-border"
                    }
                    onChange={handleFacebookLink}
                  />
                </div>
                <div
                  className="insta-link"
                  style={
                    iconClicked === "Instagram"
                      ? { display: "flex" }
                      : { display: "none" }
                  }
                >
                  <InstagramIcon
                    fontSize="large"
                    style={{ color: theme ? "white" : "#606060" }}
                    className={
                      theme
                        ? "insta-input-icon"
                        : "insta-input-icon social-lightt new-light-border"
                    }
                  />
                  <input
                    type="text"
                    name="insta-link"
                    className={
                      theme
                        ? "insta-input"
                        : "insta-input light-mode text-light-mode new-light-border"
                    }
                    onChange={handleInstagramLink}
                  />
                </div>
                <div
                  className="twitter-link"
                  style={
                    iconClicked === "Twitter"
                      ? { display: "flex" }
                      : { display: "none" }
                  }
                >
                  <TwitterIcon
                    fontSize="large"
                    style={{ color: theme ? "white" : "#606060" }}
                    className={
                      theme
                        ? "twitter-input-icon"
                        : "twitter-input-icon social-lightt new-light-border"
                    }
                  />
                  <input
                    type="text"
                    name="twitter-link"
                    className={
                      theme
                        ? "twitter-input"
                        : "twitter-input light-mode text-light-mode new-light-border"
                    }
                    onChange={handleTwitterLink}
                  />
                </div>
                <div
                  className="website-link"
                  style={
                    iconClicked === "Website"
                      ? { display: "flex" }
                      : { display: "none" }
                  }
                >
                  <LanguageIcon
                    fontSize="large"
                    style={{ color: theme ? "white" : "#606060" }}
                    className={
                      theme
                        ? "website-input-icon"
                        : "website-input-icon social-lightt new-light-border"
                    }
                  />
                  <input
                    type="text"
                    name="website-link"
                    className={
                      theme
                        ? "website-input"
                        : "website-input light-mode text-light-mode new-light-border"
                    }
                    onChange={handleWebsiteLink}
                  />
                </div>
              </div>
            </div>
            {isLoading === false ? (
              <button
                className={
                  isLoading
                    ? `save-data-disable ${theme ? "" : "text-dark-mode"}`
                    : `save-data ${theme ? "" : "text-dark-mode"}`
                }
                type="submit"
                style={
                  linksClicked === true
                    ? { marginTop: 0 }
                    : { marginTop: "22px" }
                }
                disabled={isLoading ? true : false}
              >
                SAVE
              </button>
            ) : (
              <button
                className={isLoading ? "save-data-disable" : "save-data"}
                type="submit"
                style={
                  linksClicked === true
                    ? { marginTop: 0 }
                    : { marginTop: "22px" }
                }
                disabled={isLoading ? true : false}
              >
                <span className="loader4"></span>
              </button>
            )}
          </form>
        </div>
        <div
          className={
            theme
              ? "upload-content"
              : "upload-content light-mode text-light-mode"
          }
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          style={
            isChannel === true && isClicked === true
              ? { display: "flex" }
              : { display: "none" }
          }
        >
          <div className="top-head">
            {videoName.length <= 70
              ? videoName
              : `${videoName.slice(0, 40)}...`}{" "}
            <CloseRoundedIcon
              className="close"
              fontSize="large"
              style={{ color: "gray" }}
              onClick={() => {
                if (Progress !== 100 && selectedVideo !== null) {
                  cancelVideoUpload();
                  CancelNotify();
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                } else if (Progress === 100 && isPublished === false) {
                  CancelNotify();
                  setTimeout(() => {
                    window.location.reload();
                  }, 1000);
                }
                if (isClicked === true) {
                  ClearState();
                }
              }}
            />
          </div>
          <hr
            className={
              theme ? "seperate seperate2" : "seperate seperate2 seperate-light"
            }
          />
          <div
            className="middle-data"
            style={
              isVideoSelected === false
                ? { display: "flex" }
                : { display: "none" }
            }
          >
            <img
              src={Upload}
              className={theme ? "upload-img" : "upload-img upload-img-light"}
              onClick={handleUploadImageClick}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            />
            <p>Drag and drop video files to upload</p>
            <p>Your videos will be private until you publish them.</p>
            <div className="upload-btn-wrapper">
              <button className={theme ? "btn" : "btn text-dark-mode"}>
                SELECT FILES
              </button>
              <input
                id="videoFileInput"
                type="file"
                name="videoFile"
                accept="video/mp4"
                onChange={handleVideoChange}
              />
            </div>
          </div>
          <div
            className="uploading-video-data"
            style={
              isVideoSelected === true
                ? { display: "flex" }
                : { display: "none" }
            }
          >
            <div className="left-video-section">
              <form className="details-form">
                <div className="details-section">
                  <p>Details</p>
                  <input
                    type="text"
                    className={theme ? "video-title" : "video-title light-mode"}
                    value={videoName}
                    placeholder="Title (required)"
                    required
                    onChange={handleTitleChange}
                  />
                  <textarea
                    type="text"
                    className={
                      theme
                        ? "video-description"
                        : "video-description light-mode"
                    }
                    placeholder="Description"
                    onChange={(e) => setVideoDescription(e.target.value)}
                    spellCheck="true"
                  />
                  <input
                    type="text"
                    className={theme ? "video-tags" : "video-tags light-mode"}
                    placeholder="Tags"
                    onChange={(e) => setVideoTags(e.target.value)}
                  />
                </div>
              </form>
              <div
                className="thumbnail-section"
                style={
                  isThumbnailSelected === false
                    ? { display: "flex" }
                    : { display: "none" }
                }
              >
                <p>Thumbnail</p>
                <p>
                  Select or upload a picture that shows what&apos;s in your
                  video. A good thumbnail stands out and draws viewer&apos;s
                  attention.
                </p>
                <label htmlFor="thumbnail-input" className="upload-thumbnail">
                  <AddPhotoAlternateOutlinedIcon
                    fontSize="medium"
                    style={{ color: "#808080" }}
                  />
                  <p>Upload thumbnail</p>
                </label>
                <input
                  id="thumbnail-input"
                  type="file"
                  accept=".jpg, .png"
                  style={{ display: "none" }}
                  onChange={handleThumbnailChange}
                />
              </div>
              <div
                className="thumbnail-section thumb2"
                style={
                  isThumbnailSelected === true
                    ? { display: "flex" }
                    : { display: "none" }
                }
              >
                <p>Thumbnail</p>
                <p>
                  Select or upload a picture that shows what&apos;s in your
                  video. A good thumbnail stands out and draws viewer&apos;s
                  attention.
                </p>
                <div className="thumb2-img">
                  <CloseRoundedIcon
                    className="close close2"
                    fontSize="medium"
                    style={{ color: theme ? "gray" : "white" }}
                    onClick={() => {
                      setIsThumbnailSelected(false);
                    }}
                  />
                  <img
                    className="prevThumbnail"
                    src={previewThumbnail}
                    alt=""
                  />
                </div>
              </div>
              <div className="video-tag-section"></div>
            </div>
            <div className="right-video-section">
              <div
                className={
                  theme ? "preview-video" : "preview-video preview-light"
                }
              >
                <div
                  className="preview-img"
                  style={
                    Progress === 100 && VideoURL !== ""
                      ? { display: "none" }
                      : { display: "block" }
                  }
                >
                  <p className={theme ? "" : "text-light-mode"}>
                    Uploading video...
                  </p>
                </div>
                {Progress === 100 && VideoURL !== "" ? (
                  <iframe
                    width="284.44"
                    height="160"
                    src={VideoURL}
                    title="YouTube video player"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                ) : null}
              </div>

              <div
                className={
                  theme ? "preview-bottom" : "preview-bottom preview-light2"
                }
              >
                <div className="file-details">
                  <p>Filename</p>
                  <p>{videoName}</p>
                </div>
              </div>

              <div className="video-visibility">
                <p>Visibility</p>
                <div
                  className={
                    theme
                      ? "selected-visibility"
                      : "selected-visibility text-light-mode"
                  }
                  onClick={() => {
                    if (isVisibilityClicked === false) {
                      setisVisibilityClicked(true);
                    } else {
                      setisVisibilityClicked(false);
                    }
                  }}
                >
                  <p>{visibility}</p>
                  <ArrowDropDownRoundedIcon
                    fontSize="large"
                    style={{ color: theme ? "white" : "black" }}
                  />
                </div>
                {isVisibilityClicked === true ? (
                  <div
                    className={
                      theme ? "show-visibility" : "show-visibility studio-light"
                    }
                  >
                    <p
                      className="public"
                      style={
                        visibility === "Public"
                          ? { backgroundColor: "rgba(255, 255, 255, 0.134)" }
                          : { backgroundColor: "rgba(255, 255, 255, 0)" }
                      }
                      onClick={() => {
                        setVisibility("Public");
                        setisVisibilityClicked(false);
                      }}
                    >
                      Public
                    </p>
                    <hr className="seperatee" />
                    <p
                      className="private"
                      style={
                        visibility === "Private"
                          ? { backgroundColor: "rgba(255, 255, 255, 0.134)" }
                          : { backgroundColor: "rgba(255, 255, 255, 0)" }
                      }
                      onClick={() => {
                        setVisibility("Private");
                        setisVisibilityClicked(false);
                      }}
                    >
                      Private
                    </p>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div
            className="last-segment"
            style={
              isVideoSelected === true
                ? { display: "block" }
                : { display: "none" }
            }
          >
            <hr
              className={
                theme
                  ? "seperate seperate2"
                  : "seperate seperate2 seperate-light"
              }
            />
            <div className="last-btn">
              <div className="left-icons">
                <CloudUploadIcon
                  className="left-ic"
                  fontSize="large"
                  style={
                    Progress === 100
                      ? { display: "none" }
                      : { color: "gray", marginRight: "6px" }
                  }
                />
                <SdIcon
                  className="left-ic"
                  fontSize="large"
                  style={
                    Progress >= 60
                      ? { display: "none" }
                      : { color: "gray", marginLeft: "6px" }
                  }
                />
                <CloudDoneRoundedIcon
                  className="left-ic"
                  fontSize="large"
                  style={
                    Progress === 100
                      ? {
                          display: "block",
                          color: "#3ea6ff",
                          marginRight: "6px",
                          animation: "none",
                        }
                      : { display: "none" }
                  }
                />
                <HdIcon
                  className="left-ic"
                  fontSize="large"
                  style={
                    Progress >= 60
                      ? {
                          display: "block",
                          color: "#3ea6ff",
                          marginLeft: "6px",
                          animation: "none",
                        }
                      : { display: "none" }
                  }
                />
                <p
                  style={
                    Progress === 100
                      ? { display: "none" }
                      : { marginLeft: "12px" }
                  }
                >
                  Uploading {Progress}% ...
                </p>
                <p
                  style={
                    Progress === 100
                      ? { marginLeft: "12px" }
                      : { display: "none" }
                  }
                >
                  Video uploaded
                </p>
              </div>
              {loading ? (
                <button
                  className={
                    loading || Progress !== 100
                      ? "save-video-data-disable"
                      : "save-video-data"
                  }
                  onClick={PublishData}
                  disabled={loading === true || Progress !== 100 ? true : false}
                >
                  <span className="loader3"></span>
                </button>
              ) : (
                <button
                  className={
                    loading || Progress !== 100
                      ? `save-video-data-disable ${
                          theme ? "" : "text-dark-mode"
                        }`
                      : `save-video-data ${theme ? "" : "text-dark-mode"}`
                  }
                  onClick={PublishData}
                  disabled={loading === true || Progress !== 100 ? true : false}
                >
                  PUBLISH
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {isChannel === true ? <Dashboard /> : ""}
    </>
  );
}

export default Studio;
