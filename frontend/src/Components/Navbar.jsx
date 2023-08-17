//MUI Icons
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import AccountPop from "./AccountPop";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../Css/navbar.css";
import Logo from "../img/logo1.png";
import { useEffect, useState } from "react";
import Signup from "./Signup";
import Signin from "./Signin";
import avatar from "../img/avatar.png";
import { useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { FiSearch } from "react-icons/fi";
import { RxCross1 } from "react-icons/rx";

function Navbar() {
  const { data } = useParams();
  const [data2, setData] = useState(data);
  const [isbtnClicked, setisbtnClicked] = useState(false);
  const [isSwitch, setisSwitched] = useState(false);
  const token = localStorage.getItem("userToken");
  const [email, setEmail] = useState();
  const [profilePic, setProfilePic] = useState();
  const [showPop, setShowPop] = useState(false);
  const [searchedData, setSearchedData] = useState();
  const [loading, setLoading] = useState(true);
  const [newSearch, setNewSearch] = useState(false);

  useEffect(() => {
    if (token) {
      setisbtnClicked(false);
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

  useEffect(() => {
    const getData = async () => {
      try {
        if (email) {
          const response = await fetch(
            `http://localhost:3000/getuserimage/${email}`
          );
          const { channelIMG } = await response.json();
          setProfilePic(channelIMG);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getData, 200);

    return () => clearInterval(interval);
  }, [email]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  const handleSearch = (e) => {
    setSearchedData(e.target.value);
    setData(e.target.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && searchedData) {
      window.location.href = `/results/${searchedData}`;
    }
  };

  return (
    <>
      <div className="navbar">
        <div className="left-bar">
          <MenuRoundedIcon
            className="menu"
            fontSize="large"
            style={{ color: "white" }}
          />
          <img
            src={Logo}
            alt="logo"
            loading="lazy"
            className="youtubeLogo"
            onClick={() => {
              window.location.href = "/";
            }}
          />
        </div>
        <div className="middle-bar">
          <div className="search">
            <input
              type="text"
              placeholder="Type to search"
              id="searchType"
              value={data2 ? data2 : searchedData}
              onChange={handleSearch}
              onKeyDown={handleKeyPress}
            />
            <SearchRoundedIcon
              className="search-icon"
              fontSize="large"
              style={{ color: "rgb(160, 160, 160)" }}
              onClick={() => {
                if (searchedData) {
                  window.location.href = `/results/${searchedData}`;
                }
              }}
            />
          </div>
        </div>
        <div
          className="right-bar"
          style={
            token
              ? { justifyContent: "space-evenly", paddingRight: "0px" }
              : { justifyContent: "space-evenly", paddingRight: "25px" }
          }
        >
          <FiSearch
            fontSize="24px"
            color="#aaa"
            className="second-search"
            onClick={() => setNewSearch(true)}
          />
          <Tooltip
            TransitionComponent={Zoom}
            title="YouTube studio"
            placement="bottom"
          >
            <VideoCallOutlinedIcon
              className="icon-btns"
              fontSize="large"
              style={{ color: "rgb(160, 160, 160)" }}
              onClick={() => {
                if (token) {
                  window.location.href = "/studio";
                } else {
                  setisbtnClicked(true);
                  document.body.classList.add("bg-css");
                }
              }}
            />
          </Tooltip>

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
          <SkeletonTheme baseColor="#353535" highlightColor="#444">
            <div
              className="navimg"
              style={
                loading === true && token
                  ? { visibility: "visible" }
                  : { visibility: "hidden", display: "none" }
              }
            >
              <Skeleton
                count={1}
                width={42}
                height={42}
                style={{ borderRadius: "100%" }}
              />
            </div>
          </SkeletonTheme>
          <img
            src={profilePic ? profilePic : avatar}
            alt="user profile pic"
            loading="lazy"
            className="profile-pic"
            style={
              token && loading === false
                ? { display: "block" }
                : { display: "none" }
            }
            onClick={() => {
              if (showPop === false) {
                setShowPop(true);
              } else {
                setShowPop(false);
              }
            }}
          />
        </div>
      </div>
      <div
        className="auth-popup"
        style={
          isbtnClicked === true ? { display: "block" } : { display: "none" }
        }
      >
        <ClearRoundedIcon
          onClick={() => {
            if (isbtnClicked === false) {
              setisbtnClicked(true);
            } else {
              setisbtnClicked(false);
              document.body.classList.remove("bg-css");
            }
          }}
          className="cancel"
          fontSize="large"
          style={{ color: "gray" }}
        />
        <div
          className="signup-last"
          style={
            isSwitch === false ? { display: "block" } : { display: "none" }
          }
        >
          <Signup />
          <div className="already">
            <p>Already have an account?</p>
            <p
              onClick={() => {
                if (isSwitch === false) {
                  setisSwitched(true);
                } else {
                  setisSwitched(false);
                }
              }}
            >
              Signin
            </p>
          </div>
        </div>
        <div
          className="signin-last"
          style={isSwitch === true ? { display: "block" } : { display: "none" }}
        >
          <Signin />
          <div className="already">
            <p>Don&apos;t have an account?</p>
            <p
              onClick={() => {
                if (isSwitch === false) {
                  setisSwitched(true);
                } else {
                  setisSwitched(false);
                }
              }}
            >
              Signup
            </p>
          </div>
        </div>
      </div>
      <div
        className="ac-pop"
        style={showPop === true ? { display: "block" } : { display: "none" }}
      >
        <AccountPop />
      </div>
      <div
        className="new-searchbar"
        style={{ display: newSearch && window.innerWidth <= 940 ? "flex" : "none" }}
      >
        <div
          className="new-searchbar-component"
          style={{ display: newSearch && window.innerWidth <= 940 ? "flex" : "none" }}
        >
          <FiSearch fontSize="28px" color="#aaa" />
          <input
            type="text"
            name="search-content"
            placeholder="Type to search"
            className="extra-search"
            value={data2 ? data2 : searchedData}
            onChange={handleSearch}
            onKeyDown={handleKeyPress}
          />
          <RxCross1 fontSize="26px" color="#aaa" className="cancel-newsearch" onClick={()=> setNewSearch(false)}/>
        </div>
      </div>
    </>
  );
}

export default Navbar;
