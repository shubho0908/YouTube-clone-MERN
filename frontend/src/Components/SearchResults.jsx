import Navbar from "./Navbar";
import LeftPanel from "./LeftPanel";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function SearchResults() {
    const { data } = useParams()
    const [searchedVideoData, setsearchedVideoData] = useState([]);
    const [searchedChannelData, setsearchedChannelData] = useState([]);

    useEffect(() => {
        const getSearchResult = async () => {
            try {
                const response = await fetch(
                    `http://localhost:3000/search/${data}`
                );
                const Data = await response.json();
                const { videoData, channelData } = Data;
                setsearchedVideoData(videoData);
                setsearchedChannelData(channelData);
            } catch (error) {
                console.log(error.message);
            }
        };
        getSearchResult()
    }, [data, searchedChannelData, searchedVideoData]);

    return (
        <>
            <Navbar />
            <LeftPanel />
        </>
    );
}

export default SearchResults;
