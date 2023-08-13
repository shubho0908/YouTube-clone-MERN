import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import fb from "../img/social/fb.jpg";
import whatsapp from "../img/social/whatsapp.jpg";
import linkedin from "../img/social/linkedin.jpg";
import twitter from "../img/social/twitter.jpg";
import mail from "../img/social/mail.jpg";
import "../Css/share.css";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Share() {
  const [copyText, setCopyText] = useState("Copy");

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

  const handleCopyLink = () => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        setCopyText("Copied!");
      })
      .catch((error) => {
        console.log("Error copying link to clipboard:", error);
      });
  };

  return (
    <>
      <div className="share-section">
        <div className="share-head">
          <p>Share</p>
          <CloseRoundedIcon
            fontSize="medium"
            style={{ color: "white" }}
            className="cancel-share"
          />
        </div>
        <div className="share-social">
          <img
            src={fb}
            alt="fb"
            className="social-handles"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              window.open(
                `https://www.facebook.com/dialog/share?app_id=87741124305&href=${window.location.href}`
              )
            }
          />
          <img
            src={whatsapp}
            alt="whatsapp"
            className="social-handles"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              window.open(
                `https://api.whatsapp.com/send?text=Check%20out%20this%20video:%20${window.location.href}`
              )
            }
          />
          <img
            src={twitter}
            alt="twitter"
            className="social-handles"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              window.open(
                `https://twitter.com/intent/tweet?url=${window.location.href}`
              )
            }
          />
          <img
            src={mail}
            alt="mail"
            target="_blank"
            className="social-handles"
            rel="noopener noreferrer"
            onClick={() =>
              window.open(
                `mailto:?subject=Check%20out%20this%20video&body=I%20thought%20you%20might%20find%20this%20video%20interesting:%20${window.location.href}`
              )
            }
          />
          <img
            src={linkedin}
            alt="linkedin"
            target="_blank"
            className="social-handles"
            rel="noopener noreferrer"
            onClick={() =>
              window.open(
                `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`
              )
            }
          />
        </div>
        <div className="share-link">
          <div className="link-area">
            <p>{window.location.href}</p>
            <button
              className="copy-link-btn"
              onClick={() => {
                handleCopyLink();
                CopiedNotify();
              }}
            >
              {copyText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default Share;
