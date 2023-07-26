import { useState, useEffect, useRef } from "react";
import jwtDecode from "jwt-decode";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";

function Basic() {
  const [Email, setEmail] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelDescription, setChannelDescription] = useState("");
  const [channelID, setChannelID] = useState("");
  const [Links, setLinks] = useState([]);
  const channelUrl = "http://localhost:5173/channel";
  const channelIDInputRef = useRef(null);
  const [addLinkClicked, setAddlinkClicked] = useState(false);
  const [fblink, setfblink] = useState();
  const [instalink, setinstalink] = useState();
  const [twitterlink, setTwitterlink] = useState();
  const [weblink, setweblink] = useState();

  //Social Clicks

  const [fbClicked, setFbclicked] = useState(false);
  const [instaClicked, setinstaclicked] = useState(false);
  const [twitterClicked, settwitterclicked] = useState(false);
  const [webClicked, setwebclicked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, []);

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
        const { channelDescription, channelID, links } = data;
        setChannelDescription(channelDescription);
        setChannelID(channelID);
        setLinks(links);
        links.map((item) => {
          setfblink(item.facebook);
          setinstalink(item.instagram);
          setTwitterlink(item.twitter);
          setweblink(item.website);
        });
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

  console.log(Links);

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
        <div className="basic-links-section">
          <p className="basic-link-head">Links</p>
          <p className="basic-link-desc">
            Add links to sites you want to share with your viewers{" "}
          </p>
          <div className="links-areaa">
            {Links &&
              Links.map((element, index) => {
                return (
                  <div className="mylink-data" key={index}>
                    <div
                      className="fblink-data"
                      style={
                        element.facebook || fbClicked === true
                          ? { display: "flex" }
                          : { display: "none" }
                      }
                    >
                      <FacebookIcon
                        fontSize="large"
                        style={{ color: "white" }}
                      />
                      <input
                        type="text"
                        value={fblink}
                        className="channel-link-inp"
                        onChange={(e) => setfblink(e.target.value)}
                      />
                      <DeleteOutlineOutlinedIcon
                        fontSize="medium"
                        className="delete-link"
                        style={{ color: "#aaa" }}
                        onClick={() => setFbclicked(false)}
                      />
                    </div>
                    <div
                      className="insta-data"
                      style={
                        element.instagram || instaClicked === true
                          ? { display: "flex" }
                          : { display: "none" }
                      }
                    >
                      <InstagramIcon
                        fontSize="large"
                        style={{ color: "white" }}
                      />
                      <input
                        type="text"
                        value={instalink}
                        className="channel-link-inp"
                        onChange={(e) => setinstalink(e.target.value)}
                      />
                      <DeleteOutlineOutlinedIcon
                        fontSize="medium"
                        className="delete-link"
                        style={{ color: "#aaa" }}
                        onClick={() => setinstaclicked(false)}
                      />
                    </div>
                    <div
                      className="twitter-data"
                      style={
                        element.twitter || twitterClicked === true
                          ? { display: "flex" }
                          : { display: "none" }
                      }
                    >
                      <TwitterIcon
                        fontSize="large"
                        style={{ color: "white" }}
                      />
                      <input
                        type="text"
                        value={twitterlink}
                        className="channel-link-inp"
                        onChange={(e) => setTwitterlink(e.target.value)}
                      />
                      <DeleteOutlineOutlinedIcon
                        fontSize="medium"
                        className="delete-link"
                        style={{ color: "#aaa" }}
                        onClick={() => settwitterclicked(false)}
                      />
                    </div>
                    <div
                      className="web-data"
                      style={
                        element.website || webClicked === true
                          ? { display: "flex" }
                          : { display: "none" }
                      }
                    >
                      <LanguageIcon
                        fontSize="large"
                        style={{ color: "white" }}
                      />
                      <input
                        type="text"
                        value={weblink}
                        className="channel-link-inp"
                        onChange={(e) => setweblink(e.target.value)}
                      />
                      <DeleteOutlineOutlinedIcon
                        fontSize="medium"
                        className="delete-link"
                        style={{ color: "#aaa" }}
                        onClick={() => setwebclicked(false)}
                      />
                    </div>
                  </div>
                );
              })}
            <div
              className="addnew-link"
              style={
                ((Links && Links.length > 0 && Links[0].facebook) ||
                  fbClicked === true) &&
                ((Links && Links.length > 0 && Links[0].instagram) ||
                  instaClicked === true) &&
                ((Links && Links.length > 0 && Links[0].twitter) ||
                  twitterClicked === true) &&
                ((Links && Links.length > 0 && Links[0].website) ||
                  webClicked === true)
                  ? { display: "none" }
                  : { display: "flex" }
              }
              onClick={() => {
                if (addLinkClicked === false) {
                  setAddlinkClicked(true);
                } else {
                  setAddlinkClicked(false);
                }
              }}
            >
              <AddIcon fontSize="medium" style={{ color: "#3EA6FF" }} />
              <p>ADD LINK</p>
            </div>
            <div
              className="social-icons-links2"
              style={
                addLinkClicked === true
                  ? { display: "flex" }
                  : { display: "none" }
              }
            >
              <FacebookIcon
                fontSize="large"
                className="social_links"
                style={
                  Links &&
                  Links.length > 0 &&
                  !Links[0].facebook &&
                  fbClicked === false
                    ? { color: "white", marginLeft: "6px", marginRight: "6px" }
                    : { display: "none" }
                }
                onClick={() => {
                  setFbclicked(true);
                  setAddlinkClicked(false);
                }}
              />
              <InstagramIcon
                fontSize="large"
                className="social_links"
                style={
                  Links &&
                  Links.length > 0 &&
                  !Links[0].instagram &&
                  instaClicked === false
                    ? { color: "white", marginLeft: "6px", marginRight: "6px" }
                    : { display: "none" }
                }
                onClick={() => {
                  setinstaclicked(true);
                  setAddlinkClicked(false);
                }}
              />
              <TwitterIcon
                fontSize="large"
                className="social_links"
                style={
                  Links &&
                  Links.length > 0 &&
                  !Links[0].twitter &&
                  twitterClicked === false
                    ? { color: "white", marginLeft: "6px", marginRight: "6px" }
                    : { display: "none" }
                }
                onClick={() => {
                  settwitterclicked(true);
                  setAddlinkClicked(false);
                }}
              />
              <LanguageIcon
                fontSize="large"
                className="social_links"
                style={
                  Links &&
                  Links.length > 0 &&
                  !Links[0].website &&
                  webClicked === false
                    ? { color: "white", marginLeft: "6px", marginRight: "6px" }
                    : { display: "none" }
                }
                onClick={() => {
                  setwebclicked(true);
                  setAddlinkClicked(false);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Basic;
