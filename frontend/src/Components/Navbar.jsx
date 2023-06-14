//MUI Icons
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

import "../Css/navbar.css";
import Logo from "../img/logo1.png";

function Navbar() {
  return (
    <>
      <div className="navbar">
        <div className="left-bar">
          <MenuRoundedIcon fontSize="large" style={{ color: "white" }} />
          <img src={Logo} alt="logo" className="youtubeLogo" />
        </div>
        <div className="middle-bar">
          <div className="search">
            <KeyboardVoiceOutlinedIcon
              fontSize="medium"
              style={{ color: "gray" }}
            />
            <input type="text" placeholder="Type to search" id="searchType" />
          </div>
        </div>
        <div className="right-bar">
          <VideoCallOutlinedIcon
            className="icon-btns"
            fontSize="large"
            style={{ color: "rgb(160, 160, 160)" }}
          />
          <NotificationsNoneOutlinedIcon
            className="icon-btns"
            fontSize="large"
            style={{ color: "rgb(160, 160, 160)" }}
          />
          <button className="signin">
            <AccountCircleOutlinedIcon
              fontSize="medium"
              style={{ color: "rgb(0, 162, 255)" }}
            />
            <p>Signin</p>
          </button>
        </div>
      </div>
    </>
  );
}

export default Navbar;
