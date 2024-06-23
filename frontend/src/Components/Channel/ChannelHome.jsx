import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import noImage from "../../img/no-video.jpg";
import noImage2 from "../../img/novideo.png";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSelector } from "react-redux";

function ChannelHome(prop) {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000"
  const [myVideos, setMyVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHome, setShowHome] = useState(false);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const User = useSelector((state) => state.user.user);
  const { user } = User;

  useEffect(() => {
    function handleResize() {
      setShowHome(window.innerWidth <= 510);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    if (theme === false && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "white";
    } else if (theme === true && !window.location.href.includes("/studio")) {
      document.body.style.backgroundColor = "0f0f0f";
    }
  }, [theme]);

  useEffect(() => {
    const getUserVideos = async () => {
      try {
        if (user?.email === prop?.newmail) {
          const response = await fetch(
            `${backendURL}/getuservideos/${user?.email}`
          );
          const myvideos = await response.json();
          setMyVideos(myvideos);
        } else {
          const response = await fetch(
            `${backendURL}/getuservideos/${prop?.newmail}`
          );
          const myvideos = await response.json();
          setMyVideos(myvideos);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    getUserVideos();
  }, [user?.email, prop?.newmail]);

  const updateViews = async (id) => {
    try {
      const response = await fetch(
        `${backendURL}/updateview/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await response.json();
    } catch (error) {
      // console.log(error.message);
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
      <SkeletonTheme
        baseColor={theme ? "#353535" : "#aaaaaa"}
        highlightColor={theme ? "#444" : "#b6b6b6"}
      >
        <div
          className="myvideos-section sk-myvideos"
          style={{
            display:
              (myVideos && myVideos.message === "USER DOESN'T EXIST") ||
              (myVideos.length > 0 && myVideos[0].visibility === "Private") ||
              loading === false
                ? "none"
                : "block",
          }}
        >
          {myVideos.length > 0 && myVideos[0].visibility === "Public" ? (
            <div className="user-video">
              <Skeleton
                count={1}
                width={250}
                height={141}
                style={{ borderRadius: "10px" }}
                className="sk-top-video"
              />

              <div
                className="video-metadata user-ka-video sk-video-metadata"
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
                  className="sk-topvideo-title"
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
                    className="sk-topvideo-title2"
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
                  className="sk-topvideo-desc"
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
                  className="sk-topvideo-desc2"
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
                  className="sk-topvideo-desc3"
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      </SkeletonTheme>
      <div
        className={
          theme
            ? "myvideos-section before-channel"
            : "myvideos-section before-channel light-border1"
        }
        style={{
          visibility: loading === true ? "hidden" : "visible",
          display:
            (myVideos && myVideos.message === "USER DOESN'T EXIST") ||
            (myVideos.length > 0 && myVideos[0].visibility === "Private")
              ? "none"
              : "block",
        }}
      >
        {myVideos.length > 0 && myVideos[0].visibility === "Public" ? (
          <div
            className={theme ? "user-video" : "user-video text-light-mode"}
            onClick={() => {
              if (user?.email) {
                updateViews(myVideos[0]._id);
                window.location.href = `/video/${myVideos[0]._id}`;
              }
              window.location.href = `/video/${myVideos[0]._id}`;
            }}
          >
            <img
              src={myVideos[0].thumbnailURL}
              alt="user-videos"
              className="myvideos-thumbnail"
              loading="lazy"
            />
            <p
              className={
                theme ? "myvideo-duration" : "myvideo-duration text-dark-mode"
              }
            >
              {Math.floor(myVideos[0].videoLength / 60) +
                ":" +
                (Math.round(myVideos[0].videoLength % 60) < 10
                  ? "0" + Math.round(myVideos[0].videoLength % 60)
                  : Math.round(myVideos[0].videoLength % 60))}
            </p>
            <div className="video-metadata user-ka-video">
              {window.innerWidth <= 1180 ? (
                <p className="myvideo-title">
                  {myVideos[0].Title.length <= 50
                    ? myVideos[0].Title
                    : `${myVideos[0].Title.slice(0, 50)}...`}
                </p>
              ) : (
                <p className="myvideo-title">{myVideos[0].Title}</p>
              )}
              <div
                className={
                  theme
                    ? "video-oneliner-data"
                    : "video-oneliner-data text-light-mode2"
                }
              >
                <div className="videoliner-indata">
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
                </div>
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
              {window.innerWidth <= 1180 ? (
                <p
                  className={
                    theme
                      ? "myvideo-description"
                      : "myvideo-description text-light-mode2"
                  }
                >
                  {myVideos[0].Description.length <= 120
                    ? myVideos[0].Description
                    : `${myVideos[0].Description.slice(0, 120)}...`}
                </p>
              ) : (
                <p
                  className={
                    theme
                      ? "myvideo-description"
                      : "myvideo-description text-light-mode2"
                  }
                >
                  {myVideos[0].Description.length <= 250
                    ? myVideos[0].Description
                    : `${myVideos[0].Description.slice(0, 250)}...`}
                </p>
              )}
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
      <br />

      <SkeletonTheme
        baseColor={theme ? "#353535" : "#aaaaaa"}
        highlightColor={theme ? "#444" : "#b6b6b6"}
      >
        <div
          className="myuploaded-videos sk-myupload"
          style={{
            display:
              (myVideos && myVideos.message === "USER DOESN'T EXIST") ||
              loading === false
                ? "none"
                : "block",
            marginTop: "8px",
            top:
              myVideos.length > 0 && myVideos[0].visibility === "Private"
                ? "290px"
                : "500px",
          }}
        >
          <div className="section-headtxt">
            <Skeleton
              count={1}
              width={140}
              height={18}
              style={{ borderRadius: "4px" }}
              className="sk-upload-title"
            />
          </div>
          <div className="my-all-videos-list">
            {AllVideos &&
              AllVideos.length > 0 &&
              AllVideos.sort(sortByViews2).map((element, index) => {
                return (
                  <div
                    className="uploadedvideo-alldata"
                    key={index}
                    style={{
                      display:
                        element.visibility === "Public" ? "block" : "none",
                    }}
                  >
                    <Skeleton
                      count={1}
                      width={220}
                      height={124}
                      style={{ borderRadius: "10px" }}
                      className="sk-upload-thumbnail"
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
                        className="sk-upload-title"
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
                        className="sk-upload-extra"
                      />
                      <div
                        className={
                          theme
                            ? "views-and-time"
                            : "views-and-time text-light-mode2"
                        }
                      >
                        <Skeleton
                          count={1}
                          width={140}
                          height={18}
                          style={{
                            borderRadius: "4px",
                            position: "relative",
                            top: "40px",
                          }}
                          className="sk-upload-extra2"
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
        className={
          theme
            ? "myuploaded-videos before-channel"
            : "myuploaded-videos before-channel light-border1"
        }
        style={{
          visibility: loading === true ? "hidden" : "visible",
          display:
            myVideos && myVideos.message === "USER DOESN'T EXIST"
              ? "none"
              : "block",
          top:
            myVideos.length > 0 && myVideos[0].visibility === "Private"
              ? "300px"
              : "500px",
        }}
      >
        <div
          className={
            theme ? "section-headtxt" : "section-headtxt text-light-mode"
          }
        >
          <div className="inside-headtxt">
            <p className="section-title">Videos</p>
            <div
              className={theme ? "playall-videos" : "playall-videos-light"}
              onClick={() => {
                if (user?.email) {
                  updateViews(AllVideos.sort(sortByViews2)[0]._id);
                  window.location.href = `/video/${
                    AllVideos.sort(sortByViews2)[0]._id
                  }`;
                }
                window.location.href = `/video/${
                  AllVideos.sort(sortByViews2)[0]._id
                }`;
              }}
            >
              <PlayArrowIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
              <p className="playall-txt">Play all</p>
            </div>
          </div>
          {AllVideos && AllVideos.length >= 5 ? (
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
                  style={{
                    display: element.visibility === "Public" ? "block" : "none",
                  }}
                  onClick={() => {
                    if (user?.email) {
                      updateViews(element._id);
                      setTimeout(() => {
                        window.location.href = `/video/${element._id}`;
                      }, 400);
                    } else {
                      window.location.href = `/video/${element._id}`;
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
                    <p
                      className={
                        theme ? "video-title2" : "video-title2 text-light-mode"
                      }
                    >
                      {element.Title.length <= 50
                        ? element.Title
                        : `${element.Title.slice(0, 50)}...`}
                    </p>
                    <div
                      className={
                        theme
                          ? "views-and-time"
                          : "views-and-time text-light-mode2"
                      }
                    >
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

      <SkeletonTheme
        baseColor={theme ? "#353535" : "#aaaaaa"}
        highlightColor={theme ? "#444" : "#b6b6b6"}
      >
        <div
          className="mypopular-videos sk-mypopular"
          style={{
            display:
              (myVideos && myVideos.message === "USER DOESN'T EXIST") ||
              loading === false
                ? "none"
                : "block",
            marginTop: "16px",
            top:
              myVideos.length > 0 && myVideos[0].visibility === "Private"
                ? "605px"
                : "810px",
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
                  <div
                    className="uploadedvideo-alldata"
                    style={{
                      display:
                        element.visibility === "Public" ? "block" : "none",
                    }}
                    key={index}
                  >
                    <Skeleton
                      count={1}
                      width={220}
                      height={124}
                      style={{ borderRadius: "10px" }}
                      className="sk-popular-thumbnail"
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
                        className="sk-popular-title"
                      />
                      <div
                        className={
                          theme
                            ? "views-and-time"
                            : "views-and-time text-light-mode2"
                        }
                      >
                        <Skeleton
                          count={1}
                          width={120}
                          height={14}
                          style={{ borderRadius: "4px", top: "10px" }}
                          className="sk-popular-extra"
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
        className="mypopular-videos before-channel"
        style={{
          visibility: loading === true ? "hidden" : "visible",
          display:
            myVideos && myVideos.message === "USER DOESN'T EXIST"
              ? "none"
              : "block",
          top:
            myVideos.length > 0 && myVideos[0].visibility === "Private"
              ? "620px"
              : "816px",
        }}
      >
        <div
          className={
            theme ? "section-headtxt" : "section-headtxt text-light-mode"
          }
        >
          <div className="inside-headtxt">
            <p className="section-title">Popular videos</p>
            <div
              className={theme ? "playall-videos" : "playall-videos-light"}
              onClick={() => {
                if (user?.email) {
                  updateViews(AllVideos.sort(sortByViews)[0]._id);
                  window.location.href = `/video/${
                    AllVideos.sort(sortByViews)[0]._id
                  }`;
                }
                window.location.href = `/video/${
                  AllVideos.sort(sortByViews)[0]._id
                }`;
              }}
            >
              <PlayArrowIcon
                fontSize="medium"
                style={{ color: theme ? "white" : "black" }}
              />
              <p className="playall-txt">Play all</p>
            </div>
          </div>
          {AllVideos && AllVideos.length >= 5 ? (
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
                  style={{
                    display: element.visibility === "Public" ? "block" : "none",
                  }}
                  key={index}
                  onClick={() => {
                    if (user?.email) {
                      updateViews(element._id);
                      setTimeout(() => {
                        window.location.href = `/video/${element._id}`;
                      }, 400);
                    } else {
                      window.location.href = `/video/${element._id}`;
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
                    <p
                      className={
                        theme ? "video-title2" : "video-title2 text-light-mode"
                      }
                    >
                      {element.Title.length <= 50
                        ? element.Title
                        : `${element.Title.slice(0, 50)}...`}
                    </p>
                    <div
                      className={
                        theme
                          ? "views-and-time"
                          : "views-and-time text-light-mode2"
                      }
                    >
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
        className={
          theme
            ? "thischannel-no-content"
            : "thischannel-no-content text-light-mode"
        }
        style={
          myVideos &&
          myVideos.message === "USER DOESN'T EXIST" &&
          user?.email !== prop?.newmail
            ? { display: "block" }
            : { display: "none" }
        }
      >
        <p>This channel doesn&apos;t have any content.</p>
      </div>
      <div
        className={
          theme
            ? "thischannel-no-content2"
            : "thischannel-no-content2 text-light-mode"
        }
        style={
          myVideos &&
          myVideos.message === "USER DOESN'T EXIST" &&
          user?.email === prop?.newmail
            ? { display: "flex" }
            : { display: "none" }
        }
      >
        <img
          src={theme ? noImage : noImage2}
          alt="upload"
          className="novideo"
        />
        <p>Upload a video to get started</p>
        <p className={theme ? "" : "text-light-mode2"}>
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

      {/* AFTER 540 WIDTH  */}

      <SkeletonTheme
        baseColor={theme ? "#353535" : "#aaaaaa"}
        highlightColor={theme ? "#444" : "#b6b6b6"}
      >
        <div className="home-pagevideos sk-homepage">
          <div
            className="myvideos-section sk-myvideos2"
            style={{
              display:
                (myVideos && myVideos.message === "USER DOESN'T EXIST") ||
                (myVideos.length > 0 && myVideos[0].visibility === "Private") ||
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
                  className="sk-top-video"
                />

                <div
                  className="video-metadata user-ka-video sk-video-metadata"
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
                    className="sk-topvideo-title"
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
                      className="sk-topvideo-title2"
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
                    className="sk-topvideo-desc"
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
                    className="sk-topvideo-desc2"
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
                    className="sk-topvideo-desc3"
                  />
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
          <div
            className="myuploaded-videos sk-myupload2"
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
                className="sk-upload-title"
              />
            </div>
            <div className="my-all-videos-list">
              {AllVideos &&
                AllVideos.length > 0 &&
                AllVideos.sort(sortByViews2).map((element, index) => {
                  return (
                    <div
                      className="uploadedvideo-alldata"
                      style={{
                        display:
                          element.visibility === "Public" ? "block" : "none",
                      }}
                      key={index}
                    >
                      <Skeleton
                        count={1}
                        width={220}
                        height={124}
                        style={{ borderRadius: "10px" }}
                        className="sk-upload-thumbnail"
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
                          className="sk-upload-title"
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
                          className="sk-upload-extra"
                        />
                        <div
                          className={
                            theme
                              ? "views-and-time"
                              : "views-and-time text-light-mode2"
                          }
                        >
                          <Skeleton
                            count={1}
                            width={140}
                            height={18}
                            style={{
                              borderRadius: "4px",
                              position: "relative",
                              top: "40px",
                            }}
                            className="sk-upload-extra2"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
          <div
            className="mypopular-videos sk-mypopular2"
            style={{
              display:
                (myVideos && myVideos.message === "USER DOESN'T EXIST") ||
                loading === false
                  ? "none"
                  : "block",
              marginTop: "16px",
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
                    <div
                      className="uploadedvideo-alldata"
                      style={{
                        display:
                          element.visibility === "Public" ? "block" : "none",
                      }}
                      key={index}
                    >
                      <Skeleton
                        count={1}
                        width={220}
                        height={124}
                        style={{ borderRadius: "10px" }}
                        className="sk-popular-thumbnail"
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
                          className="sk-popular-title"
                        />
                        <div
                          className={
                            theme
                              ? "views-and-time"
                              : "views-and-time text-light-mode2"
                          }
                        >
                          <Skeleton
                            count={1}
                            width={120}
                            height={14}
                            style={{ borderRadius: "4px", top: "10px" }}
                            className="sk-popular-extra"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </SkeletonTheme>

      <div
        className="home-pagevideos"
        style={
          loading === false && showHome === true
            ? { display: "block" }
            : { display: "none" }
        }
      >
        <div
          className="myvideos-section"
          style={{
            visibility: loading === true ? "hidden" : "visible",
            display:
              (myVideos && myVideos.message === "USER DOESN'T EXIST") ||
              (myVideos.length > 0 && myVideos[0].visibility === "Private")
                ? "none"
                : "block",
          }}
        >
          {myVideos.length > 0 ? (
            <div
              className={theme ? "user-video" : "user-video text-light-mode"}
              onClick={() => {
                if (user?.email) {
                  updateViews(myVideos[0]._id);
                  window.location.href = `/video/${myVideos[0]._id}`;
                }
                window.location.href = `/video/${myVideos[0]._id}`;
              }}
            >
              <img
                src={myVideos[0].thumbnailURL}
                alt="user-videos"
                className="myvideos-thumbnail"
                loading="lazy"
              />
              <p
                className={
                  theme ? "myvideo-duration" : "myvideo-duration text-dark-mode"
                }
              >
                {Math.floor(myVideos[0].videoLength / 60) +
                  ":" +
                  (Math.round(myVideos[0].videoLength % 60) < 10
                    ? "0" + Math.round(myVideos[0].videoLength % 60)
                    : Math.round(myVideos[0].videoLength % 60))}
              </p>
              <div className="video-metadata user-ka-video">
                {window.innerWidth <= 1180 ? (
                  <p className="myvideo-title">
                    {myVideos[0].Title.length <= 50
                      ? myVideos[0].Title
                      : `${myVideos[0].Title.slice(0, 50)}...`}
                  </p>
                ) : (
                  <p className="myvideo-title">{myVideos[0].Title}</p>
                )}
                <div
                  className={
                    theme
                      ? "video-oneliner-data"
                      : "video-oneliner-data text-light-mode2"
                  }
                >
                  <div className="videoliner-indata">
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
                  </div>
                  <div className="view-time2">
                    <p className="last-dot">&#x2022;</p>
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
                {window.innerWidth <= 1180 ? (
                  <p
                    className={
                      theme
                        ? "myvideo-description"
                        : "myvideo-description text-light-mode2"
                    }
                  >
                    {myVideos[0].Description.length <= 120
                      ? myVideos[0].Description
                      : `${myVideos[0].Description.slice(0, 120)}...`}
                  </p>
                ) : (
                  <p
                    className={
                      theme
                        ? "myvideo-description"
                        : "myvideo-description text-light-mode2"
                    }
                  >
                    {myVideos[0].Description.length <= 250
                      ? myVideos[0].Description
                      : `${myVideos[0].Description.slice(0, 250)}...`}
                  </p>
                )}
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <div
          className="myuploaded-videos"
          style={{
            visibility: loading === true ? "hidden" : "visible",
            display:
              myVideos && myVideos.message === "USER DOESN'T EXIST"
                ? "none"
                : "block",
            top:
              myVideos.length > 0 && myVideos[0].visibility === "Private"
                ? "0px"
                : "20px",
          }}
        >
          <div
            className={
              theme ? "section-headtxt" : "section-headtxt text-light-mode"
            }
          >
            <div className="inside-headtxt">
              <p className="section-title">Videos</p>
              <div
                className={theme ? "playall-videos" : "playall-videos-light"}
                onClick={() => {
                  if (user?.email) {
                    updateViews(AllVideos.sort(sortByViews2)[0]._id);
                    window.location.href = `/video/${
                      AllVideos.sort(sortByViews2)[0]._id
                    }`;
                  }
                  window.location.href = `/video/${
                    AllVideos.sort(sortByViews2)[0]._id
                  }`;
                }}
              >
                <PlayArrowIcon
                  fontSize="medium"
                  style={{ color: theme ? "white" : "black" }}
                />
                <p className="playall-txt">Play all</p>
              </div>
            </div>
            {AllVideos && AllVideos.length >= 5 ? (
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
                    style={{
                      display:
                        element.visibility === "Public" ? "block" : "none",
                    }}
                    key={index}
                    onClick={() => {
                      if (user?.email) {
                        updateViews(element._id);
                        setTimeout(() => {
                          window.location.href = `/video/${element._id}`;
                        }, 400);
                      } else {
                        window.location.href = `/video/${element._id}`;
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
                      <p
                        className={
                          theme
                            ? "video-title2"
                            : "video-title2 text-light-mode"
                        }
                      >
                        {element.Title.length <= 50
                          ? element.Title
                          : `${element.Title.slice(0, 50)}...`}
                      </p>
                      <div
                        className={
                          theme
                            ? "views-and-time"
                            : "views-and-time text-light-mode2"
                        }
                      >
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
                );
              })}
          </div>
        </div>
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
          <div
            className={
              theme ? "section-headtxt" : "section-headtxt text-light-mode"
            }
          >
            <div className="inside-headtxt">
              <p className="section-title">Popular videos</p>
              <div
                className={theme ? "playall-videos" : "playall-videos-light"}
                onClick={() => {
                  if (user?.email) {
                    updateViews(AllVideos.sort(sortByViews)[0]._id);
                    window.location.href = `/video/${
                      AllVideos.sort(sortByViews)[0]._id
                    }`;
                  }
                  window.location.href = `/video/${
                    AllVideos.sort(sortByViews)[0]._id
                  }`;
                }}
              >
                <PlayArrowIcon
                  fontSize="medium"
                  style={{ color: theme ? "white" : "black" }}
                />
                <p className="playall-txt">Play all</p>
              </div>
            </div>
            {AllVideos && AllVideos.length >= 5 ? (
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
                    style={{
                      display:
                        element.visibility === "Public" ? "block" : "none",
                    }}
                    key={index}
                    onClick={() => {
                      if (user?.email) {
                        updateViews(element._id);
                        setTimeout(() => {
                          window.location.href = `/video/${element._id}`;
                        }, 400);
                      } else {
                        window.location.href = `/video/${element._id}`;
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
                      <p
                        className={
                          theme
                            ? "video-title2"
                            : "video-title2 text-light-mode"
                        }
                      >
                        {element.Title.length <= 50
                          ? element.Title
                          : `${element.Title.slice(0, 50)}...`}
                      </p>
                      <div
                        className={
                          theme
                            ? "views-and-time"
                            : "views-and-time text-light-mode2"
                        }
                      >
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
                );
              })}
          </div>
        </div>
      </div>
    </>
  );
}

export default ChannelHome;
