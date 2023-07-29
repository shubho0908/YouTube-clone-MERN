import LeftPanel2 from "../LeftPanel2";
import Navbar2 from "../Navbar2";
import "../../Css/Studio/content.css";
import SouthIcon from "@mui/icons-material/South";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import InsertCommentOutlinedIcon from "@mui/icons-material/InsertCommentOutlined";
import YouTubeIcon from "@mui/icons-material/YouTube";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import NorthOutlinedIcon from "@mui/icons-material/NorthOutlined";

function Content() {
  const [userVideos, setUserVideos] = useState([]);
  const [sortByDateAsc, setSortByDateAsc] = useState(true);
  const [Email, setEmail] = useState();
  const [changeSort, setChangeSort] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    setEmail(jwtDecode(token).email);
  }, []);

  useEffect(() => {
    const GetUserVideos = async () => {
      try {
        if (Email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getuservideos/${Email}`
          );

          const data = await response.json();
          setUserVideos(data);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    const interval = setInterval(GetUserVideos, 100);

    return () => clearInterval(interval);
  }, [Email]);

  const handleSortByDate = () => {
    setSortByDateAsc((prevState) => !prevState);
    setChangeSort(!changeSort);
  };

  const sortedUserVideos = userVideos.sort((a, b) => {
    if (sortByDateAsc) {
      return new Date(a.uploaded_date) - new Date(b.uploaded_date);
    } else {
      return new Date(b.uploaded_date) - new Date(a.uploaded_date);
    }
  });

  return (
    <>
      <Navbar2 />
      <LeftPanel2 />
      <div className="channel-content-section">
        <div className="channel-content-top">
          <p>Channel content</p>
          <p className="channel-videosss">Videos</p>
        </div>
        <hr className="breakk2 breakkk" />
        <div className="channels-uploaded-videos-section">
          {sortedUserVideos && sortedUserVideos.length > 0 && (
            <table className="videos-table">
              <thead>
                <tr style={{ color: "#aaa", fontSize: "14px" }}>
                  <th
                    style={{
                      textAlign: "left",
                      paddingLeft: "40px",
                      width: "45%",
                    }}
                  >
                    Video
                  </th>
                  <th>Visibility</th>
                  <th onClick={handleSortByDate} className="date-table-head">
                    <div className="table-row">
                      <p>Date</p>
                      {changeSort === false ? (
                        <SouthIcon
                          fontSize="200px"
                          style={{ color: "white", marginLeft: "5px" }}
                        />
                      ) : (
                        <NorthOutlinedIcon
                          fontSize="200px"
                          style={{ color: "white", marginLeft: "5px" }}
                        />
                      )}
                    </div>
                  </th>
                  <th>Views</th>
                  <th>Comments</th>
                  <th>Likes</th>
                </tr>
              </thead>
              <tbody>
                {sortedUserVideos.map((element, index) => {
                  const uploaded = new Date(element.uploaded_date);
                  return (
                    <tr key={index} className="table-roww">
                      <td className="video-cell">
                        <img
                          src={element.thumbnailURL}
                          alt="thumbnail"
                          className="studio-video-thumbnail"
                        />
                        <p className="video-left-duration">
                          {Math.floor(element.videoLength / 60) +
                            ":" +
                            (Math.round(element.videoLength % 60) < 10
                              ? "0" + Math.round(element.videoLength % 60)
                              : Math.round(element.videoLength % 60))}
                        </p>
                        <div className="studio-video-details">
                          <p className="studio-video-title">
                            {element.Title.length <= 40
                              ? element.Title
                              : `${element.Title.slice(0, 40)}...`}
                          </p>
                          {element.Description ? (
                            <p className="studio-video-desc">
                              {element.Description.length <= 85
                                ? element.Description
                                : `${element.Description.slice(0, 85)}...`}
                            </p>
                          ) : (
                            <p>Add description</p>
                          )}
                          <div className="video-editable-section">
                            <ModeEditOutlineOutlinedIcon
                              className="video-edit-icons"
                              fontSize="medium"
                              style={{ color: "#aaa" }}
                            />
                            <InsertCommentOutlinedIcon
                              className="video-edit-icons"
                              fontSize="medium"
                              style={{ color: "#aaa" }}
                            />
                            <YouTubeIcon
                              className="video-edit-icons"
                              fontSize="medium"
                              style={{ color: "#aaa" }}
                            />
                            <MoreVertOutlinedIcon
                              className="video-edit-icons"
                              fontSize="medium"
                              style={{ color: "#aaa" }}
                            />
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="privacy-table">
                          <RemoveRedEyeOutlinedIcon
                            fontSize="small"
                            style={{ color: "#2ba640" }}
                          />
                          <p style={{ marginLeft: "8px" }}>
                            {element.visibility}
                          </p>
                        </div>
                      </td>
                      <td>
                        <p>
                          {uploaded.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      </td>
                      <td>
                        <p>{element.views && element.views.toLocaleString()}</p>
                      </td>
                      <td>
                        <p>{element.comments && element.comments.length}</p>
                      </td>
                      <td>
                        <p>{element.likes}</p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}

export default Content;
