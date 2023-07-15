import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../Css/search.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import ReactLoading from "react-loading";
import jwtDecode from "jwt-decode";
import nothing from "../img/nothing.png"
import Zoom from "@mui/material/Zoom";

function SearchResults() {
  const { data } = useParams();
  const [myemail, setmyEmail] = useState();
  const [searchedVideoData, setsearchedVideoData] = useState([]);
  const [searchedChannelData, setsearchedChannelData] = useState([]);
  const [channelID, setChannelID] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userVideos, setUserVideos] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState();

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
      {!searchedChannelData || !searchedVideoData ? (
        <div
          className="searched-content"
          style={
            searchedChannelData && searchedChannelData.length > 0
              ? { top: "200px" }
              : { top: "130px" }
          }
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
                        {element.channelDescription.length <= 140
                          ? element.channelDescription
                          : `${element.channelDescription.slice(0, 140)}...`}
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
          <div className="thischannel-videos-section">
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
                        navigate(`/video/${element._id}`);
                        window.location.reload();
                        if (token) {
                          updateViews(element._id);
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
          <div className="searched-videos-section">
            {searchedVideoData &&
              searchedVideoData.length > 0 &&
              searchedVideoData.map((element, index) => {
                <hr className="seperate sep2" />;
                return (
                  <div className="searched-video-alldata" key={index}>
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
      ) : (
        <div className="main-trending-section">
          <div className="spin2" style={{ height: "auto" }}>
            <ReactLoading
              type={"spin"}
              color={"white"}
              height={50}
              width={50}
            />
            <p style={{ marginTop: "15px" }}>
              Fetching the data, Hang tight...{" "}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchResults;
