import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import "../Css/browse.css";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

function Browse() {
  const [videos, setVideos] = useState("");
  const [thumbnails, setThumbnails] = useState();
  const [Titles, setTitles] = useState();
  const [uploader, setUploader] = useState();
  const [ProfilePic, setProfilePic] = useState();
  const [duration, setDuration] = useState();
  const [menuClicked, setMenuClicked] = useState(false);

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

  const Tags = [
    "All",
    "Music",
    "Tutorial",
    "Vlog",
    "Gaming",
    "Comedy",
    "Beauty",
    "Travel",
    "Food",
    "Fashion",
    "Tutorial",
    "Vlog",
    "Gaming",
    "Comedy",
    "Beauty",
    "Travel",
    "Food",
    "Fashion",
    "Travel",
    "Food",
    "Fashion",
    "Tutorial",
    "Vlog",
    "Gaming",
    "Comedy",
    "Beauty",
    "Travel",
    "Food",
    "Fashion",
  ];

  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = async () => {
    try {
      const response = await fetch("http://localhost:3000/getvideos");
      const { videoURLs, thumbnailURLs, titles, Uploader, Profile, Duration } =
        await response.json();
      setVideos(videoURLs);
      setThumbnails(thumbnailURLs);
      setTitles(titles);
      setUploader(Uploader);
      setProfilePic(Profile);
      setDuration(Duration);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="browse">
        <LeftPanel />
        <div
          className="browse-data"
          style={
            menuClicked ? { left: "80px", width: "100%" } : { left: "250px" }
          }
        >
          <div className="popular-categories">
            {Tags.map((element, index) => {
              return (
                <div className={`top-tags tag-${index}`} key={index}>
                  <p>{element}</p>
                </div>
              );
            })}
          </div>
          {thumbnails ? (
            <div
              className="video-section"
              style={{
                ...(thumbnails ? { height: "auto" } : { height: "100vh" }),
                ...(menuClicked === true
                  ? { marginLeft: "40px" }
                  : { marginLeft: "80px" }),
              }}
            >
              <div
                className="uploaded-videos"
                style={
                  menuClicked === true
                    ? { paddingRight: "50px" }
                    : { paddingRight: "0px" }
                }
              >
                {thumbnails &&
                  thumbnails.map((element, index) => {
                    return (
                      <div className="video-data" key={index}>
                        <img
                          style={{ width: "330px", borderRadius: "10px" }}
                          src={element}
                          alt="temp"
                        />
                        <p className="duration">
                          {Math.floor(duration[index] / 60) +
                            ":" +
                            (Math.round(duration[index] % 60) < 10
                              ? "0" + Math.round(duration[index] % 60)
                              : Math.round(duration[index] % 60))}
                        </p>

                        <div className="channel-basic-data">
                          <div className="channel-pic">
                            <img
                              className="channel-profile"
                              src={ProfilePic[index]}
                              alt="channel-profile"
                            />
                          </div>
                          <div className="channel-text-data">
                            <p className="title" style={{ marginTop: "10px" }}>
                              {Titles[index]}
                            </p>
                            <div className="video-uploader">
                              <p
                                className="uploader"
                                style={{ marginTop: "10px" }}
                              >
                                {uploader[index]}
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
                              <p className="views">1M views</p>
                              <p
                                className="upload-time"
                                style={{ marginLeft: "4px" }}
                              >
                                &#x2022; 5 hours ago
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ) : (
            <div className="spinner" style={{ height: "100vh" }}>
              <ReactLoading
                type={"spin"}
                color={"white"}
                height={50}
                width={50}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Browse;
