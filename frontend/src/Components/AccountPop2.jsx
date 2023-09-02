import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import "../Css/accountPop.css";
import avatar from "../img/avatar.png";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import YouTubeIcon from "@mui/icons-material/YouTube";

function AccountPop() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("");
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const [ChannelID, setChannelID] = useState();
  const [isBtnClicked, setIsBtnClicked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setName(decodedToken.name || "");
        setEmail(decodedToken.email || "");
      } catch (error) {
        console.log("Error decoding token:", error.message);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("Dark", JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    const getUserData = async () => {
      try {
        if (email) {
          const response = await fetch(
            `http://localhost:3000/getuserimage/${email}`
          );
          const { channelIMG } = await response.json();
          setProfile(channelIMG);
        }
      } catch (error) {
        console.log("Error fetching user data:", error.message);
      }
    };

    getUserData();
  }, [email]);

  useEffect(() => {
    const getChannelID = async () => {
      try {
        if (email) {
          const response = await fetch(
            `http://localhost:3000/getchannelid/${email}`
          );
          const { channelID } = await response.json();
          setChannelID(channelID);
        }
      } catch (error) {
        console.log("Error fetching user data:", error.message);
      }
    };

    getChannelID();
  }, [email]);

  return (
    <>
      <div
        className="account-pop2"
        style={
          isBtnClicked === false ? { display: "block" } : { display: "none" }
        }
      >
        <div className="user-section">
          <div className="left-part">
            <img
              src={profile ? profile : avatar}
              alt="channelIMG"
              className="channelIMG"
            />
          </div>
          <div className="right-part">
            <p>{name}</p>
            <Tooltip
              TransitionComponent={Zoom}
              title={email}
              placement="bottom"
            >
              <p>
                {email.slice(0, 12)}
                {email.length > 12 ? "..." : ""}
              </p>
            </Tooltip>
          </div>
        </div>
        <hr className="seperate" />
        <div className="about-channel-section">
          <div
            className="yourchannel c-sec"
            onClick={() => {
              window.location.href = `/channel/${ChannelID}`;
            }}
          >
            <AccountBoxOutlinedIcon
              fontSize="medium"
              style={{ color: "#909090" }}
            />
            <p>Your channel</p>
          </div>
          <div
            className="yourstudio c-sec"
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <YouTubeIcon fontSize="medium" style={{ color: "#909090" }} />
            <p>YouTube</p>
          </div>
          <div
            className="apperance c-sec"
            onClick={() => {
              if (isBtnClicked === false) {
                setIsBtnClicked(true);
              } else {
                setIsBtnClicked(false);
              }
            }}
          >
            <DarkModeOutlinedIcon
              fontSize="medium"
              style={{ color: "#909090" }}
            />
            <p>Appearance: {theme ? "Dark" : "Light"}</p>
            <ArrowForwardIosRoundedIcon
              className="open"
              fontSize="small"
              style={{ color: "#ffffff8a" }}
            />
          </div>
        </div>
        <hr className="seperate" />
        <div className="extra1-section">
          <div className="language c-sec">
            <TranslateOutlinedIcon
              fontSize="medium"
              style={{ color: "#909090" }}
            />
            <p>Language: English</p>
          </div>
          <div
            className="exitout c-sec"
            onClick={() => {
              localStorage.removeItem("userToken");
              window.location.href = "/";
            }}
          >
            <LogoutOutlinedIcon
              fontSize="medium"
              style={{ color: "#909090" }}
            />
            <p>Sign Out</p>
          </div>
        </div>
      </div>
      <div
        className="account-pop2"
        style={
          isBtnClicked === true
            ? { display: "block", paddingTop: "12px" }
            : { display: "none", paddingTop: "20px" }
        }
      >
        <div className="appearance-title">
          <ArrowBackOutlinedIcon
            className="back-arrow"
            fontSize="medium"
            style={{ color: "#909090" }}
            onClick={() => {
              if (isBtnClicked === true) {
                setIsBtnClicked(false);
              } else {
                setIsBtnClicked(true);
              }
            }}
          />
          <p>Apperance</p>
        </div>
        <hr
          className="seperate"
          style={
            isBtnClicked === true ? { marginTop: "6px" } : { marginTop: "15px" }
          }
        />
        <div className="theme-section">
          <p className="caution">Settings applied to this browser only</p>
          <div className="theme-list">
            <div
              className="dark-theme"
              onClick={() => {
                setTheme(true);
                window.location.reload();
              }}
            >
              <DoneOutlinedIcon
                className="dark-arrow"
                fontSize="medium"
                style={theme === true ? { opacity: 1 } : { opacity: 0 }}
              />
              <p>Dark theme</p>
            </div>
            <div
              className="light-theme"
              onClick={() => {
                setTheme(false);
                window.location.reload();
              }}
            >
              <DoneOutlinedIcon
                className="light-arrow"
                fontSize="medium"
                style={theme === false ? { opacity: 1 } : { opacity: 0 }}
              />
              <p>Light theme</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AccountPop;
