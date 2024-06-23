import { useState } from "react";
import "../Css/navbar.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  // const backendURL = "http://localhost:3000";
  const [data, setData] = useState({});
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });

  //TOASTS

  const SignupNotify = () =>
    toast.success("Signup successfull!", {
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

  const EmailErrorNotify = (data) =>
    toast.error(data, {
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
    if (!data.name || !data.email || !data.password) {
      ErrorNotify();
      return;
    }
    try {
      const response = await fetch(`${backendURL}/signup`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { message, user } = await response.json();
      if (message === "REGISTRATION SUCCESSFUL") {
        SignupNotify();
        localStorage.setItem("userData", JSON.stringify(user));
        
        setTimeout(() => {
          window.location.reload();
          document.body.classList.remove("bg-class");
        }, 2000);
      } else {
        EmailErrorNotify(message);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      <div className="above-data">
        <p className="signup-head">Create Your Account</p>
        <p className="signup-desc">
          Unlock Your World of Entertainment, Unlock Your World of
          Entertainment, Join the YouTube Community
        </p>
      </div>
      <div className="signup-form">
        <form onSubmit={SubmitData}>
          <input
            type="text"
            name="name"
            className={
              theme
                ? "username"
                : "username email-light light-mode text-light-mode"
            }
            placeholder="Name"
            required
            onChange={handleInputs}
          />
          <input
            type="email"
            name="email"
            className={
              theme ? "email" : "email email-light light-mode text-light-mode"
            }
            placeholder="Email Address"
            required
            onChange={handleInputs}
          />
          <input
            type="password"
            name="password"
            className={
              theme
                ? "password"
                : "password email-light light-mode text-light-mode"
            }
            placeholder="Passcode"
            required
            onChange={handleInputs}
          />
          <button
            className={theme ? "signup-btn" : "signup-btn signin-btn-light"}
            type="submit"
          >
            Create Your Account
          </button>
        </form>
      </div>
    </>
  );
}

export default Signup;
