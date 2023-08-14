import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Css/search.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import jwtDecode from "jwt-decode";
import Signup from "./Signup";
import Signin from "./Signin";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import nothing from "../img/nothing.png";
import Zoom from "@mui/material/Zoom";

function SearchResults() {
  const { data } = useParams();
  const [myemail, setmyEmail] = useState();
  const [searchedVideoData, setsearchedVideoData] = useState([]);
  const [searchedChannelData, setsearchedChannelData] = useState([]);
  const [channelID, setChannelID] = useState();
  const [userEmail, setUserEmail] = useState();
  const [isbtnClicked, setisbtnClicked] = useState(false);
  const [isSwitch, setisSwitched] = useState(false);
  const [userVideos, setUserVideos] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3500);
  }, []);

  document.title = data && data !== undefined ? `${data} - YouTube` : "YouTube";

  const token = localStorage.getItem("userToken");

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setmyEmail(jwtDecode(token).email);
    }
  }, [token]);

  useEffect(() => {
    const getSearchResult = async () => {
      try {
        const response = await fetch(`http://localhost:3000/search/${data}`);
        const Data = await response.json();
        const { videoData, channelData } = Data;
        setsearchedVideoData(videoData);
        setsearchedChannelData(channelData);
      } catch (error) {
        console.log(error.message);
      }
    };
    getSearchResult();
  }, [data, searchedChannelData, searchedVideoData]);

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
    const getOtherChannel = async () => {
      try {
        if (channelID !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getotherchannel/${channelID}`
          );
          const userEmail = await response.json();
          setUserEmail(userEmail);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getOtherChannel, 200);

    return () => clearInterval(interval);
  }, [channelID]);

  useEffect(() => {
    const getUserVideos = async () => {
      try {
        if (userEmail !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getuservideos/${userEmail}`
          );

          const myvideos = await response.json();
          setUserVideos(myvideos);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getUserVideos();
  }, [userEmail]);

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        if (myemail !== undefined && channelID !== undefined) {
          const response = await fetch(
            `http://localhost:3000/checksubscription/${channelID}/${myemail}`
          );
          const { existingChannelID } = await response.json();
          if (existingChannelID !== undefined) {
            setIsSubscribed(true);
          } else {
            setIsSubscribed(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(checkSubscription, 100);

    return () => clearInterval(interval);
  }, [channelID, myemail]);

  //POST REQUESTS

  const updateViews = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/updateview/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      await response.json();
    } catch (error) {
      console.log(error.message);
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
      const response = await fetch(
        `http://localhost:3000/subscribe/${channelID}/${myemail}/${userEmail}`,
        {
          method: "POST",
          body: JSON.stringify(channelData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
    } catch (error) {
      console.log(error.message);
    }
  };

  if (
    searchedChannelData &&
    searchedChannelData.length > 0 &&
    !searchedVideoData
  ) {
    return (
      <>
        <Navbar />
        <LeftPanel />
        <SkeletonTheme baseColor="#353535" highlightColor="#444">
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
              <hr
                className="seperate sep2"
                style={
                  searchedChannelData && searchedChannelData.length > 0
                    ? { display: "block" }
                    : { display: "none" }
                }
              />
              {searchedChannelData &&
                searchedChannelData.length > 0 &&
                searchedChannelData.map((element, index) => {
                  return (
                    <div className="search-channel" key={index}>
                      <Skeleton
                        count={1}
                        width={130}
                        height={130}
                        style={{ borderRadius: "100%" }}
                      />
                      <div className="channel-extra-content">
                        <div className="channel-liner">
                          <Skeleton count={1} width={300} height={18} />
                        </div>

                        <div className="channel-liner">
                          <Skeleton
                            count={1}
                            width={150}
                            height={18}
                            style={{ position: "relative", top: "4px" }}
                          />
                        </div>
                        <div className="new-desc">
                          <Skeleton
                            count={1}
                            width={550}
                            height={18}
                            style={{ position: "relative", top: "8px" }}
                          />
                        </div>
                      </div>
                      <div className="subscribe-btnss">
                        <Skeleton
                          count={1}
                          width={120}
                          height={35}
                          style={{ borderRadius: "20px" }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
            <hr className="seperate sep2" />
            <div className="thischannel-videos-section">
              {searchedChannelData &&
                searchedChannelData.length > 0 &&
                userVideos &&
                userVideos.map((index) => {
                  return (
                    <>
                      <div className="thischannel-all-data" key={index}>
                        <Skeleton
                          count={1}
                          width={350}
                          height={197}
                          style={{ borderRadius: "12px" }}
                        />

                        <div
                          className="thischannel-video-data"
                          style={{
                            position: "relative",
                            left: "20px",
                            top: "4px",
                          }}
                        >
                          <Skeleton count={1} width={420} height={18} />

                          <div className="thisvideo-onliner">
                            <Skeleton count={1} width={180} height={18} />
                          </div>
                          <div className="thisvideo-channel">
                            <Skeleton
                              count={1}
                              width={30}
                              height={30}
                              style={{ borderRadius: "100%" }}
                            />

                            <Skeleton
                              count={1}
                              width={180}
                              height={18}
                              style={{ position: "relative", left: "8px" }}
                            />
                          </div>
                          <Skeleton
                            count={3}
                            width={220}
                            height={10}
                            style={{ position: "relative", top: "10px" }}
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
            <hr
              className="seperate sep2"
              style={
                searchedChannelData && searchedChannelData.length > 0
                  ? { display: "block" }
                  : { display: "none" }
              }
            />

            {searchedChannelData &&
              searchedChannelData.length > 0 &&
              searchedChannelData.map((element, index) => {
                return (
                  <div className="search-channel" key={index}>
                    <img
                      src={element.channelProfile}
                      alt="channelDP"
                      className="channel-img"
                      onClick={() => navigate(`/channel/${element._id}`)}
                    />
                    <div
                      className="channel-extra-content"
                      onClick={() => navigate(`/channel/${element._id}`)}
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
                          />
                        </Tooltip>
                      </div>

                      <div className="channel-liner">
                        <p className="new-email">
                          {userEmail && "@" + userEmail.split("@")[0]}
                        </p>
                        <p className="new-subs">
                          {element.subscribers} subscribers
                        </p>
                      </div>
                      <p className="new-desc">
                        {" "}
                        {element.channelDescription.length <= 100
                          ? element.channelDescription
                          : `${element.channelDescription.slice(0, 100)}...`}
                      </p>
                    </div>
                    <div className="subscribe-btnss">
                      {myemail === userEmail ? (
                        ""
                      ) : (
                        <>
                          <button
                            className="subscribethis-channel"
                            style={
                              isSubscribed === true
                                ? { display: "none" }
                                : { display: "block" }
                            }
                            onClick={() => {
                              if (token) {
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
                            Subscribe
                          </button>
                          <button
                            className="subscribethis-channel2"
                            style={
                              isSubscribed === true
                                ? { display: "block" }
                                : { display: "none" }
                            }
                            onClick={() => {
                              if (token) {
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
                );
              })}
            <hr className="seperate sep2" />
          </div>
          <div className="thischannel-videos-section">
            <p
              style={
                loading === true
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
              userVideos.map((element, index) => {
                return (
                  <>
                    <div
                      className="thischannel-all-data"
                      key={index}
                      onClick={() => {
                        if (token) {
                          updateViews(element._id);
                          setTimeout(() => {
                            navigate(`/video/${element._id}`);
                            window.location.reload();
                          }, 400);
                        } else {
                          navigate(`/video/${element._id}`);
                          window.location.reload();
                        }
                      }}
                    >
                      <img
                        src={element.thumbnailURL}
                        alt="thumbnail"
                        className="thischannel-thumbnail"
                      />
                      <p className="thisvideo-duration">
                        {Math.floor(element.videoLength / 60) +
                          ":" +
                          (Math.round(element.videoLength % 60) < 10
                            ? "0" + Math.round(element.videoLength % 60)
                            : Math.round(element.videoLength % 60))}
                      </p>
                      <div className="thischannel-video-data">
                        <p className="thisvideo-title">{element.Title}</p>
                        <div className="thisvideo-onliner">
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
                        <div className="thisvideo-channel">
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
                            />
                          </Tooltip>
                        </div>
                        <p className="thisvideo-desc">
                          {element.Description.length <= 120
                            ? element.Description
                            : `${element.Description.slice(0, 120)}...`}
                        </p>
                      </div>
                    </div>
                  </>
                );
              })}
          </div>
        </div>
        {/* SIGNUP/SIGNIN  */}

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
        <SkeletonTheme baseColor="#353535" highlightColor="#444">
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
            <hr className="seperate sep2" />
            <div className="searched-videos-section">
              {searchedVideoData &&
                searchedVideoData.length > 0 &&
                searchedVideoData.map((index) => {
                  return (
                    <>
                      <div className="thischannel-all-data" key={index}>
                        <Skeleton
                          count={1}
                          width={350}
                          height={197}
                          style={{ borderRadius: "12px" }}
                        />

                        <div
                          className="thischannel-video-data"
                          style={{
                            position: "relative",
                            left: "20px",
                            top: "4px",
                          }}
                        >
                          <Skeleton count={1} width={420} height={18} />

                          <div className="thisvideo-onliner">
                            <Skeleton count={1} width={180} height={18} />
                          </div>
                          <div className="thisvideo-channel">
                            <Skeleton
                              count={1}
                              width={30}
                              height={30}
                              style={{ borderRadius: "100%" }}
                            />

                            <Skeleton
                              count={1}
                              width={180}
                              height={18}
                              style={{ position: "relative", left: "8px" }}
                            />
                          </div>
                          <Skeleton
                            count={3}
                            width={220}
                            height={10}
                            style={{ position: "relative", top: "10px" }}
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
          <hr className="seperate sep2" />
          <div className="searched-videos-section">
            {searchedVideoData &&
              searchedVideoData.length > 0 &&
              searchedVideoData.map((element, index) => {
                <hr className="seperate sep2" />;
                return (
                  <div
                    className="searched-video-alldata"
                    key={index}
                    onClick={() => {
                      if (token) {
                        updateViews(element._id);
                        setTimeout(() => {
                          navigate(`/video/${element._id}`);
                          window.location.reload();
                        }, 400);
                      } else {
                        navigate(`/video/${element._id}`);
                        window.location.reload();
                      }
                    }}
                  >
                    <img
                      src={element.thumbnailURL}
                      alt="thumbnail"
                      className="thischannel-thumbnail"
                    />
                    <p className="thisvideo-duration">
                      {Math.floor(element.videoLength / 60) +
                        ":" +
                        (Math.round(element.videoLength % 60) < 10
                          ? "0" + Math.round(element.videoLength % 60)
                          : Math.round(element.videoLength % 60))}
                    </p>
                    <div className="thischannel-video-data">
                      <p className="thisvideo-title">{element.Title}</p>
                      <div className="thisvideo-onliner">
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
                      <div className="thisvideo-channel">
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
                          />
                        </Tooltip>
                      </div>
                      <p className="thisvideo-desc">
                        {element.Description.length <= 120
                          ? element.Description
                          : `${element.Description.slice(0, 120)}...`}
                      </p>
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
        <SkeletonTheme baseColor="#353535" highlightColor="#444">
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
              <hr
                className="seperate sep2"
                style={
                  searchedChannelData && searchedChannelData.length > 0
                    ? { display: "block" }
                    : { display: "none" }
                }
              />

              {searchedChannelData &&
                searchedChannelData.length > 0 &&
                searchedChannelData.map((element, index) => {
                  return (
                    <div className="search-channel" key={index}>
                      <Skeleton
                        count={1}
                        width={130}
                        height={130}
                        style={{ borderRadius: "100%" }}
                      />
                      <div className="channel-extra-content">
                        <div className="channel-liner">
                          <Skeleton count={1} width={300} height={18} />
                        </div>

                        <div className="channel-liner">
                          <Skeleton
                            count={1}
                            width={150}
                            height={18}
                            style={{ position: "relative", top: "4px" }}
                          />
                        </div>
                        <div className="new-desc">
                          <Skeleton
                            count={1}
                            width={550}
                            height={18}
                            style={{ position: "relative", top: "8px" }}
                          />
                        </div>
                      </div>
                      <div className="subscribe-btnss">
                        <Skeleton
                          count={1}
                          width={120}
                          height={35}
                          style={{ borderRadius: "20px" }}
                        />
                      </div>
                    </div>
                  );
                })}
              <hr className="seperate sep2" />
            </div>
            <div className="searched-videos-section">
              {searchedVideoData &&
                searchedVideoData.length > 0 &&
                searchedVideoData.map((element, index) => {
                  <hr className="seperate sep2" />;
                  return (
                    <div className="thischannel-all-data" key={index}>
                      <Skeleton
                        count={1}
                        width={350}
                        height={197}
                        style={{ borderRadius: "12px" }}
                      />

                      <div
                        className="thischannel-video-data"
                        style={{
                          position: "relative",
                          left: "20px",
                          top: "4px",
                        }}
                      >
                        <Skeleton count={1} width={420} height={18} />

                        <div className="thisvideo-onliner">
                          <Skeleton count={1} width={180} height={18} />
                        </div>
                        <div className="thisvideo-channel">
                          <Skeleton
                            count={1}
                            width={30}
                            height={30}
                            style={{ borderRadius: "100%" }}
                          />

                          <Skeleton
                            count={1}
                            width={180}
                            height={18}
                            style={{ position: "relative", left: "8px" }}
                          />
                        </div>
                        <Skeleton
                          count={3}
                          width={220}
                          height={10}
                          style={{ position: "relative", top: "10px" }}
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
            <hr
              className="seperate sep2"
              style={
                searchedChannelData && searchedChannelData.length > 0
                  ? { display: "block" }
                  : { display: "none" }
              }
            />

            {searchedChannelData &&
              searchedChannelData.length > 0 &&
              searchedChannelData.map((element, index) => {
                return (
                  <div className="search-channel" key={index}>
                    <img
                      src={element.channelProfile}
                      alt="channelDP"
                      className="channel-img"
                      onClick={() => navigate(`/channel/${element._id}`)}
                    />
                    <div
                      className="channel-extra-content"
                      onClick={() => navigate(`/channel/${element._id}`)}
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
                          />
                        </Tooltip>
                      </div>

                      <div className="channel-liner">
                        <p className="new-email">
                          {userEmail && "@" + userEmail.split("@")[0]}
                        </p>
                        <p className="new-subs">
                          {element.subscribers} subscribers
                        </p>
                      </div>
                      <p className="new-desc">
                        {" "}
                        {element.channelDescription.length <= 100
                          ? element.channelDescription
                          : `${element.channelDescription.slice(0, 100)}...`}
                      </p>
                    </div>
                    <div className="subscribe-btnss">
                      {myemail === userEmail ? (
                        ""
                      ) : (
                        <>
                          <button
                            className="subscribethis-channel"
                            style={
                              isSubscribed === true
                                ? { display: "none" }
                                : { display: "block" }
                            }
                            onClick={() =>
                              SubscribeChannel(
                                element.channelName,
                                element.channelProfile,
                                element._id
                              )
                            }
                          >
                            Subscribe
                          </button>
                          <button
                            className="subscribethis-channel2"
                            style={
                              isSubscribed === true
                                ? { display: "block" }
                                : { display: "none" }
                            }
                            onClick={() =>
                              SubscribeChannel(
                                element.channelName,
                                element.channelProfile,
                                element._id
                              )
                            }
                          >
                            Subscribed
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            <hr className="seperate sep2" />
          </div>
          <div className="searched-videos-section">
            {searchedVideoData &&
              searchedVideoData.length > 0 &&
              searchedVideoData.map((element, index) => {
                <hr className="seperate sep2" />;
                return (
                  <div
                    className="searched-video-alldata"
                    key={index}
                    onClick={() => {
                      if (token) {
                        updateViews(element._id);
                        setTimeout(() => {
                          navigate(`/video/${element._id}`);
                          window.location.reload();
                        }, 400);
                      } else {
                        navigate(`/video/${element._id}`);
                        window.location.reload();
                      }
                    }}
                  >
                    <img
                      src={element.thumbnailURL}
                      alt="thumbnail"
                      className="thischannel-thumbnail"
                    />
                    <p className="thisvideo-duration">
                      {Math.floor(element.videoLength / 60) +
                        ":" +
                        (Math.round(element.videoLength % 60) < 10
                          ? "0" + Math.round(element.videoLength % 60)
                          : Math.round(element.videoLength % 60))}
                    </p>
                    <div className="thischannel-video-data">
                      <p className="thisvideo-title">{element.Title}</p>
                      <div className="thisvideo-onliner">
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
                      <div className="thisvideo-channel">
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
                          />
                        </Tooltip>
                      </div>
                      <p className="thisvideo-desc">
                        {element.Description.length <= 120
                          ? element.Description
                          : `${element.Description.slice(0, 120)}...`}
                      </p>
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
          <p className="no-results">No results found!</p>
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
          <span className="loader"></span>
        </div>
      </div>
    </>
  );
}

export default SearchResults;
