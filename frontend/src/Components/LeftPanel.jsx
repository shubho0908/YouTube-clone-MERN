import "../Css/leftpanel.css";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { useEffect, useState } from "react";

function LeftPanel() {
  const [menuClicked, setMenuClicked] = useState(false);

  useEffect(() => {
    const handleMenuButtonClick = () => {
      setMenuClicked((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".menu");
    menuButton.addEventListener("click", handleMenuButtonClick);

    return () => {
      menuButton.removeEventListener("click", handleMenuButtonClick);
    };
  }, []);

  return (
    <>
      <div
        className="main-left-section"
        style={
          menuClicked === true ? { display: "none" } : { display: "block" }
        }
      >
        <div className="first-section ">
          <div className="home sec-data">
            <HomeIcon fontSize="medium" style={{ color: "white" }} />
            <p>Home</p>
          </div>
          <div className="trending sec-data">
            <WhatshotOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>Trending</p>
          </div>
          <div className="subscription sec-data">
            <SubscriptionsOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>Subscription</p>
          </div>
        </div>
        <hr className="seperate" />
        <div className="second-section">
          <div className="library sec-data">
            <VideoLibraryOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>Library</p>
          </div>
          <div className="history sec-data">
            <HistoryOutlinedIcon fontSize="medium" style={{ color: "white" }} />
            <p>History</p>
          </div>
          <div className="watch-later sec-data">
            <WatchLaterOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>Watch later</p>
          </div>
          <div className="liked-video sec-data">
            <ThumbUpOutlinedIcon fontSize="medium" style={{ color: "white" }} />
            <p>Liked videos</p>
          </div>
        </div>
        
      </div>

      {/* SHORT HAND  */}
      <div
        className="main-left-section main-2"
        style={
          menuClicked === true ? { display: "flex" } : { display: "none" }
        }
      >
        <div className="first-section ">
          <div className="home sec-data sec-data2">
            <HomeIcon fontSize="medium" style={{ color: "white" }} />
          </div>
          <div className="trending trending2 sec-data sec-data2">
            <WhatshotOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
          </div>
          <div className="subscription subscription2 sec-data sec-data2">
            <SubscriptionsOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
          </div>
        </div>
        {/* <hr className="seperate" /> */}
        <div className="second-section">
          <div className="library library2 sec-data sec-data2">
            <VideoLibraryOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default LeftPanel;
