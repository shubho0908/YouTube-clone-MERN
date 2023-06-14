import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "../Css/browse.css";

function Browse() {
  const [videoThumbnails, setVideoThumbnails] = useState([]);
  const [videoTitles, setvideoTitles] = useState([]);

  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = async () => {
    const url =
      "https://youtube-v31.p.rapidapi.com/search?relatedToVideoId=oFnIe-RpkE4&part=id%2Csnippet&type=video&maxResults=50";
    const options = {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": "e2f9ad5dcemsh38310f6038553bep1272a3jsn86a8a531de48",
        "X-RapidAPI-Host": "youtube-v31.p.rapidapi.com",
      },
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result);
      const thumbnails = result.items.map((item) => {
        const thumbnailUrl =
          item.snippet.thumbnails.maxres?.url ||
          item.snippet.thumbnails.default.url;
        return thumbnailUrl;
      });
      setVideoThumbnails(thumbnails);
      const titles = result.items.map((item) => {
        const vidTitle = item.snippet.title;
        return vidTitle;
      });
      setvideoTitles(titles);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="browse-videos">
        <div className="thumbnails">
          {videoThumbnails.map((thumbnail, index) => (
            <div key={index}>
              <img
                src={thumbnail}
                alt="Video Thumbnail"
                className="video-thumbnails"
                style={{
                  width: "426px",
                  height: "240px",
                  "object-fit": "cover",
                }}
              />
              <h4>{videoTitles[index]}</h4>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Browse;
