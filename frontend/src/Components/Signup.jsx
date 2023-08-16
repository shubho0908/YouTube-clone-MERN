import { useState } from "react";
import "../Css/navbar.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {
  const [data, setData] = useState({});

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
    if (!data.name || !data.email || !data.password) {
      ErrorNotify();
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { message, token } = await response.json();
      if (message === "REGISTRATION SUCCESSFUL") {
        SignupNotify();
        localStorage.setItem("userToken", token);
        setTimeout(() => {
          window.location.reload();
          document.body.classList.remove("bg-class");
        }, 2000);
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
            className="username"
            placeholder="Name"
            required
            onChange={handleInputs}
          />
          <input
            type="email"
            name="email"
            className="email"
            placeholder="Email Address"
            required
            onChange={handleInputs}
          />
          <input
            type="password"
            name="password"
            className="password"
            placeholder="Passcode"
            required
            onChange={handleInputs}
          />
          <button className="signup-btn" type="submit">
            Create Your Account
          </button>
        </form>
      </div>
    </>
  );
}

export default Signup;
