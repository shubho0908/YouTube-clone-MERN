import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import "../Css/subscriptions.css";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import nothing from "../img/nothing.png";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReactLoading from "react-loading";
import { useNavigate } from "react-router-dom";

function Subscriptions() {
  const [email, setEmail] = useState();
  const [subscriptions, setSubscriptions] = useState([]);
  const [subsVideos, setSubsVideos] = useState([]);
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });

  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setEmail(jwtDecode(token).email);
  }, []);

  useEffect(() => {
    localStorage.setItem("menuClicked", JSON.stringify(menuClicked));
  }, [menuClicked]);

  useEffect(() => {
    const getSubscriptions = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getsubscriptions/${email}`
        );
        const result = await response.json();
        setSubscriptions(result);
      } catch (error) {
        console.log(error.message);
      }
    };
    const interval = setInterval(getSubscriptions, 100);

    return () => clearInterval(interval);
  }, [email]);

  useEffect(() => {
    const getUserMail = async () => {
      try {
        if (subscriptions && subscriptions.length > 0) {
          const newSubsVideos = [];
          for (const element of subscriptions) {
            const response = await fetch(
              `http://localhost:3000/getotherchannel/${element.channelID}`
            );
            const userEmail = await response.json();
            const response2 = await fetch(
              `http://localhost:3000/getuservideos/${userEmail}`
            );
            const myvideos = await response2.json();
            newSubsVideos.push(...myvideos);
          }
          setSubsVideos(newSubsVideos);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
  
    const interval = setInterval(getUserMail, 200);
  
    return () => clearInterval(interval);
  }, [subscriptions]);
  

  useEffect(() => {
    const handleMenuButtonClick = () => {
      setMenuClicked((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".menu");
    menuButton.addEventListener("click", handleMenuButtonClick);

    return () => {
      menuButton.removeEventListener("click", handleMenuButtonClick);
    };
  }, []);

  //UPDATE VIEWS

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

  if (subscriptions.subscribedData === "NO DATA") {
    return (
      <>
        <Navbar />
        <LeftPanel />
        <div className="searched-content">
          <img src={nothing} alt="no results" className="nothing-found" />
          <p className="no-results">No subscriptions found!</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <LeftPanel />
      {subsVideos.length > 0 ? (
        <div
          className="subscription-content"
          style={menuClicked === false ? { left: "150px" } : { left: "300px" }}
        >
          <div className="subscribed-channels">
            <p className="main-txxt">Channels</p>
            <div className="channels-full-list">
            {subscriptions.length > 0 &&
              subscriptions.map((element, index) => {
                return (
                  <div
                    className="sub-channels"
                    key={index}
                    onClick={() => {
                      navigate(`/channel/${element.channelID}`);
                      window.location.reload();
                    }}
                  >
                    <img
                      src={element.channelProfile}
                      alt="channelDP"
                      className="sub-channelDP"
                    />
                    <p className="sub-channelname">{element.channelname}</p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="subscribed-videos">
            <p className="main-txxt">Videos</p>
            <div className="subs-videos-all">
              {subsVideos.length > 0 &&
                subsVideos.map((element, index) => {
                  return (
                    <div
                      className="subs-video-data"
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
                        className="sub-thumbnail"
                      />
                      <p className="duration durationn2">
                        {Math.floor(element.videoLength / 60) +
                          ":" +
                          (Math.round(element.videoLength % 60) < 10
                            ? "0" + Math.round(element.videoLength % 60)
                            : Math.round(element.videoLength % 60))}
                      </p>

                      <div className="channel-basic-data">
                        <div className="channel-pic">
                          <img
                            className="channel-profile"
                            src={element.ChannelProfile}
                            alt="channel-profile"
                          />
                        </div>
                        <div className="channel-text-data">
                          <p className="title" style={{ marginTop: "10px" }}>
                            {element.Title}
                          </p>
                          <div className="video-uploader">
                            <p
                              className="uploader"
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
                                  marginLeft: "4px",
                                }}
                              />
                            </Tooltip>
                          </div>
                          <div className="view-time">
                            <p className="views">
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
                              className="upload-time"
                              style={{ marginLeft: "4px" }}
                            >
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
                    </div>
                  );
                })}
            </div>
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

export default Subscriptions;
