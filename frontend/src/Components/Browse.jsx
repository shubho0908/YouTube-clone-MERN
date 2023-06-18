import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import "../Css/browse.css";
import { useEffect, useState } from "react";

function Browse() {
  const [videos, setVideos] = useState("");
  const [thumbnails, setThumbnails] = useState();
  const [Titles, setTitles] = useState();
  const [uploader, setUploader] = useState();

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
  ];

  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = async () => {
    try {
      const response = await fetch("http://localhost:3000/getvideos");
      const { videoURLs, thumbnailURLs, titles,Uploader } = await response.json();
      setVideos(videoURLs);
      setThumbnails(thumbnailURLs);
      setTitles(titles);
      setUploader(Uploader)
        console.log(Uploader);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Navbar />
      <div className="browse">
        <LeftPanel />
        <div className="browse-data">
          <div className="popular-categories">
            {Tags.map((element, index) => {
              return (
                <div className={`top-tags tag-${index}`} key={index}>
                  <p>{element}</p>
                </div>
              );
            })}
          </div>
          <div className="video-section">
            <div className="uploaded-videos">
              {thumbnails &&
                thumbnails.map((element, index) => {
                  return (
                    <div className="video-data" key={index}>
                      <img
                        style={{ width: "360px", borderRadius: "8px" }}
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
