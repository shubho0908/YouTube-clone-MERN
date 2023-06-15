import { useEffect, useState } from "react";
import "../Css/leftpanel2.css";
import jwtDecode from "jwt-decode";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ExitToAppOutlinedIcon from "@mui/icons-material/ExitToAppOutlined";

function LeftPanel2() {
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("userToken");
  const [profileIMG, setProfileIMG] = useState();
  const [channel, setChannel] = useState("");

  useEffect(() => {
    setEmail(jwtDecode(token).email);
  }, [token]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getchannel/${email}`
        );
        const { profile, ChannelName } = await response.json();
        setProfileIMG(profile);
        setChannel(ChannelName);
      } catch (error) {
        alert(error.message);
      }
    };

    if (email) {
      getData();
    }
  }, [email]);

  return (
    <>
      <div className="main-section2">
        <div className="first-panel">
          <img src={profileIMG} alt="" className="profile_img" />
          <div className="about-channel">
            <p className="your-channel">Your Channel</p>
            <p className="c-name">{channel}</p>
          </div>
        </div>
        <div className="second-panel">
          <div className="dashboard panel">
            <DashboardIcon
              className="studio-icon"
              fontSize="medium"
              style={{ color: "#A9A9A9" }}
            />
            <p>Dashboard</p>
          </div>
          <div className="content panel">
            <VideoLibraryOutlinedIcon
              className="studio-icon"
              fontSize="medium"
              style={{ color: "#A9A9A9" }}
            />
            <p>Content</p>
          </div>
          <div className="comments panel">
            <ChatOutlinedIcon
              className="studio-icon"
              fontSize="medium"
              style={{ color: "#A9A9A9" }}
            />
            <p>Comments</p>
          </div>
        </div>
        <div className="third-panel">
          <div className="out panel">
            <ExitToAppOutlinedIcon
              className="studio-icon"
              fontSize="medium"
              style={{ color: "#A9A9A9" }}
            />
            <p>Sign out</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LeftPanel2;
