import { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import ReactLoading from "react-loading";

function Basic() {
  const [Email, setEmail] = useState();
  const token = localStorage.getItem("userToken");
  const [channelName, setChannelname] = useState();
  const [channelDescription, setchannelDescription] = useState();
  const channelname = localStorage.getItem("channelname")
  const channelDesc = localStorage.getItem("channelDesc")

  useEffect(() => {
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

  useEffect(() => {
    const getChannelData = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getchannel/${Email}`
        );
        const data = await response.json();
        const { ChannelName, channelDescription } = data;
        setChannelname(ChannelName);
        localStorage.setItem("channelname", ChannelName)
        setchannelDescription(channelDescription)
        localStorage.setItem("channelDesc", channelDescription)
      } catch (error) {
        console.log(error.message);
      }
    };

    getChannelData();
  }, [Email]);



  if (channelname === undefined) {
    return (
      <>
        <div className="basic-info-section">
          <div
            className="spin2"
            style={{
              height: "auto",
              position: "relative",
              width: "max-content",
              left: "18%",
              top: "27px",
            }}
          >
            <ReactLoading
              type={"spin"}
              color={"white"}
              height={40}
              width={40}
            />
            <p style={{ marginTop: "15px", fontSize: "14px" }}>
              Fetching the data, Hang tight...{" "}
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="basic-info-section">
        <div className="basic-name-section">
          <p className="basic-name-head">Name</p>
          <p className="basic-name-desc">
            Choose a channel name that represents you and your content. Changes
            made to your name and picture are visible only on YouTube.
          </p>
          {channelname === "undefined" ? (
            <input
            type="text"
            className="channel-name-inp"
            value="Loading..."
            placeholder="Enter channel name"
            onChange={(e) => {
              setChannelname(e.target.value);
              localStorage.setItem("channelname", e.target.value)
            }}
          />
          ) : (
            <input
            type="text"
            className="channel-name-inp"
            value={channelname}
            placeholder="Enter channel name"
            onChange={(e) => {
              setChannelname(e.target.value);
              localStorage.setItem("channelname", e.target.value)
            }}
          />
          )}
        </div>
        <div className="basic-description-section">
          <p className="basic-desc-head">Description</p>
          {channelDesc === "undefined" ? (
            <textarea name="channel-desc" className="basic-channel-desc" value="Loading..." cols="30" rows="10" maxLength={1000}></textarea>
          ) : (
            <textarea name="channel-desc" className="basic-channel-desc" value={channelDesc} cols="30" rows="10" maxLength={1000}></textarea>
          )}
        </div>
        <div className="basic-channelurl-section"></div>
        <div className="basic-links-section"></div>
        <div className="basic-contact-section"></div>
      </div>
    </>
  );
}

export default Basic;
