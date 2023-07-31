import LeftPanel3 from "../LeftPanel3";
import Navbar2 from "../Navbar2";
import { useParams } from "react-router-dom";

function VideoDetails() {
  const { id } = useParams();

  return (
    <>
      <Navbar2 />
      <LeftPanel3/>
      <div className="main-video-details-section">
        
      </div>
    </>
  );
}

export default VideoDetails;
