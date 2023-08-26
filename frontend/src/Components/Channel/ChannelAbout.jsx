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
  const [Email, setEmail] = useState();
  const [description, setDescription] = useState();
  const [links, setLinks] = useState();
  const [joinedDate, setjoinedDate] = useState();
  const [TotalViews, setTotalViews] = useState(0);
  const [loading, setLoading] = useState(true);

  const CopiedNotify = () =>
    toast.success("Link Copied!", {
      position: "bottom-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  useEffect(() => {
    const getUserMail = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/getotherchannel/${prop.channelid}`
        );
        const userEmail = await response.json();
        setEmail(userEmail);
      } catch (error) {
        // console.log(error.message);
      }
    };

    getUserMail();
  }, [prop.channelid]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    const GetAboutData = async () => {
      try {
        if (Email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/getabout/${Email}`
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
        if (Email !== undefined) {
          const response = await fetch(
            `http://localhost:3000/totalviews/${Email}`
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
          <span className="loader2"></span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="channel-about-section">
        <div className="left-about-section">
          <div className="channel-description-section">
            <p>Description</p>
            <p
              className="channel-desc"
              dangerouslySetInnerHTML={{
                __html: description && formatDescriptionWithLinks(description),
              }}
            />
          </div>
          <hr className="seperate-two seperate" />

          <div className="channel-details">
            <p>Details</p>
            <div className="enquiries">
              <p>For business inquiries:</p>
              <a className="channel-email" href={`mailto:${Email}`}>
                {Email && Email}
              </a>
            </div>
          </div>
          <hr className="seperate-two seperate" />

          <div
            className="channel-links"
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
        <div className="right-about-section">
          <p>Stats</p>
          <hr className="seperate-three seperate" />
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
          <hr className="seperate-three seperate" />
          <p>
            {typeof TotalViews === "number"
              ? TotalViews.toLocaleString()
              : "No"}{" "}
            views
          </p>

          <hr className="seperate-three seperate" />
          <Tooltip
            TransitionComponent={Zoom}
            title="Share channel"
            placement="bottom"
          >
            <ReplyOutlinedIcon
              className="share-playlist"
              fontSize="medium"
              style={{ color: "white" }}
              onClick={handleCopyLink}
            />
          </Tooltip>
        </div>

        {/* SECOND RIGHT SECTION */}

        <div className="right-about-section2">
          <p>Stats</p>
          <div className="this-aboutall-data">
            <div className="about-joined-date">
              <AiOutlineInfoCircle fontSize="24px" color="white" />
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
              <BiTrendingUp fontSize="24px" color="white" />

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
              style={{ color: "white" }}
              onClick={handleCopyLink}
            />
          </Tooltip>
        </div>
      </div>
    </>
  );
}

export default ChannelAbout;
