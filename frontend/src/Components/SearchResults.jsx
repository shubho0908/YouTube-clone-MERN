import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../Css/search.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Signup from "./Signup";
import Signin from "./Signin";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import nothing from "../img/nothing.png";
import Zoom from "@mui/material/Zoom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

function SearchResults() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000";
  const { data } = useParams();
  const [searchedVideoData, setsearchedVideoData] = useState([]);
  const [searchedChannelData, setsearchedChannelData] = useState([]);
  const [channelID, setChannelID] = useState();
  const [userEmail, setUserEmail] = useState();
  const [isbtnClicked, setisbtnClicked] = useState(false);
  const [isSwitch, setisSwitched] = useState(false);
  const [userVideos, setUserVideos] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const User = useSelector((state) => state.user.user);
  const { user } = User;
  //TOASTS

  const SubscribeNotify = () =>
    toast.success("Channel subscribed!", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  //USE EFFECTS

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  document.title = data && data !== undefined ? `${data} - YouTube` : "YouTube";

  useEffect(() => {
    if (theme === false && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "white";
    } else if (theme === true && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "0f0f0f";
    }
  }, [theme]);

  useEffect(() => {
    const getSearchResult = async () => {
      try {
        const response = await fetch(`${backendURL}/search/${data}`);
        const Data = await response.json();
        const { videoData, channelData } = Data;
        setsearchedVideoData(videoData);
        setsearchedChannelData(channelData);
      } catch (error) {
        // console.log(error.message);
      }
    };
    return () => getSearchResult();
  }, [data]);

  useEffect(() => {
    const getChannelID = () => {
      searchedChannelData &&
        searchedChannelData !== "NO DATA" &&
        searchedChannelData.length > 0 &&
        searchedChannelData.map((item) => setChannelID(item._id));
    };

    getChannelID();
  }, [searchedChannelData]);

  useEffect(() => {
    const fetchOtherChannel = async () => {
      try {
        if (channelID) {
          const response = await fetch(
            `${backendURL}/getotherchannel/${channelID}`
          );
          const email = await response.json();
          setUserEmail(email);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchOtherChannel();
  }, [channelID]);

  useEffect(() => {
    const getUserVideos = async () => {
      try {
        if (userEmail !== undefined) {
          const response = await fetch(
            `${backendURL}/getuservideos/${userEmail}`
          );

          const myvideos = await response.json();
          setUserVideos(myvideos);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    return () => getUserVideos();
  }, [userEmail]);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        if (user?.email && channelID) {
          const response = await fetch(
            `${backendURL}/checksubscription/${channelID}/${user?.email}`
          );
          const { message } = await response.json();
          if (message === true) {
            setIsSubscribed(true);
          } else {
            setIsSubscribed(false);
          }
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    return () => checkSubscription();
  }, []);

  //POST REQUESTS

  const updateViews = async (id) => {
    try {
      const response = await fetch(`${backendURL}/updateview/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      await response.json();
    } catch (error) {
      // console.log(error.message);
    }
  };

  const SubscribeChannel = async (
    youtuberName,
    youtuberProfile,
    youtubeChannelID
  ) => {
    try {
      const channelData = {
        youtuberName,
        youtuberProfile,
        youtubeChannelID,
      };
      if (userEmail && user?.email) {
        const response = await fetch(
          `${backendURL}/subscribe/${channelID}/${user?.email}/${userEmail}`,
          {
            method: "POST",
            body: JSON.stringify(channelData),
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await response.json();
        if (data === "Subscribed") {
          setIsSubscribed(true);
        } else {
          setIsSubscribed(false);
        }
      }
    } catch (error) {
      // console.log(error.message);
    }
  };

  if (
    searchedVideoData.length === 1 &&
    searchedVideoData[0].visibility === "Private"
  ) {
    return (
      <>
        <Navbar />
        <LeftPanel />
        <div className="searched-content">
          <img src={nothing} alt="no results" className="nothing-found" />
          <p className={theme ? "no-results" : "no-results text-light-mode"}>
            No results found!
          </p>
        </div>
      </>
    );
  } else if (
    searchedChannelData &&
    searchedChannelData.length > 0 &&
    !searchedVideoData
  ) {
    return (
      <>
        <Navbar />
        <LeftPanel />
        <SkeletonTheme
          baseColor={theme ? "#353535" : "#aaaaaa"}
          highlightColor={theme ? "#444" : "#b6b6b6"}
        >
          <div
            className="searched-content"
            style={{
              top:
                searchedChannelData && searchedChannelData.length > 0
                  ? "200px"
                  : "130px",
              display: loading === true ? "block" : "none",
            }}
          >
            <div className="searched-channels-section">
              {searchedChannelData &&
                searchedChannelData.length > 0 &&
                searchedChannelData.map((element, index) => {
                  return (
                    <div
                      className={
                        theme
                          ? "search-channel"
                          : "search-channel text-light-mode"
                      }
                      key={index}
                    >
                      <Skeleton
                        count={1}
                        width={130}
                        height={130}
                        style={{ borderRadius: "100%" }}
                        className="sk-search-dp"
                      />
                      <div className="channel-flex-data">
                        <div className="channel-extra-content">
                          <div className="channel-liner">
                            <Skeleton
                              count={1}
                              width={300}
                              height={18}
                              className="sk-search-channel-name"
                            />
                          </div>

                          <div className="channel-liner">
                            <Skeleton
                              count={1}
                              width={150}
                              height={18}
                              style={{ position: "relative", top: "4px" }}
                              className="sk-search-channel-extra"
                            />
                          </div>
                        </div>
                        <div className="subscribe-btnss">
                          <Skeleton
                            count={1}
                            width={120}
                            height={35}
                            style={{ borderRadius: "20px" }}
                            className="sk-search-button"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <hr
              className={
                theme ? "seperate sep2" : "seperate sep2 seperate-light"
              }
            />
            <div className="thischannel-videos-section">
              {searchedChannelData &&
                searchedChannelData.length > 0 &&
                userVideos &&
                userVideos.length > 0 &&
                userVideos.map((index) => {
                  return (
                    <>
                      <div className="sk-thischannel-all-data" key={index}>
                        <Skeleton
                          count={1}
                          width={350}
                          height={197}
                          style={{ borderRadius: "12px" }}
                          className="sk-search-thumbnail"
                        />

                        <div
                          className="sk-thischannel-video-data"
                          style={{
                            position: "relative",
                            left: "20px",
                            top: "4px",
                          }}
                        >
                          <Skeleton
                            count={1}
                            width={420}
                            height={18}
                            className="sk-search-title"
                          />

                          <div
                            className={
                              theme
                                ? "thisvideo-onliner"
                                : "thisvideo-onliner text-light-mode2"
                            }
                          >
                            <Skeleton
                              count={1}
                              width={180}
                              height={18}
                              className="sk-search-videodata"
                            />
                          </div>
                          <div
                            className={
                              theme
                                ? "thisvideo-channel"
                                : "thisvideo-channel text-light-mode2"
                            }
                          >
                            <Skeleton
                              count={1}
                              width={30}
                              height={30}
                              style={{ borderRadius: "100%" }}
                              className="sk-search-channeldp"
                            />

                            <Skeleton
                              count={1}
                              width={180}
                              height={18}
                              style={{ position: "relative", left: "8px" }}
                              className="sk-search-videodata2"
                            />
                          </div>
                          <Skeleton
                            count={3}
                            width={220}
                            height={10}
                            style={{ position: "relative", top: "10px" }}
                            className="sk-search-videodata3"
                          />
                        </div>
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
        </SkeletonTheme>

        <div
          className="searched-content"
          style={{
            top:
              searchedChannelData && searchedChannelData.length > 0
                ? "200px"
                : "130px",
            display: loading === true ? "none" : "block",
            visibility: loading === true ? "hidden" : "visible",
          }}
        >
          <div className="searched-channels-section">
            {searchedChannelData &&
              searchedChannelData.length > 0 &&
              searchedChannelData.map((element, index) => {
                return (
                  <div
                    className={
                      theme
                        ? "search-channel"
                        : "search-channel text-light-mode"
                    }
                    key={index}
                  >
                    <img
                      src={element.channelProfile}
                      alt="channelDP"
                      className="channel-img"
                      onClick={() =>
                        (window.location.href = `/channel/${element._id}`)
                      }
                    />
                    <div className="channel-flex-data">
                      <div
                        className="channel-extra-content"
                        onClick={() =>
                          (window.location.href = `/channel/${element._id}`)
                        }
                      >
                        <div className="channel-liner">
                          <p className="new-title">{element.channelName}</p>
                          <Tooltip
                            TransitionComponent={Zoom}
                            title="Verified"
                            placement="top"
                          >
                            <CheckCircleIcon
                              fontSize="100px"
                              style={{
                                color: "rgb(138, 138, 138)",
                                marginLeft: "4px",
                              }}
                              className="channelVerify"
                            />
                          </Tooltip>
                        </div>

                        <div className="channel-liner">
                          <p
                            className={
                              theme ? "new-email" : "new-email text-light-mode2"
                            }
                          >
                            {userEmail && "@" + userEmail.split("@")[0]}
                          </p>
                          <p
                            className={
                              theme ? "new-subs" : "new-subs text-light-mode2"
                            }
                          >
                            {element.subscribers} subscribers
                          </p>
                        </div>
                        <p
                          className={
                            theme
                              ? "new-desc search-desc"
                              : "new-desc search-desc text-light-mode2"
                          }
                        >
                          {" "}
                          {element.channelDescription.length <= 100
                            ? element.channelDescription
                            : `${element.channelDescription.slice(0, 100)}...`}
                        </p>
                      </div>
                      <div className="subscribe-btnss">
                        {user?.email === userEmail ? (
                          ""
                        ) : (
                          <>
                            <button
                              className={
                                theme
                                  ? "subscribethis-channel"
                                  : "subscribethis-channel-light text-dark-mode"
                              }
                              style={
                                isSubscribed === true
                                  ? { display: "none" }
                                  : { display: "block" }
                              }
                              onClick={() => {
                                if (user?.email) {
                                  SubscribeChannel(
                                    element.channelName,
                                    element.channelProfile,
                                    element._id
                                  );
                                  SubscribeNotify();
                                } else {
                                  setisbtnClicked(true);
                                  document.body.classList.add("bg-css");
                                }
                              }}
                            >
                              Subscribe
                            </button>
                            <button
                              className={
                                theme
                                  ? "subscribethis-channel2"
                                  : "subscribethis-channel2-light"
                              }
                              style={
                                isSubscribed === true
                                  ? { display: "block" }
                                  : { display: "none" }
                              }
                              onClick={() => {
                                if (user?.email) {
                                  SubscribeChannel(
                                    element.channelName,
                                    element.channelProfile,
                                    element._id
                                  );
                                } else {
                                  setisbtnClicked(true);
                                  document.body.classList.add("bg-css");
                                }
                              }}
                            >
                              Subscribed
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            <hr
              className={
                theme ? "seperate sep2" : "seperate sep2 seperate-light"
              }
            />
          </div>
          <div className="thischannel-videos-section">
            <p
              style={
                userVideos.message === "USER DOESN'T EXIST" || loading === true
                  ? { visibility: "hidden", display: "none" }
                  : { display: "block", position: "relative", bottom: "20px" }
              }
            >
              Latest from{" "}
              {searchedChannelData && searchedChannelData[0].channelName}
            </p>
            {searchedChannelData &&
              searchedChannelData.length > 0 &&
              userVideos &&
              userVideos.length > 0 &&
              userVideos.map((element, index) => {
                return (
                  <>
                    <div
                      className="thischannel-all-data"
                      key={index}
                      onClick={() => {
                        if (user?.email) {
                          updateViews(element._id);
                          setTimeout(() => {
                            window.location.href = `/video/${element._id}`;
                          }, 400);
                        } else {
                          window.location.href = `/video/${element._id}`;
                        }
                      }}
                    >
                      <img
                        src={element.thumbnailURL}
                        alt="thumbnail"
                        className="thischannel-thumbnail search-ka-thumbnail"
                      />
                      <p className="thisvideo-duration">
                        {Math.floor(element.videoLength / 60) +
                          ":" +
                          (Math.round(element.videoLength % 60) < 10
                            ? "0" + Math.round(element.videoLength % 60)
                            : Math.round(element.videoLength % 60))}
                      </p>
                      <div className="thischannel-video-data">
                        <p
                          className={
                            theme
                              ? "thisvideo-title"
                              : "thisvideo-title text-light-mode"
                          }
                        >
                          {window.innerWidth <= 1200 ? (
                            <p>
                              {element.Title.length <= 50
                                ? element.Title
                                : `${element.Title.slice(0, 50)}..`}
                            </p>
                          ) : (
                            <p>{element.Title}</p>
                          )}
                        </p>
                        <div
                          className={
                            theme
                              ? "thisvideo-onliner"
                              : "thisvideo-onliner text-light-mode2"
                          }
                        >
                          <p className="thisvideo-views">
                            {element.views >= 1e9
                              ? `${(element.views / 1e9).toFixed(1)}B`
                              : element.views >= 1e6
                              ? `${(element.views / 1e6).toFixed(1)}M`
                              : element.views >= 1e3
                              ? `${(element.views / 1e3).toFixed(1)}K`
                              : element.views}{" "}
                            views
                          </p>
                          <p className="thisvideo-uploaded-date">
                            &#x2022;{" "}
                            {(() => {
                              const timeDifference =
                                new Date() - new Date(element.uploaded_date);
                              const minutes = Math.floor(
                                timeDifference / 60000
                              );
                              const hours = Math.floor(
                                timeDifference / 3600000
                              );
                              const days = Math.floor(
                                timeDifference / 86400000
                              );
                              const weeks = Math.floor(
                                timeDifference / 604800000
                              );
                              const years = Math.floor(
                                timeDifference / 31536000000
                              );

                              if (minutes < 1) {
                                return "just now";
                              } else if (minutes < 60) {
                                return `${minutes} mins ago`;
                              } else if (hours < 24) {
                                return `${hours} hours ago`;
                              } else if (days < 7) {
                                return `${days} days ago`;
                              } else if (weeks < 52) {
                                return `${weeks} weeks ago`;
                              } else {
                                return `${years} years ago`;
                              }
                            })()}
                          </p>
                        </div>
                        <div
                          className={
                            theme
                              ? "thisvideo-channel"
                              : "thisvideo-channel text-light-mode2"
                          }
                        >
                          <img
                            src={element.ChannelProfile}
                            alt="profile"
                            className="thischannelDP"
                          />
                          <p className="thischannel-name">{element.uploader}</p>
                          <Tooltip
                            TransitionComponent={Zoom}
                            title="Verified"
                            placement="top"
                          >
                            <CheckCircleIcon
                              fontSize="100px"
                              style={{
                                color: "rgb(138, 138, 138)",
                                marginLeft: "6px",
                              }}
                              className="channelVerify"
                            />
                          </Tooltip>
                        </div>
                        {window.innerWidth <= 970 ? (
                          <p
                            className={
                              theme
                                ? "thisvideo-desc"
                                : "thisvideo-desc text-light-mode2"
                            }
                          >
                            {element.Description.length <= 50
                              ? element.Description
                              : `${element.Description.slice(0, 50)}...`}
                          </p>
                        ) : (
                          <p
                            className={
                              theme
                                ? "thisvideo-desc"
                                : "thisvideo-desc text-light-mode2"
                            }
                          >
                            {element.Description.length <= 120
                              ? element.Description
                              : `${element.Description.slice(0, 120)}...`}
                          </p>
                        )}
                      </div>
                      <div className="thischannel-video-data-new">
                        <img
                          src={element.ChannelProfile}
                          alt="profile"
                          className="thischannelDP"
                        />
                        <div className="new-channel-data-right">
                          <div className="thisvideos-top-right">
                            <p
                              className={
                                theme
                                  ? "thisvideo-title"
                                  : "thisvideo-title text-light-mode"
                              }
                            >
                              {window.innerWidth <= 1200 ? (
                                <p>
                                  {element.Title.length <= 50
                                    ? element.Title
                                    : `${element.Title.slice(0, 50)}..`}
                                </p>
                              ) : (
                                <p>{element.Title}</p>
                              )}
                            </p>
                          </div>
                          <div className="thisvideos-bottom-right">
                            <div
                              className={
                                theme
                                  ? "thisvideo-onliner"
                                  : "thisvideo-onliner text-light-mode2"
                              }
                            >
                              <p className="thischannel-name">
                                {element.uploader}
                              </p>
                              <Tooltip
                                TransitionComponent={Zoom}
                                title="Verified"
                                placement="top"
                              >
                                <CheckCircleIcon
                                  fontSize="100px"
                                  style={{
                                    color: "rgb(138, 138, 138)",
                                    marginLeft: "6px",
                                    marginRight: "6px",
                                  }}
                                  className="channelVerify"
                                />
                              </Tooltip>
                              &#x2022;
                              <p className="thisvideo-views">
                                {element.views >= 1e9
                                  ? `${(element.views / 1e9).toFixed(1)}B`
                                  : element.views >= 1e6
                                  ? `${(element.views / 1e6).toFixed(1)}M`
                                  : element.views >= 1e3
                                  ? `${(element.views / 1e3).toFixed(1)}K`
                                  : element.views}{" "}
                                views
                              </p>
                              <p className="thisvideo-uploaded-date">
                                &#x2022;{" "}
                                {(() => {
                                  const timeDifference =
                                    new Date() -
                                    new Date(element.uploaded_date);
                                  const minutes = Math.floor(
                                    timeDifference / 60000
                                  );
                                  const hours = Math.floor(
                                    timeDifference / 3600000
                                  );
                                  const days = Math.floor(
                                    timeDifference / 86400000
                                  );
                                  const weeks = Math.floor(
                                    timeDifference / 604800000
                                  );
                                  const years = Math.floor(
                                    timeDifference / 31536000000
                                  );

                                  if (minutes < 1) {
                                    return "just now";
                                  } else if (minutes < 60) {
                                    return `${minutes} mins ago`;
                                  } else if (hours < 24) {
                                    return `${hours} hours ago`;
                                  } else if (days < 7) {
                                    return `${days} days ago`;
                                  } else if (weeks < 52) {
                                    return `${weeks} weeks ago`;
                                  } else {
                                    return `${years} years ago`;
                                  }
                                })()}
                              </p>
                            </div>
                          </div>
                        </div>

                        {window.innerWidth <= 970 ? (
                          <p
                            className={
                              theme
                                ? "thisvideo-desc"
                                : "thisvideo-desc text-light-mode2"
                            }
                          >
                            {element.Description.length <= 50
                              ? element.Description
                              : `${element.Description.slice(0, 50)}...`}
                          </p>
                        ) : (
                          <p
                            className={
                              theme
                                ? "thisvideo-desc"
                                : "thisvideo-desc text-light-mode2"
                            }
                          >
                            {element.Description.length <= 120
                              ? element.Description
                              : `${element.Description.slice(0, 120)}...`}
                          </p>
                        )}
                      </div>
                    </div>
                  </>
                );
              })}
          </div>
        </div>
        {/* SIGNUP/SIGNIN  */}

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
            style={
              isSwitch === true ? { display: "block" } : { display: "none" }
            }
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
      </>
    );
  } else if (
    searchedVideoData &&
    searchedVideoData.length > 0 &&
    !searchedChannelData
  ) {
    return (
      <>
        <Navbar />
        <LeftPanel />
        <SkeletonTheme
          baseColor={theme ? "#353535" : "#aaaaaa"}
          highlightColor={theme ? "#444" : "#b6b6b6"}
        >
          <div
            className="searched-content"
            style={{
              top:
                searchedChannelData && searchedChannelData.length > 0
                  ? "200px"
                  : "130px",
              display: loading === true ? "block" : "none",
            }}
          >
            <div className="searched-videos-section">
              {searchedVideoData &&
                searchedVideoData.length > 0 &&
                searchedVideoData.map((element, index) => {
                  return (
                    <>
                      <div
                        className="sk-thischannel-all-data"
                        style={{
                          display:
                            element.visibility === "Public" ? "flex" : "none",
                        }}
                        key={index}
                      >
                        <Skeleton
                          count={1}
                          width={350}
                          height={197}
                          style={{ borderRadius: "12px" }}
                          className="sk-search-thumbnail"
                        />

                        <div
                          className="sk-thischannel-video-data"
                          style={{
                            position: "relative",
                            left: "20px",
                            top: "4px",
                          }}
                        >
                          <Skeleton
                            count={1}
                            width={420}
                            height={18}
                            className="sk-search-title"
                          />

                          <div
                            className={
                              theme
                                ? "thisvideo-onliner"
                                : "thisvideo-onliner text-light-mode2"
                            }
                          >
                            <Skeleton
                              count={1}
                              width={180}
                              height={18}
                              className="sk-search-videodata"
                            />
                          </div>
                          <div
                            className={
                              theme
                                ? "thisvideo-channel"
                                : "thisvideo-channel text-light-mode2"
                            }
                          >
                            <Skeleton
                              count={1}
                              width={30}
                              height={30}
                              style={{ borderRadius: "100%" }}
                              className="sk-search-channeldp"
                            />

                            <Skeleton
                              count={1}
                              width={180}
                              height={18}
                              style={{ position: "relative", left: "8px" }}
                              className="sk-search-videodata2"
                            />
                          </div>
                          <Skeleton
                            count={3}
                            width={220}
                            height={10}
                            style={{ position: "relative", top: "10px" }}
                            className="sk-search-videodata3"
                          />
                        </div>
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
        </SkeletonTheme>
        <div
          className="searched-content"
          style={{
            top:
              searchedChannelData && searchedChannelData.length > 0
                ? "200px"
                : "130px",
            display: loading === true ? "none" : "block",
            visibility: loading === true ? "hidden" : "visible",
          }}
        >
          <div className="searched-videos-section">
            {searchedVideoData &&
              searchedVideoData.length > 0 &&
              searchedVideoData.map((element, index) => {
                <hr
                  className={
                    theme ? "seperate sep2" : "seperate sep2 seperate-light"
                  }
                />;
                return (
                  <div
                    className="searched-video-alldata"
                    key={index}
                    style={{
                      display:
                        element.visibility === "Public" ? "flex" : "none",
                    }}
                    onClick={() => {
                      if (user?.email) {
                        updateViews(element._id);
                        setTimeout(() => {
                          window.location.href = `/video/${element._id}`;
                        }, 400);
                      } else {
                        window.location.href = `/video/${element._id}`;
                      }
                    }}
                  >
                    <img
                      src={element.thumbnailURL}
                      alt="thumbnail"
                      className="thischannel-thumbnail search-ka-thumbnail"
                    />
                    <p className="thisvideo-duration">
                      {Math.floor(element.videoLength / 60) +
                        ":" +
                        (Math.round(element.videoLength % 60) < 10
                          ? "0" + Math.round(element.videoLength % 60)
                          : Math.round(element.videoLength % 60))}
                    </p>
                    <div className="thischannel-video-data">
                      <p
                        className={
                          theme
                            ? "thisvideo-title"
                            : "thisvideo-title text-light-mode"
                        }
                      >
                        {window.innerWidth <= 1200 ? (
                          <p>
                            {element.Title.length <= 50
                              ? element.Title
                              : `${element.Title.slice(0, 50)}..`}
                          </p>
                        ) : (
                          <p>{element.Title}</p>
                        )}
                      </p>
                      <div
                        className={
                          theme
                            ? "thisvideo-onliner"
                            : "thisvideo-onliner text-light-mode2"
                        }
                      >
                        <p className="thisvideo-views">
                          {element.views >= 1e9
                            ? `${(element.views / 1e9).toFixed(1)}B`
                            : element.views >= 1e6
                            ? `${(element.views / 1e6).toFixed(1)}M`
                            : element.views >= 1e3
                            ? `${(element.views / 1e3).toFixed(1)}K`
                            : element.views}{" "}
                          views
                        </p>
                        <p className="thisvideo-uploaded-date">
                          &#x2022;{" "}
                          {(() => {
                            const timeDifference =
                              new Date() - new Date(element.uploaded_date);
                            const minutes = Math.floor(timeDifference / 60000);
                            const hours = Math.floor(timeDifference / 3600000);
                            const days = Math.floor(timeDifference / 86400000);
                            const weeks = Math.floor(
                              timeDifference / 604800000
                            );
                            const years = Math.floor(
                              timeDifference / 31536000000
                            );

                            if (minutes < 1) {
                              return "just now";
                            } else if (minutes < 60) {
                              return `${minutes} mins ago`;
                            } else if (hours < 24) {
                              return `${hours} hours ago`;
                            } else if (days < 7) {
                              return `${days} days ago`;
                            } else if (weeks < 52) {
                              return `${weeks} weeks ago`;
                            } else {
                              return `${years} years ago`;
                            }
                          })()}
                        </p>
                      </div>
                      <div
                        className={
                          theme
                            ? "thisvideo-channel"
                            : "thisvideo-channel text-light-mode2"
                        }
                      >
                        <img
                          src={element.ChannelProfile}
                          alt="profile"
                          className="thischannelDP"
                        />
                        <p className="thischannel-name">{element.uploader}</p>
                        <Tooltip
                          TransitionComponent={Zoom}
                          title="Verified"
                          placement="top"
                        >
                          <CheckCircleIcon
                            fontSize="100px"
                            style={{
                              color: "rgb(138, 138, 138)",
                              marginLeft: "6px",
                            }}
                            className="channelVerify"
                          />
                        </Tooltip>
                      </div>
                      {window.innerWidth <= 970 ? (
                        <p
                          className={
                            theme
                              ? "thisvideo-desc"
                              : "thisvideo-desc text-light-mode2"
                          }
                        >
                          {element.Description.length <= 50
                            ? element.Description
                            : `${element.Description.slice(0, 50)}...`}
                        </p>
                      ) : (
                        <p
                          className={
                            theme
                              ? "thisvideo-desc"
                              : "thisvideo-desc text-light-mode2"
                          }
                        >
                          {element.Description.length <= 120
                            ? element.Description
                            : `${element.Description.slice(0, 120)}...`}
                        </p>
                      )}
                    </div>
                    <div className="thischannel-video-data-new">
                      <img
                        src={element.ChannelProfile}
                        alt="profile"
                        className="thischannelDP"
                      />
                      <div className="new-channel-data-right">
                        <div className="thisvideos-top-right">
                          <p
                            className={
                              theme
                                ? "thisvideo-title"
                                : "thisvideo-title text-light-mode"
                            }
                          >
                            {window.innerWidth <= 1200 ? (
                              <p>
                                {element.Title.length <= 50
                                  ? element.Title
                                  : `${element.Title.slice(0, 50)}..`}
                              </p>
                            ) : (
                              <p>{element.Title}</p>
                            )}
                          </p>
                        </div>
                        <div className="thisvideos-bottom-right">
                          <div
                            className={
                              theme
                                ? "thisvideo-onliner"
                                : "thisvideo-onliner text-light-mode2"
                            }
                          >
                            <p className="thischannel-name">
                              {element.uploader}
                            </p>
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Verified"
                              placement="top"
                            >
                              <CheckCircleIcon
                                fontSize="100px"
                                style={{
                                  color: "rgb(138, 138, 138)",
                                  marginLeft: "6px",
                                  marginRight: "6px",
                                }}
                                className="channelVerify"
                              />
                            </Tooltip>
                            &#x2022;
                            <p className="thisvideo-views">
                              {element.views >= 1e9
                                ? `${(element.views / 1e9).toFixed(1)}B`
                                : element.views >= 1e6
                                ? `${(element.views / 1e6).toFixed(1)}M`
                                : element.views >= 1e3
                                ? `${(element.views / 1e3).toFixed(1)}K`
                                : element.views}{" "}
                              views
                            </p>
                            <p className="thisvideo-uploaded-date">
                              &#x2022;{" "}
                              {(() => {
                                const timeDifference =
                                  new Date() - new Date(element.uploaded_date);
                                const minutes = Math.floor(
                                  timeDifference / 60000
                                );
                                const hours = Math.floor(
                                  timeDifference / 3600000
                                );
                                const days = Math.floor(
                                  timeDifference / 86400000
                                );
                                const weeks = Math.floor(
                                  timeDifference / 604800000
                                );
                                const years = Math.floor(
                                  timeDifference / 31536000000
                                );

                                if (minutes < 1) {
                                  return "just now";
                                } else if (minutes < 60) {
                                  return `${minutes} mins ago`;
                                } else if (hours < 24) {
                                  return `${hours} hours ago`;
                                } else if (days < 7) {
                                  return `${days} days ago`;
                                } else if (weeks < 52) {
                                  return `${weeks} weeks ago`;
                                } else {
                                  return `${years} years ago`;
                                }
                              })()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {window.innerWidth <= 970 ? (
                        <p
                          className={
                            theme
                              ? "thisvideo-desc"
                              : "thisvideo-desc text-light-mode2"
                          }
                        >
                          {element.Description.length <= 50
                            ? element.Description
                            : `${element.Description.slice(0, 50)}...`}
                        </p>
                      ) : (
                        <p
                          className={
                            theme
                              ? "thisvideo-desc"
                              : "thisvideo-desc text-light-mode2"
                          }
                        >
                          {element.Description.length <= 120
                            ? element.Description
                            : `${element.Description.slice(0, 120)}...`}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </>
    );
  } else if (
    searchedChannelData &&
    searchedChannelData.length > 0 &&
    searchedChannelData !== "NO DATA" &&
    searchedVideoData &&
    searchedVideoData !== "NO DATA" &&
    searchedVideoData.length > 0
  ) {
    return (
      <>
        <Navbar />
        <LeftPanel />

        {/* EDIT HERE  */}
        <SkeletonTheme
          baseColor={theme ? "#353535" : "#aaaaaa"}
          highlightColor={theme ? "#444" : "#b6b6b6"}
        >
          <div
            className="searched-content"
            style={{
              top:
                searchedChannelData && searchedChannelData.length > 0
                  ? "200px"
                  : "130px",
              display: loading === true ? "block" : "none",
            }}
          >
            <div className="searched-channels-section">
              {searchedChannelData &&
                searchedChannelData.length > 0 &&
                searchedChannelData.map((element, index) => {
                  return (
                    <div
                      className={
                        theme
                          ? "search-channel"
                          : "search-channel text-light-mode"
                      }
                      key={index}
                    >
                      <Skeleton
                        count={1}
                        width={130}
                        height={130}
                        style={{ borderRadius: "100%" }}
                        className="sk-search-dp"
                      />
                      <div className="channel-flex-data">
                        <div className="channel-extra-content">
                          <div className="channel-liner">
                            <Skeleton
                              count={1}
                              width={300}
                              height={18}
                              className="sk-search-channel-name"
                            />
                          </div>

                          <div className="channel-liner">
                            <Skeleton
                              count={1}
                              width={150}
                              height={18}
                              style={{ position: "relative", top: "4px" }}
                              className="sk-search-channel-extra"
                            />
                          </div>
                        </div>
                        <div className="subscribe-btnss">
                          <Skeleton
                            count={1}
                            width={120}
                            height={35}
                            style={{ borderRadius: "20px" }}
                            className="sk-search-button"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              <hr
                className={
                  theme ? "seperate sep2" : "seperate sep2 seperate-light"
                }
              />
            </div>
            <div className="searched-videos-section">
              {searchedVideoData &&
                searchedVideoData.length > 0 &&
                searchedVideoData.map((element, index) => {
                  <hr
                    className={
                      theme ? "seperate sep2" : "seperate sep2 seperate-light"
                    }
                  />;
                  return (
                    <div
                      className="sk-thischannel-all-data"
                      key={index}
                      style={{
                        display:
                          element.visibility === "Public" ? "flex" : "none",
                      }}
                    >
                      <Skeleton
                        count={1}
                        width={350}
                        height={197}
                        style={{ borderRadius: "12px" }}
                        className="sk-search-thumbnail"
                      />

                      <div
                        className="sk-thischannel-video-data"
                        style={{
                          position: "relative",
                          left: "20px",
                          top: "4px",
                        }}
                      >
                        <Skeleton
                          count={1}
                          width={420}
                          height={18}
                          className="sk-search-title"
                        />

                        <div
                          className={
                            theme
                              ? "thisvideo-onliner"
                              : "thisvideo-onliner text-light-mode2"
                          }
                        >
                          <Skeleton
                            count={1}
                            width={180}
                            height={18}
                            className="sk-search-videodata"
                          />
                        </div>
                        <div
                          className={
                            theme
                              ? "thisvideo-channel"
                              : "thisvideo-channel text-light-mode2"
                          }
                        >
                          <Skeleton
                            count={1}
                            width={30}
                            height={30}
                            style={{ borderRadius: "100%" }}
                            className="sk-search-channeldp"
                          />

                          <Skeleton
                            count={1}
                            width={180}
                            height={18}
                            style={{ position: "relative", left: "8px" }}
                            className="sk-search-videodata2"
                          />
                        </div>
                        <Skeleton
                          count={3}
                          width={220}
                          height={10}
                          style={{ position: "relative", top: "10px" }}
                          className="sk-search-videodata3"
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </SkeletonTheme>
        {/* STOP HERE  */}

        <div
          className="searched-content"
          style={{
            top:
              searchedChannelData && searchedChannelData.length > 0
                ? "200px"
                : "130px",
            visibility: loading === true ? "hidden" : "visible",
            display: loading === true ? "none" : "block",
          }}
        >
          <div className="searched-channels-section">
            {searchedChannelData &&
              searchedChannelData.length > 0 &&
              searchedChannelData.map((element, index) => {
                return (
                  <div
                    className={
                      theme
                        ? "search-channel"
                        : "search-channel text-light-mode"
                    }
                    key={index}
                  >
                    <img
                      src={element.channelProfile}
                      alt="channelDP"
                      className="channel-img"
                      onClick={() =>
                        (window.location.href = `/channel/${element._id}`)
                      }
                    />
                    <div className="channel-flex-data">
                      <div
                        className="channel-extra-content"
                        onClick={() =>
                          (window.location.href = `/channel/${element._id}`)
                        }
                      >
                        <div className="channel-liner">
                          <p className="new-title">{element.channelName}</p>
                          <Tooltip
                            TransitionComponent={Zoom}
                            title="Verified"
                            placement="top"
                          >
                            <CheckCircleIcon
                              fontSize="100px"
                              style={{
                                color: "rgb(138, 138, 138)",
                                marginLeft: "4px",
                              }}
                              className="channelVerify"
                            />
                          </Tooltip>
                        </div>

                        <div className="channel-liner">
                          <p
                            className={
                              theme ? "new-email" : "new-email text-light-mode2"
                            }
                          >
                            {userEmail && "@" + userEmail.split("@")[0]}
                          </p>
                          <p
                            className={
                              theme ? "new-subs" : "new-subs text-light-mode2"
                            }
                          >
                            {element.subscribers} subscribers
                          </p>
                        </div>
                        <p
                          className={
                            theme
                              ? "new-desc search-desc"
                              : "new-desc search-desc text-light-mode2"
                          }
                        >
                          {" "}
                          {element.channelDescription.length <= 100
                            ? element.channelDescription
                            : `${element.channelDescription.slice(0, 100)}...`}
                        </p>
                      </div>
                      <div className="subscribe-btnss">
                        {user?.email === userEmail ? (
                          ""
                        ) : (
                          <>
                            <button
                              className={
                                theme
                                  ? "subscribethis-channel"
                                  : "subscribethis-channel-light text-dark-mode"
                              }
                              style={
                                isSubscribed === true
                                  ? { display: "none" }
                                  : { display: "block" }
                              }
                              onClick={() => {
                                if (user?.email) {
                                  SubscribeChannel(
                                    element.channelName,
                                    element.channelProfile,
                                    element._id
                                  );
                                  SubscribeNotify();
                                } else {
                                  setisbtnClicked(true);
                                  document.body.classList.add("bg-css");
                                }
                              }}
                            >
                              Subscribe
                            </button>
                            <button
                              className={
                                theme
                                  ? "subscribethis-channel2"
                                  : "subscribethis-channel2-light"
                              }
                              style={
                                isSubscribed === true
                                  ? { display: "block" }
                                  : { display: "none" }
                              }
                              onClick={() => {
                                if (user?.email) {
                                  SubscribeChannel(
                                    element.channelName,
                                    element.channelProfile,
                                    element._id
                                  );
                                } else {
                                  setisbtnClicked(true);
                                  document.body.classList.add("bg-css");
                                }
                              }}
                            >
                              Subscribed
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            <hr
              className={
                theme ? "seperate sep2" : "seperate sep2 seperate-light"
              }
            />
          </div>
          <div className="searched-videos-section">
            {searchedVideoData &&
              searchedVideoData.length > 0 &&
              searchedVideoData.map((element, index) => {
                <hr
                  className={
                    theme ? "seperate sep2" : "seperate sep2 seperate-light"
                  }
                />;
                return (
                  <div
                    className="searched-video-alldata"
                    key={index}
                    style={{
                      display:
                        element.visibility === "Public" ? "flex" : "none",
                    }}
                    onClick={() => {
                      if (user?.email) {
                        updateViews(element._id);
                        setTimeout(() => {
                          window.location.href = `/video/${element._id}`;
                        }, 400);
                      } else {
                        window.location.href = `/video/${element._id}`;
                      }
                    }}
                  >
                    <img
                      src={element.thumbnailURL}
                      alt="thumbnail"
                      className="thischannel-thumbnail search-ka-thumbnail"
                    />
                    <p className="thisvideo-duration">
                      {Math.floor(element.videoLength / 60) +
                        ":" +
                        (Math.round(element.videoLength % 60) < 10
                          ? "0" + Math.round(element.videoLength % 60)
                          : Math.round(element.videoLength % 60))}
                    </p>
                    <div className="thischannel-video-data">
                      <p
                        className={
                          theme
                            ? "thisvideo-title"
                            : "thisvideo-title text-light-mode"
                        }
                      >
                        {window.innerWidth <= 1200 ? (
                          <p>
                            {element.Title.length <= 50
                              ? element.Title
                              : `${element.Title.slice(0, 50)}..`}
                          </p>
                        ) : (
                          <p>{element.Title}</p>
                        )}
                      </p>
                      <div
                        className={
                          theme
                            ? "thisvideo-onliner"
                            : "thisvideo-onliner text-light-mode2"
                        }
                      >
                        <p className="thisvideo-views">
                          {element.views >= 1e9
                            ? `${(element.views / 1e9).toFixed(1)}B`
                            : element.views >= 1e6
                            ? `${(element.views / 1e6).toFixed(1)}M`
                            : element.views >= 1e3
                            ? `${(element.views / 1e3).toFixed(1)}K`
                            : element.views}{" "}
                          views
                        </p>
                        <p className="thisvideo-uploaded-date">
                          &#x2022;{" "}
                          {(() => {
                            const timeDifference =
                              new Date() - new Date(element.uploaded_date);
                            const minutes = Math.floor(timeDifference / 60000);
                            const hours = Math.floor(timeDifference / 3600000);
                            const days = Math.floor(timeDifference / 86400000);
                            const weeks = Math.floor(
                              timeDifference / 604800000
                            );
                            const years = Math.floor(
                              timeDifference / 31536000000
                            );

                            if (minutes < 1) {
                              return "just now";
                            } else if (minutes < 60) {
                              return `${minutes} mins ago`;
                            } else if (hours < 24) {
                              return `${hours} hours ago`;
                            } else if (days < 7) {
                              return `${days} days ago`;
                            } else if (weeks < 52) {
                              return `${weeks} weeks ago`;
                            } else {
                              return `${years} years ago`;
                            }
                          })()}
                        </p>
                      </div>
                      <div
                        className={
                          theme
                            ? "thisvideo-channel"
                            : "thisvideo-channel text-light-mode2"
                        }
                      >
                        <img
                          src={element.ChannelProfile}
                          alt="profile"
                          className="thischannelDP"
                        />
                        <p className="thischannel-name">{element.uploader}</p>
                        <Tooltip
                          TransitionComponent={Zoom}
                          title="Verified"
                          placement="top"
                        >
                          <CheckCircleIcon
                            fontSize="100px"
                            style={{
                              color: "rgb(138, 138, 138)",
                              marginLeft: "6px",
                            }}
                            className="channelVerify"
                          />
                        </Tooltip>
                      </div>
                      {window.innerWidth <= 970 ? (
                        <p
                          className={
                            theme
                              ? "thisvideo-desc"
                              : "thisvideo-desc text-light-mode2"
                          }
                        >
                          {element.Description.length <= 50
                            ? element.Description
                            : `${element.Description.slice(0, 50)}...`}
                        </p>
                      ) : (
                        <p
                          className={
                            theme
                              ? "thisvideo-desc"
                              : "thisvideo-desc text-light-mode2"
                          }
                        >
                          {element.Description.length <= 120
                            ? element.Description
                            : `${element.Description.slice(0, 120)}...`}
                        </p>
                      )}
                    </div>
                    <div className="thischannel-video-data-new">
                      <img
                        src={element.ChannelProfile}
                        alt="profile"
                        className="thischannelDP"
                      />
                      <div className="new-channel-data-right">
                        <div className="thisvideos-top-right">
                          <p
                            className={
                              theme
                                ? "thisvideo-title"
                                : "thisvideo-title text-light-mode"
                            }
                          >
                            {window.innerWidth <= 1200 ? (
                              <p>
                                {element.Title.length <= 50
                                  ? element.Title
                                  : `${element.Title.slice(0, 50)}..`}
                              </p>
                            ) : (
                              <p>{element.Title}</p>
                            )}
                          </p>
                        </div>
                        <div className="thisvideos-bottom-right">
                          <div
                            className={
                              theme
                                ? "thisvideo-onliner"
                                : "thisvideo-onliner text-light-mode2"
                            }
                          >
                            <p className="thischannel-name">
                              {element.uploader}
                            </p>
                            <Tooltip
                              TransitionComponent={Zoom}
                              title="Verified"
                              placement="top"
                            >
                              <CheckCircleIcon
                                fontSize="100px"
                                style={{
                                  color: "rgb(138, 138, 138)",
                                  marginLeft: "6px",
                                  marginRight: "6px",
                                }}
                                className="channelVerify"
                              />
                            </Tooltip>
                            &#x2022;
                            <p className="thisvideo-views">
                              {element.views >= 1e9
                                ? `${(element.views / 1e9).toFixed(1)}B`
                                : element.views >= 1e6
                                ? `${(element.views / 1e6).toFixed(1)}M`
                                : element.views >= 1e3
                                ? `${(element.views / 1e3).toFixed(1)}K`
                                : element.views}{" "}
                              views
                            </p>
                            <p className="thisvideo-uploaded-date">
                              &#x2022;{" "}
                              {(() => {
                                const timeDifference =
                                  new Date() - new Date(element.uploaded_date);
                                const minutes = Math.floor(
                                  timeDifference / 60000
                                );
                                const hours = Math.floor(
                                  timeDifference / 3600000
                                );
                                const days = Math.floor(
                                  timeDifference / 86400000
                                );
                                const weeks = Math.floor(
                                  timeDifference / 604800000
                                );
                                const years = Math.floor(
                                  timeDifference / 31536000000
                                );

                                if (minutes < 1) {
                                  return "just now";
                                } else if (minutes < 60) {
                                  return `${minutes} mins ago`;
                                } else if (hours < 24) {
                                  return `${hours} hours ago`;
                                } else if (days < 7) {
                                  return `${days} days ago`;
                                } else if (weeks < 52) {
                                  return `${weeks} weeks ago`;
                                } else {
                                  return `${years} years ago`;
                                }
                              })()}
                            </p>
                          </div>
                        </div>
                      </div>

                      {window.innerWidth <= 970 ? (
                        <p
                          className={
                            theme
                              ? "thisvideo-desc"
                              : "thisvideo-desc text-light-mode2"
                          }
                        >
                          {element.Description.length <= 50
                            ? element.Description
                            : `${element.Description.slice(0, 50)}...`}
                        </p>
                      ) : (
                        <p
                          className={
                            theme
                              ? "thisvideo-desc"
                              : "thisvideo-desc text-light-mode2"
                          }
                        >
                          {element.Description.length <= 120
                            ? element.Description
                            : `${element.Description.slice(0, 120)}...`}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </>
    );
  } else if (
    searchedChannelData === "NO DATA" ||
    searchedChannelData === "" ||
    searchedVideoData === "NO DATA" ||
    searchedVideoData === ""
  ) {
    return (
      <>
        <Navbar />
        <LeftPanel />
        <div className="searched-content">
          <img src={nothing} alt="no results" className="nothing-found" />
          <p className={theme ? "no-results" : "no-results text-light-mode"}>
            No results found!
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <LeftPanel />
      <div className="main-trending-section">
        <div className="spin23" style={{ top: "200px" }}>
          <span className={theme ? "loader2" : "loader2-light"}></span>
        </div>
      </div>
    </>
  );
}

export default SearchResults;
