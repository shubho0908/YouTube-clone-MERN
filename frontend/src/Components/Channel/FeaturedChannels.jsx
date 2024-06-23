import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import nothing from "../../img/nothing.png";
import { useEffect, useState } from "react";
import "../../Css/channel.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

function FeaturedChannels(prop) {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000";
  const [addChannelClicked, setAddChannelClicked] = useState(false);
  const [Subscriptions, setSubscriptions] = useState([]);
  const [featuredChannelsData, setFeaturedChannelsData] = useState([]);
  const [SelectedChannel, setSelectedChannel] = useState();
  const [SaveChannel, setSaveChannel] = useState();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });
  const User = useSelector((state) => state.user.user);
  const { user } = User;
  // TOASTS

  const ChannelAdded = () =>
    toast.success("Channel featured!", {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  const AlreadyHas = (data) =>
    toast.warning(data, {
      position: "bottom-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  // UseEffects

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const getSubscriptions = async () => {
      try {
        if (prop?.newmail) {
          const response = await fetch(
            `${backendURL}/getsubscriptions/${prop?.newmail}`
          );
          const result = await response.json();
          setSubscriptions(result);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };
    getSubscriptions();
  }, [prop?.newmail]);

  useEffect(() => {
    const getFeaturedChannels = async () => {
      try {
        const response = await fetch(
          `${backendURL}/getfeaturedchannels/${prop?.newmail}`
        );
        const featuredChannelData = await response.json();
        setFeaturedChannelsData(featuredChannelData);
      } catch (error) {
        // console.log(error.message);
      }
    };
    getFeaturedChannels();
  }, [prop?.newmail]);

  //POST REQUESTS

  const AddChannel = async () => {
    try {
      if (prop?.newmail && SaveChannel) {
        const data = {
          channelname: SaveChannel.channelname,
          channelProfile: SaveChannel.channelProfile,
          channelID: SaveChannel.channelID,
        };

        const response = await fetch(
          `${backendURL}/savefeaturedchannel/${prop?.newmail}`,
          {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const featuredChannelData = await response.json();
        if (featuredChannelData === "Channel added already") {
          AlreadyHas(featuredChannelData);
        } else {
          ChannelAdded();
        }
      }
    } catch (error) {
      // console.log(error.message);
    }
  };

  const DeleteChannel = async (channelid) => {
    try {
      const response = await fetch(
        `${backendURL}/deletefeaturedchannel/${user?.email}/${channelid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      await response.json();
    } catch (error) {
      // console.log(error.message);
    }
  };

  if (featuredChannelsData === "No channels" && addChannelClicked === false) {
    return (
      <>
        <div className="featured-channels-sections">
          <div
            className={
              theme
                ? "featured-channel-btn"
                : "featured-channel-btn btn-light-mode"
            }
            style={
              user?.email === prop?.newmail
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
            <PlaylistAddIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
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
          <p
            className={
              theme
                ? "no-results no-channel"
                : "no-results no-channel text-light-mode"
            }
          >
            No channels found!
          </p>
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
        <div
          className={
            theme
              ? "featured-channels-sections"
              : "featured-channels-sections text-light-mode"
          }
        >
          <div
            className={
              theme
                ? "featured-channel-btn"
                : "featured-channel-btn btn-light-mode"
            }
            style={
              user?.email === prop?.newmail
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
            <PlaylistAddIcon
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
            />
            <p>Add channels</p>
          </div>
          <p
            style={
              prop?.newmail !== user?.email
                ? {
                    color: theme ? "white" : "black",
                    marginTop: "10px",
                    marginBottom: "10px",
                  }
                : { display: "none" }
            }
          >
            Featured channels
          </p>
        </div>

        <SkeletonTheme
          baseColor={theme ? "#353535" : "#aaaaaa"}
          highlightColor={theme ? "#444" : "#b6b6b6"}
        >
          <div
            className="featured-channels-added"
            style={{
              display: loading === true ? "flex" : "none",
              top: prop?.newmail === user?.email ? "360px" : "340px",
              left: prop?.newmail === user?.email ? "0px" : "-12px",
            }}
          >
            {featuredChannelsData &&
              featuredChannelsData.length > 0 &&
              featuredChannelsData.map((index) => {
                return (
                  <div
                    className={
                      user?.email === prop?.newmail
                        ? `featured-channelss featured-channelss-new ${
                            theme ? "" : "feature-light"
                          }`
                        : `featured-channelss ${theme ? "" : "feature-light2"}`
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
            top: prop?.newmail === user?.email ? "360px" : "340px",
            left: prop?.newmail === user?.email ? "0px" : "-12px",
          }}
        >
          {featuredChannelsData &&
            featuredChannelsData.length > 0 &&
            featuredChannelsData.map((element, index) => {
              return (
                <div
                  className={
                    user?.email === prop?.newmail
                      ? `featured-channelss featured-channelss-new ${
                          theme ? "" : "feature-light"
                        }`
                      : `featured-channelss ${theme ? "" : "feature-light2"}`
                  }
                  key={index}
                  onClick={() => {
                    if (user?.email !== prop?.newmail) {
                      window.location.href = `/channel/${element.channelID}`;
                    }
                  }}
                >
                  <div className="feature-channel-extra-div">
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
                  </div>
                  <p
                    className={
                      theme
                        ? "feature-channel-name"
                        : "feature-channel-name text-light-mode"
                    }
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
          className={
            theme
              ? "featured-channel-btn"
              : "featured-channel-btn btn-light-mode"
          }
          style={
            user?.email  === prop?.newmail
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
          <PlaylistAddIcon
            fontSize="medium"
            style={{ color: theme ? "white" : "black" }}
          />
          <p>Add channels</p>
        </div>
        <div
          className={
            theme
              ? "add-feature-channel"
              : "add-feature-channel text-light-mode"
          }
          style={{
            display: addChannelClicked ? "block" : "none",
          }}
        >
          <p style={{ fontSize: "16.5px", width: "max-content" }}>
            Your subscriptions
          </p>
          <div className="my-subscribed-channels">
            {Subscriptions && Subscriptions.length > 0 ? (
              Subscriptions.map((element, index) => {
                return (
                  <div
                    className={
                      SelectedChannel === element.channelname
                        ? `subscribed-channels-all ${
                            theme ? "locked" : "locked2"
                          } ${theme ? "" : "feature-light2"}`
                        : `subscribed-channels-all ${
                            theme ? "" : "feature-light2"
                          }`
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
                      className={
                        theme
                          ? "feature-channel-name"
                          : "feature-channel-name text-light-mode"
                      }
                      style={{ marginTop: "6px" }}
                    >
                      {element.channelname}
                    </p>
                  </div>
                );
              })
            ) : (
              <>
                <p
                  style={{
                    color: theme ? "white" : "black",
                    fontSize: "16.5px",
                    width: "max-content",
                  }}
                >
                  No subscriptions found!!
                </p>
              </>
            )}
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
