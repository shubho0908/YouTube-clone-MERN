//MUI Icons
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

import "../Css/navbar.css";
import StudioLogo from "../img/studio.png";
import { useEffect, useState } from "react";
import avatar from "../img/avatar.png";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

function Navbar2() {
  const [isbtnClicked, setisbtnClicked] = useState(false);
  const token = localStorage.getItem("userToken");
  const [email, setEmail] = useState();
  const [profilePic, setProfilePic] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setisbtnClicked(false);
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getchannel/${email}`
        );
        const { profile } = await response.json();
        setProfilePic(profile);
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
      <div className="navbar">
        <div className="left-bar">
          <MenuRoundedIcon fontSize="large" style={{ color: "white" }} />
          <img
            src={StudioLogo}
            alt="logo"
            className="youtubeLogo"
            onClick={() => {
              navigate("/");
            }}
          />
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
        <div
          className="right-bar"
          style={
            token
              ? { justifyContent: "space-evenly", paddingRight: "0px" }
              : { justifyContent: "space-between", paddingRight: "25px" }
          }
        >
          <VideoCallOutlinedIcon
            className="icon-btns"
            fontSize="large"
            style={{ color: "rgb(160, 160, 160)" }}
            onClick={() => {
              navigate("/studio");
            }}
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
                document.body.classList.add("bg-css");
              } else {
                setisbtnClicked(false);
                document.body.classList.remove("bg-css");
              }
            }}
            className="signin"
            style={token ? { display: "none" } : { display: "flex" }}
          >
            <AccountCircleOutlinedIcon
              fontSize="medium"
              style={{ color: "rgb(0, 162, 255)" }}
            />
            <p>Signin</p>
          </button>
          <img
            src={profilePic ? profilePic : avatar}
            alt=""
            className="profile-pic"
            style={token ? { display: "block" } : { display: "none" }}
          />
        </div>
      </div>
      
    </>
  );
}

export default Navbar2;
