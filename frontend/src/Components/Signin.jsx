import { useState } from "react";
import "../Css/navbar.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signin() {
  const [data, setData] = useState({});

  //TOASTS

  const LoginNotify = () =>
    toast.success("Login successfull!", {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const InvalidNotify = () =>
    toast.error("Invalid Credentials!", {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const ErrorNotify = () =>
    toast.error("Input fields can't be empty.", {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const handleInputs = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const SubmitData = async (e) => {
    e.preventDefault();
    if (!data.email1 || !data.password1) {
      ErrorNotify();
      return;
    }
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
        LoginNotify();
        localStorage.setItem("userToken", token);
        setTimeout(() => {
          window.location.reload();
          document.body.classList.remove("bg-class");
        }, 2000);
      } else if (message === "INVALID CREDENTIALS") {
        InvalidNotify();
      }
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
            onChange={handleInputs}
            required
          />
          <input
            type="password"
            name="password1"
            className="password"
            placeholder="Passcode"
            onChange={handleInputs}
            required
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
