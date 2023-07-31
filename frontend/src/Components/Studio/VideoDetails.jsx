import LeftPanel3 from "../LeftPanel3";
import Navbar2 from "../Navbar2";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../Css/Studio/videodetails.css";

function VideoDetails() {
  const { id } = useParams();
  const [videodata, setVideoData] = useState();
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewDescription, setPreviewDescription] = useState("");

  useEffect(() => {
    const GetVideoData = async () => {
      try {
        if (id !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getvideodata/${id}`
          );
          const data = await response.json();
          setVideoData(data);
          setPreviewTitle(data.Title);
          setPreviewDescription(data.Description);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    GetVideoData();
  }, [id]);

  return (
    <>
      <Navbar2 />
      <LeftPanel3 />
      <div className="main-video-details-section">
              <p className="current-tophead">Video details</p>
        <div className="current-editvideo-data">
          <div className="video-details-left">
            <div className="current-video-editable-section">
              <div className="currentvideo-title">
                <input
                  type="text"
                  name="video-title"
                  className="currentvideo-title-inp"
                  value={previewTitle}
                  onChange={(e) => setPreviewTitle(e.target.value)}
                  placeholder="Add a title that describes your video"
                  maxLength={100}
                />
                <p className="title-sample-txt">Title (required)</p>
              </div>
              <div className="currentvideo-desc">
                <textarea
                  type="text"
                  name="video-desc"
                  className="currentvideo-desc-inp"
                  onChange={(e) => setPreviewDescription(e.target.value)}
                  placeholder="Tell viewers about your video"
                  value={previewDescription}
                  maxLength={1000}
                />
                <p className="desc-sample-txt">Description</p>
              </div>
            </div>
          </div>
          <div className="video-details-right">
            <div className="preview-current-video">
              <iframe
                width="426"
                height="240"
                src={videodata && videodata.videoURL}
                title="YouTube video player"
                frameBorder="0"
                allowFullScreen
              ></iframe>
              <div className="preview-data-details">
                
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoDetails;
