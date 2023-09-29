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
import {SiYoutubestudio} from "react-icons/si"

function AccountPop() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("");
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const [ChannelID, setChannelID] = useState();
  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [isChannel, setIsChannel] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setName(decodedToken.name || "");
        setEmail(decodedToken.email || "");
      } catch (error) {
        // console.log("Error decoding token:", error.message);
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
            `${backendURL}/getuserimage/${email}`
          );
          const { channelIMG } = await response.json();
          setProfile(channelIMG);
        }
      } catch (error) {
        // console.log("Error fetching user data:", error.message);
      }
    };

    getUserData();
  }, [email]);

  useEffect(() => {
    const getChannelID = async () => {
      try {
        if (email) {
          const response = await fetch(
            `${backendURL}/getchannelid/${email}`
          );
          const { channelID } = await response.json();
          setChannelID(channelID);
        }
      } catch (error) {
        // console.log("Error fetching user data:", error.message);
      }
    };

    getChannelID();
  }, [email]);

  useEffect(() => {
    const getChannel = async () => {
      try {
        if (email) {
          const response = await fetch(
            `${backendURL}/getchannel/${email}`
          );
          const { channel } = await response.json();
          setIsChannel(channel);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    const interval = setInterval(getChannel, 200);

    return () => clearInterval(interval);
  }, [email]);

  return (
    <>
      <div
        className={
          theme ? "account-pop" : "account-pop account-pop-light light-mode"
        }
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
        <hr className={theme ? "seperate" : "seperate-light"} />
        <div className="about-channel-section">
          <div
            className={theme ? "yourchannel c-sec" : "yourchannel c-sec2"}
            onClick={() => {
              if (isChannel === true) {
                window.location.href = `/channel/${ChannelID}`;
              } else {
                window.location.href = `/studio`;
              }
            }}
          >
            <AccountBoxOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
            <p>Your channel</p>
          </div>
          <div
            className={theme ? "yourstudio c-sec" : "yourstudio c-sec2"}
            onClick={() => {
              window.location.href = "/studio";
            }}
          >
            <SiYoutubestudio
              fontSize="21px"
              style={{ color: theme ? "white" : "black" }}
            />
            <p>YouTube Studio</p>
          </div>
          <div
            className={theme ? "apperance c-sec" : "apperance c-sec2"}
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
              style={{ color: theme ? "white" : "black" }}
            />
            <p>Appearance: {theme ? "Dark" : "Light"}</p>
            <ArrowForwardIosRoundedIcon
              className="open"
              fontSize="small"
              style={{ color: theme ? "#ffffff8a" : "black" }}
            />
          </div>
        </div>
        <hr className={theme ? "seperate" : "seperate-light"} />
        <div className="extra1-section">
          <div className={theme ? "language c-sec" : "language c-sec2"}>
            <TranslateOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
            <p>Language: English</p>
          </div>
          <div
            className={theme ? "exitout c-sec" : "exitout c-sec2"}
            onClick={() => {
              localStorage.removeItem("userToken");
              window.location.href = "/";
            }}
          >
            <LogoutOutlinedIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
            <p>Sign Out</p>
          </div>
        </div>
      </div>
      <div
        className={
          theme ? "account-pop" : "account-pop account-pop-light light-mode"
        }
        style={
          isBtnClicked === true
            ? { display: "block", paddingTop: "12px" }
            : { display: "none", paddingTop: "20px" }
        }
      >
        <div className="appearance-title">
          <ArrowBackOutlinedIcon
            className={theme ? "back-arrow" : "back-arroww2"}
            fontSize="medium"
            style={{ color: theme ? "white" : "black" }}
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
          className={theme ? "seperate" : "seperate-light"}
          style={
            isBtnClicked === true ? { marginTop: "6px" } : { marginTop: "15px" }
          }
        />
        <div className="theme-section">
          <p className="caution">Settings applied to this browser only</p>
          <div className="theme-list">
            <div
              className={theme ? "dark-theme" : "dark-theme2"}
              onClick={() => {
                setTheme(true);
                window.location.reload();
              }}
            >
              <DoneOutlinedIcon
                className="dark-arrow"
                fontSize="medium"
                color={theme ? "white" : "black"}
                style={theme === true ? { opacity: 1 } : { opacity: 0 }}
              />
              <p>Dark theme</p>
            </div>
            <div
              className={theme ? "light-theme" : "light-theme2"}
              onClick={() => {
                setTheme(false);
                window.location.reload();
              }}
            >
              <DoneOutlinedIcon
                className="light-arrow"
                fontSize="medium"
                color={theme ? "white" : "black"}
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
