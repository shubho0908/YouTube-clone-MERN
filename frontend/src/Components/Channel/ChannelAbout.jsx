import { useState, useEffect } from "react";
import Tooltip from "@mui/material/Tooltip";
import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";
import Zoom from "@mui/material/Zoom";
import InstagramIcon from "@mui/icons-material/Instagram";
import LanguageIcon from "@mui/icons-material/Language";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { BiTrendingUp } from "react-icons/bi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ChannelAbout(prop) {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000"
  const [Email, setEmail] = useState();
  const [description, setDescription] = useState();
  const [links, setLinks] = useState();
  const [joinedDate, setjoinedDate] = useState();
  const [TotalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  const CopiedNotify = () =>
    toast.success("Link Copied!", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
    });

  useEffect(() => {
    const getUserMail = async () => {
      try {
        const response = await fetch(
          `${backendURL}/getotherchannel/${prop?.channelid}`
        );
        const userEmail = await response.json();
        setEmail(userEmail);
      } catch (error) {
        // console.log(error.message);
      }
    };

    getUserMail();
  }, [prop?.channelid]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const GetAboutData = async () => {
      try {
        if (Email) {
          const response = await fetch(
            `${backendURL}/getabout/${Email}`
          );
          const { description, sociallinks, joining } = await response.json();
          setDescription(description);
          setLinks(sociallinks);
          setjoinedDate(joining);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };
    GetAboutData();
  }, [Email]);

  useEffect(() => {
    const GetTotalViews = async () => {
      try {
        if (Email) {
          const response = await fetch(
            `${backendURL}/totalviews/${Email}`
          );
          const totalViews = await response.json();
          setTotalViews(totalViews);
        }
      } catch (error) {
        // console.log(error.message);
      }
    };

    GetTotalViews();
  }, [Email]);

  const joined = new Date(joinedDate);

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        CopiedNotify();
      })
      .catch((error) => {
        console.log("Error copying link to clipboard:", error);
      });
  };

  const formatDescriptionWithLinks = (description) => {
    const linkPattern = /(http|https):\/\/www\.[^\s]+/g;
    const formattedDescription = description.replace(
      linkPattern,
      (match) => `<a href="${match}" target="_blank">${match}</a>`
    );
    return formattedDescription.replace(/\n/g, "<br>");
  };

  if (loading === true) {
    return (
      <div
        className="channel-about-section"
        style={{ width: "-webkit-fill-available" }}
      >
        <div className="spin23" style={{ top: "50px" }}>
          <span className={theme ? "loader2" : "loader2-light"}></span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="channel-about-section">
        <div className="left-about-section">
          <div
            className={
              theme
                ? "channel-description-section"
                : "channel-description-section text-light-mode"
            }
          >
            <p>Description</p>
            <p
              className="channel-desc"
              dangerouslySetInnerHTML={{
                __html: description && formatDescriptionWithLinks(description),
              }}
            />
          </div>
          <hr
            className={
              theme
                ? "seperate-two seperate"
                : "seperate-two seperate seperate-light"
            }
          />

          <div
            className={
              theme ? "channel-details" : "channel-details text-light-mode"
            }
          >
            <p>Details</p>
            <div className="enquiries">
              <p className={theme ? "" : "text-light-mode2"}>
                For business inquiries:
              </p>
              <a className="channel-email" href={`mailto:${Email}`}>
                {Email && Email}
              </a>
            </div>
          </div>
          <hr
            className={
              theme
                ? "seperate-two seperate"
                : "seperate-two seperate seperate-light"
            }
          />

          <div
            className={
              theme ? "channel-links" : "channel-links text-light-mode"
            }
            style={
              (links && links.length > 0 && links[0].facebook) ||
              (links && links.length > 0 && links[0].instagram) ||
              (links && links.length > 0 && links[0].twitter) ||
              (links && links.length > 0 && links[0].website)
                ? { display: "block" }
                : { display: "none" }
            }
          >
            <p>Links</p>
            <div className="channel-links-all">
              {links &&
                links.map((element, index) => {
                  return (
                    <div className="main-links" key={index}>
                      {element.instagram ? (
                        <div className="link-insta">
                          <InstagramIcon
                            fontSize="medium"
                            style={{ color: "darkorchid" }}
                          />
                          <a
                            href={`${element.instagram}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Instagram
                          </a>
                        </div>
                      ) : (
                        ""
                      )}

                      {element.facebook ? (
                        <div className="link-fb">
                          <FacebookIcon
                            fontSize="medium"
                            style={{ color: "#2d84d0" }}
                          />
                          <a
                            href={`${element.facebook}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Facebook
                          </a>
                        </div>
                      ) : (
                        ""
                      )}
                      {element.twitter ? (
                        <div className="link-twitter">
                          <TwitterIcon
                            fontSize="medium"
                            style={{ color: "#00acee" }}
                          />
                          <a
                            href={`${element.twitter}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Twitter
                          </a>
                        </div>
                      ) : (
                        ""
                      )}
                      {element.website ? (
                        <div className="link-web">
                          <LanguageIcon
                            fontSize="medium"
                            style={{ color: "#aaa" }}
                          />
                          <a
                            href={`${element.website}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Website
                          </a>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
        <div
          className={
            theme
              ? "right-about-section"
              : "right-about-section text-light-mode"
          }
        >
          <p>Stats</p>
          <hr
            className={
              theme
                ? "seperate-three seperate"
                : "seperate-three seperate seperate-light"
            }
          />
          {joinedDate ? (
            <p style={{ fontSize: "15px" }}>
              {joined.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          ) : (
            <p style={{ fontSize: "15px" }}>No data</p>
          )}
          <hr
            className={
              theme
                ? "seperate-three seperate"
                : "seperate-three seperate seperate-light"
            }
          />
          <p>
            {typeof TotalViews === "number"
              ? TotalViews.toLocaleString()
              : "No"}{" "}
            views
          </p>

          <hr
            className={
              theme
                ? "seperate-three seperate"
                : "seperate-three seperate seperate-light"
            }
          />
          <Tooltip
            TransitionComponent={Zoom}
            title="Share channel"
            placement="bottom"
          >
            <ReplyOutlinedIcon
              className="share-playlist"
              fontSize="medium"
              style={{
                color: theme ? "white" : "black",
                backgroundColor: theme ? "" : "#f0f0f0",
              }}
              onClick={handleCopyLink}
            />
          </Tooltip>
        </div>

        {/* SECOND RIGHT SECTION */}

        <div
          className={
            theme
              ? "right-about-section2"
              : "right-about-section2 text-light-mode"
          }
        >
          <p>Stats</p>
          <div className="this-aboutall-data">
            <div className="about-joined-date">
              <AiOutlineInfoCircle
                fontSize="24px"
                color={theme ? "white" : "black"}
              />
              {joinedDate ? (
                <p style={{ fontSize: "15px" }}>
                  {joined.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              ) : (
                <p style={{ fontSize: "15px" }}>No data</p>
              )}
            </div>
            <div className="about-totalviews-channel">
              <BiTrendingUp fontSize="24px" color={theme ? "white" : "black"} />

              <p>
                {typeof TotalViews === "number"
                  ? TotalViews.toLocaleString()
                  : "No"}{" "}
                views
              </p>
            </div>
          </div>

          <Tooltip
            TransitionComponent={Zoom}
            title="Share channel"
            placement="bottom"
          >
            <ReplyOutlinedIcon
              className="share-playlist"
              fontSize="medium"
              style={{ color: theme ? "white" : "black" }}
              onClick={handleCopyLink}
            />
          </Tooltip>
        </div>
      </div>
    </>
  );
}

export default ChannelAbout;
