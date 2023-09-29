import { useState } from "react";
import "../Css/reset.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Reset() {
  const backendURL = "https://youtube-clone-mern-backend.vercel.app"
  const [email, setEmail] = useState("");
  const [BtnLoading, setBtnLoading] = useState(false);
  const [theme, setTheme] = useState(() => {
    const Dark = localStorage.getItem("Dark");
    return Dark ? JSON.parse(Dark) : true;
  });


  //TOASTS

  const LinkNotify = () =>
    toast.success("Link sent successfully!", {
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

  const ResetData = async (e) => {
    e.preventDefault();
    if (email === "") {
      ErrorNotify()
      return;
    } else {
      setBtnLoading(true);
      const response = await fetch(`${backendURL}/resetlink`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.message !== "USER DOESN'T EXIST") {
        setBtnLoading(false);
        LinkNotify();
      } else {
        alert(data.message);
      }
    }
  };

  return (
    <>
      <div className="reset-old-password">
        <div className="top-reset">
          <p>Forgot Password</p>
          <p>
            Don&apos;t remember your password? No worries, we can help you to
            reset your password.
          </p>
        </div>
        <div className="reset-option">
          <form onSubmit={ResetData}>
            <input
              type="email"
              name="email2"
              className={
                theme ? "email" : "email email-light light-mode text-light-mode"
              }
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
            />
            {BtnLoading ? (
              <button
                className={theme ? "signup-btn" : "signup-btn signin-btn-light"}
                type="submit"
                disabled={BtnLoading ? true : false}
              >
                <span className="loader3"></span>
              </button>
            ) : (
              <button
                className={theme ? "signup-btn" : "signup-btn signin-btn-light"}
                type="submit"
                disabled={BtnLoading ? true : false}
              >
                Send Reset Link
              </button>
            )}
          </form>
        </div>
      </div>
    </>
  );
}

export default Reset;
