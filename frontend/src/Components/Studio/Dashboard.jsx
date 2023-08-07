import { useEffect, useState } from "react";
import "../../Css/Studio/dashboard.css";
import jwtDecode from "jwt-decode";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import YouTubeIcon from "@mui/icons-material/YouTube";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Dashboard() {
  const [myVideos, setMyVideos] = useState([]);
  const [Email, setEmail] = useState();
  const [dropDown, setDropDown] = useState(true);
  const [showSortedVideos, setShowSortedVideos] = useState(false); // State for hover effect
  const [channelSubs, setChannelSubs] = useState(0);
  const [totalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setEmail(jwtDecode(token).email);
  }, []);

  useEffect(() => {
    const getVideos = async () => {
      try {
        if (Email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getuservideos/${Email}`
          );
          const data = await response.json();
          setMyVideos(data);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    const interval = setInterval(getVideos, 100);

    return () => clearInterval(interval);
  }, [Email]);

  useEffect(() => {
    const getSubscriber = async () => {
      try {
        if (Email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getchannelid/${Email}`
          );
          const { subscribers } = await response.json();
          setChannelSubs(subscribers);
        }
      } catch (error) {
        //  console.log(error.message);
      }
    };
    const interval = setInterval(getSubscriber, 100);

    return () => clearInterval(interval);
  }, [Email]);

  useEffect(() => {
    const GetTotalViews = async () => {
      try {
        if (Email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/totalviews/${Email}`
          );
          const totalViews = await response.json();
          setTotalViews(totalViews);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    GetTotalViews();
  }, [Email]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2600);
  }, []);

  const sortedVideos =
    myVideos &&
    myVideos.length > 0 &&
    myVideos.sort((a, b) => b.views - a.views);

  const indexInSorted =
    sortedVideos &&
    sortedVideos.findIndex((video) => video._id === myVideos[0]._id);

  if (loading === true) {
    return (
      <SkeletonTheme baseColor="#353535" highlightColor="#444">
        <div className="dashboard-data">
          <Skeleton count={1} width={250} height={25} />
          <div className="performed-vid-data">
          <Skeleton count={1} width={350} height={425} />

          </div>
        </div>
      </SkeletonTheme>
    );
  }

  return (
    <>
      <div className="studio-dashboard-section">
        <div className="dashboard-data">
          <p className="dashboard-top">Channel dashboard</p>
          <div className="dash-data-all">
            <div className="left-dashboard-data">
              <div className="dashboard-performance">
                <div className="video-performance">
                  <p>Latest video performance</p>
                  <div className="performed-vid-data">
                    <img
                      src={
                        myVideos &&
                        myVideos.length > 0 &&
                        myVideos[0].thumbnailURL
                      }
                      alt=""
                    />
                    <div className="video-performance-icons">
                      <div className="left-performed-icons">
                        <div className="performed-video-views">
                          <BarChartOutlinedIcon
                            fontSize="small"
                            style={{ color: "#aaa" }}
                          />
                          <p>
                            {myVideos &&
                              myVideos.length > 0 &&
                              myVideos[0].views}
                          </p>
                        </div>
                        <div className="performed-video-comments">
                          <ChatOutlinedIcon
                            fontSize="small"
                            style={{ color: "#aaa" }}
                          />
                          <p>
                            {myVideos &&
                              myVideos.length > 0 &&
                              myVideos[0].comments.length}
                          </p>
                        </div>
                        <div className="performed-video-likes">
                          <ThumbUpOutlinedIcon
                            fontSize="small"
                            style={{ color: "#aaa" }}
                          />
                          <p>
                            {myVideos &&
                              myVideos.length > 0 &&
                              myVideos[0].likes}
                          </p>
                        </div>
                      </div>
                      <div className="right-performed-icons">
                        <KeyboardArrowDownOutlinedIcon
                          fontSize="medium"
                          className="expandd"
                          style={
                            dropDown === false &&
                            myVideos &&
                            myVideos.length > 1
                              ? { color: "#aaa", cursor: "pointer" }
                              : { display: "none" }
                          }
                          onClick={() => setDropDown(true)}
                        />
                        <KeyboardArrowUpIcon
                          fontSize="medium"
                          className="expandd"
                          style={
                            dropDown === true && myVideos && myVideos.length > 1
                              ? { color: "#aaa", cursor: "pointer" }
                              : { display: "none" }
                          }
                          onClick={() => setDropDown(false)}
                        />
                      </div>
                    </div>
                    <div
                      className="extra-performance-data"
                      style={
                        myVideos && myVideos.length > 1 && dropDown === true
                          ? { display: "block" }
                          : { display: "none" }
                      }
                    >
                      <p>
                        First{" "}
                        {(() => {
                          const timeDifference =
                            new Date() -
                            new Date(
                              myVideos &&
                                myVideos.length > 0 &&
                                myVideos[0].uploaded_date
                            );
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
                            return `${minutes} mins`;
                          } else if (hours < 24) {
                            return `${hours} hours`;
                          } else if (days < 7) {
                            return `${days} days`;
                          } else if (weeks < 52) {
                            return `${weeks} weeks`;
                          } else {
                            return `${years} years`;
                          }
                        })()}
                      </p>
                      <div className="more-performed-details">
                        <div className="views-ranking">
                          <p>Ranking by views</p>
                          <div
                            className="total-outof"
                            onMouseEnter={() => setShowSortedVideos(true)}
                            onMouseLeave={() => setShowSortedVideos(false)}
                          >
                            <p>
                              {indexInSorted + 1} of {myVideos.length}
                            </p>
                            <ChevronRightIcon
                              fontSize="medium"
                              className="right-arrw"
                              style={{ color: "#aaa" }}
                            />
                          </div>
                          <div
                            className={`all-sortedvideos-dash ${
                              showSortedVideos ? "visible" : ""
                            }`}
                          >
                            <p>Top recent videos</p>
                            <p>Views</p>

                            {sortedVideos &&
                              sortedVideos.map((element, index) => {
                                return (
                                  <div
                                    className="list-of-sortedvideos"
                                    key={index}
                                  >
                                    <div className="leftsort-list">
                                      <p style={{ color: "#aaa" }}>
                                        {index + 1}
                                      </p>
                                      <div className="sorted-viddataaa">
                                        <img
                                          src={element.thumbnailURL}
                                          alt=""
                                          className="sortedthumbnail"
                                        />
                                        <p style={{ marginLeft: "12px" }}>
                                          {" "}
                                          {element.Title.length <= 25
                                            ? element.Title
                                            : `${element.Title.slice(
                                                0,
                                                25
                                              )}...`}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="right-sortlist">
                                      <p>{element.views}</p>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>

                        <div className="thisviews-performed">
                          <p>Views</p>
                          <p>
                            {myVideos &&
                              myVideos.length > 0 &&
                              myVideos[0].views}
                          </p>
                        </div>
                      </div>
                    </div>
                    <p
                      className="see-comments-dash"
                      onClick={() =>
                        (window.location.href = `/studio/video/comments/${myVideos[0]._id}`)
                      }
                    >
                      SEE COMMENTS (
                      {myVideos &&
                        myVideos.length > 0 &&
                        myVideos[0].comments.length}
                      )
                    </p>
                  </div>
                </div>
              </div>
              <div className="published-videos-dash">
                <p className="publish-toop">Published videos</p>
                <div className="all-publishvid-data">
                  {myVideos &&
                    myVideos.length > 0 &&
                    myVideos.map((element, index) => {
                      return (
                        <div className="dashboard-publishvideos" key={index}>
                          <img
                            src={element.thumbnailURL}
                            alt="thumbnail"
                            className="publish-imgs"
                          />
                          <div className="publish-rightdata">
                            <div className="toppublish">
                              {element.Title.length <= 42
                                ? element.Title
                                : `${element.Title.slice(0, 42)}...`}
                            </div>
                            <div className="bottompublish">
                              <div className="publishviews">
                                <BarChartOutlinedIcon
                                  fontSize="small"
                                  style={{ color: "#aaa" }}
                                />
                                <p>{element.views}</p>
                              </div>
                              <div className="publishcomments">
                                <ChatOutlinedIcon
                                  fontSize="small"
                                  style={{ color: "#aaa" }}
                                />
                                <p>{element.comments.length}</p>
                              </div>
                              <div className="publishlikes">
                                <ThumbUpOutlinedIcon
                                  fontSize="small"
                                  style={{ color: "#aaa" }}
                                />
                                <p>{element.likes}</p>
                              </div>
                            </div>
                            <div className="bottompublish2">
                              <div className="publishviews">
                                <ModeEditOutlineOutlinedIcon
                                  className="make-white"
                                  fontSize="small"
                                  style={{ color: "#aaa" }}
                                  onClick={() =>
                                    (window.location.href = `/studio/video/edit/${element._id}`)
                                  }
                                />
                              </div>
                              <div className="publishcomments">
                                <ChatOutlinedIcon
                                  className="make-white"
                                  fontSize="small"
                                  style={{ color: "#aaa" }}
                                  onClick={() =>
                                    (window.location.href = `/studio/video/comments/${element._id}`)
                                  }
                                />
                              </div>
                              <div className="publishlikes">
                                <YouTubeIcon
                                  className="make-white"
                                  fontSize="small"
                                  style={{ color: "#aaa" }}
                                  onClick={() =>
                                    (window.location.href = `/video/${element._id}`)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
                <p
                  className="see-comments-dash go-videos"
                  onClick={() => (window.location.href = `/studio/video`)}
                >
                  GO TO VIDEOS
                </p>
              </div>
            </div>
            <div className="right-dashboard-data">
              <div className="dashboard-analytics">
                <p>Channel analytics</p>
                <div className="subscriber-analytics">
                  <p>Current subscribers</p>
                  <p>{channelSubs}</p>
                </div>
                <div className="channel-summary">
                  <p>Summary</p>
                  <div className="channel-totalviews-analytics">
                    <p>Views</p>
                    <p>{totalViews}</p>
                  </div>
                  <div className="channel-totalvideos-analytics">
                    <p>Videos</p>
                    <p>{myVideos && myVideos.length}</p>
                  </div>
                </div>
                <div className="channel-top-videos-analytics">
                  <p>Top videos</p>
                  <p>Views</p>
                  <div className="channel-top-videosdata">
                    {sortedVideos &&
                      sortedVideos.map((element, index) => {
                        return (
                          <div className="thisanalytics-data" key={index}>
                            <p
                              onClick={() =>
                                (window.location.href = `/studio/video/edit/${element._id}`)
                              }
                            >
                              {element.Title.length <= 25
                                ? element.Title
                                : `${element.Title.slice(0, 25)}...`}
                            </p>
                            <p style={{ color: "white" }}>{element.views}</p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
