import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../Css/search.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Tooltip from "@mui/material/Tooltip";
import Zoom from "@mui/material/Zoom";

function SearchResults() {
  const { data } = useParams();
  const [searchedVideoData, setsearchedVideoData] = useState([]);
  const [searchedChannelData, setsearchedChannelData] = useState([]);
  const [channelID, setChannelID] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userVideos, setUserVideos] = useState([]);

  useEffect(() => {
    const getSearchResult = async () => {
      try {
        const response = await fetch(`http://localhost:3000/search/${data}`);
        const Data = await response.json();
        const { videoData, channelData } = Data;
        setsearchedVideoData(videoData);
        setsearchedChannelData(channelData);
      } catch (error) {
        console.log(error.message);
      }
    };
    getSearchResult();
  }, [data, searchedChannelData, searchedVideoData]);

  useEffect(() => {
    const getChannelID = () => {
      searchedChannelData.map((item) => setChannelID(item._id));
    };

    getChannelID();
  }, [searchedChannelData]);

  useEffect(() => {
    const getOtherChannel = async () => {
      try {
        if (channelID !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getotherchannel/${channelID}`
          );
          const userEmail = await response.json();
          setUserEmail(userEmail);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const interval = setInterval(getOtherChannel, 200);

    return () => clearInterval(interval);
  }, [channelID]);

  useEffect(() => {
    const getUserVideos = async () => {
      try {
        if (userEmail !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getuservideos/${userEmail}`
          );

          const myvideos = await response.json();
          setUserVideos(myvideos);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    getUserVideos();
  }, [userEmail]);

  return (
    <>
      <Navbar />
      <LeftPanel />
      <div className="searched-content">
        <div className="searched-channels-section">
          <hr className="seperate sep2" />
          {searchedChannelData &&
            searchedChannelData.length > 0 &&
            searchedChannelData.map((element, index) => {
              return (
                <div className="search-channel" key={index}>
                  <img
                    src={element.channelProfile}
                    alt="channelDP"
                    className="channel-img"
                  />
                  <div className="channel-extra-content">
                    <div className="channel-liner">
                      <p className="new-title">{element.channelName}</p>
                      <Tooltip
                        TransitionComponent={Zoom}
                        title="Verified"
                        placement="top"
                      >
                        <CheckCircleIcon
                          fontSize="100px"
                          style={{
                            color: "rgb(138, 138, 138)",
                            marginLeft: "4px",
                          }}
                        />
                      </Tooltip>
                    </div>

                    <div className="channel-liner">
                      <p className="new-email">
                        {userEmail && "@" + userEmail.split("@")[0]}
                      </p>
                      <p className="new-subs">
                        {element.subscribers} subscribers
                      </p>
                    </div>
                    <p className="new-desc">
                      {" "}
                      {element.channelDescription.length <= 140
                        ? element.channelDescription
                        : `${element.channelDescription.slice(0, 140)}...`}
                    </p>
                  </div>
                  <div className="subscribe-btnss">
                    <button
                      className="subscribethis-channel"
                      style={{ marginLeft: "130px" }}
                    >
                      Subscribe
                    </button>
                  </div>
                </div>
              );
            })}
          <hr className="seperate sep2" />
        </div>
        <div className="thischannel-videos-section">
          {searchedChannelData &&
            searchedChannelData.length > 0 &&
            userVideos &&
            userVideos.map((element, index) => {
              return (
                <>
                  <div className="thischannel-video-data" key={index}>
                    <img
                      src={element.thumbnailURL}
                      alt="thumbnail"
                      className="thischannel-thumbnail"
                    />
                  </div>
                </>
              );
            })}
        </div>
        <div className="searched-videos-section"></div>
      </div>
    </>
  );
}

export default SearchResults;
