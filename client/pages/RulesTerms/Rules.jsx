
import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "./Rules.css";

export default function Rules() {
  const location = useLocation();
  const navigate = useNavigate();

  const [checked, setChecked] = useState(false);
  const [htmlContent, setHtmlContent] = useState("");
//   const [showPopup, setShowPopup] = useState(location.state?.showWelcomePopup || false);
const [showPopup, setShowPopup] = useState(true);

  useEffect(() => {
    fetch("https://docs.easylottery.in/rules")
      .then((resp) => resp.text())
      .then((html) => setHtmlContent(html))
      .catch(() => setHtmlContent("<p>Unable to load content.</p>"));
  }, []);

  const handleAccept = () => {
    if (!checked) {
      toast.error("Please read and confirm the Rules and Regulations to continue.");
      return;
    }
    navigate("/terms");
  };

  return (
    <div className="otp-verification">
      {/* Background Image */}
      <div className="background-container">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/833d2053dc602c2041d74093fbcc195e94b043c7?width=822"
          alt="Rules background"
          className="background-image"
        />
      </div>

      {/* Logo */}
      <div className="logo-container">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/9a1fa58c65a730117bfada3b930d33b94ca74140?width=444"
          alt="EasyLottery Logo"
          className="logo"
        />
      </div>

      {/* Main Content Card */}
      <div className="main-content-card">
        <div className="card-handle"></div>
        <div className="card-content">
          <h1 className="page-title">Rules & Regulations</h1>

          <div
            className="scroll-container"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />

          <label className="checkbox-container">
            <input
              type="checkbox"
              checked={checked}
              onChange={() => setChecked(!checked)}
            />
            <span>I have read & agree to the Rules & Regulations</span>
          </label>

          <button
            className={`verify-button ${checked ? "enabled" : "disabled"}`}
            onClick={handleAccept}
          >
            <span className="button-text">Accept</span>
          </button>
        </div>
      </div>

      {/* Welcome Popup */}
{showPopup && (
  <div className="popup-overlay">
    <div className="popup-card">
      {/* Banner image */}
      <div className="popup-banner">
        <img src={registerSuccessImg} alt="Register Success" />
      </div>

      {/* Close button */}
      <button className="close-btn" onClick={() => setShowPopup(false)}>×</button>

      {/* Content */}
      <div className="popup-content">
        <h2 className="popup-title">Welcome to Easy Lottery</h2>
        <p className="popup-subtitle">You have been registered successfully with your Mobile Number</p>
        <ol className="popup-list">
          <li>1. To proceed, login with your Mobile Number and OTP.</li>
          <li>2. After logging in, load Credits into your account using UPI, NetBanking, or Cards.</li>
          <li>3. Buy tickets of your choice and win lotteries.</li>
        </ol>
        <button onClick={() => setShowPopup(false)} className="yellow-btn">
          Best of luck, be responsible.
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}
