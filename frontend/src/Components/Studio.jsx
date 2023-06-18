import { useEffect, useState } from "react";
import Navbar2 from "./Navbar2";
import LeftPanel2 from "./LeftPanel2";
import jwtDecode from "jwt-decode";
import avatar from "../img/avatar.png";
import "../Css/studio.css";
import { storage } from "../Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Upload from "../img/upload.png";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SdIcon from "@mui/icons-material/Sd";
import HdIcon from "@mui/icons-material/Hd";
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";

function Studio() {
  const [email, setEmail] = useState("");
  const [isChannel, setisChannel] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [previewImage, setPreviewImage] = useState(avatar);
  const [previewThumbnail, setPreviewThumbnail] = useState(null);
  const [ChannelName, setChannelName] = useState();
  const [isLoading, setisLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVideoSelected, setIsVideoSelected] = useState(false);
  const [isThumbnailSelected, setIsThumbnailSelected] = useState(false);
  const [videoName, setVideoName] = useState("Upload videos");
  const [VideoURL, setVideoURL] = useState("");
  const [Progress, setProgress] = useState(0);
  const [uploadTask, setUploadTask] = useState(null);
  const [videoLink, setVideoLink] = useState("https://www.youtube.com");

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setEmail(jwtDecode(token).email);
  }, []);

  useEffect(() => {
    if (email) {
      ChannelAvailable();
    }
  });

  useEffect(() => {
    const createBtn = document.querySelector(".create-btn");

    const handleClick = () => {
      setIsClicked(true);
    };

    if (createBtn) {
      createBtn.addEventListener("click", handleClick);
    }

    return () => {
      if (createBtn) {
        createBtn.removeEventListener("click", handleClick);
      }
    };
  }, []);

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
    console.log(isClicked);
  }, [isClicked]);

  //GET CHANNEL'S DATA

  const ChannelAvailable = async () => {
    try {
      const response = await fetch(`http://localhost:3000/getchannel/${email}`);
      const { channel } = await response.json();
      setisChannel(channel);
    } catch (error) {
      console.log(error.message);
    }
  };

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
    setSelectedVideo(file);
    setIsVideoSelected(true);

    if (file) {
      const fileName = file.name;
      setVideoName(fileName.substring(0, fileName.lastIndexOf(".")));
      uploadVideo(file);
    }
  };

  const uploadVideo = (videoFile) => {
    try {
      const fileReference = ref(storage, `videos/${videoFile.name}`);
      const uploadTask = uploadBytesResumable(fileReference, videoFile);
      setUploadTask(uploadTask); // Store the upload task

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
            console.log("Video download URL:", downloadURL);
            setVideoURL(downloadURL);
            // Do something with the download URL, e.g., save it to the database
          } catch (error) {
            console.log(error);
          }
        }
      );
    } catch (error) {
      console.log(error);
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

    try {
      setisLoading(true);
      const downloadURL = await uploadPic(); // Wait for the image upload to complete
      if (!downloadURL) {
        setisLoading(false);
        return; // Handle the case when no image is selected
      }

      const data = {
        profileURL: downloadURL,
        ChannelName,
        email,
      };

      // Proceed with saving the channel data
      const response = await fetch("http://localhost:3000/savechannel", {
        method: "POST",
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
      console.log(error.message);
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

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(videoLink)
      .then(() => {
        alert("Link Copied!");
      })
      .catch((error) => {
        console.log("Error copying link to clipboard:", error);
      });
  };

  //UPLOAD THUMBNAIL

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];

    // Check if the file is an image and has a 16:9 aspect ratio
    if (file && file.type.startsWith("image/")) {
      const img = new Image();
      img.onload = function () {
        const aspectRatio = img.width / img.height;
        if (Math.abs(aspectRatio - 16 / 9) < 0.01) {
          setIsThumbnailSelected(true);
          setSelectedThumbnail(file);
          setPreviewThumbnail(URL.createObjectURL(file));
        } else {
          // Reset the selection if the aspect ratio is not 16:9
          setIsThumbnailSelected(false);
          setSelectedThumbnail(null);
          setPreviewThumbnail(null);
          alert("Please select a 16:9 aspect ratio image.");
        }
      };
      img.src = URL.createObjectURL(file);
    } else {
      // Reset the selection if the file is not an image
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

  return (
    <>
      <Navbar2 />
      <LeftPanel2 />
      <div className="studio">
        <div
          className="create-channel"
          style={
            isChannel === false ? { display: "flex" } : { display: "none" }
          }
        >
          <p className="channel-head">Create Your Channel</p>
          <p className="channel-slogan">
            Share Your Story: Inspire and Connect with a YouTube Channel!
          </p>
          <form onSubmit={saveChannelData} className="channel-deatils">
            <div className="profile-pic-section">
              <img src={previewImage} alt="" className="selected-pic" />
              <div className="upload-btn-wrapper">
                <button className="btn">SELECT</button>
                <input
                  type="file"
                  name="myfile"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>
            <div className="channel-name">
              <input
                className="channelName"
                type="text"
                name="channelname"
                placeholder="Channel Name"
                onChange={handleChannelname}
              />
            </div>
            <button
              className="save-data"
              type="submit"
              disabled={isLoading ? true : false}
            >
              {isLoading ? "LOADING..." : "SAVE"}
            </button>
          </form>
        </div>
        <div
          className="upload-content"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          style={
            isChannel === true && isClicked === true
              ? { display: "flex" }
              : { display: "none" }
          }
        >
          <div className="top-head">
            <p>{videoName}</p>
            <CloseRoundedIcon
              className="close"
              fontSize="large"
              style={{ color: "gray" }}
              onClick={() => {
                if (Progress !== 100) {
                  cancelVideoUpload();
                }
                if (isClicked === true) {
                  setIsClicked(false);
                  window.location.reload();
                }
              }}
            />
          </div>
          <hr className="seperate seperate2" />
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
              className="upload-img"
              onClick={handleUploadImageClick}
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
            />
            <p>Drag and drop video files to upload</p>
            <p>Your videos will be private until you publish them.</p>
            <div className="upload-btn-wrapper">
              <button className="btn">SELECT FILES</button>
              <input
                id="videoFileInput"
                type="file"
                name="videoFile"
                accept="video/*"
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
                    className="video-title"
                    value={videoName}
                    placeholder="Title (required)"
                    required
                    onChange={handleTitleChange}
                  />
                  <input
                    type="text"
                    className="video-description"
                    placeholder="Description"
                  />
                  <input
                    type="text"
                    className="video-tags"
                    placeholder="Tags"
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
                  accept="image/*"
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
                    style={{ color: "gray" }}
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
              <div className="preview-video">
                <div
                  className="preview-img"
                  style={
                    Progress === 100 && VideoURL !== ""
                      ? { display: "none" }
                      : { display: "block" }
                  }
                >
                  <p>Uploading video...</p>
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

              <div className="preview-bottom">
                <div className="link-details">
                  <div className="vid-link">
                    <p>Video link</p>
                    <a href="https://www.youtube.com/">
                      https://www.youtube.com
                    </a>
                  </div>
                  <ContentCopyOutlinedIcon
                    className="copy-btn"
                    fontSize="medium"
                    style={{ color: "gray" }}
                    onClick={handleCopyLink}
                  />
                </div>
                <div className="file-details">
                  <p>Filename</p>
                  <p>{videoName}</p>
                </div>
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
            <hr className="seperate seperate2" />
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
              <button className="save-video-data">PUBLISH</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Studio;
