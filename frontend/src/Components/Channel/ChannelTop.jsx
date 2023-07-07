import { useParams } from "react-router-dom"
import jwtDecode from "jwt-decode";
import { useEffect, useState } from "react";
import Navbar from "../Navbar"
import LeftPanel from "../LeftPanel"

function ChannelTop() {

    const [Email, setEmail] = useState()
    const token = localStorage.getItem("userToken");

    useEffect(() => {
        if (token) {
            setEmail(jwtDecode(token).email);
        }
    }, [token]);


    return (
        <>
            <Navbar />
            <LeftPanel />
            <h1>{Email}</h1>
        </>
    )
}

export default ChannelTop