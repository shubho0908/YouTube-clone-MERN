import { useEffect, useState } from "react";
import "../Css/leftpanel2.css";
import jwtDecode from "jwt-decode";
import DashboardIcon from "@mui/icons-material/Dashboard";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import AutoFixHighOutlinedIcon from "@mui/icons-material/AutoFixHighOutlined";
import { useNavigate, useLocation } from "react-router-dom";

function LeftPanel2() {
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("userToken");
  const [profileIMG, setProfileIMG] = useState();
  const [channel, setChannel] = useState("");
  const [menuClicked, setMenuClicked] = useState(false);
  const StudioSection = localStorage.getItem("Studio-Section");
  const location = useLocation();

  const navigate = useNavigate();

  useEffect(() => {
    const currentUrl = location.pathname;
    let selected = "";

    if (currentUrl === "/studio") {
      selected = "Dashboard";
    } else if (currentUrl === "/studio/customize") {
      selected = "Customization";
    }
    // } else if (currentUrl === "/watchlater") {
    //   selected = "watch-later";
    // } else if (currentUrl === "/subscriptions") {
    //   selected = "subscription";
    // } else if (currentUrl === "/likedVideos") {
    //   selected = "liked-video";
    // } else {
    //   selected = "other";
    // }

    localStorage.setItem("Studio-Section", selected);
  }, [location]);

  useEffect(() => {
    const handleMenuButtonClick = () => {
      setMenuClicked((prevMenuClicked) => !prevMenuClicked);
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
        console.log(error.message);
      }
    };

    const interval = setInterval(getData, 100);

    return () => {
      clearInterval(interval);
    };
  }, [email]);

  return (
    <>
      <div
        className="main-section2"
        style={menuClicked === true ? { display: "none" } : { display: "flex" }}
      >
        <div className="first-panel">
          <img src={profileIMG} alt="" className="profile_img" />
          <div className="about-channel">
            <p className="your-channel">Your Channel</p>
            <p className="c-name">{channel}</p>
          </div>
        </div>
        <div className="second-panel">
          <div
            className={
              StudioSection === "Dashboard"
                ? "studio-active panel"
                : "dashboard panel"
            }
            onClick={() => {
              localStorage.setItem("Studio-Section", "Dashboard");
              navigate("/studio");
              window.location.reload();
            }}
          >
            <DashboardIcon
              className={StudioSection === "Dashboard" ? "studio-icon2" : "studio-icon"}
              fontSize="medium"
              style={{ color: "#A9A9A9", paddingLeft: "25px !important" }}
            />
            <p>Dashboard</p>
          </div>
          <div
            className="content panel"
            onClick={() => {
              localStorage.setItem("Studio-Section", "Content");
            }}
          >
            <VideoLibraryOutlinedIcon
              className="studio-icon"
              fontSize="medium"
              style={{ color: "#A9A9A9" }}
            />
            <p>Content</p>
          </div>
          <div
            className="comments panel"
            onClick={() => {
              localStorage.setItem("Studio-Section", "Comments");
            }}
          >
            <ChatOutlinedIcon
              className="studio-icon"
              fontSize="medium"
              style={{ color: "#A9A9A9" }}
            />
            <p>Comments</p>
          </div>
          <div
            className={StudioSection === "Customization" ? "studio-active panel" : "customization panel"}
            onClick={() => {
              localStorage.setItem("Studio-Section", "Customization");
              navigate("/studio/customize");
              window.location.reload();
            }}
          >
            <AutoFixHighOutlinedIcon
              className={StudioSection === "Customization" ? "studio-icon2" : "studio-icon"}
              fontSize="medium"
              style={{ color: "#A9A9A9" }}
            />
            <p>Customization</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LeftPanel2;
