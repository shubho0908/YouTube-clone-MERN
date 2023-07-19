import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import nothing from "../../img/nothing.png";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Css/channel.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

function FeaturedChannels(prop) {
  const [addChannelClicked, setAddChannelClicked] = useState(false);
  const [Subscriptions, setSubscriptions] = useState([]);
  const [Email, setEmail] = useState();
  const [featuredChannelsData, setFeaturedChannelsData] = useState([]);
  const [SelectedChannel, setSelectedChannel] = useState();
  const [SaveChannel, setSaveChannel] = useState();
  const token = localStorage.getItem("userToken");

  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

  useEffect(() => {
    const getSubscriptions = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getsubscriptions/${prop.newmail}`
        );
        const result = await response.json();
        setSubscriptions(result);
      } catch (error) {
        console.log(error.message);
      }
    };
    const interval = setInterval(getSubscriptions, 100);

    return () => clearInterval(interval);
  }, [prop.newmail]);

  useEffect(() => {
    const getFeaturedChannels = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getfeaturedchannels/${prop.newmail}`
        );
        const featuredChannelData = await response.json();
        setFeaturedChannelsData(featuredChannelData);
      } catch (error) {
        console.log(error.message);
      }
    };
    const interval = setInterval(getFeaturedChannels, 100);

    return () => clearInterval(interval);
  }, [prop.newmail]);

  //POST REQUESTS

  const AddChannel = async () => {
    try {
      if (prop.newmail !== undefined && SaveChannel) {
        const data = {
          channelname: SaveChannel.channelname,
          channelProfile: SaveChannel.channelProfile,
          channelID: SaveChannel.channelID,
        };

        const response = await fetch(
          `http://localhost:3000/savefeaturedchannel/${prop.newmail}`,
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const featuredChannelData = await response.json();
        if (featuredChannelData === "Data present already") {
          alert(featuredChannelData);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const DeleteChannel = async (channelid) => {
    try {
      const response = await fetch(
        `http://localhost:3000/deletefeaturedchannel/${Email}/${channelid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      await response.json();
    } catch (error) {
      console.log(error.message);
    }
  };

  if (featuredChannelsData === "No channels" && addChannelClicked === false) {
    return (
      <>
        <div className="featured-channels-sections">
          <div
            className="featured-channel-btn"
            style={
              token && Email === prop.newmail
                ? { display: "flex" }
                : { display: "none" }
            }
            onClick={() => {
              if (addChannelClicked === false) {
                setAddChannelClicked(true);
              } else {
                setAddChannelClicked(false);
              }
            }}
          >
            <PlaylistAddIcon fontSize="medium" style={{ color: "white" }} />
            <p>Add channels</p>
          </div>
        </div>
        <div
          className="no-playlists"
          style={
            addChannelClicked === true
              ? { display: "none" }
              : { display: "block" }
          }
        >
          <img src={nothing} alt="no results" className="nothing-found" />
          <p className="no-results">No channels found!</p>
        </div>
      </>
    );
  } else if (
    featuredChannelsData !== "No channels" &&
    featuredChannelsData.length > 0 &&
    addChannelClicked === false
  ) {
    return (
      <>
        <div className="featured-channels-sections">
          <div
            className="featured-channel-btn"
            style={
              token && Email === prop.newmail
                ? { display: "flex" }
                : { display: "none" }
            }
            onClick={() => {
              if (addChannelClicked === false) {
                setAddChannelClicked(true);
              } else {
                setAddChannelClicked(false);
              }
            }}
          >
            <PlaylistAddIcon fontSize="medium" style={{ color: "white" }} />
            <p>Add channels</p>
          </div>
        </div>

        <div
          className="featured-channels-added"
          style={token ? { top: "360px" } : { top: "300px" }}
        >
          {featuredChannelsData &&
            featuredChannelsData.length > 0 &&
            featuredChannelsData.map((element, index) => {
              return (
                <div
                  className={
                    Email === prop.newmail
                      ? `featured-channelss featured-channelss-new`
                      : `featured-channelss`
                  }
                  key={index}
                  onClick={() => {
                    if (Email !== prop.newmail) {
                      navigate(`/channel/${element.channelID}`);
                      window.location.reload();
                    }
                  }}
                >
                  <CloseRoundedIcon
                    fontSize="large"
                    style={{ color: "white" }}
                    className="delete-feature-btn"
                    onClick={() => {
                      DeleteChannel(element.channelID);
                    }}
                  />

                  <img
                    src={element.channelProfile}
                    alt="channel profile"
                    className="featured-channel-img"
                  />
                  <p
                    className="feature-channel-name"
                    style={{ marginTop: "6px" }}
                  >
                    {element.channelname}
                  </p>
                </div>
              );
            })}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="featured-channels-sections">
        <div
          className="featured-channel-btn"
          style={
            token && Email === prop.newmail
              ? { display: "flex" }
              : { display: "none" }
          }
          onClick={() => {
            if (addChannelClicked === false) {
              setAddChannelClicked(true);
            } else {
              setAddChannelClicked(false);
            }
          }}
        >
          <PlaylistAddIcon fontSize="medium" style={{ color: "white" }} />
          <p>Add channels</p>
        </div>
        <div
          className="add-feature-channel"
          style={
            addChannelClicked === true
              ? { display: "block" }
              : { display: "none" }
          }
        >
          <p>Your subscriptions</p>
          <div className="my-subscribed-channels">
            {Subscriptions &&
              Subscriptions.length > 0 &&
              Subscriptions.map((element, index) => {
                return (
                  <div
                    className={
                      SelectedChannel === element.channelname
                        ? `subscribed-channels-all locked`
                        : `subscribed-channels-all`
                    }
                    key={index}
                    onClick={() => {
                      setSelectedChannel(element.channelname);
                      setSaveChannel(element);
                    }}
                  >
                    <img
                      src={element.channelProfile}
                      alt="Channel profile"
                      className="sub-channel-imgs"
                    />
                    <p
                      className="feature-channel-name"
                      style={{ marginTop: "6px" }}
                    >
                      {element.channelname}
                    </p>
                  </div>
                );
              })}
          </div>
          <div className="lasst-data">
            {SelectedChannel !== undefined ? (
              <button
                className="save-channels"
                onClick={() => {
                  AddChannel();
                  setAddChannelClicked(false);
                }}
              >
                Add Channel
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default FeaturedChannels;
