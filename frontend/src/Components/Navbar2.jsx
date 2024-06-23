//MUI Icons
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import "../Css/navbar.css";
import StudioLogo from "../img/studio.png";
import StudioLogo2 from "../img/studio2.png";
import { useEffect, useState, useRef } from "react";
import AccountPop2 from "./AccountPop2";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { BiSearch } from "react-icons/bi";
import { useSelector } from "react-redux";

function Navbar2() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app";
  // const backendURL = "http://localhost:3000";
  const [profilePic, setProfilePic] = useState();
  const [userVideos, setUserVideos] = useState([]);
  const [showPop, setShowPop] = useState(false);
  const [searchInput, setSearchInput] = useState();
  const [showResults, setShowResults] = useState(false);
  const [searchInput2, setSearchInput2] = useState("");
  const [showResults2, setShowResults2] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchDesc, setSearchDesc] = useState(false);
  const [MobileSearch, setMobileSearch] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const searchRef = useRef();
  const accountRef = useRef();

  const User = useSelector((state) => state.user.user);
  const { user } = User;

  useEffect(() => {
    const handler = (e) => {
      if (!searchRef.current.contains(e.target)) {
        setSearchClicked(false);
        setSearchInput2("");
        setShowResults2(false);
      }
    };
    document.addEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (!accountRef.current.contains(e.target)) {
        setShowPop(false);
      }
    };
    document.addEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    function handleResize() {
      setSearchDesc(window.innerWidth <= 1100);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    function handleResize() {
      setMobileSearch(window.innerWidth <= 915);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  useEffect(() => {
    const getData = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getchannel/${user?.email}`
          );
          const { userProfile } = await response.json();
          setProfilePic(userProfile);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    getData();
  }, [user?.email]);

  useEffect(() => {
    const getVideos = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getuservideos/${user?.email}`
          );
          const data = await response.json();
          setUserVideos(data);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    getVideos();
  }, [user?.email]);

  const filteredVideos =
    userVideos?.length > 0 &&
    userVideos?.filter(
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

  const filteredVideos2 =
    userVideos?.length > 0 &&
    userVideos?.filter(
      (video) =>
        video.Title.toLowerCase().includes(
          searchInput2 !== undefined &&
            searchInput2 !== "" &&
            searchInput2.toLowerCase()
        ) ||
        video.Description.toLowerCase().includes(
          searchInput2 !== undefined &&
            searchInput2 !== "" &&
            searchInput2.toLowerCase()
        )
    );

  return (
    <>
      <div className={theme ? "navbar2" : "navbar2 light-mode text-light-mode"}>
        <div className="left-bar">
          <MenuRoundedIcon
            className={theme ? "menu2" : "menu2 menu2-light"}
            fontSize="large"
            style={{ color: theme ? "white" : "black" }}
          />

          <img
            src={theme ? StudioLogo : StudioLogo2}
            alt="logo"
            className="youtubeLogo2"
            onClick={() => {
              window.location.href = "/studio";
            }}
          />
        </div>
        <div className="middle-bar2">
          <div
            className={
              theme
                ? "search2"
                : "search2 search2-light light-mode text-light-mode"
            }
          >
            <SearchRoundedIcon
              className="search-icon2"
              fontSize="medium"
              style={{ color: theme ? "rgb(160, 160, 160)" : "black" }}
            />
            <input
              type="text"
              placeholder="Search across your channel"
              id="searchType2"
              className={theme ? "" : "light-mode text-light-mode"}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onClick={() => {
                setShowResults(true);
                document.querySelector(".navbar2").style.zIndex = "6";
              }}
            />
            <CloseOutlinedIcon
              fontSize="medium"
              className={theme ? "clear-search" : "clear-search clear-light"}
              onClick={() => {
                setShowResults(false);
                setSearchInput("");
              }}
              style={
                showResults === true
                  ? {
                      color: theme ? "rgb(160, 160, 160)" : "black",
                      paddingRight: "12px",
                      opacity: "1",
                    }
                  : {
                      opacity: "0",
                      paddingRight: "12px",
                      pointerEvents: "none",
                    }
              }
            />
          </div>
          <div
            className={
              theme
                ? "nav-search-results"
                : "nav-search-results light-mode text-light-mode"
            }
            style={{
              display:
                (showResults === true && searchInput === "") ||
                (showResults === true && searchInput === undefined)
                  ? "block"
                  : "none",
              height: userVideos && userVideos.length >= 4 ? "450px" : "auto",
            }}
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
            <hr
              className={
                theme
                  ? "seperate extra-seperate"
                  : "seperate extra-seperate seperate-light"
              }
            />
            <div className="my-five-videos">
              {userVideos &&
                userVideos.length > 0 &&
                userVideos.slice(0, 4).map((element, index) => {
                  const uploaded = new Date(element.uploaded_date);
                  return (
                    <div
                      className={
                        theme
                          ? "allsearch-video-data"
                          : "allsearch-video-data videodata-light"
                      }
                      key={index}
                    >
                      <div className="searchdata-one">
                        <img
                          src={element.thumbnailURL}
                          alt="thumbnail"
                          className="searching-thumbnail"
                          onClick={() => {
                            window.location.href = `/studio/video/edit/${element._id}`;
                          }}
                        />
                        <p
                          className={
                            theme
                              ? "searchvid-duration"
                              : "searchvid-duration text-dark-mode"
                          }
                        >
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
                          {searchDesc ? (
                            <p className={theme ? "" : "text-light-mode2"}>
                              {element.Description.length <= 75
                                ? element.Description
                                : `${element.Description.slice(0, 30)}...`}
                            </p>
                          ) : (
                            <p className={theme ? "" : "text-light-mode2"}>
                              {element.Description.length <= 75
                                ? element.Description
                                : `${element.Description.slice(0, 75)}...`}
                            </p>
                          )}
                          <div className="searchvid-edit-section">
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Details"
                              placement="bottom"
                            >
                              <ModeEditOutlineOutlinedIcon
                                className={
                                  theme ? "edit-this" : "edit-this-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => {
                                  window.location.href = `/studio/video/edit/${element._id}`;
                                }}
                              />
                            </Tooltip>
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Comments"
                              placement="bottom"
                            >
                              <ChatOutlinedIcon
                                className={
                                  theme ? "comment-this" : "comment-this-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => {
                                  window.location.href = `/studio/video/comments/${element._id}`;
                                }}
                              />
                            </Tooltip>
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="View on YouTube"
                              placement="bottom"
                            >
                              <YouTubeIcon
                                className={
                                  theme ? "watch-this" : "watch-this-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => {
                                  window.location.href = `/video/${element._id}`;
                                }}
                              />
                            </Tooltip>
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
                        <p className={theme ? "" : "text-light-mode2"}>
                          Published
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div
            className={
              theme
                ? "nav-search-results2"
                : "nav-search-results2 light-mode text-light-mode"
            }
            style={{
              display:
                showResults === true &&
                filteredVideos &&
                filteredVideos.length > 0
                  ? "block"
                  : "none",
              height:
                filteredVideos && filteredVideos.length >= 4 ? "450px" : "auto",
            }}
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
            <hr
              className={
                theme
                  ? "seperate extra-seperate"
                  : "seperate extra-seperate seperate-light"
              }
            />
            <div className="my-five-videos">
              {filteredVideos &&
                filteredVideos.length > 0 &&
                filteredVideos.map((element, index) => {
                  const uploaded = new Date(element.uploaded_date);
                  return (
                    <div
                      className={
                        theme
                          ? "allsearch-video-data"
                          : "allsearch-video-data videodata-light"
                      }
                      key={index}
                    >
                      <div className="searchdata-one">
                        <img
                          src={element.thumbnailURL}
                          alt="thumbnail"
                          className="searching-thumbnail"
                          onClick={() => {
                            window.location.href = `/studio/video/edit/${element._id}`;
                          }}
                        />
                        <p
                          className={
                            theme
                              ? "searchvid-duration"
                              : "searchvid-duration text-dark-mode"
                          }
                        >
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
                          {searchDesc ? (
                            <p className={theme ? "" : "text-light-mode2"}>
                              {element.Description.length <= 75
                                ? element.Description
                                : `${element.Description.slice(0, 30)}...`}
                            </p>
                          ) : (
                            <p className={theme ? "" : "text-light-mode2"}>
                              {element.Description.length <= 75
                                ? element.Description
                                : `${element.Description.slice(0, 75)}...`}
                            </p>
                          )}
                          <div className="searchvid-edit-section">
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Details"
                              placement="bottom"
                            >
                              <ModeEditOutlineOutlinedIcon
                                className={
                                  theme ? "edit-this" : "edit-this-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => {
                                  window.location.href = `/studio/video/edit/${element._id}`;
                                }}
                              />
                            </Tooltip>
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Comments"
                              placement="bottom"
                            >
                              <ChatOutlinedIcon
                                className={
                                  theme ? "comment-this" : "comment-this-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => {
                                  window.location.href = `/studio/video/comments/${element._id}`;
                                }}
                              />
                            </Tooltip>
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="View on YouTube"
                              placement="bottom"
                            >
                              <YouTubeIcon
                                className={
                                  theme ? "watch-this" : "watch-this-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => {
                                  window.location.href = `/video/${element._id}`;
                                }}
                              />
                            </Tooltip>
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
                        <p className={theme ? "" : "text-light-mode2"}>
                          Published
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div
            className={
              theme
                ? "nav-search-results2"
                : "nav-search-results2 light-mode text-light-mode"
            }
            style={{
              display:
                showResults === true &&
                searchInput !== undefined &&
                searchInput.length !== 0 &&
                filteredVideos &&
                filteredVideos.length === 0
                  ? "block"
                  : "none",
            }}
          >
            <div className="just-abovetxt">
              <p className="top-search-head">
                Videos ({filteredVideos && filteredVideos.length})
              </p>
            </div>
            <hr
              className={
                theme
                  ? "seperate extra-seperate"
                  : "seperate extra-seperate seperate-light"
              }
            />
            <div className="my-five-videos"></div>
          </div>
        </div>
        <SkeletonTheme
          baseColor={theme ? "#353535" : "#aaaaaa"}
          highlightColor={theme ? "#444" : "#b6b6b6"}
        >
          <div
            className="right-bar2 sk-right-bar2"
            style={loading ? { display: "block" } : { display: "none" }}
          >
            <Skeleton
              count={1}
              width={42}
              height={42}
              style={{ borderRadius: "100%" }}
            />
          </div>
        </SkeletonTheme>
        <div
          className="right-bar2"
          style={
            !loading
              ? { visibility: "visible", display: "flex" }
              : { visibility: "hidden", display: "none" }
          }
        >
          <BiSearch
            fontSize="28px"
            color={theme ? "rgb(160, 160, 160)" : "black"}
            className="studio-searchh"
            onClick={() => setSearchClicked(true)}
          />
          <img
            src={profilePic && profilePic}
            alt=""
            className="profile-pic2"
            style={user?.email ? { display: "block" } : { display: "none" }}
            onClick={() => setShowPop(!showPop)}
          />
        </div>
      </div>
      <div
        className="ac-pop"
        ref={accountRef}
        style={showPop === true ? { display: "block" } : { display: "none" }}
      >
        <AccountPop2 />
      </div>

      {/* MOBILE SEARCH BAR */}

      <div
        className="new-studio-search-section"
        style={{ display: searchClicked && MobileSearch ? "flex" : "none" }}
      >
        <div
          className={
            theme ? "search2-new" : "search2-new light-mode text-light-mode"
          }
          ref={searchRef}
        >
          <SearchRoundedIcon
            className="search-icon2"
            fontSize="medium"
            style={{ color: theme ? "rgb(160, 160, 160)" : "black" }}
          />
          <input
            type="text"
            placeholder="Search across your channel"
            id="searchType2-new"
            className={theme ? "" : "light-mode text-light-mode"}
            value={searchInput2}
            onChange={(e) => setSearchInput2(e.target.value)}
            onClick={() => setShowResults2(true)}
          />
          <CloseOutlinedIcon
            fontSize="medium"
            className="clear-search"
            onClick={() => {
              setSearchInput2("");
              setShowResults2(false);
              setSearchClicked(false);
            }}
            style={
              showResults2 === true
                ? {
                    color: theme ? "rgb(160, 160, 160)" : "black",
                    paddingRight: "12px",
                    opacity: "1",
                  }
                : {
                    opacity: "0",
                    paddingRight: "12px",
                    pointerEvents: "none",
                  }
            }
          />
        </div>
        <div className="show-mobile-search-results">
          <div
            className={
              theme
                ? "nav-search-results mobile-search-data"
                : "nav-search-results mobile-search-data light-mode text-light-mode"
            }
            style={{
              display:
                (showResults2 === true && searchInput2 === "") ||
                (showResults2 === true && searchInput2 === undefined)
                  ? "block"
                  : "none",
              height: userVideos && userVideos.length >= 4 ? "400px" : "auto",
            }}
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
            <hr
              className={
                theme
                  ? "seperate extra-seperate"
                  : "seperate extra-seperate seperate-light"
              }
            />
            <div className="my-five-videos">
              {userVideos &&
                userVideos.length > 0 &&
                userVideos.slice(0, 4).map((element, index) => {
                  const uploaded = new Date(element.uploaded_date);
                  return (
                    <div
                      className={
                        theme
                          ? "allsearch-video-data"
                          : "allsearch-video-data videodata-light"
                      }
                      key={index}
                    >
                      <div className="searchdata-one">
                        <img
                          src={element.thumbnailURL}
                          alt="thumbnail"
                          className="searching-thumbnail"
                          onClick={() => {
                            window.location.href = `/studio/video/edit/${element._id}`;
                          }}
                        />
                        <p
                          className={
                            theme
                              ? "searchvid-duration"
                              : "searchvid-duration text-dark-mode"
                          }
                        >
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
                          {searchDesc ? (
                            <p className={theme ? "" : "text-light-mode2"}>
                              {element.Description.length <= 75
                                ? element.Description
                                : `${element.Description.slice(0, 30)}...`}
                            </p>
                          ) : (
                            <p className={theme ? "" : "text-light-mode2"}>
                              {element.Description.length <= 75
                                ? element.Description
                                : `${element.Description.slice(0, 75)}...`}
                            </p>
                          )}
                          <div className="searchvid-edit-section">
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Details"
                              placement="bottom"
                            >
                              <ModeEditOutlineOutlinedIcon
                                className={
                                  theme ? "edit-this" : "edit-this-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => {
                                  window.location.href = `/studio/video/edit/${element._id}`;
                                }}
                              />
                            </Tooltip>
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Comments"
                              placement="bottom"
                            >
                              <ChatOutlinedIcon
                                className={
                                  theme ? "comment-this" : "comment-this-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => {
                                  window.location.href = `/studio/video/comments/${element._id}`;
                                }}
                              />
                            </Tooltip>
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="View on YouTube"
                              placement="bottom"
                            >
                              <YouTubeIcon
                                className={
                                  theme ? "watch-this" : "watch-this-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => {
                                  window.location.href = `/video/${element._id}`;
                                }}
                              />
                            </Tooltip>
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
                        <p className={theme ? "" : "text-light-mode2"}>
                          Published
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div
            className={
              theme
                ? "nav-search-results2 mobile-search-data"
                : "nav-search-results2 mobile-search-data light-mode text-light-mode"
            }
            style={{
              display:
                showResults2 === true &&
                filteredVideos2 &&
                filteredVideos2.length > 0
                  ? "block"
                  : "none",
              height:
                filteredVideos2 && filteredVideos2.length >= 2
                  ? "400px"
                  : "auto",
            }}
          >
            <div className="just-abovetxt">
              <p className="top-search-head">
                Videos ({filteredVideos2 && filteredVideos2.length})
              </p>
              {filteredVideos2 && filteredVideos2.length >= 4 ? (
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
            <hr
              className={
                theme
                  ? "seperate extra-seperate"
                  : "seperate extra-seperate seperate-light"
              }
            />
            <div className="my-five-videos">
              {filteredVideos2 &&
                filteredVideos2.length > 0 &&
                filteredVideos2.map((element, index) => {
                  const uploaded = new Date(element.uploaded_date);
                  return (
                    <div
                      className={
                        theme
                          ? "allsearch-video-data"
                          : "allsearch-video-data videodata-light"
                      }
                      key={index}
                    >
                      <div className="searchdata-one">
                        <img
                          src={element.thumbnailURL}
                          alt="thumbnail"
                          className="searching-thumbnail"
                          onClick={() => {
                            window.location.href = `/studio/video/edit/${element._id}`;
                          }}
                        />
                        <p
                          className={
                            theme
                              ? "searchvid-duration"
                              : "searchvid-duration text-dark-mode"
                          }
                        >
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
                          {searchDesc ? (
                            <p className={theme ? "" : "text-light-mode2"}>
                              {element.Description.length <= 75
                                ? element.Description
                                : `${element.Description.slice(0, 30)}...`}
                            </p>
                          ) : (
                            <p className={theme ? "" : "text-light-mode2"}>
                              {element.Description.length <= 75
                                ? element.Description
                                : `${element.Description.slice(0, 75)}...`}
                            </p>
                          )}
                          <div className="searchvid-edit-section">
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Details"
                              placement="bottom"
                            >
                              <ModeEditOutlineOutlinedIcon
                                className={
                                  theme ? "edit-this" : "edit-this-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => {
                                  window.location.href = `/studio/video/edit/${element._id}`;
                                }}
                              />
                            </Tooltip>
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Comments"
                              placement="bottom"
                            >
                              <ChatOutlinedIcon
                                className={
                                  theme ? "comment-this" : "comment-this-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => {
                                  window.location.href = `/studio/video/comments/${element._id}`;
                                }}
                              />
                            </Tooltip>
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="View on YouTube"
                              placement="bottom"
                            >
                              <YouTubeIcon
                                className={
                                  theme ? "watch-this" : "watch-this-light"
                                }
                                fontSize="medium"
                                style={{ color: theme ? "#aaa" : "#606060" }}
                                onClick={() => {
                                  window.location.href = `/video/${element._id}`;
                                }}
                              />
                            </Tooltip>
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
                        <p className={theme ? "" : "text-light-mode2"}>
                          Published
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div
            className={
              theme
                ? "nav-search-results2 mobile-search-data"
                : "nav-search-results2 mobile-search-data light-mode text-light-mode"
            }
            style={
              showResults2 === true &&
              searchInput2 !== undefined &&
              searchInput2.length !== 0 &&
              filteredVideos2 &&
              filteredVideos2.length === 0
                ? { display: "block" }
                : { display: "none" }
            }
          >
            <div className="just-abovetxt">
              <p className="top-search-head">
                Videos ({filteredVideos2 && filteredVideos2.length})
              </p>
            </div>
            <hr
              className={
                theme
                  ? "seperate extra-seperate"
                  : "seperate extra-seperate seperate-light"
              }
            />
            <div className="my-five-videos"></div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar2;
