import jwtDecode from "jwt-decode";
import { useState, useEffect } from "react";

function Branding() {
  const [email, setEmail] = useState("");
  const [profile, setProfileIMG] = useState();
  const [channel, setChannel] = useState();

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
          const { profile, ChannelName } = await response.json();
          setProfileIMG(profile);
          setChannel(ChannelName);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    const interval = setInterval(getData, 100);

    return () => {
      clearInterval(interval);
    };
  }, [email]);

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
              <img src={profile} alt="profile" className="channel-image" />
            </div>
            <div className="pic-extra-content">
              It’s recommended to use a picture that’s at least 98 x 98 pixels
              and 4MB or less. Use a PNG or GIF (no animations) file. Make sure
              your picture follows the YouTube Community Guidelines.
            <button className="change-image">CHANGE</button>
            </div>
          </div>
        </div>
        <div className="cover-update-section"></div>
      </div>
    </>
  );
}

export default Branding;
