import LeftPanel2 from "../LeftPanel2";
import Navbar2 from "../Navbar2";
import "../../Css/Studio/comments.css"
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { useEffect } from "react";

function Comments() {

  useEffect(() => {
   
  }, [])
  

  return (
    <>
      <Navbar2 />
      <LeftPanel2 />
      <div className="video-all-comments-section">
        <div className="channel-comments-top">
          <p>Channel comments</p>
        </div>
        <div className="channel-comments-mid">
          <p>Comments</p>
        </div>
        <hr className="breakkk" />
        <div className="filter-comments">
        <FilterListOutlinedIcon fontSize="medium" style={{color:"#aaa"}}/>
        <input type="text" name="comment-search" placeholder="Filter" />
        </div>
        <div className="channel-comments-list"></div>
      </div>
    </>
  );
}

export default Comments;
