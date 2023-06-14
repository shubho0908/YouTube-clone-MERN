//MUI Icons
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

import "../Css/navbar.css";
import Logo from "../img/logo1.png";
import { useState } from "react";

function Navbar() {
  const [isbtnClicked, setisbtnClicked] = useState(false);

  return (
    <>
      <div className="navbar">
        <div className="left-bar">
          <MenuRoundedIcon fontSize="large" style={{ color: "white" }} />
          <img src={Logo} alt="logo" className="youtubeLogo" />
        </div>
        <div className="middle-bar">
          <div className="search">
            <input type="text" placeholder="Type to search" id="searchType" />
            <SearchRoundedIcon
              className="search-icon"
              fontSize="large"
              style={{ color: "rgb(160, 160, 160)" }}
            />
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
          <button
            onClick={() => {
              if (isbtnClicked === false) {
                setisbtnClicked(true);
              } else {
                setisbtnClicked(false);
              }
              console.log(isbtnClicked);
            }}
            className="signin"
          >
            <AccountCircleOutlinedIcon
              fontSize="medium"
              style={{ color: "rgb(0, 162, 255)" }}
            />
            <p>Signin</p>
          </button>
        </div>
      </div>
      <div
        className="auth-popup"
        style={
          isbtnClicked === true ? { display: "block" } : { display: "none" }
        }
      >
        <p>Name</p>
        <input type="text" />
        <p>Name</p>
        <input type="text" />
        <p>Name</p>
        <input type="text" />
      </div>
    </>
  );
}

export default Navbar;
