import "../Css/navbar.css";
function Signup() {
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
        <input
          type="text"
          name="name"
          className="username"
          placeholder="Name"
          required
        />
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
        <button className="signup-btn">Create Your Account</button>
        
      </div>
    </>
  );
}

export default Signup;
