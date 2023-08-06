import { useEffect, useState } from "react";
import "../../Css/Studio/dashboard.css";
import jwtDecode from "jwt-decode";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

function Dashboard() {
  const [myVideos, setMyVideos] = useState([]);
  const [Email, setEmail] = useState();
  const [dropDown, setDropDown] = useState(false);

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

  const sortedVideos =
    myVideos &&
    myVideos.length > 0 &&
    myVideos.sort((a, b) => b.views - a.views);

  const indexInSorted =
    sortedVideos &&
    sortedVideos.findIndex((video) => video._id === myVideos[0]._id);

  return (
    <>
      <div className="studio-dashboard-section">
        <div className="dashboard-data">
          <p className="dashboard-top">Channel dashboard</p>
          <div className="dashboard-performance">
            <div className="video-performance">
              <p>Latest video performance</p>
              <div className="performed-vid-data">
                <img
                  src={
                    myVideos && myVideos.length > 0 && myVideos[0].thumbnailURL
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
                        {myVideos && myVideos.length > 0 && myVideos[0].views}
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
                        {myVideos && myVideos.length > 0 && myVideos[0].likes}
                      </p>
                    </div>
                  </div>
                  <div className="right-performed-icons">
                    <KeyboardArrowDownOutlinedIcon
                      fontSize="medium"
                      className="expandd"
                      style={
                        dropDown === false && myVideos && myVideos.length > 1
                          ? { color: "#aaa", cursor:"pointer" }
                          : { display: "none" }
                      }
                      onClick={() => setDropDown(true)}
                    />
                    <KeyboardArrowUpIcon
                      fontSize="medium"
                      className="expandd"
                      style={
                        dropDown === true && myVideos && myVideos.length > 1
                          ? { color: "#aaa", cursor:"pointer" }
                          : { display: "none" }
                      }
                      onClick={() => setDropDown(false)}
                    />
                  </div>
                </div>
                <div className="extra-performance-data"
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
                      const years = Math.floor(timeDifference / 31536000000);

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
                  <div className="more-performed-details"
                  
                  >
                    <div
                      className="views-ranking"
                      
                    >
                      <p>Ranking by views</p>
                      <div className="total-outof">
                        <p>
                          {indexInSorted + 1} of {myVideos.length}
                        </p>
                        <ChevronRightIcon
                          fontSize="medium"
                          style={{ color: "#aaa" }}
                        />
                      </div>
                    </div>
                    <div className="thisviews-performed">
                      <p>Views</p>
                      <p>
                        {myVideos && myVideos.length > 0 && myVideos[0].views}
                      </p>
                    </div>
                  </div>
                </div>
                <p className="see-comments-dash">
                  SEE COMMENTS (
                  {myVideos &&
                    myVideos.length > 0 &&
                    myVideos[0].comments.length}
                  )
                </p>
              </div>
            </div>
            <div className="published-videos-dash"></div>
          </div>
          <div className="dashboard-analytics"></div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
