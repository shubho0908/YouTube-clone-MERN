import { useEffect, useState } from "react";
import "../Css/navbar.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Reset from "./Reset";

function Signin(prop) {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000"
  const [data, setData] = useState({});
  const [showReset, setShowReset] = useState(false);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  useEffect(() => {
    if (prop.close === true) {
      setShowReset(false);
    }
  }, [prop.close]);

  useEffect(() => {
    if (prop.switch === false) {
      setShowReset(false);
    }
  }, [prop.switch]);

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
      theme: theme ? "dark" : "light",
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
      theme: theme ? "dark" : "light",
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
      theme: theme ? "dark" : "light",
    });

  const NoUserNotify = () =>
    toast.error("User doesn't exists.", {
      position: "top-center",
      autoClose: 1200,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: theme ? "dark" : "light",
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
      const response = await fetch(`${backendURL}/login`, {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { message } = await response.json();
      if (message === "LOGIN SUCCESSFUL") {
        LoginNotify();
        setTimeout(() => {
          window.location.reload();
          document.body.classList.remove("bg-class");
        }, 2000);
      } else if (message === "INVALID CREDENTIALS") {
        InvalidNotify();
      } else if (message === "USER DOESN'T EXIST") {
        NoUserNotify();
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div
        className="above-data"
        style={{ display: showReset ? "none" : "block" }}
      >
        <p className="signup-head">Login to Your Account</p>
        <p className="signup-desc">
          Stay Connected-Stay Entertained, Step into the World of YouTube, Join
          the YouTube Community
        </p>
      </div>
      <div
        className="signup-form"
        style={{ display: showReset ? "none" : "flex" }}
      >
        <form onSubmit={SubmitData}>
          <input
            type="email"
            name="email1"
            className={
              theme ? "email" : "email email-light light-mode text-light-mode"
            }
            placeholder="Email Address"
            onChange={handleInputs}
            required
          />
          <input
            type="password"
            name="password1"
            className={
              theme
                ? "password"
                : "password email-light light-mode text-light-mode"
            }
            placeholder="Passcode"
            onChange={handleInputs}
            required
          />
          <p
            className={
              theme ? "forgot-password" : "forgot-password text-light-mode"
            }
            onClick={() => setShowReset(true)}
          >
            Forgot password?
          </p>
          <button
            className={theme ? "signup-btn" : "signup-btn signin-btn-light"}
            type="submit"
          >
            Login to Your Account
          </button>
        </form>
      </div>
      <div
        className="password-reset"
        style={{ display: showReset ? "block" : "none" }}
      >
        <Reset />
      </div>
    </>
  );
}

export default Signin;
