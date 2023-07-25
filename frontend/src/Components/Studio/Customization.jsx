import Navbar2 from "../Navbar2";
import LeftPanel2 from "../LeftPanel2";
import "../../Css/Studio/customize.css";
import Branding from "./Branding";
import { useState } from "react";

function Customization() {
  const [currentTab, setCurrentTab] = useState("branding");
 

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
              <p>CANCEL</p>
              <button className="save-customize">PUBLISH</button>
            </div>
          </div>
          <hr className="breakk" />
          <div className="customize-data-section">
            <Branding />
          </div>
        </div>
      </div>
    </>
  );
}

export default Customization;
