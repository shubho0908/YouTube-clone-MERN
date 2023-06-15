import "../Css/navbar.css";

function Signin() {
  return (
    <>
      <div className="above-data">
        <p className="signup-head">Login to Your Account</p>
        <p className="signup-desc">
          Unlock Your World of Entertainment, Unlock Your World of
          Entertainment, Join the YouTube Community
        </p>
      </div>
      <div className="signup-form">
        <input
          type="email"
          name="email"
          className="email"
          placeholder="Email Address"
          required
        />
        <input
          type="password"
          name="password"
          className="password"
          placeholder="Passcode"
          required
        />
        <button className="signup-btn">Login to Your Account</button>
        
      </div>
    </>
  );
}

export default Signin;
