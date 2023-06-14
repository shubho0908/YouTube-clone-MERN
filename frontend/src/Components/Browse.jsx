import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import "../Css/browse.css";
import thumbnail from "../img/temp.jpg";

function Browse() {
  const Tags = [
    "All",
    "Music",
    "Tutorial",
    "Vlog",
    "Gaming",
    "Comedy",
    "Beauty",
    "Travel",
    "Food",
    "Fashion",
  ];

  return (
    <>
      <Navbar />
      <div className="browse">
        <LeftPanel />
        <div className="browse-data">
          <div className="popular-categories">
            {Tags.map((element, index) => {
              return (
                <div className={`top-tags tag-${index}`} key={index}>
                  <p>{element}</p>
                </div>
              );
            })}
          </div>
          <div className="video-section">
            <div className="uploaded-videos">
              <div className="video-data">
                <img
                  style={{ width: "360px", borderRadius: "8px" }}
                  src={thumbnail}
                  alt="temp"
                />
                <p className="title" style={{ marginTop: "10px" }}>
                  Pehli Salary ka Pagalpan | Tanay Pratap Hindi Pehli Salary ka
                  Pagalpan | Tanay Pratap Hindi
                </p>
              </div>
              <div className="video-data">
                <img
                  style={{ width: "360px", borderRadius: "8px" }}
                  src={thumbnail}
                  alt="temp"
                />
                <p className="title" style={{ marginTop: "10px" }}>
                  Pehli Salary ka Pagalpan | Tanay Pratap Hindi Pehli Salary ka
                  Pagalpan | Tanay Pratap Hindi
                </p>
              </div>
              <div className="video-data">
                <img
                  style={{ width: "360px", borderRadius: "8px" }}
                  src={thumbnail}
                  alt="temp"
                />
                <p className="title" style={{ marginTop: "10px" }}>
                  Pehli Salary ka Pagalpan | Tanay Pratap Hindi Pehli Salary ka
                  Pagalpan | Tanay Pratap Hindi
                </p>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Browse;
