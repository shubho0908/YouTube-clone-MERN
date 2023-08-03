//MUI Icons
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import "../Css/navbar.css";
import StudioLogo from "../img/studio.png";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import AccountPop2 from "./AccountPop2";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import YouTubeIcon from "@mui/icons-material/YouTube";

function Navbar2() {
  const token = localStorage.getItem("userToken");
  const [email, setEmail] = useState();
  const [profilePic, setProfilePic] = useState();
  const [userVideos, setUserVideos] = useState([]);
  const [showPop, setShowPop] = useState(false);
  const [searchInput, setSearchInput] = useState();
  const [showResults, setShowResults] = useState(false);

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

  useEffect(() => {
    const getVideos = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getuservideos/${email}`
        );
        const data = await response.json();
        setUserVideos(data);
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getVideos, 200);

    return () => clearInterval(interval);
  }, [email]);

  const filteredVideos =
    userVideos &&
    userVideos.filter(
      (video) =>
        video.Title.toLowerCase().includes(
          searchInput !== undefined &&
            searchInput !== "" &&
            searchInput.toLowerCase()
        ) ||
        video.Description.toLowerCase().includes(
          searchInput !== undefined &&
            searchInput !== "" &&
            searchInput.toLowerCase()
        )
    );

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
              window.location.href = "/studio";
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
            <input
              type="text"
              placeholder="Search across your channel"
              id="searchType2"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onClick={() => {
                setShowResults(true);
                document.querySelector(".navbar2").style.zIndex = "6";
              }}
            />
            <CloseOutlinedIcon
              fontSize="medium"
              className="clear-search"
              onClick={() => {
                setShowResults(false);
                setSearchInput("");
              }}
              style={
                showResults === true
                  ? {
                      color: "rgb(160, 160, 160)",
                      paddingRight: "12px",
                      opacity: "1",
                    }
                  : { opacity: "0", pointerEvents: "none" }
              }
            />
          </div>
          <div
            className="nav-search-results"
            style={
              (showResults === true && searchInput === "") ||
              (showResults === true && searchInput === undefined)
                ? { display: "block" }
                : { display: "none" }
            }
          >
            <div className="just-abovetxt">
              <p className="top-search-head">Your recent videos</p>
              {userVideos && userVideos.length >= 4 ? (
                <p
                  className="show-all"
                  onClick={() => {
                    window.location.href = "/studio/video";
                  }}
                >
                  Show all
                </p>
              ) : (
                ""
              )}
            </div>
            <hr className="seperate extra-seperate" />
            <div className="my-five-videos">
              {userVideos &&
                userVideos.length > 0 &&
                userVideos.slice(0, 4).map((element, index) => {
                  const uploaded = new Date(element.uploaded_date);
                  return (
                    <div className="allsearch-video-data" key={index}>
                      <div className="searchdata-one">
                        <img
                          src={element.thumbnailURL}
                          alt="thumbnail"
                          className="searching-thumbnail"
                          onClick={() => {
                            window.location.href = `/studio/video/edit/${element._id}`;
                          }}
                        />
                        <p className="searchvid-duration">
                          {Math.floor(element.videoLength / 60) +
                            ":" +
                            (Math.round(element.videoLength % 60) < 10
                              ? "0" + Math.round(element.videoLength % 60)
                              : Math.round(element.videoLength % 60))}
                        </p>
                        <div className="searchvid-data">
                          <p
                            onClick={() => {
                              window.location.href = `/studio/video/edit/${element._id}`;
                            }}
                          >
                            {element.Title.length <= 30
                              ? element.Title
                              : `${element.Title.slice(0, 30)}...`}
                          </p>
                          <p>
                            {element.Description.length <= 75
                              ? element.Description
                              : `${element.Description.slice(0, 75)}...`}
                          </p>
                          <div className="searchvid-edit-section">
                            <ModeEditOutlineOutlinedIcon
                              className="edit-this"
                              fontSize="medium"
                              style={{ color: "#aaa" }}
                              onClick={() => {
                                window.location.href = `/studio/video/edit/${element._id}`;
                              }}
                            />
                            <ChatOutlinedIcon
                              className="comment-this"
                              fontSize="medium"
                              style={{ color: "#aaa" }}
                            />
                            <YouTubeIcon
                              className="watch-this"
                              fontSize="medium"
                              style={{ color: "#aaa" }}
                              onClick={() => {
                                window.location.href = `/video/${element._id}`;
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="searchvid-date">
                        <p>
                          {uploaded.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p>Published</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div
            className="nav-search-results2"
            style={
              showResults === true &&
              filteredVideos &&
              filteredVideos.length > 0
                ? { display: "block" }
                : { display: "none" }
            }
          >
            <div className="just-abovetxt">
              <p className="top-search-head">
                Videos ({filteredVideos && filteredVideos.length})
              </p>
              {filteredVideos && filteredVideos.length >= 4 ? (
                <p
                  className="show-all"
                  onClick={() => {
                    window.location.href = "/studio/video";
                  }}
                >
                  Show all
                </p>
              ) : (
                ""
              )}
            </div>
            <hr className="seperate extra-seperate" />
            <div className="my-five-videos">
              {filteredVideos &&
                filteredVideos.length > 0 &&
                filteredVideos.map((element, index) => {
                  const uploaded = new Date(element.uploaded_date);
                  return (
                    <div className="allsearch-video-data" key={index}>
                      <div className="searchdata-one">
                        <img
                          src={element.thumbnailURL}
                          alt="thumbnail"
                          className="searching-thumbnail"
                          onClick={() => {
                            window.location.href = `/studio/video/edit/${element._id}`;
                          }}
                        />
                        <p className="searchvid-duration">
                          {Math.floor(element.videoLength / 60) +
                            ":" +
                            (Math.round(element.videoLength % 60) < 10
                              ? "0" + Math.round(element.videoLength % 60)
                              : Math.round(element.videoLength % 60))}
                        </p>
                        <div className="searchvid-data">
                          <p
                            onClick={() => {
                              window.location.href = `/studio/video/edit/${element._id}`;
                            }}
                          >
                            {element.Title.length <= 30
                              ? element.Title
                              : `${element.Title.slice(0, 30)}...`}
                          </p>
                          <p>
                            {element.Description.length <= 75
                              ? element.Description
                              : `${element.Description.slice(0, 75)}...`}
                          </p>
                          <div className="searchvid-edit-section">
                            <ModeEditOutlineOutlinedIcon
                              className="edit-this"
                              fontSize="medium"
                              style={{ color: "#aaa" }}
                              onClick={() => {
                                window.location.href = `/studio/video/edit/${element._id}`;
                              }}
                            />
                            <ChatOutlinedIcon
                              className="comment-this"
                              fontSize="medium"
                              style={{ color: "#aaa" }}
                            />
                            <YouTubeIcon
                              className="watch-this"
                              fontSize="medium"
                              style={{ color: "#aaa" }}
                              onClick={() => {
                                window.location.href = `/video/${element._id}`;
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="searchvid-date">
                        <p>
                          {uploaded.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p>Published</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div
            className="nav-search-results2"
            style={
              showResults === true &&
              searchInput !== undefined &&
              searchInput.length !== 0 &&
              filteredVideos &&
              filteredVideos.length === 0
                ? { display: "block" }
                : { display: "none" }
            }
          >
            <div className="just-abovetxt">
              <p className="top-search-head">
                Videos ({filteredVideos && filteredVideos.length})
              </p>
            </div>
            <hr className="seperate extra-seperate" />
            <div className="my-five-videos"></div>
          </div>
        </div>
        <div className="right-bar2">
          <img
            src={profilePic && profilePic}
            alt=""
            className="profile-pic"
            style={token ? { display: "block" } : { display: "none" }}
            onClick={() => setShowPop(!showPop)}
          />
        </div>
      </div>
      <div
        className="ac-pop"
        style={showPop === true ? { display: "block" } : { display: "none" }}
      >
        <AccountPop2 />
      </div>
    </>
  );
}

export default Navbar2;
