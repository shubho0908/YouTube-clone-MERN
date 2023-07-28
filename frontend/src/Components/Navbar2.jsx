//MUI Icons
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

import "../Css/navbar.css";
import StudioLogo from "../img/studio.png";
import { useEffect, useState } from "react";
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
        console.log(error.message);
      }
    };

    const interval = setInterval(getData, 200);

    return () => clearInterval(interval);
  }, [email]);

  return (
    <>
      <div className="navbar2">
        <div className="left-bar">
          <MenuRoundedIcon
            className="menu2"
            fontSize="large"
            style={{ color: "white" }}
          />
          <img
            src={StudioLogo}
            alt="logo"
            className="youtubeLogo"
            onClick={() => {
              navigate("/");
              window.location.reload();
            }}
          />
        </div>
        <div className="middle-bar">
          <div className="search2">
            <SearchRoundedIcon
              className="search-icon2"
              fontSize="medium"
              style={{ color: "rgb(160, 160, 160)" }}
            />
            <input type="text" placeholder="Search across your channel" id="searchType2" />
          </div>
        </div>
        <div className="right-bar2">
          <img
            src={profilePic && profilePic}
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
