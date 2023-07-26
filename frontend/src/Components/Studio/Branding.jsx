import jwtDecode from "jwt-decode";
import { useState, useEffect } from "react";
import defaultimg from "../../img/avatar.png";

function Branding() {
  const [email, setEmail] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(defaultimg);
  const [selectedBanner, setSelectedBanner] = useState();
  const ChannelProfile = localStorage.getItem("ChannelProfile");
  const ChannelCover = localStorage.getItem("ChannelCover");

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setEmail(jwtDecode(token).email);
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        if (email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getchannel/${email}`
          );
          const { profile } = await response.json();
          setSelectedProfile(profile);
          localStorage.setItem("ChannelProfile", profile);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };
    getData();
  }, [email]);

  const handleProfileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedProfile(reader.result);
        localStorage.setItem("ChannelProfile", reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const width = img.width;
          const height = img.height;
          const aspectRatio = width / height;
          if (Math.abs(aspectRatio - 16 / 9) < 0.01) {
            setSelectedBanner(reader.result);
            localStorage.setItem("ChannelCover", reader.result);
          } else {
            alert("Invalid image aspect ratio. Please select a 16:9 image.");
          }
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="channel-branding-section">
        <div className="profile-update-section">
          <p className="profile-head-txt">Picture</p>
          <p className="profile-desc-txt">
            Your profile picture will appear where your channel is presented on
            YouTube, like next to your videos and comments.
          </p>
          <div className="picture-section">
            <div className="pic-div">
              <img
                src={!ChannelProfile ? selectedProfile : ChannelProfile}
                alt="profile"
                className="channel-image"
              />
            </div>
            <div className="pic-extra-content">
              It’s recommended to use a picture that’s at least 98 x 98 pixels
              and 4MB or less. Use a PNG or GIF (no animations) file. Make sure
              your picture follows the YouTube Community Guidelines.
              <label className="change-image" htmlFor="profile-image-input">
                CHANGE
              </label>
              <input
                type="file"
                id="profile-image-input"
                accept="image/*"
                onChange={handleProfileChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
        <div className="cover-update-section">
          <p className="cover-head">Banner image</p>
          <p className="banner-desc">
            This image will appear across the top of your channel
          </p>
          <div className="banner-section">
            <div className="pic-div">
              {ChannelCover ? (
                <img src={ChannelCover} alt="banner" className="banner-image" />
              ) : (
                ""
              )}
            </div>
            <div className="pic-extra-content">
              For the best results on all devices, use an image that’s at least
              2048 x 1152 pixels and 6MB or less.
              <label className="change-image" htmlFor="banner-image-input">
                CHANGE
              </label>
              <input
                type="file"
                id="banner-image-input"
                accept="image/*"
                onChange={handleBannerChange}
                style={{ display: "none" }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Branding;
