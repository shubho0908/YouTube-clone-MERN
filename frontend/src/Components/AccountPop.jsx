import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Css/accountPop.css";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import TranslateOutlinedIcon from "@mui/icons-material/TranslateOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import DoneOutlinedIcon from "@mui/icons-material/DoneOutlined";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

function AccountPop() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("");
  const [theme, setTheme] = useState("Dark");
  const [isBtnClicked, setIsBtnClicked] = useState(false);

  const navigate = useNavigate();

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
    const getUserData = async () => {
      try {
        if (email) {
          const response = await fetch(
            `http://localhost:3000/getuserdata/${email}`
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

  return (
    <>
      <div
        className="account-pop"
        style={
          isBtnClicked === false ? { display: "block" } : { display: "none" }
        }
      >
        <div className="user-section">
          <div className="left-part">
            <img src={profile} alt="channelIMG" className="channelIMG" />
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
          <div className="yourchannel c-sec">
            <AccountBoxOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>Your channel</p>
          </div>
          <div className="yourstudio c-sec" onClick={() => navigate("/studio")}>
            <OndemandVideoOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>YouTube Studio</p>
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
              style={{ color: "white" }}
            />
            <p>Appearance: {theme}</p>
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
              style={{ color: "white" }}
            />
            <p>Language: English</p>
          </div>
          <div className="exitout c-sec">
            <LogoutOutlinedIcon fontSize="medium" style={{ color: "white" }} />
            <p>Sign Out</p>
          </div>
        </div>
      </div>
      <div
        className="account-pop"
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
            style={{ color: "white" }}
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
            <div className="dark-theme" onClick={() => setTheme("Dark")}>
              <DoneOutlinedIcon
                className="dark-arrow"
                fontSize="medium"
                style={theme === "Dark" ? { opacity: 1 } : { opacity: 0 }}
              />
              <p>Dark theme</p>
            </div>
            <div className="light-theme" onClick={() => setTheme("Light")}>
              <DoneOutlinedIcon
                className="light-arrow"
                fontSize="medium"
                style={theme === "Light" ? { opacity: 1 } : { opacity: 0 }}
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
