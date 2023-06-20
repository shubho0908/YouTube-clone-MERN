import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import "../Css/accountPop.css";
import AccountBoxOutlinedIcon from "@mui/icons-material/AccountBoxOutlined";
import OndemandVideoOutlinedIcon from "@mui/icons-material/OndemandVideoOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";

function AccountPop() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profile, setProfile] = useState("");

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
      <div className="account-pop">
        <div className="user-section">
          <div className="left-part">
            <img src={profile} alt="channelIMG" className="channelIMG" />
          </div>
          <div className="right-part">
            <p>{name}</p>
            <p>{email}</p>
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
          <div className="yourstudio c-sec">
            <OndemandVideoOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>YouTube Studio</p>
          </div>
          <div className="apperance c-sec">
            <DarkModeOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>Appearance</p>
            <ArrowForwardIosRoundedIcon className="open"
              fontSize="small"
              style={{ color: "#ffffff8a" }}
            />
          </div>
        </div>
        <hr className="seperate" />
        <div className="extra1-section"></div>
      </div>
    </>
  );
}

export default AccountPop;
