//MUI Icons
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import AccountPop from "./AccountPop";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "../Css/navbar.css";
import Logo from "../img/logo1.png";
import Logo2 from "../img/logo2.png";
import { useEffect, useState, useRef } from "react";
import Signup from "./Signup";
import Signin from "./Signin";
import avatar from "../img/avatar.png";
import { useParams } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { FiSearch } from "react-icons/fi";
import { IoIosSearch } from "react-icons/io";
import { RxCross1 } from "react-icons/rx";
import { AiOutlineVideoCameraAdd } from "react-icons/ai";
import { useSelector } from "react-redux";
function Navbar() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000";
  const { data } = useParams();
  const [data2, setData] = useState(data);
  const [isbtnClicked, setisbtnClicked] = useState(false);
  const [isSwitch, setisSwitched] = useState(false);
  const [profilePic, setProfilePic] = useState();
  const [showPop, setShowPop] = useState(false);
  const [searchedData, setSearchedData] = useState();
  const [loading, setLoading] = useState(true);
  const [newSearch, setNewSearch] = useState(false);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const profileRef = useRef();
  const searchRef = useRef();

  const User = useSelector((state) => state.user.user);
  const { user } = User;
  useEffect(() => {
    if (User.success) {
      setisbtnClicked(false);
    }
  }, [user]);

  useEffect(() => {
    const handler = (e) => {
      if (!profileRef.current.contains(e.target)) {
        setShowPop(false);
      }
    };

    document.addEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!searchRef.current.contains(e.target)) {
        setNewSearch(false);
      }
    };

    document.addEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getuserimage/${user?.email}`
          );
          const { channelIMG } = await response.json();
          setProfilePic(channelIMG);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    getData();
  }, [user?.email]);

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
      <div className={theme === true ? "navbar" : "navbar light-mode"}>
        <div className="left-bar">
          <MenuRoundedIcon
            className={theme ? "menu" : "menu-light"}
            fontSize="large"
            style={{ color: theme ? "white" : "black" }}
          />
          <img
            src={theme ? Logo : Logo2}
            alt="logo"
            loading="lazy"
            className="youtubeLogo"
            onClick={() => {
              window.location.href = "/";
            }}
          />
        </div>
        <div className="middle-bar">
          <div className={theme ? "search" : "search light-mode light-border"}>
            <input
              type="text"
              placeholder="Type to search"
              id={theme ? "searchType" : "searchType-light-mode"}
              value={data2 ? data2 : searchedData}
              onChange={handleSearch}
              onKeyDown={handleKeyPress}
            />
            <IoIosSearch
              className={theme ? "search-icon" : "search-light-icon"}
              fontSize="28px"
              style={{ color: theme ? "rgb(160, 160, 160)" : "black" }}
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
            User.success
              ? { justifyContent: "space-evenly", paddingRight: "0px" }
              : { justifyContent: "space-evenly", paddingRight: "25px" }
          }
        >
          <FiSearch
            fontSize="24px"
            color={theme ? "#aaa" : "black"}
            className="second-search"
            onClick={() => setNewSearch(true)}
          />
          <Tooltip
            TransitionComponent={Zoom}
            title="YouTube studio"
            placement="bottom"
          >
            <AiOutlineVideoCameraAdd
              className={theme ? "icon-btns videocreate" : "video-light"}
              fontSize="24px"
              style={{ color: theme ? "white" : "black" }}
              onClick={() => {
                if (User.success) {
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
            className={theme ? "signin" : "signin signin-light"}
            style={User.success ? { display: "none" } : { display: "flex" }}
          >
            <AccountCircleOutlinedIcon
              fontSize="medium"
              style={{ color: "rgb(0, 162, 255)" }}
              className="user-avatar"
            />
            <p>Signin</p>
          </button>
          <SkeletonTheme
            baseColor={theme ? "#353535" : "#aaaaaa"}
            highlightColor={theme ? "#444" : "#b6b6b6"}
          >
            <div
              className="navimg"
              style={
                loading === true && User.success
                  ? { visibility: "visible" }
                  : { visibility: "hidden", display: "none" }
              }
            >
              <Skeleton
                count={1}
                width={42}
                height={42}
                style={{ borderRadius: "100%" }}
                className="sk-profile"
              />
            </div>
          </SkeletonTheme>
          <img
            src={profilePic ? profilePic : avatar}
            alt="user profile pic"
            loading="lazy"
            className="profile-pic"
            style={
              User.success && loading === false
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
        className={
          theme ? "auth-popup" : "auth-popup light-mode text-light-mode"
        }
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
              setisSwitched(false);
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
          <Signin close={isbtnClicked} switch={isSwitch} />
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
        ref={profileRef}
        style={showPop === true ? { display: "block" } : { display: "none" }}
      >
        <AccountPop />
      </div>
      <div
        className={theme ? "new-searchbar" : "new-searchbar2"}
        style={{
          display: newSearch && window.innerWidth <= 940 ? "flex" : "none",
        }}
      >
        <div
          className="new-searchbar-component"
          ref={searchRef}
          style={{
            display: newSearch && window.innerWidth <= 940 ? "flex" : "none",
          }}
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
          <RxCross1
            fontSize="26px"
            color="#aaa"
            className="cancel-newsearch"
            onClick={() => setNewSearch(false)}
          />
        </div>
      </div>
    </>
  );
}

export default Navbar;
