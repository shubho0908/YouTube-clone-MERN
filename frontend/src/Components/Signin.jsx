import "../Css/navbar.css";

function Signin() {

  const handleInputs =(e)=>{
    
  }

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
        <form>
          <input
            type="email"
            name="email1"
            className="email"
            placeholder="Email Address"
            required
          />
          <input
            type="password"
            name="password1"
            className="password"
            placeholder="Passcode"
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
