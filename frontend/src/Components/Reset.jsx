import { useState } from "react";
import "../Css/reset.css";

function Reset() {
  const [email, setEmail] = useState("");

  const ResetData = async (e) => {
    e.preventDefault();
    if (email === "") {
      return;
    } else {
      alert("Submitted");
    }
  };

  return (
    <>
      <div className="reset-old-password">
        <div className="top-reset">
          <p>Forgot Password</p>
          <p>
            Don&apos;t remember your password? No worries, you can simply reset
            it.
          </p>
        </div>
        <div className="reset-option">
          <form onSubmit={ResetData}>
            <input
              type="email"
              name="email2"
              className="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              required
            />
            <button className="signup-btn" type="submit">
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Reset;
