import "../Css/leftpanel.css";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function LeftPanel() {
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    localStorage.setItem("menuClicked", JSON.stringify(menuClicked));
  }, [menuClicked]);

  const selected = localStorage.getItem("selected");

  useEffect(() => {
    const currentUrl = location.pathname;
    let selected = "";

    if (currentUrl === "/") {
      selected = "home";
    } else if (currentUrl === "/trending") {
      selected = "trending";
    } else if (currentUrl === "/watchlater") {
      selected = "watch-later";
    } else if (currentUrl === "/subscriptions") {
      selected = "subscription";
    } else if (currentUrl === "/likedVideos") {
      selected = "liked-video";
    } else {
      selected = "other";
    }

    localStorage.setItem("selected", selected);
  }, [location]);

  return (
    <>
      <div
        className="main-left-section"
        style={
          menuClicked === false ? { display: "none" } : { display: "block" }
        }
      >
        <div className="first-section ">
          <div
            className={
              selected === "home" ? "home sec-data changeBG" : "home sec-data"
            }
            onClick={() => {
              localStorage.setItem("selected", "home");
              navigate("/");
              window.location.reload();
            }}
          >
            <HomeIcon fontSize="medium" style={{ color: "white" }} />
            <p>Home</p>
          </div>
          <div
            className={
              selected === "trending"
                ? "trending sec-data changeBG"
                : "trending sec-data"
            }
            onClick={() => {
              localStorage.setItem("selected", "trending");
              navigate("/trending");
              window.location.reload();
            }}
          >
            <WhatshotOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>Trending</p>
          </div>
          <div
            className={
              selected === "subscription"
                ? "subscription sec-data changeBG"
                : "subscription sec-data"
            }
            onClick={() => {
              localStorage.setItem("selected", "subscription");
              navigate("/subscriptions");
              window.location.reload();
            }}
          >
            <SubscriptionsOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>Subscription</p>
          </div>
        </div>
        <hr className="seperate" />
        <div className="second-section">
          <div
            className={
              selected === "library"
                ? "library sec-data changeBG"
                : "library sec-data"
            }
            onClick={() => {
              localStorage.setItem("selected", "library");
            }}
          >
            <VideoLibraryOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>Library</p>
          </div>

          <div
            className={
              selected === "watch-later"
                ? "watch-later sec-data changeBG"
                : "watch-later sec-data"
            }
            onClick={() => {
              localStorage.setItem("selected", "watch-later");
              navigate("/watchlater");
              window.location.reload();
            }}
          >
            <WatchLaterOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>Watch later</p>
          </div>
          <div
            className={
              selected === "liked-video"
                ? "liked-video sec-data changeBG"
                : "liked-video sec-data"
            }
            onClick={() => {
              localStorage.setItem("selected", "liked-video");

              navigate("/likedVideos");
              window.location.reload();
            }}
          >
            <ThumbUpOutlinedIcon fontSize="medium" style={{ color: "white" }} />
            <p>Liked videos</p>
          </div>
        </div>
      </div>

      {/* SHORT HAND  */}
      <div
        className="main-left-section main-2"
        style={
          menuClicked === false ? { display: "flex" } : { display: "none" }
        }
      >
        <div className="first-section ">
          <div
            className={
              selected === "home"
                ? "home sec-data sec-data2 changeBG"
                : "home sec-data sec-data2"
            }
            onClick={() => {
              localStorage.setItem("selected", "home");

              navigate("/");
              window.location.reload();
            }}
          >
            <HomeIcon fontSize="medium" style={{ color: "white" }} />
          </div>
          <div
            className={
              selected === "trending"
                ? "trending trending2 sec-data sec-data2 changeBG"
                : "trending trending2 sec-data sec-data2"
            }
            onClick={() => {
              localStorage.setItem("selected", "trending");

              navigate("/trending");
              window.location.reload();
            }}
          >
            <WhatshotOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
          </div>
          <div
            className={
              selected === "subscription"
                ? "subscription subscription2 sec-data sec-data2 changeBG"
                : "subscription subscription2 sec-data sec-data2"
            }
            onClick={() => {
              localStorage.setItem("selected", "subscription");

              navigate("/subscription");
              window.location.reload();
            }}
          >
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
          <div
            className={
              selected === "watch-later"
                ? "watch-later watch-later2 sec-data sec-data2 changeBG"
                : "watch-later watch-later2 sec-data sec-data2"
            }
            onClick={() => {
              localStorage.setItem("selected", "watch-later");
              navigate("/watchlater");
              window.location.reload();
            }}
          >
            <WatchLaterOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
          </div>
          <div
            className={
              selected === "liked-video"
                ? "liked-video liked-video2 sec-data sec-data2 changeBG"
                : "liked-video liked-video2 sec-data sec-data2"
            }
            onClick={() => {
              localStorage.setItem("selected", "liked-video");

              navigate("/likedVideos");
              window.location.reload();
            }}
          >
            <ThumbUpOutlinedIcon fontSize="medium" style={{ color: "white" }} />
          </div>
        </div>
      </div>
    </>
  );
}

export default LeftPanel;
