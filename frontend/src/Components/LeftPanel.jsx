import "../Css/leftpanel.css";
import HomeIcon from "@mui/icons-material/Home";
import WhatshotOutlinedIcon from "@mui/icons-material/WhatshotOutlined";
import SubscriptionsOutlinedIcon from "@mui/icons-material/SubscriptionsOutlined";
import VideoLibraryOutlinedIcon from "@mui/icons-material/VideoLibraryOutlined";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import WatchLaterOutlinedIcon from "@mui/icons-material/WatchLaterOutlined";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import Signup from "./Signup";
import Signin from "./Signin";
import { useNavigate, useLocation } from "react-router-dom";

function LeftPanel() {
  const [menuClicked, setMenuClicked] = useState(() => {
    const menu = localStorage.getItem("menuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const navigate = useNavigate();
  const [Email, setEmail] = useState();
  const location = useLocation();
  const [Subscriptions, setSubscriptions] = useState([]);
  const [isbtnClicked, setisbtnClicked] = useState(false);
  const token = localStorage.getItem("userToken");
  const [isSwitch, setisSwitched] = useState(false);

  useEffect(() => {
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

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

  useEffect(() => {
    const getSubscriptions = async () => {
      try {
        if (Email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getsubscriptions/${Email}`
          );
          const result = await response.json();
          setSubscriptions(result);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const interval = setInterval(getSubscriptions, 100);

    return () => clearInterval(interval);
  }, [Email]);

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
              if (token) {
                localStorage.setItem("selected", "subscription");
                navigate("/subscriptions");
                window.location.reload();
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            <SubscriptionsOutlinedIcon
              fontSize="medium"
              style={{ color: "white" }}
            />
            <p>Subscription</p>
          </div>
          <div
            className="subscribed-channels"
            style={
              Subscriptions && Subscriptions.length > 0
                ? { display: "block" }
                : { display: "none" }
            }
          >
            {Subscriptions &&
              Subscriptions.length > 0 &&
              Subscriptions.map((element, index) => {
                return (
                  <div
                    className="mysubscriptions"
                    key={index}
                    onClick={() => {
                      navigate(`/channel/${element.channelID}`);
                      window.location.reload();
                    }}
                  >
                    <img
                      src={element.channelProfile}
                      alt="channel profile"
                      className="channel-profilee"
                    />
                    <p className="sub-channelnamee">
                      {element.channelname.length <= 7
                        ? element.channelname
                        : `${element.channelname.slice(0, 7)}..`}
                    </p>
                  </div>
                );
              })}
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
              if (token) {
                localStorage.setItem("selected", "library");
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
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
              if (token) {
                localStorage.setItem("selected", "watch-later");
                navigate("/watchlater");
                window.location.reload();
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
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
              if (token) {
                localStorage.setItem("selected", "liked-video");

                navigate("/likedVideos");
                window.location.reload();
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            <ThumbUpOutlinedIcon fontSize="medium" style={{ color: "white" }} />
            <p>Liked videos</p>
          </div>
          <hr className="seperate" />
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
              if (token) {
                localStorage.setItem("selected", "subscription");
                navigate("/subscriptions");
                window.location.reload();
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
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
              if (token) {
                localStorage.setItem("selected", "watch-later");
                navigate("/watchlater");
                window.location.reload();
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
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
              if (token) {
                localStorage.setItem("selected", "liked-video");

                navigate("/likedVideos");
                window.location.reload();
              } else {
                setisbtnClicked(true);
                document.body.classList.add("bg-css");
              }
            }}
          >
            <ThumbUpOutlinedIcon fontSize="medium" style={{ color: "white" }} />
          </div>
        </div>
      </div>

      {/* SIGNUP/SIGNIN  */}

      <div
        className="auth-popup"
        style={
          isbtnClicked === true ? { display: "block" } : { display: "none" }
        }
      >
        <ClearRoundedIcon
          onClick={() => {
            if (isbtnClicked === false) {
              setisbtnClicked(true);
            } else {
              setisbtnClicked(false);
              document.body.classList.remove("bg-css");
            }
          }}
          className="cancel"
          fontSize="large"
          style={{ color: "gray" }}
        />
        <div
          className="signup-last"
          style={
            isSwitch === false ? { display: "block" } : { display: "none" }
          }
        >
          <Signup />
          <div className="already">
            <p>Already have an account?</p>
            <p
              onClick={() => {
                if (isSwitch === false) {
                  setisSwitched(true);
                } else {
                  setisSwitched(false);
                }
              }}
            >
              Signin
            </p>
          </div>
        </div>
        <div
          className="signin-last"
          style={isSwitch === true ? { display: "block" } : { display: "none" }}
        >
          <Signin />
          <div className="already">
            <p>Don&apos;t have an account?</p>
            <p
              onClick={() => {
                if (isSwitch === false) {
                  setisSwitched(true);
                } else {
                  setisSwitched(false);
                }
              }}
            >
              Signup
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default LeftPanel;
