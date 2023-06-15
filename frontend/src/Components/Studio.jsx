import { useEffect, useState } from "react";
import Navbar2 from "./Navbar2";
import LeftPanel2 from "./LeftPanel2";
import jwtDecode from "jwt-decode";
import avatar from "../img/avatar.png";
import "../Css/studio.css";
import { storage } from "../Firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function Studio() {
  const [email, setEmail] = useState("");
  const [isChannel, setisChannel] = useState();
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(avatar);
  const [ChannelName, setChannelName] = useState();
  const [isLoading, setisLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setEmail(jwtDecode(token).email);
  }, []);

  useEffect(() => {
    if (email) {
      ChannelAvailable();
    }
  });

  const ChannelAvailable = async () => {
    try {
      const response = await fetch(`http://localhost:3000/getchannel/${email}`);
      const { channel } = await response.json();
      setisChannel(channel);
    } catch (error) {
      alert(error.message);
    }
  };

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
        alert(message);
        setisChannel(true);
      }
    } catch (error) {
      alert(error.message);
    } finally{
      setisLoading(false)
    }
  };

  return (
    <>
      <Navbar2 />
      <LeftPanel2/>
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
            <button className="save-data" type="submit">
            {isLoading ? "Loading..." : "SAVE"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Studio;
