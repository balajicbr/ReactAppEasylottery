import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import axios from "axios";
import { logoutUser } from "../../redux/user/userActions";

import "./Rules.css";

export default function LegalDisclaimer() {
  const [checked, setChecked] = useState(false);
    const [htmlContent, setHtmlContent] = useState("");

  const navigate = useNavigate();
const dispatch = useDispatch();

    const user = useSelector((state) => state.auth.user?.user);
  const refreshToken = user?.refreshToken;

    useEffect(() => {
    fetch("https://docs.easylottery.in/terms")
      .then((resp) => resp.text())
      .then((html) => setHtmlContent(html))
      .catch(() => setHtmlContent("<p>Unable to load content.</p>"));
  }, []);

const handleAccept = async () => {
  if (!checked) {
    toast.error("Please read and confirm the Terms and Conditions to continue.");
    return;
  }

  if (!refreshToken) {
    toast.error("Session expired. Please log in again.");
    navigate("/login");
    return;
  }

  try {
    const response = await axios.post(
        // "https://api.easylotto.in/updateTerms", 
        "https://api.easylotto.in/reactDummy",
        {
      refreshToken,
      formstep: "updateTermsandcondition",
    });

    if (response.status === 200) {
      toast.success("Terms accepted successfully!");
      navigate("/dashboard");
    } else {
      toast.error("Something went wrong. Please try again.");
    }
  } catch (err) {
    console.error(err);
    toast.error("Failed to update terms. Please try again.");
  }
};

  const handleDecline = () => {
    dispatch(logoutUser());
    toast.info("You must accept Terms to continue.");
    navigate("/login");
  };

  return (
    <div className="otp-verification">
      {/* Background Image */}
      <div className="background-container">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/833d2053dc602c2041d74093fbcc195e94b043c7?width=822"
          alt="Terms background"
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
          <h1 className="page-title">Terms & Conditions</h1>

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
            <span>I have read & agree to the Terms & Conditions</span>
          </label>

          <div className="terms-button-group">
            <button className="verify-button enabled" onClick={handleDecline}>
              <span className="button-text">Decline</span>
            </button>
            <button
              className={`verify-button ${checked ? "enabled" : "disabled"}`}
              onClick={handleAccept}
            >
              <span className="button-text">Accept</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
