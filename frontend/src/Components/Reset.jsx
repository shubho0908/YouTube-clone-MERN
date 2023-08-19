import { useState } from "react";
import "../Css/reset.css";

function Reset() {
  const [email, setEmail] = useState("");

  const ResetData = async (e) => {
    e.preventDefault();
    if (email === "") {
      return;
    } else {
      const response = await fetch(`http://localhost:3000/reset-link`, {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.message !== "USER DOESN'T EXIST") {
        console.log(`Reset Link: `, data);
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
            Don&apos;t remember your password? No worries, we can help you to reset
            your password.
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
