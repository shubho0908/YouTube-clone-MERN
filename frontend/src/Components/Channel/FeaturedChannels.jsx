import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import nothing from "../../img/nothing.png";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import "../../Css/channel.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function FeaturedChannels(prop) {
  const [addChannelClicked, setAddChannelClicked] = useState(false);
  const [Subscriptions, setSubscriptions] = useState([]);
  const [Email, setEmail] = useState();
  const [featuredChannelsData, setFeaturedChannelsData] = useState([]);
  const [SelectedChannel, setSelectedChannel] = useState();
  const [SaveChannel, setSaveChannel] = useState();
  const token = localStorage.getItem("userToken");
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    if (token) {
      setEmail(jwtDecode(token).email);
    }
  }, [token]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3200);
  }, []);

  useEffect(() => {
    const getSubscriptions = async () => {
      try {
        if (prop.newmail !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getsubscriptions/${prop.newmail}`
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
          <p
            style={
              prop.newmail !== Email
                ? { color: "white", marginTop: "10px", marginBottom: "10px" }
                : { display: "none" }
            }
          >
            Featured channels
          </p>
        </div>

        <SkeletonTheme baseColor="#353535" highlightColor="#444">
          <div
            className="featured-channels-added"
            style={{
              display: loading === true ? "flex" : "none",
              top: prop.newmail === Email ? "360px" : "340px",
              left: prop.newmail === Email ? "0px" : "-12px",
            }}
          >
            {featuredChannelsData &&
              featuredChannelsData.length > 0 &&
              featuredChannelsData.map((index) => {
                return (
                  <div
                    className={
                      Email === prop.newmail
                        ? `featured-channelss featured-channelss-new`
                        : `featured-channelss`
                    }
                    key={index}
                  >
                    <Skeleton
                      count={1}
                      width={100}
                      height={100}
                      style={{ borderRadius: "100%" }}
                    />
                    <Skeleton
                      count={1}
                      width={150}
                      height={17}
                      style={{
                        borderRadius: "4px",
                        position: "relative",
                        top: "10px",
                      }}
                    />
                  </div>
                );
              })}
          </div>
        </SkeletonTheme>
        <div
          className="featured-channels-added"
          style={{
            visibility: loading === true ? "hidden" : "visible",
            display: loading === true ? "none" : "flex",
            top: prop.newmail === Email ? "360px" : "340px",
            left: prop.newmail === Email ? "0px" : "-12px",
          }}
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
                     window.location.href = `/channel/${element.channelID}`
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
          <p style={{ fontSize: "18.5px" }}>Your subscriptions</p>
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
