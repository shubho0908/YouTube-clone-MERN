import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import fb from "../img/social/fb.jpg";
import whatsapp from "../img/social/whatsapp.jpg";
import linkedin from "../img/social/linkedin.jpg";
import twitter from "../img/social/twitter.jpg";
import mail from "../img/social/mail.jpg";
function Share() {
  return (
    <>
      <div className="share-section">
        <div className="share-head">
          <p>Share</p>
          <CloseRoundedIcon fontSize="medium" style={{ color: "white" }} />
        </div>
        <div className="share-social">
          <img src={fb} alt="fb" />
          <img src={whatsapp} alt="fb" />
          <img src={twitter} alt="fb" />
          <img src={mail} alt="fb" />
          <img src={linkedin} alt="fb" />
        </div>
        <div className="share-link"></div>
      </div>
    </>
  );
}

export default Share;
