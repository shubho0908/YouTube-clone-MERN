import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import ReactLoading from "react-loading";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import noImage from "../../img/no-video.jpg";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function ChannelHome(prop) {
  const [myVideos, setMyVideos] = useState([]);
  const [Email, setEmail] = useState();
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3200);
  }, []);

  useEffect(() => {
    const getUserVideos = async () => {
      try {
        if (Email === prop.newmail) {
          const response = await fetch(
            `http://localhost:3000/getuservideos/${Email}`
          );
          const myvideos = await response.json();
          setMyVideos(myvideos);
        } else {
          const response = await fetch(
            `http://localhost:3000/getuservideos/${prop.newmail}`
          );
          const myvideos = await response.json();
          setMyVideos(myvideos);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getUserVideos();
  }, [Email, prop.newmail]);

  const updateViews = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/updateview/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log(result);
    } catch (error) {
      console.log(error.message);
    }
  };

  const sortByViews = (a, b) => b.views - a.views;
  const sortByViews2 = (a, b) => a.views - b.views;

  const AllVideos =
    myVideos && myVideos.length > 0
      ? myVideos.slice(0, 4) // Get the first four elements if available
      : [];

  if (!myVideos) {
    return (
      <div className="spinner" style={{ height: "100vh" }}>
        <ReactLoading type={"spin"} color={"white"} height={50} width={50} />
      </div>
    );
  }

  return (
    <>
      <SkeletonTheme baseColor="#353535" highlightColor="#444">
        <div
          className="myvideos-section"
          style={{
            display:
              (myVideos && myVideos.message === "USER DOESN'T EXIST") ||
              loading === false
                ? "none"
                : "block",
          }}
        >
          {myVideos.length > 0 ? (
            <div className="user-video">
              <Skeleton
                count={1}
                width={250}
                height={141}
                style={{ borderRadius: "10px" }}
              />

              <div
                className="video-metadata"
                style={{ position: "relative", top: "4px" }}
              >
                <Skeleton
                  count={1}
                  width={500}
                  height={20}
                  style={{
                    borderRadius: "4px",
                    position: "relative",
                    left: "36px",
                  }}
                />
                <div className="video-oneliner-data">
                  <Skeleton
                    count={1}
                    width={350}
                    height={20}
                    style={{
                      borderRadius: "4px",
                      position: "relative",
                      left: "36px",
                    }}
                  />
                </div>
                <Skeleton
                  count={1}
                  width={450}
                  height={12}
                  style={{
                    borderRadius: "4px",
                    position: "relative",
                    left: "36px",
                    top: "15px",
                  }}
                />
                <Skeleton
                  count={1}
                  width={400}
                  height={12}
                  style={{
                    borderRadius: "4px",
                    position: "relative",
                    left: "36px",
                    top: "15px",
                  }}
                />
                <Skeleton
                  count={1}
                  width={360}
                  height={12}
                  style={{
                    borderRadius: "4px",
                    position: "relative",
                    left: "36px",
                    top: "15px",
                  }}
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </SkeletonTheme>
      <div
        className="myvideos-section"
        style={{
          visibility: loading === true ? "hidden" : "visible",
          display:
            myVideos && myVideos.message === "USER DOESN'T EXIST"
              ? "none"
              : "block",
        }}
      >
        {myVideos.length > 0 ? (
          <div
            className="user-video"
            onClick={() => {
              if (token) {
                updateViews(myVideos[0]._id);
                navigate(`/video/${myVideos[0]._id}`);
                window.location.reload();
              }
              navigate(`/video/${myVideos[0]._id}`);
              window.location.reload();
            }}
          >
            <img
              src={myVideos[0].thumbnailURL}
              alt="user-videos"
              className="myvideos-thumbnail"
              loading="lazy"
            />
            <p className="myvideo-duration">
              {Math.floor(myVideos[0].videoLength / 60) +
                ":" +
                (Math.round(myVideos[0].videoLength % 60) < 10
                  ? "0" + Math.round(myVideos[0].videoLength % 60)
                  : Math.round(myVideos[0].videoLength % 60))}
            </p>
            <div className="video-metadata">
              <p className="myvideo-title">{myVideos[0].Title}</p>
              <div className="video-oneliner-data">
                <p className="mychannelname">{myVideos[0].uploader}</p>
                <Tooltip
                  TransitionComponent={Zoom}
                  title="Verified"
                  placement="right"
                >
                  <CheckCircleIcon
                    fontSize="100px"
                    style={{
                      color: "rgb(138, 138, 138)",
                      marginLeft: "6px",
                    }}
                  />
                </Tooltip>
                <div className="view-time2">
                  <p className="myviews">
                    {myVideos[0].views >= 1e9
                      ? `${(myVideos[0].views / 1e9).toFixed(1)}B`
                      : myVideos[0].views >= 1e6
                      ? `${(myVideos[0].views / 1e6).toFixed(1)}M`
                      : myVideos[0].views >= 1e3
                      ? `${(myVideos[0].views / 1e3).toFixed(1)}K`
                      : myVideos[0].views}{" "}
                    views
                  </p>
                  <p className="video_published-date">
                    &#x2022;{" "}
                    {(() => {
                      const timeDifference =
                        new Date() - new Date(myVideos[0].uploaded_date);
                      const minutes = Math.floor(timeDifference / 60000);
                      const hours = Math.floor(timeDifference / 3600000);
                      const days = Math.floor(timeDifference / 86400000);
                      const weeks = Math.floor(timeDifference / 604800000);
                      const years = Math.floor(timeDifference / 31536000000);

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
              <p className="myvideo-description">
                {myVideos[0].Description.length <= 250
                  ? myVideos[0].Description
                  : `${myVideos[0].Description.slice(0, 250)}...`}
              </p>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <br />
      <hr
        className="seperate seperate-new1"
        style={
          myVideos && myVideos.message === "USER DOESN'T EXIST"
            ? { display: "none" }
            : { display: "block" }
        }
      />
      <SkeletonTheme baseColor="#353535" highlightColor="#444">
        <div
          className="myuploaded-videos"
          style={{
            display:
              (myVideos && myVideos.message === "USER DOESN'T EXIST") ||
              loading === false
                ? "none"
                : "block",
            marginTop: "8px",
          }}
        >
          <div className="section-headtxt">
            <Skeleton
              count={1}
              width={140}
              height={18}
              style={{ borderRadius: "4px" }}
            />
          </div>
          <div className="my-all-videos-list">
            {AllVideos &&
              AllVideos.length > 0 &&
              AllVideos.sort(sortByViews2).map((element, index) => {
                return (
                  <div className="uploadedvideo-alldata" key={index}>
                    <Skeleton
                      count={1}
                      width={220}
                      height={124}
                      style={{ borderRadius: "10px" }}
                    />
                    <div className="video-metadata2">
                      <Skeleton
                        count={1}
                        width={200}
                        height={20}
                        style={{
                          borderRadius: "4px",
                          position: "relative",
                          top: "30px",
                        }}
                      />
                      <Skeleton
                        count={1}
                        width={170}
                        height={20}
                        style={{
                          borderRadius: "4px",
                          position: "relative",
                          top: "33px",
                        }}
                      />
                      <div className="views-and-time">
                        <Skeleton
                          count={1}
                          width={140}
                          height={18}
                          style={{
                            borderRadius: "4px",
                            position: "relative",
                            top: "40px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </SkeletonTheme>
      <div
        className="myuploaded-videos"
        style={{
          visibility: loading === true ? "hidden" : "visible",
          display:
            myVideos && myVideos.message === "USER DOESN'T EXIST"
              ? "none"
              : "block",
        }}
      >
        <div className="section-headtxt">
          <p className="section-title">Videos</p>
          <div
            className="playall-videos"
            onClick={() => {
              if (token) {
                updateViews(AllVideos.sort(sortByViews2)[0]._id);
                navigate(`/video/${AllVideos.sort(sortByViews2)[0]._id}`);
                window.location.reload();
              }
              navigate(`/video/${AllVideos.sort(sortByViews2)[0]._id}`);
              window.location.reload();
            }}
          >
            <PlayArrowIcon fontSize="medium" style={{ color: "white" }} />
            <p className="playall-txt">Play all</p>
          </div>
          {AllVideos && AllVideos.length >= 4 ? (
            <p
              className="see-all2"
              onClick={() => {
                localStorage.setItem("Section", "Videos");
                window.location.reload();
              }}
            >
              See all
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="my-all-videos-list">
          {AllVideos &&
            AllVideos.length > 0 &&
            AllVideos.sort(sortByViews2).map((element, index) => {
              return (
                <div
                  className="uploadedvideo-alldata"
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
                    alt="thumbnails"
                    className="myvideos-thumbnail myvideos-thumbnail2"
                    loading="lazy"
                  />
                  <p className="myvideo-duration2">
                    {Math.floor(element.videoLength / 60) +
                      ":" +
                      (Math.round(element.videoLength % 60) < 10
                        ? "0" + Math.round(element.videoLength % 60)
                        : Math.round(element.videoLength % 60))}
                  </p>
                  <div className="video-metadata2">
                    <p className="video-title2">{element.Title}</p>
                    <div className="views-and-time">
                      <p className="myviews">
                        {element.views >= 1e9
                          ? `${(element.views / 1e9).toFixed(1)}B`
                          : element.views >= 1e6
                          ? `${(element.views / 1e6).toFixed(1)}M`
                          : element.views >= 1e3
                          ? `${(element.views / 1e3).toFixed(1)}K`
                          : element.views}{" "}
                        views
                      </p>
                      <p className="video_published-date">
                        &#x2022;{" "}
                        {(() => {
                          const timeDifference =
                            new Date() - new Date(element.uploaded_date);
                          const minutes = Math.floor(timeDifference / 60000);
                          const hours = Math.floor(timeDifference / 3600000);
                          const days = Math.floor(timeDifference / 86400000);
                          const weeks = Math.floor(timeDifference / 604800000);
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
              );
            })}
        </div>
      </div>
      <hr
        className="seperate seperate-new2"
        style={
          myVideos && myVideos.message === "USER DOESN'T EXIST"
            ? { display: "none" }
            : { display: "block" }
        }
      />
      <SkeletonTheme baseColor="#353535" highlightColor="#444">
        <div
          className="mypopular-videos"
          style={{
            display:
              (myVideos && myVideos.message === "USER DOESN'T EXIST") ||
              loading === false
                ? "none"
                : "block",
            marginTop: "8px",
          }}
        >
          <div className="section-headtxt">
            <Skeleton
              count={1}
              width={180}
              height={18}
              style={{ borderRadius: "4px" }}
            />
          </div>
          <div className="my-all-videos-list2">
            {AllVideos &&
              AllVideos.length > 0 &&
              AllVideos.sort(sortByViews).map((element, index) => {
                return (
                  <div className="uploadedvideo-alldata" key={index}>
                    <Skeleton
                      count={1}
                      width={220}
                      height={124}
                      style={{ borderRadius: "10px" }}
                    />
                    <div
                      className="video-metadata2"
                      style={{ position: "relative", top: "20px" }}
                    >
                      <Skeleton
                        count={2}
                        width={160}
                        height={20}
                        style={{ borderRadius: "4px" }}
                      />
                      <div className="views-and-time">
                        <Skeleton
                          count={1}
                          width={120}
                          height={14}
                          style={{ borderRadius: "4px", top: "10px" }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </SkeletonTheme>
      <div
        className="mypopular-videos"
        style={{
          visibility: loading === true ? "hidden" : "visible",
          display:
            myVideos && myVideos.message === "USER DOESN'T EXIST"
              ? "none"
              : "block",
        }}
      >
        <div className="section-headtxt">
          <p className="section-title">Popular videos</p>
          <div
            className="playall-videos"
            onClick={() => {
              if (token) {
                updateViews(AllVideos.sort(sortByViews)[0]._id);
                navigate(`/video/${AllVideos.sort(sortByViews)[0]._id}`);
                window.location.reload();
              }
              navigate(`/video/${AllVideos.sort(sortByViews)[0]._id}`);
              window.location.reload();
            }}
          >
            <PlayArrowIcon fontSize="medium" style={{ color: "white" }} />
            <p className="playall-txt">Play all</p>
          </div>
          {AllVideos && AllVideos.length >= 4 ? (
            <p
              className="see-all2"
              onClick={() => {
                localStorage.setItem("Section", "Videos");
                window.location.reload();
              }}
            >
              See all
            </p>
          ) : (
            ""
          )}
        </div>
        <div className="my-all-videos-list2">
          {AllVideos &&
            AllVideos.length > 0 &&
            AllVideos.sort(sortByViews).map((element, index) => {
              return (
                <div
                  className="uploadedvideo-alldata"
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
                    alt="thumbnails"
                    className="myvideos-thumbnail myvideos-thumbnail2"
                    loading="lazy"
                  />
                  <p className="myvideo-duration2">
                    {Math.floor(element.videoLength / 60) +
                      ":" +
                      (Math.round(element.videoLength % 60) < 10
                        ? "0" + Math.round(element.videoLength % 60)
                        : Math.round(element.videoLength % 60))}
                  </p>
                  <div className="video-metadata2">
                    <p className="video-title2">{element.Title}</p>
                    <div className="views-and-time">
                      <p className="myviews">
                        {element.views >= 1e9
                          ? `${(element.views / 1e9).toFixed(1)}B`
                          : element.views >= 1e6
                          ? `${(element.views / 1e6).toFixed(1)}M`
                          : element.views >= 1e3
                          ? `${(element.views / 1e3).toFixed(1)}K`
                          : element.views}{" "}
                        views
                      </p>
                      <p className="video_published-date">
                        &#x2022;{" "}
                        {(() => {
                          const timeDifference =
                            new Date() - new Date(element.uploaded_date);
                          const minutes = Math.floor(timeDifference / 60000);
                          const hours = Math.floor(timeDifference / 3600000);
                          const days = Math.floor(timeDifference / 86400000);
                          const weeks = Math.floor(timeDifference / 604800000);
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
              );
            })}
        </div>
      </div>
      <div
        className="thischannel-no-content"
        style={
          myVideos &&
          myVideos.message === "USER DOESN'T EXIST" &&
          Email !== prop.newmail
            ? { display: "block" }
            : { display: "none" }
        }
      >
        <p>This channel doesn&apos;t have any content.</p>
      </div>
      <div
        className="thischannel-no-content2"
        style={
          myVideos &&
          myVideos.message === "USER DOESN'T EXIST" &&
          Email === prop.newmail
            ? { display: "flex" }
            : { display: "none" }
        }
      >
        <img src={noImage} alt="upload" className="novideo" />
        <p>Upload a video to get started</p>
        <p>
          Start sharing your story and connecting with viewers. Videos you
          upload will show up here.
        </p>
        <button
          className="upload-videoo"
          onClick={() => {
            window.location.href = "/studio";
          }}
        >
          Upload video
        </button>
      </div>
    </>
  );
}

export default ChannelHome;
