//MUI Icons
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";

import "../Css/navbar.css";
import StudioLogo from "../img/studio.png";
import { useEffect, useState } from "react";
import avatar from "../img/avatar.png";
import { useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";

function Navbar2() {
  const token = localStorage.getItem("userToken");
  const [email, setEmail] = useState();
  const [profilePic, setProfilePic] = useState();

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
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
          <div className="create-btn">
            <VideoCallOutlinedIcon
              className=""
              fontSize="large"
              style={{ color: "#FF4E45" }}
            />
            <p>CREATE</p>
          </div>

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
