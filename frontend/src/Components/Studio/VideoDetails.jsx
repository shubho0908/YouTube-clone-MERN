import LeftPanel3 from "../LeftPanel3";
import Navbar2 from "../Navbar2";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "../../Css/Studio/videodetails.css";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import HdIcon from "@mui/icons-material/Hd";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";

function VideoDetails() {
  const { id } = useParams();
  const [videodata, setVideoData] = useState();
  const [previewTitle, setPreviewTitle] = useState("");
  const [previewDescription, setPreviewDescription] = useState("");
  const videolink = "http://localhost:5173/video";
  const [thumbnailImage, setThumbnailImage] = useState(null);
  const [thumbnailSelected, setThumbnailSelected] = useState(false);
  const [finalThumbnail, setFinalThumbnail] = useState(null);

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

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(`${videolink}/${videodata && videodata._id}`)
      .then(() => {
        alert("Link Copied!");
      })
      .catch((error) => {
        console.log("Error copying link to clipboard:", error);
      });
  };

  const handleThumbnailUpload = (e) => {
    const file = e.target.files[0];
    setThumbnailImage(file);
    setThumbnailSelected(true);
    setFinalThumbnail(file);
    const reader = new FileReader();
    reader.onloadend = () => {};
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <Navbar2 />
      <LeftPanel3 />
      <div className="main-video-details-section">
        <div className="current-editvideodata">
          <p className="current-tophead">Video details</p>
          <div className="thissection-btns">
            <button>UNDO CHANGES</button>
            <button>SAVE</button>
          </div>
        </div>
        <div className="current-editvideo-data">
          <div className="video-details-left">
            <div className="current-video-editable-section">
              <div className="currentvideo-title">
                <input
                  type="text"
                  name="video-title"
                  className="currentvideo-title-inp"
                  value={previewTitle}
                  onChange={(e) => {
                    setPreviewTitle(e.target.value);
                  }}
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
                  maxLength={5000}
                />
                <p className="desc-sample-txt">Description</p>
              </div>
              <div className="currentvideo-thumbnailedit">
                <p>Thumbnail</p>
                <p>
                  Select or upload a picture that shows what&apos;s in your
                  video. A good thumbnail stands out and draws viewers&apos;
                  attention.
                </p>
                <div className="mythumbnails-sectionn">
                  {thumbnailImage ? (
                    <div className="currentthumbnail-data">
                      <img
                        src={URL.createObjectURL(thumbnailImage)}
                        alt="thumbnail"
                        className="currnt-tbimg"
                        style={
                          thumbnailSelected === true && videodata
                            ? {
                                border: "2.2px solid white",
                                borderRadius: "3px", opacity:"1" 
                              }
                            : { border: "none", opacity:".4" }
                        }
                        onClick={() => {
                          setThumbnailSelected(true);
                          setFinalThumbnail(thumbnailImage);
                        }}
                      />
                    </div>
                  ) : (
                    <label
                      htmlFor="thumbnail-upload"
                      className="uploadnew-thumbnaill"
                    >
                      <AddPhotoAlternateOutlinedIcon
                        fontSize="medium"
                        style={{ color: "#aaa" }}
                      />
                      <p>Upload thumbnail</p>
                    </label>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    id="thumbnail-upload"
                    style={{ display: "none" }}
                    onChange={handleThumbnailUpload}
                  />
                  <div className="currentthumbnail-data">
                    <img
                      src={videodata && videodata.thumbnailURL}
                      alt="thumbnail"
                      className="currnt-tbimg"
                      style={
                        thumbnailSelected === false && videodata
                          ? {
                              border: "2.2px solid white",
                              borderRadius: "3px",
                              opacity: "1",
                            }
                          : { border: "none", opacity: ".4" }
                      }
                      onClick={() => {
                        setThumbnailSelected(false);
                        setFinalThumbnail(videodata.thumbnailURL);
                      }}
                    />
                    <div
                      className="img-optionss"
                      style={
                        thumbnailImage && thumbnailSelected === true
                          ? { display: "block" }
                          : { display: "none" }
                      }
                    >
                      <MoreVertOutlinedIcon
                        fontSize="small"
                        className="extra-optn"
                        style={{ color: "white" }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="video-details-right">
            <div className="preview-current-video">
              <iframe
                width="360"
                height="220"
                src={videodata && videodata.videoURL}
                title="YouTube video player"
                frameBorder="0"
                allowFullScreen
              ></iframe>
              <div className="preview-data-details">
                <div className="preview-part1">
                  <div className="video-linkleft">
                    <p>Video link</p>
                    <p
                      className="current-videolink"
                      onClick={() => {
                        if (videodata) {
                          window.location.href = `${videolink}/${videodata._id}`;
                        }
                      }}
                    >
                      {videolink +
                        `/${
                          videodata && videodata._id.length <= 5
                            ? videodata && videodata._id
                            : `${videodata && videodata._id.slice(0, 5)}...`
                        }`}
                    </p>
                  </div>
                  <ContentCopyIcon
                    fontSize="medium"
                    className="copythis-btn"
                    style={{ color: "#aaaaaab0" }}
                    onClick={handleCopyLink}
                  />
                </div>
                <div className="preview-part2">
                  <p>Filename</p>
                  <p>
                    {videodata && videodata.Title.length <= 35
                      ? videodata && videodata.Title
                      : `${videodata && videodata.Title.slice(0, 35)}...`}
                  </p>
                </div>
                <div className="preview-part3">
                  <p>Video quality</p>
                  <HdIcon
                    fontSize="large"
                    style={{ color: "#3ea6ff", marginTop: "6px" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VideoDetails;
