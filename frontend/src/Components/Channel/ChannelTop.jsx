import { useParams } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import Navbar from "../Navbar";
import LeftPanel from "../LeftPanel";
import "../../Css/channel.css"
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function ChannelTop() {
    const { id } = useParams();
    const [Email, setEmail] = useState();
    const [channelName, setChannelname] = useState();
    const [ChannelProfile, setChannelProfile] = useState();
    const token = localStorage.getItem("userToken");

    useEffect(() => {
        if (token) {
            setEmail(jwtDecode(token).email);
        }
    }, [token]);

    useEffect(() => {
        const getChannelData = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/getchannel/${Email}`
                );
                const data = await response.json();
                const { profile, ChannelName } = data;
                setChannelProfile(profile);
                setChannelname(ChannelName);
            } catch (error) {
                console.log(error.message);
            }
        };

        getChannelData();
    }, [Email]);

    const getUsername = (email) => {
        return email.split("@")[0];
    }

    const username = Email && getUsername(Email)

    return (
        <>
            <Navbar />
            <LeftPanel />
            <div className="channel-main-content">
                <div className="channel-left-content">
                    <img src={ChannelProfile} alt="channelDP" className="channel_profile" />
                    <div className="channel-left">
                        <p className="channelname">{channelName}</p>
                        <div className="channel-extra">
                            <p className="channeluser">@{username}</p>
                            <p className="my-subs">100 subscribers</p>
                            <p className="my-videoscount">5 videos</p>
                        </div>
                        <div className="more-about">
                            <p className="more-text">More about this channel</p>
                            <ArrowForwardIosIcon fontSize="15px" style={{ color: "#aaa", marginLeft: "7px" }} />
                        </div>
                    </div>
                </div>
                <div className="channel-right-content">
                    <button className="customize-channel">Customize channel</button>
                    <button className="manage-videos">Manage videos</button>
                </div>
            </div>
        </>
    );
}

export default ChannelTop;
