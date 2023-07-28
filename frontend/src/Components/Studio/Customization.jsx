import Navbar2 from "../Navbar2";
import LeftPanel2 from "../LeftPanel2";
import "../../Css/Studio/customize.css";
import Branding from "./Branding";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Basic from "./Basic";

function Customization() {
  const [currentTab, setCurrentTab] = useState("branding");
  const navigate = useNavigate();

  useEffect(() => {
    const createBtn = document.querySelector(".create-btn");

    const handleClick = () => {
      navigate("/studio");
      window.location.reload()
    };

    if (createBtn) {
      createBtn.addEventListener("click", handleClick);
    }

    return () => {
      if (createBtn) {
        createBtn.removeEventListener("click", handleClick);
      }
    };
  });

  return (
    <>
      <Navbar2 />
      <LeftPanel2 />
      <div className="channel-customize">
        <div className="channel-customize-section">
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
              <p>VIEW CHANNEL</p>
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
