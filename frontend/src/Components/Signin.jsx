import { useState } from "react";
import "../Css/navbar.css";

function Signin() {
  const [data, setData] = useState({});

  const handleInputs = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const SubmitData = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { message, token } = await response.json();
      if (message === "LOGIN SUCCESSFUL") {
        localStorage.setItem("userToken", token);
        alert(message);
        window.location.reload();
        document.body.classList.remove("bg-class");
      }
      alert(message);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className="above-data">
        <p className="signup-head">Login to Your Account</p>
        <p className="signup-desc">
          Stay Connected-Stay Entertained, Step into the World of YouTube, Join
          the YouTube Community
        </p>
      </div>
      <div className="signup-form">
        <form onSubmit={SubmitData}>
          <input
            type="email"
            name="email1"
            className="email"
            placeholder="Email Address"
            required
            onChange={handleInputs}
          />
          <input
            type="password"
            name="password1"
            className="password"
            placeholder="Passcode"
            required
            onChange={handleInputs}
          />
          <button className="signup-btn" type="submit">
            Login to Your Account
          </button>
        </form>
      </div>
    </>
  );
}

export default Signin;
