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

function Studio() {
  const [email, setEmail] = useState("");
  const [isChannel, setisChannel] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [previewImage, setPreviewImage] = useState(avatar);
  const [ChannelName, setChannelName] = useState();
  const [isLoading, setisLoading] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVideoSelected, setIsVideoSelected] = useState(false);
  const [videoName, setVideoName] = useState("Upload videos");
  const [VideoURL, setVideoURL] = useState("");

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
      alert(error.message);
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
      setVideoName(file.name);
      uploadVideo(file);
    }
  };

  const uploadVideo = async (videoFile) => {
    try {
      const fileReference = ref(storage, `videos/${videoFile.name}`);
      const uploadTask = uploadBytesResumable(fileReference, videoFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Handle upload progress if needed
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload progress: ${progress}%`);
        },
        (error) => {
          // Handle error during upload
          console.log(error);
        },
        () => {
          // Handle successful upload
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("Video download URL:", downloadURL);
            setVideoURL(downloadURL);
            // Do something with the download URL, e.g., save it to database
          });
        }
      );
    } catch (error) {
      console.log(error);
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
    setVideoName(file.name);
    uploadVideo(file);
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
                if (isClicked === true) {
                  setIsClicked(false);
                }
              }}
            />
          </div>
          <hr className="seperate seperate2" />
          {/* <div
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
          </div> */}
          <div
            className="uploading-video-data"
            style={
              isVideoSelected === true
                ? { display: "flex" }
                : { display: "none" }
            }
          >
            <div className="left-video-section">
              <div className="details-section"></div>
              <div className="thumbnail-section"></div>
            </div>
            <div className="right-video-section"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Studio;
