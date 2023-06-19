import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import "../Css/browse.css";
import { useEffect, useState } from "react";

function Browse() {
  const [videos, setVideos] = useState("");
  const [thumbnails, setThumbnails] = useState();
  const [Titles, setTitles] = useState();
  const [uploader, setUploader] = useState();
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
      const { videoURLs, thumbnailURLs, titles, Uploader } =
        await response.json();
      setVideos(videoURLs);
      setThumbnails(thumbnailURLs);
      setTitles(titles);
      setUploader(Uploader);
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
                        style={{ width: "330px", borderRadius: "8px" }}
                        src={element}
                        alt="temp"
                      />
                      <p className="title" style={{ marginTop: "10px" }}>
                        {Titles[index]}
                      </p>
                      <p className="uploader" style={{ marginTop: "10px" }}>
                        {uploader[index]}
                      </p>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Browse;
