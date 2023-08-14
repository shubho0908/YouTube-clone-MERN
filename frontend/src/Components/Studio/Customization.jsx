import Navbar2 from "../Navbar2";
import LeftPanel2 from "../LeftPanel2";
import "../../Css/Studio/customize.css";
import Branding from "./Branding";
import { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import Basic from "./Basic";

function Customization() {
  const [currentTab, setCurrentTab] = useState("branding");
  const [email, setEmail] = useState();
  const [channelID, setChannelID] = useState();
  const token = localStorage.getItem("userToken");
  const [menu, setmenu] = useState(() => {
    const menu = localStorage.getItem("studioMenuClicked");
    return menu ? JSON.parse(menu) : false;
  });

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
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

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
        if (email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getchannelid/${email}`
          );
          const { channelID } = await response.json();
          setChannelID(channelID);
        }
      } catch (error) {
        // console.log("Error fetching user data:", error.message);
      }
    };

    const interval = setInterval(getChannelID, 100);

    return () => clearInterval(interval);
  }, [email]);

  return (
    <>
      <Navbar2 />
      <LeftPanel2 />
      <div className="channel-customize">
        <div
          className="channel-customize-section"
          style={{ left: menu ? "90px" : " 270px" }}
        >
          <div className="customize-header">
            <p>Channel customization</p>
          </div>
          <div className="redirectss">
            <div className="left-redirects">
              <p
                className={
                  currentTab === "branding" ? "branding-txt1" : "branding-txt"
                }
                onClick={() => setCurrentTab("branding")}
              >
                Branding
              </p>
              <p
                className={currentTab === "basic" ? "basic-txt1" : "basic-txt"}
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
              <button className="save-customize">PUBLISH</button>
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
