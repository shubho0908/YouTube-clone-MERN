import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import { useNavigate } from "react-router-dom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import jwtDecode from "jwt-decode";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { useState, useEffect } from "react";
import "../Css/library.css";

function Library() {
  const [watchlater, setWatchLater] = useState([]);
  const navigate = useNavigate();
  const [email, setEmail] = useState();
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    setEmail(jwtDecode(token).email);
  }, [token]);

  useEffect(() => {
    const getWatchLater = async () => {
      try {
        if (email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getwatchlater/${email}`
          );
          const savedData = await response.json();
          setWatchLater(savedData);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getWatchLater, 100);

    return () => clearInterval(interval);
  }, [email]);

  const watchLaterArray =
    watchlater && watchlater.length > 0
      ? watchlater.slice(0, 4) // Get the first four elements if available
      : [];

  return (
    <>
      <Navbar />
      <LeftPanel />
      <div className="library-section">
        <div className="watchlater-library">
          <div className="top-watchlater-library">
            <WatchLaterOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>Watch later</p>
            <p>{watchlater && watchlater.length}</p>
            {watchLaterArray && watchLaterArray.length >= 4 ? (
              <p className="see-all">See all</p>
            ) : (
              ""
            )}
          </div>
          <div className="watchlater-library-videos">
            {watchLaterArray &&
              watchLaterArray.map((element, index) => {
                return (
                  <div className="thiswatchlater-videoss" key={index}>
                    <img
                      src={element.thumbnailURL}
                      alt="thumbnail"
                      className="thiswatch-thumbnail"
                    />
                    <p className="thislibrary-duration">
                      {Math.floor(element.videoLength / 60) +
                        ":" +
                        (Math.round(element.videoLength % 60) < 10
                          ? "0" + Math.round(element.videoLength % 60)
                          : Math.round(element.videoLength % 60))}
                    </p>
                    <div className="thislibrary-video-details">
                      <p>
                        {element.Title && element.Title.length <= 46
                          ? element.Title
                          : `${element.Title.slice(0, 46)}..`}
                      </p>
                      <div className="thisvideo-extra-daataa">
                        <div className="thisvide-oneliner-1">
                          <p>{element.uploader}</p>
                          <Tooltip
                            TransitionComponent={Zoom}
                            title="Verified"
                            placement="right"
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
                        <div className="thisvide-oneliner-2">
                          <p>
                            {element.views >= 1e9
                              ? `${(element.views / 1e9).toFixed(1)}B`
                              : element.views >= 1e6
                              ? `${(element.views / 1e6).toFixed(1)}M`
                              : element.views >= 1e3
                              ? `${(element.views / 1e3).toFixed(1)}K`
                              : element.views}{" "}
                            views
                          </p>
                          <p className="thisvideo-uploaddate">
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
        <hr className="seperate" />
        <div className="playlists-library"></div>
        <hr className="seperate" />

        <div className="likedvideos-library"></div>
      </div>
    </>
  );
}

export default Library;
