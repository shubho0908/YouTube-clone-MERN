import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import { useEffect, useState } from "react";
import "../Css/subscriptions.css";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import nothing from "../img/nothing.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSelector } from "react-redux";

function Subscriptions() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app";
  // const backendURL = "http://localhost:3000";
  const [subscriptions, setSubscriptions] = useState([]);
  const [subsVideos, setSubsVideos] = useState([]);
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  document.title = "Subscriptions - YouTube";
  const User = useSelector((state) => state.user.user);
  const { user } = User;

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    localStorage.setItem("menuClicked", JSON.stringify(menuClicked));
  }, [menuClicked]);

  useEffect(() => {
    const getSubscriptions = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getsubscriptions/${user?.email}`
          );
          const result = await response.json();
          setSubscriptions(result);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };
   getSubscriptions();
  }, [user?.email]);

  useEffect(() => {
    const getUserMail = async () => {
      try {
        if (subscriptions && subscriptions.length > 0) {
          const newSubsVideos = [];
          for (const element of subscriptions) {
            const response = await fetch(
              `${backendURL}/getotherchannel/${element.channelID}`
            );
            const userEmail = await response.json();
            const response2 = await fetch(
              `${backendURL}/getuservideos/${userEmail}`
            );
            const myvideos = await response2.json();

            // Make sure myvideos is an array before using spread syntax
            if (Array.isArray(myvideos)) {
              newSubsVideos.push(...myvideos);
            } else {
              // console.log("myvideos is not an array:", myvideos);
            }
          }
          setSubsVideos(newSubsVideos);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    getUserMail();
  }, [subscriptions]);

  useEffect(() => {
    const handleMenuButtonClick = () => {
      setMenuClicked((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".menu");
    if (menuButton) {
      menuButton.addEventListener("click", handleMenuButtonClick);
    }

    return () => {
      if (menuButton) {
        menuButton.removeEventListener("click", handleMenuButtonClick);
      }
    };
  }, []);

  useEffect(() => {
    const handleMenuButtonClick = () => {
      setMenuClicked((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".menu-light");
    if (menuButton) {
      menuButton.addEventListener("click", handleMenuButtonClick);
    }

    return () => {
      if (menuButton) {
        menuButton.removeEventListener("click", handleMenuButtonClick);
      }
    };
  }, []);

  useEffect(() => {
    if (theme === false && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "white";
    } else if (theme === true && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "0f0f0f";
    }
  }, [theme]);

  //UPDATE VIEWS

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

  if (subscriptions.subscribedData === "NO DATA") {
    return (
      <>
        <Navbar />
        <LeftPanel />
        <div className="searched-content">
          <img src={nothing} alt="no results" className="nothing-found" />
          <p className={theme ? "no-results" : "no-results text-light-mode"}>
            No subscriptions found!
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <LeftPanel />
      <div className="subscription-content">
        <div
          className="all-subs-dataaa"
          style={
            menuClicked === false
              ? { left: "150px", width: "85%" }
              : { left: "300px", width: "76%" }
          }
        >
          <div className="subscribed-channels">
            <p className={theme ? "main-txxt" : "main-txxt text-light-mode"}>
              Channels
            </p>
            <SkeletonTheme
              baseColor={theme ? "#353535" : "#aaaaaa"}
              highlightColor={theme ? "#444" : "#b6b6b6"}
            >
              <div
                className="channels-full-list"
                style={
                  loading === true ? { display: "flex" } : { display: "none" }
                }
              >
                {subscriptions.length > 0 &&
                  subscriptions.map((element, index) => {
                    return (
                      <div
                        className={theme ? "sub-channels" : "sub-channels2"}
                        key={index}
                      >
                        <Skeleton
                          count={1}
                          width={100}
                          height={100}
                          style={{ borderRadius: "100%" }}
                          className="sk-channelDP"
                        />
                        <Skeleton
                          count={1}
                          width={120}
                          height={22}
                          style={{ position: "relative", top: "20px" }}
                          className="sk-channelname"
                        />
                      </div>
                    );
                  })}
              </div>
              <div
                className="subscribed-videos sk-subs"
                style={
                  loading === true
                    ? { display: "block", position: "relative", top: "20px" }
                    : { display: "none" }
                }
              >
                <p
                  className={theme ? "main-txxt" : "main-txxt text-light-mode"}
                >
                  Videos
                </p>

                <div className="subs-videos-all">
                  {Array.from({ length: 10 }).map(() => (
                    <>
                      <div
                        className="subs-video-data"
                        style={
                          loading === true
                            ? { display: "block" }
                            : { display: "none" }
                        }
                      >
                        <Skeleton
                          count={1}
                          width={300}
                          height={169}
                          style={{ borderRadius: "12px" }}
                          className="sk-channelvid"
                        />
                        <div className="channel-basic-data2">
                          <Skeleton
                            count={1}
                            width={40}
                            height={40}
                            style={{
                              borderRadius: "100%",
                              marginTop: "40px",
                            }}
                            className="sk-thisvid-img"
                          />
                          <Skeleton
                            count={2}
                            width={220}
                            height={15}
                            style={{
                              position: "relative",
                              top: "40px",
                              left: "15px",
                            }}
                            className="sk-thisvid-title"
                          />
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </SkeletonTheme>
            <div
              className="channels-full-list"
              style={
                loading === true
                  ? { visibility: "hidden", display: "none" }
                  : { visibility: "visible", display: "flex" }
              }
            >
              {subscriptions.length > 0 &&
                subscriptions.map((element, index) => {
                  return (
                    <div
                      className={theme ? "sub-channels" : "sub-channels2"}
                      key={index}
                      onClick={() => {
                        window.location.href = `/channel/${element.channelID}`;
                      }}
                    >
                      <img
                        src={element.channelProfile}
                        alt="channelDP"
                        className="sub-channelDP"
                      />
                      <p
                        className={
                          theme
                            ? "sub-channelname"
                            : "sub-channelname text-light-mode"
                        }
                      >
                        {element.channelname}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
          <div
            className="subscribed-videos"
            style={
              loading === true
                ? { visibility: "hidden", display: "none" }
                : { visibility: "visible", display: "block" }
            }
          >
            <p className={theme ? "main-txxt" : "main-txxt text-light-mode"}>
              Videos
            </p>

            <div className="subs-videos-all">
              {subsVideos.length > 0 &&
                subsVideos.map((element, index) => {
                  return (
                    <>
                      <div
                        className="subs-video-data"
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
                        style={{
                          visibility: loading ? "hidden" : "visible",
                          display:
                            element.visibility === "Public" ? "block" : "none",
                        }}
                      >
                        <img
                          src={element.thumbnailURL}
                          alt="thumbnail"
                          className="sub-thumbnail"
                        />
                        <p className="durationn2">
                          {Math.floor(element.videoLength / 60) +
                            ":" +
                            (Math.round(element.videoLength % 60) < 10
                              ? "0" + Math.round(element.videoLength % 60)
                              : Math.round(element.videoLength % 60))}
                        </p>

                        <div className="channel-basic-data2">
                          <div className="channel-pic2">
                            <img
                              className="channel-profile2"
                              src={element.ChannelProfile}
                              alt="channel-profile"
                            />
                          </div>
                          <div
                            className={
                              theme
                                ? "channel-text-data2"
                                : "channel-text-data2 text-light-mode"
                            }
                          >
                            <p
                              className="title2"
                              style={{ marginTop: "10px", width: "88%" }}
                            >
                              {element.Title.length <= 50
                                ? element.Title
                                : `${element.Title.slice(0, 50)}..`}
                            </p>
                            <div className="video-uploader2">
                              <p
                                className={
                                  theme
                                    ? "uploader2"
                                    : "uploader2 text-light-mode2"
                                }
                                style={{ marginTop: "10px" }}
                              >
                                {element.uploader}
                              </p>
                              <Tooltip
                                TransitionComponent={Zoom}
                                title="Verified"
                                placement="right"
                              >
                                <CheckCircleIcon
                                  fontSize="100px"
                                  style={{
                                    color: "rgb(138, 138, 138)",
                                    marginTop: "8px",
                                    marginLeft: "5px",
                                  }}
                                />
                              </Tooltip>
                            </div>
                            <div
                              className={
                                theme
                                  ? "view-time23"
                                  : "view-time23 text-light-mode2"
                              }
                            >
                              <p className="views2">
                                {element.views >= 1e9
                                  ? `${(element.views / 1e9).toFixed(1)}B`
                                  : element.views >= 1e6
                                  ? `${(element.views / 1e6).toFixed(1)}M`
                                  : element.views >= 1e3
                                  ? `${(element.views / 1e3).toFixed(1)}K`
                                  : element.views}{" "}
                                views
                              </p>
                              <p
                                className="upload-time2"
                                style={{ marginLeft: "5px" }}
                              >
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
                      </div>
                    </>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Subscriptions;
