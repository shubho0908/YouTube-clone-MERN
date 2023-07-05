import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import ReactLoading from "react-loading";
import "../Css/likevideos.css";

function LikeVideos() {
    const [email, setEmail] = useState();
    const [name, setName] = useState();
    const [menuClicked, setMenuClicked] = useState(false);
    const [videolike, setLikedVideos] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("userToken");
        setEmail(jwtDecode(token).email);
        setName(jwtDecode(token).name);
    }, []);

    useEffect(() => {
        const getLikeVideos = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/getlikevideos/${email}`
                );
                const result = await response.json();
                setLikedVideos(result);
            } catch (error) {
                console.log(error.message);
            }
        };

        const interval = setInterval(getLikeVideos, 100);

        return () => clearInterval(interval);
    }, [email]);

    useEffect(() => {
        const handleMenuButtonClick = () => {
            setMenuClicked((prevMenuClicked) => !prevMenuClicked);
        };

        const menuButton = document.querySelector(".menu");
        menuButton.addEventListener("click", handleMenuButtonClick);

        return () => {
            menuButton.removeEventListener("click", handleMenuButtonClick);
        };
    }, []);

    return (
        <>
            <Navbar />
            <LeftPanel />
            <div className="liked-video-data">
                {videolike.length > 0 ? (
                    <div
                        className="like-video-sections"
                        style={
                            menuClicked ? { left: "80px", width: "100%" } : { left: "255px" }
                        }
                    >
                        <div
                            className="like-left-section"
                            style={{
                                backgroundImage: `url(${videolike[0]?.thumbnailURL})`
                            }}
                        >
                            <div className="page-cover">
                                {videolike && (
                                    <div className="firstvideo-thumbnail">
                                        <img
                                            src={videolike[0].thumbnailURL}
                                            alt="first-like-thumbnail"
                                        />
                                    </div>
                                )}
                                <div className="last-like-section">
                                    <p className="like-head">Liked videos</p>
                                    <p className="like-username">{name}</p>
                                </div>
                            </div>
                        </div>
                        <div className="like-right-section">
                            {videolike.length > 0 ? videolike.map((element, index) => {
                                return (
                                    <div className="firstvideo-thumbnail" key={index}>
                                        <img
                                            src={element.thumbnailURL}
                                            alt="first-like-thumbnail"
                                        />
                                    </div>
                                )
                            }) : ""}
                        </div>
                    </div>
                ) : (
                    <div className="spinner" style={{ height: "100vh" }}>
                        <ReactLoading
                            type={"spin"}
                            color={"white"}
                            height={50}
                            width={50}
                        />
                    </div>
                )}
            </div>
        </>
    );
}

export default LikeVideos;
