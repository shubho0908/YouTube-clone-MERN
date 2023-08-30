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
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { BiSearch } from "react-icons/bi";

function Navbar2() {
  const token = localStorage.getItem("userToken");
  const [email, setEmail] = useState();
  const [profilePic, setProfilePic] = useState();
  const [userVideos, setUserVideos] = useState([]);
  const [showPop, setShowPop] = useState(false);
  const [searchInput, setSearchInput] = useState();
  const [showResults, setShowResults] = useState(false);
  const [searchInput2, setSearchInput2] = useState();
  const [showResults2, setShowResults2] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchDesc, setSearchDesc] = useState(false);
  const [MobileSearch, setMobileSearch] = useState(false);
  const [searchClicked, setSearchClicked] = useState(false);

  useEffect(() => {
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

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
    }, 2800);
  }, []);

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
    userVideos.length > 0 &&
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

  const filteredVideos2 =
    userVideos &&
    userVideos.length > 0 &&
    userVideos.filter(
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
            className="youtubeLogo2"
            onClick={() => {
              window.location.href = "/studio";
            }}
          />
        </div>
        <div className="middle-bar2">
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
                  : {
                      opacity: "0",
                      paddingRight: "12px",
                      pointerEvents: "none",
                    }
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
                          {searchDesc ? (
                            <p>
                              {element.Description.length <= 75
                                ? element.Description
                                : `${element.Description.slice(0, 30)}...`}
                            </p>
                          ) : (
                            <p>
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
                                className="edit-this"
                                fontSize="medium"
                                style={{ color: "#aaa" }}
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
                                className="comment-this"
                                fontSize="medium"
                                style={{ color: "#aaa" }}
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
                                className="watch-this"
                                fontSize="medium"
                                style={{ color: "#aaa" }}
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
                          {searchDesc ? (
                            <p>
                              {element.Description.length <= 75
                                ? element.Description
                                : `${element.Description.slice(0, 30)}...`}
                            </p>
                          ) : (
                            <p>
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
                                className="edit-this"
                                fontSize="medium"
                                style={{ color: "#aaa" }}
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
                                className="comment-this"
                                fontSize="medium"
                                style={{ color: "#aaa" }}
                              />
                            </Tooltip>
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="View on YouTube"
                              placement="bottom"
                            >
                              <YouTubeIcon
                                className="watch-this"
                                fontSize="medium"
                                style={{ color: "#aaa" }}
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
        <SkeletonTheme baseColor="#353535" highlightColor="#444">
          <div
            className="right-bar2"
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
            color="rgb(160, 160, 160)"
            className="studio-searchh"
            onClick={() => setSearchClicked(true)}
          />
          <img
            src={profilePic && profilePic}
            alt=""
            className="profile-pic2"
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

      {/* MOBILE SEARCH BAR */}

      <div
        className="new-studio-search-section"
        style={{ display: searchClicked && MobileSearch ? "flex" : "none" }}
      >
        <div className="search2-new">
          <SearchRoundedIcon
            className="search-icon2"
            fontSize="medium"
            style={{ color: "rgb(160, 160, 160)" }}
          />
          <input
            type="text"
            placeholder="Search across your channel"
            id="searchType2-new"
            value={searchInput}
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
                    color: "rgb(160, 160, 160)",
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
            className="nav-search-results mobile-search-data"
            style={
              (showResults2 === true && searchInput2 === "") ||
              (showResults2 === true && searchInput2 === undefined)
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
                          {searchDesc ? (
                            <p>
                              {element.Description.length <= 75
                                ? element.Description
                                : `${element.Description.slice(0, 30)}...`}
                            </p>
                          ) : (
                            <p>
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
                                className="edit-this"
                                fontSize="medium"
                                style={{ color: "#aaa" }}
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
                                className="comment-this"
                                fontSize="medium"
                                style={{ color: "#aaa" }}
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
                                className="watch-this"
                                fontSize="medium"
                                style={{ color: "#aaa" }}
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
                        <p>Published</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div
            className="nav-search-results2 mobile-search-data"
            style={
              showResults2 === true &&
              filteredVideos2 &&
              filteredVideos2.length > 0
                ? { display: "block" }
                : { display: "none" }
            }
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
            <hr className="seperate extra-seperate" />
            <div className="my-five-videos">
              {filteredVideos2 &&
                filteredVideos2.length > 0 &&
                filteredVideos2.map((element, index) => {
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
                          {searchDesc ? (
                            <p>
                              {element.Description.length <= 75
                                ? element.Description
                                : `${element.Description.slice(0, 30)}...`}
                            </p>
                          ) : (
                            <p>
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
                                className="edit-this"
                                fontSize="medium"
                                style={{ color: "#aaa" }}
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
                                className="comment-this"
                                fontSize="medium"
                                style={{ color: "#aaa" }}
                              />
                            </Tooltip>
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="View on YouTube"
                              placement="bottom"
                            >
                              <YouTubeIcon
                                className="watch-this"
                                fontSize="medium"
                                style={{ color: "#aaa" }}
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
                        <p>Published</p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div
            className="nav-search-results2 mobile-search-data"
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
            <hr className="seperate extra-seperate" />
            <div className="my-five-videos"></div>
          </div>
        </div>
      </div>


    </>
  );
}

export default Navbar2;
