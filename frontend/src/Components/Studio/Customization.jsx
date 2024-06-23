import Navbar2 from "../Navbar2";
import LeftPanel2 from "../LeftPanel2";
import "../../Css/Studio/customize.css";
import Branding from "./Branding";
import { useState, useEffect } from "react";
import Basic from "./Basic";
import { useSelector } from "react-redux";

function Customization() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000";
  const [currentTab, setCurrentTab] = useState("branding");
  const [channelID, setChannelID] = useState();
  const [menu, setmenu] = useState(() => {
    const menu = localStorage.getItem("studioMenuClicked");
    return menu ? JSON.parse(menu) : false;
  });
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const User = useSelector((state) => state.user.user);
  const { user } = User;
  document.title = "Channel customization - YouTube Studio";

  useEffect(() => {
    const handleMenuButtonClick = () => {
      setmenu((prevMenuClicked) => !prevMenuClicked);
    };

    const menuButton = document.querySelector(".menu2");
    if (menuButton) {
      menuButton.addEventListener("click", handleMenuButtonClick);
    }

    return () => {
      if (menuButton) {
        menuButton.removeEventListener("click", handleMenuButtonClick);
      }
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("studioMenuClicked", JSON.stringify(menu));
  }, [menu]);

  useEffect(() => {
    if (theme === false && window.location.href.includes("/studio/customize")) {
      document.body.style.backgroundColor = "white";
    } else if (
      theme === true &&
      window.location.href.includes("/studio/customize")
    ) {
      document.body.style.backgroundColor = "#282828";
    }
  }, [theme]);

  useEffect(() => {
    const handleClick = () => {
      document.querySelector(".channel-customize").classList.add("studio-dark");
    };

    const searchInp = document.getElementById("searchType2");

    if (searchInp) {
      searchInp.addEventListener("click", handleClick);
    }

    return () => {
      if (searchInp) {
        searchInp.removeEventListener("click", handleClick);
      }
    };
  });

  useEffect(() => {
    const handleClick = () => {
      document
        .querySelector(".channel-customize")
        .classList.remove("studio-dark");
    };

    const crossBtn = document.querySelector(".clear-search");

    if (crossBtn) {
      crossBtn.addEventListener("click", handleClick);
    }

    return () => {
      if (crossBtn) {
        crossBtn.removeEventListener("click", handleClick);
      }
    };
  });

  useEffect(() => {
    const getChannelID = async () => {
      try {
        if (user?.email) {
          const response = await fetch(
            `${backendURL}/getchannelid/${user?.email}`
          );
          const { channelID } = await response.json();
          setChannelID(channelID);
        }
      } catch (error) {
        // console.log("Error fetching user data:", error.message);
      }
    };

    getChannelID()
  }, [user?.email]);

  return (
    <>
      <Navbar2 />
      <LeftPanel2 />
      <div className="channel-customize">
        <div
          className="channel-customize-section"
          style={{
            left: menu ? "90px" : " 270px",
            transition: menu ? "all .12s ease" : "none",
          }}
        >
          <div className="customize-header">
            <p className={theme ? "" : "text-light-mode"}>
              Channel customization
            </p>
          </div>
          <div className="redirectss">
            <div className="left-redirects">
              <p
                className={
                  currentTab === "branding"
                    ? `branding-txt1 ${theme ? "" : "text-light-mode2"}`
                    : `branding-txt ${theme ? "" : "text-light-mode2"}`
                }
                onClick={() => setCurrentTab("branding")}
              >
                Branding
              </p>
              <p
                className={
                  currentTab === "basic"
                    ? `basic-txt1 ${theme ? "" : "text-light-mode2"}`
                    : `basic-txt ${theme ? "" : "text-light-mode2"}`
                }
                style={{ marginLeft: "40px" }}
                onClick={() => setCurrentTab("basic")}
              >
                Basic info
              </p>
            </div>
            <div className="right-redirects">
              <p
                onClick={() => {
                  if (channelID !== undefined) {
                    window.location.href = `/channel/${channelID}`;
                  }
                }}
                style={{ cursor: "pointer" }}
              >
                VIEW CHANNEL
              </p>
              <button className={theme ?"save-customize" : "save-customize text-dark-mode"}>PUBLISH</button>
            </div>
          </div>
          <hr className="breakk" />
          <div className="customize-data-section">
            {currentTab === "branding" ? <Branding /> : <Basic />}
          </div>
        </div>
      </div>
    </>
  );
}

export default Customization;
