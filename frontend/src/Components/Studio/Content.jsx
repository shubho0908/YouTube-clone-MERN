import LeftPanel2 from "../LeftPanel2";
import Navbar2 from "../Navbar2";
import "../../Css/Studio/content.css";
import SouthIcon from "@mui/icons-material/South";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import RemoveRedEyeOutlinedIcon from "@mui/icons-material/RemoveRedEyeOutlined";

function Content() {
  const [userVideos, setUserVideos] = useState([]);
  const [Email, setEmail] = useState();

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
          {userVideos && userVideos.length > 0 && (
            <table className="videos-table">
              <thead>
                <tr style={{ color: "#aaa", fontSize: "14px" }}>
                  <th style={{ textAlign: "left", paddingLeft: "40px" }}>
                    Video
                  </th>
                  <th>Visibility</th>
                  <th>Date</th>
                  <th>Views</th>
                  <th>Comments</th>
                  <th>Likes</th>
                </tr>
              </thead>
              <tbody>
                {userVideos.map((element, index) => {
                  const uploaded = new Date(element.uploaded_date);
                  return (
                    <tr key={index}>
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
