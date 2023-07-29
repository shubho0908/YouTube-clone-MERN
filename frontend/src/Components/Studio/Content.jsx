import LeftPanel2 from "../LeftPanel2";
import Navbar2 from "../Navbar2";
import "../../Css/Studio/content.css";
import SouthIcon from '@mui/icons-material/South';

function Content() {
  return (
    <>
      <Navbar2 />
      <LeftPanel2 />
      <div className="channel-content-section">
        <div className="channel-content-top">
          <p>Channel content</p>
          <p className="channel-videosss">Videos</p>
        </div>
        <hr className="breakk2" />
        <div className="channel-mid-row">
          <div className="left-row-side">
            <p>Video</p>
          </div>
          <div className="right-row-side">
            <p>Visibilty</p>
            <div className="sort-data">
              <p>Date</p>
              <SouthIcon fontSize="500px" style={{color:"white", marginLeft:"5px"}}/>
            </div>
            <p>Views</p>
            <p>Comments</p>
            <p>Likes</p>
          </div>
        </div>
        <hr className="breakk3" />
      </div>
    </>
  );
}

export default Content;
