import { useState, useEffect, useRef } from "react";
import jwtDecode from "jwt-decode";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";

function Basic() {
  const [Email, setEmail] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [channelID, setChannelID] = useState("");
  const channelUrl = "http://localhost:5173/channel";
  const channelIDInputRef = useRef(null);
  const [changes, setChanges] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, []);

  useEffect(() => {
    const handleMenuButtonClick = () => {
      alert("Jai shree raam");
    };

    const publishBtn = document.querySelector(".save-customize");

    if (changes === false) {
      publishBtn.classList.add("disable-btn");
    } else {
      publishBtn.classList.remove("disable-btn");

      publishBtn.addEventListener("click", handleMenuButtonClick);

      return () => {
        publishBtn.removeEventListener("click", handleMenuButtonClick);
      };
    }
  }, [changes]);

  const handleChannelIDClick = () => {
    if (channelIDInputRef.current) {
      channelIDInputRef.current.select();
    }
  };

  useEffect(() => {
    const getChannelData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getchannel/${Email}`
        );
        const { ChannelName } = await response.json();
        setChannelName(ChannelName);
      } catch (error) {
        console.log(error.message);
      }
    };

    const getChannelData2 = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getchannelid/${Email}`
        );
        const data = await response.json();
        const { channelDescription, channelID } = data;
        setChannelDescription(channelDescription);
        setChannelID(channelID);
      } catch (error) {
        console.log(error.message);
      }
    };

    getChannelData();
    getChannelData2();
  }, [Email]);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(`${channelUrl}/${channelID}`)
      .then(() => {
        handleChannelIDClick();
        alert("Link Copied!");
      })
      .catch((error) => {
        console.log("Error copying link to clipboard:", error);
      });
  };

  
  return (
    <>
      <div className="basic-info-section">
        <div className="basic-name-section">
          <p className="basic-name-head">Name</p>
          <p className="basic-name-desc">
            Choose a channel name that represents you and your content. Changes
            made to your name and picture are visible only on YouTube.
          </p>
          {channelName === "" || channelName === "undefined" ? (
            <input
              type="text"
              className="channel-name-inp"
              value="Loading..."
              style={{ pointerEvents: "none" }}
              placeholder="Enter channel name"
            />
          ) : (
            <input
              type="text"
              className="channel-name-inp"
              value={channelName}
              required
              placeholder="Enter channel name"
              onChange={(e) => {
                setChannelName(e.target.value);
                setChanges(true);
              }}
            />
          )}
        </div>
        <div className="basic-description-section">
          <p className="basic-desc-head">Description</p>
          {channelDescription === "" || channelDescription === "undefined" ? (
            <textarea
              name="channel-desc"
              className="basic-channel-desc"
              style={{ pointerEvents: "none" }}
              value="Loading..."
              cols="30"
              rows="10"
              maxLength={1000}
            ></textarea>
          ) : (
            <textarea
              name="channel-desc"
              className="basic-channel-desc"
              required
              value={channelDescription}
              style={
                channelDescription === ""
                  ? { height: "80px" }
                  : { height: "max-content" }
              }
              onChange={(e) => {
                setChannelDescription(e.target.value);
                setChanges(true);
              }}
              cols="30"
              rows="10"
              maxLength={1000}
              placeholder="Tell viewers about your channel. Your description will appear in the About section of your channel and search results, among other places."
            ></textarea>
          )}
        </div>
        <div className="basic-channelurl-section">
          <p className="basic-channelurl-head">Channel URL</p>
          <p className="basic-channelurl-desc">
            This is the standard web address for your channel. It includes your
            unique channel ID, which is the numbers and letters at the end of
            the URL.
          </p>
          {channelID === "" || channelID === "undefined" ? (
            <input
              type="text"
              className="channel-name-inp2"
              value="Loading..."
              style={{ pointerEvents: "none" }}
            />
          ) : (
            <>
              <input
                type="text"
                className="channel-name-inp2"
                value={`${channelUrl}/${channelID}`}
                onClick={handleCopyLink}
                ref={channelIDInputRef}
              />
              <ContentCopyOutlinedIcon
                className="coppy-id"
                onClick={handleCopyLink}
                fontSize="medium"
                style={{ color: "white" }}
              />
            </>
          )}
        </div>
        
      </div>
    </>
  );
}

export default Basic;
