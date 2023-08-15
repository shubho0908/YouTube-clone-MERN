import { useState, useEffect, useRef } from "react";
import jwtDecode from "jwt-decode";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LanguageIcon from "@mui/icons-material/Language";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";

function Basic() {
  const [Email, setEmail] = useState("");
  const [channelName, setChannelName] = useState();
  const [channelDescription, setChannelDescription] = useState();
  const [channelID, setChannelID] = useState("");
  const channelUrl = "http://localhost:5173/channel";
  const channelIDInputRef = useRef(null);
  const [Basicchanges, setBasicChanges] = useState(false);
  const [Linkchanges, setLinkChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [Links, setLinks] = useState([]);
  const [addLink, setAddLink] = useState(false);
  const [instaSelected, setInstaSelected] = useState(false);
  const [FBSelected, setFBSelected] = useState(false);
  const [TwitterSelected, setTwitterSelected] = useState(false);
  const [WebSelected, setWebSelected] = useState(false);
  const [instalink, setInstaLink] = useState("");
  const [fblink, setfbLink] = useState("");
  const [twitterlink, settwitterLink] = useState("");
  const [weblink, setwebLink] = useState("");

  //USE EFFECTS

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
        // console.log(error.message);
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
        setInstaLink(links[0].instagram ? links[0].instagram : "");
        setfbLink(links[0].facebook ? links[0].facebook : "");
        settwitterLink(links[0].twitter ? links[0].twitter : "");
        setwebLink(links[0].website ? links[0].website : "");
      } catch (error) {
        // console.log(error.message);
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

  //POST REQUEST

  const SaveLinksData = async () => {
    try {
      setLoading(true);

      if (Email !== undefined) {
        const data = {
          fblink: fblink,
          instalink: instalink,
          twitterlink: twitterlink,
          websitelink: weblink,
          channelID: channelID,
        };
        const response = await fetch(
          `http://localhost:3000/savelinksdata/${Email}`,
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        await response.json();
      }
    } catch (error) {
      // console.log(error.message);
    }
  };

  const saveData = async () => {
    try {
      setLoading(true);
      if (
        Email !== undefined &&
        channelName !== undefined &&
        channelDescription !== undefined &&
        channelID !== undefined
      ) {
        const data = {
          channelName,
          channelDescription,
          channelID,
        };
        const response = await fetch(
          `http://localhost:3000/updatechanneldata/${Email}`,
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const Data = await response.json();
        console.log(Data);
      }
    } catch (error) {
      setLoading(false);
      // console.log(error.message);
    }
  };

  useEffect(() => {
    const publishBtn = document.querySelector(".save-customize");

    const handleMenuButtonClick = () => {
      if (channelDescription === "" || channelName === "") {
        alert("Input fields can't be empty");
      } else {
        if (Basicchanges) {
          saveData();
        }
        if (Linkchanges) {
          SaveLinksData();
        }

        setTimeout(() => {
          setLoading(false);
          setBasicChanges(false);
          setLinkChanges(false);
          window.location.reload();
        }, 3800);
      }
    };

    if ((Basicchanges === false && Linkchanges === false) || loading) {
      publishBtn.classList.add("disable-btn");
    } else {
      publishBtn.classList.remove("disable-btn");

      publishBtn.addEventListener("click", handleMenuButtonClick);

      return () => {
        publishBtn.removeEventListener("click", handleMenuButtonClick);
      };
    }
  });

  return (
    <>
      <div
        className="basic-info-section"
        style={{
          opacity: loading ? "0.35" : "1",
          transition: "opacity .15s ease",
          cursor: loading ? "wait" : "auto",
          pointerEvents: loading ? "none" : "auto",
        }}
      >
        <div className="basic-name-section">
          <p className="basic-name-head">Name</p>
          <p className="basic-name-desc">
            Choose a channel name that represents you and your content. Changes
            made to your name and picture are visible only on YouTube.
          </p>
          {channelName === undefined ? (
            <input
              type="text"
              className="channel-name-inp"
              value="Loading..."
              style={{ pointerEvents: "none", cursor: "wait" }}
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
                setBasicChanges(true);
              }}
            />
          )}
        </div>
        <div className="basic-description-section">
          <p className="basic-desc-head">Description</p>
          {channelDescription === undefined ? (
            <textarea
              name="channel-desc"
              className="basic-channel-desc"
              style={{ pointerEvents: "none", cursor: "wait" }}
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
              style={{
                height: channelDescription === "" ? "80px" : "max-content",
                cursor: channelName === undefined ? "not-allowed" : "auto",
              }}
              onChange={(e) => {
                if (channelName !== undefined) {
                  setChannelDescription(e.target.value);
                  setBasicChanges(true);
                }
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
          <p className="basic-channelurl-head">Links</p>
          <p className="basic-link-desc">
            Share external links with your viewers. They&apos;ll be visible on
            your channel&apos;s about page. Note: To delete/remove the pre-added
            link kindly leave the input field empty.
          </p>
          {Links &&
            Links.length > 0 &&
            Links.map((element, index) => {
              return (
                <div className="uerlinks-data" key={index}>
                  {element.instagram && element.instagram !== "" && (
                    <div className="users-instalink">
                      <InstagramIcon
                        fontSize="large"
                        className="studio-social-icons"
                        style={{ color: "white" }}
                      />
                      <input
                        type="text"
                        className="edit-instalink"
                        value={instalink}
                        onChange={(e) => {
                          setInstaLink(e.target.value);
                          setLinkChanges(true);
                        }}
                      />
                      <CloseIcon
                        className="delete-social"
                        style={{ color: "#aaaaaa89" }}
                        onClick={() => {
                          setLinkChanges(true);
                          setInstaLink("");
                        }}
                      />
                    </div>
                  )}
                  {instaSelected && (
                    <div
                      className="users-instalink"
                      style={{
                        transition: "all .2s ease",
                        animation: "social-animation2 0.5s ease",
                      }}
                    >
                      <InstagramIcon
                        fontSize="large"
                        className="studio-social-icons"
                        style={{ color: "white" }}
                      />
                      <input
                        type="text"
                        className="edit-instalink"
                        value={instalink}
                        onChange={(e) => {
                          setInstaLink(e.target.value);
                          setLinkChanges(true);
                        }}
                      />
                      <CloseIcon
                        className="delete-social"
                        style={{ color: "#aaaaaa89" }}
                        onClick={() => {
                          setInstaSelected(false);
                          setLinkChanges(true);
                          setInstaLink("");
                        }}
                      />
                    </div>
                  )}
                  {element.facebook && element.facebook !== "" && (
                    <div className="users-fblink">
                      <FacebookIcon
                        fontSize="large"
                        className="studio-social-icons"
                        style={{ color: "white" }}
                      />
                      <input
                        type="text"
                        className="edit-fblink"
                        value={fblink}
                        onChange={(e) => {
                          setfbLink(e.target.value);
                          setLinkChanges(true);
                        }}
                      />
                      <CloseIcon
                        className="delete-social"
                        style={{ color: "#aaaaaa89" }}
                        onClick={() => {
                          setLinkChanges(true);
                          setfbLink("");
                        }}
                      />
                    </div>
                  )}
                  {FBSelected && (
                    <div
                      className="users-fblink"
                      style={{
                        transition: "all .2s ease",
                        animation: "social-animation2 0.5s ease",
                      }}
                    >
                      <FacebookIcon
                        fontSize="large"
                        className="studio-social-icons"
                        style={{ color: "white" }}
                      />
                      <input
                        type="text"
                        className="edit-fblink"
                        value={fblink}
                        onChange={(e) => {
                          setfbLink(e.target.value);
                          setLinkChanges(true);
                        }}
                      />
                      <CloseIcon
                        className="delete-social"
                        style={{ color: "#aaaaaa89" }}
                        onClick={() => {
                          setFBSelected(false);
                          setLinkChanges(true);
                          setfbLink("");
                        }}
                      />
                    </div>
                  )}
                  {element.twitter && element.twitter !== "" && (
                    <div className="users-twitterlink">
                      <TwitterIcon
                        fontSize="large"
                        className="studio-social-icons"
                        style={{ color: "white" }}
                      />
                      <input
                        type="text"
                        className="edit-twitterlink"
                        value={twitterlink}
                        onChange={(e) => {
                          settwitterLink(e.target.value);
                          setLinkChanges(true);
                        }}
                      />
                      <CloseIcon
                        className="delete-social"
                        style={{ color: "#aaaaaa89" }}
                        onClick={() => {
                          setLinkChanges(true);
                          settwitterLink("");
                        }}
                      />
                    </div>
                  )}
                  {TwitterSelected && (
                    <div
                      className="users-twitterlink"
                      style={{
                        transition: "all .2s ease",
                        animation: "social-animation2 0.5s ease",
                      }}
                    >
                      <TwitterIcon
                        fontSize="large"
                        className="studio-social-icons"
                        style={{ color: "white" }}
                      />
                      <input
                        type="text"
                        className="edit-twitterlink"
                        value={twitterlink}
                        onChange={(e) => {
                          settwitterLink(e.target.value);
                          setLinkChanges(true);
                        }}
                      />
                      <CloseIcon
                        className="delete-social"
                        style={{ color: "#aaaaaa89" }}
                        onClick={() => {
                          setTwitterSelected(false);
                          setLinkChanges(true);
                          settwitterLink("");
                        }}
                      />
                    </div>
                  )}
                  {element.website && element.website !== "" && (
                    <div className="users-weblink">
                      <LanguageIcon
                        fontSize="large"
                        className="studio-social-icons"
                        style={{ color: "white" }}
                      />
                      <input
                        type="text"
                        className="edit-weblink"
                        value={weblink}
                        onChange={(e) => {
                          setwebLink(e.target.value);
                          setLinkChanges(true);
                        }}
                      />
                      <CloseIcon
                        className="delete-social"
                        style={{ color: "#aaaaaa89" }}
                        onClick={() => {
                          setLinkChanges(true);
                          setwebLink("");
                        }}
                      />
                    </div>
                  )}
                  {WebSelected && (
                    <div
                      className="users-weblink"
                      style={{
                        transition: "all .2s ease",
                        animation: "social-animation2 0.5s ease",
                      }}
                    >
                      <LanguageIcon
                        fontSize="large"
                        className="studio-social-icons"
                        style={{ color: "white" }}
                      />
                      <input
                        type="text"
                        className="edit-weblink"
                        value={weblink}
                        onChange={(e) => {
                          setwebLink(e.target.value);
                          setLinkChanges(true);
                        }}
                      />
                      <CloseIcon
                        className="delete-social"
                        style={{ color: "#aaaaaa89" }}
                        onClick={() => {
                          setWebSelected(false);
                          setLinkChanges(true);
                          setwebLink("");
                        }}
                      />
                    </div>
                  )}
                  <div
                    className="add-newlink-social"
                    onClick={() => setAddLink(!addLink)}
                  >
                    <AddIcon fontSize="medium" style={{ color: "#3eaffe" }} />
                    <p>ADD LINK</p>
                  </div>
                  <div
                    className="add-more-socials"
                    style={addLink ? { display: "flex" } : { display: "none" }}
                  >
                    {!element.instagram && (
                      <InstagramIcon
                        fontSize="large"
                        className="addthis-icon"
                        style={{ color: "white" }}
                        onClick={() => {
                          setInstaSelected(!instaSelected);
                          setAddLink(false);
                        }}
                      />
                    )}
                    {!element.facebook && (
                      <FacebookIcon
                        fontSize="large"
                        className="addthis-icon"
                        style={{ color: "white" }}
                        onClick={() => {
                          setFBSelected(!FBSelected);
                          setAddLink(false);
                        }}
                      />
                    )}
                    {!element.twitter && (
                      <TwitterIcon
                        fontSize="large"
                        className="addthis-icon"
                        style={{ color: "white" }}
                        onClick={() => {
                          setTwitterSelected(!TwitterSelected);
                          setAddLink(false);
                        }}
                      />
                    )}
                    {!element.website && (
                      <LanguageIcon
                        fontSize="large"
                        className="addthis-icon"
                        style={{ color: "white" }}
                        onClick={() => {
                          setWebSelected(!WebSelected);
                          setAddLink(false);
                        }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default Basic;
