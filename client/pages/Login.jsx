import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./Login.css";
import loginMeghalaya from "../assets/loginMeghalaya.jpg";
import { useDispatch } from "react-redux";
import registerSuccessImg from "../assets/Im_RegisterSuccess.jpg";


const OTP_URL = import.meta.env.VITE_OTP_URL || "https://api.easylotto.in/reactDummy";

const Login = () => {

const location = useLocation();
const [showPopup, setShowPopup] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  if (location.state?.showPopup) {
    setShowPopup(true);
  }
}, [location.state]);

  const handleSendOtp = async (e) => {
    e.preventDefault();

    const clean = phone.replace(/\D/g, "");
    if (!/^\d{10}$/.test(clean)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }


    try {
      setIsLoading(true);

      // 🔹 Step 1: Call backend LoginAuthentication instead of direct Login API
      const loginResponse = await axios.post(
        "http://localhost:9080/authn/loginAuthentication",
        {
          loginId: phone,
          id: "",
          applicationId: "b2b10a31-7370-4696-8706-7c5e0bc356f0",
          type: "easylottouser",
          type1: "Login",
          referal_code: "",
          device_name: "web",
          device_info: JSON.stringify({
            browserName: navigator.userAgentData?.brands?.[0]?.brand || "chrome",
            appCodeName: navigator.appCodeName,
            appName: navigator.appName,
            appVersion: navigator.appVersion,
            deviceMemory: navigator.deviceMemory,
            language: navigator.language,
            platform: navigator.platform,
            product: navigator.product,
            userAgent: navigator.userAgent,
            vendor: navigator.vendor,
            hardwareConcurrency: navigator.hardwareConcurrency,
          }),
          link: "https://web.easylottery.in/",
        },
        { headers: { "Content-Type": "application/json" } }
      );
//console.log("loginResponse => " , loginResponse);
      if (loginResponse.status === 200) {
        const otpResponse = await axios.post(
          OTP_URL,
          { phoneno: clean, formstep: "1" },
          { headers: { "Content-Type": "application/json" } }
        );
        if (otpResponse?.status === 200) {
          toast.success("OTP sent successfully!");
          navigate("/otp", { state: { phoneNumber: clean, phone: clean, loginResp: loginResponse.data,action:"Login"} });
        } else {
          toast.error("Failed to send OTP, please try again.");
        }
      } else {
        dispatch({ type: "LOGIN_FAIL", payload: loginResponse.user || "Login failed" });
        // fallback if backend sends non-200 but no specific toast
        toast.error(loginResponse.data?.message || "Login failed");
      }
    } catch (error) {
      console.error("SendOtp/Login error:", error);

      if (error.response) {
        const { status, data } = error.response;
        if (status === 330) {
          toast.error("Your account has been deleted. Please contact administrator.");
        } else if (status === 310) {
          toast.error("Mobile number is changed. Use the new one.");
        } else if (status === 404) {
          toast.error("This mobile number is not registered yet! Please Sign up!");
        } else {
          toast.error(data?.message || "Server error. Please try again.");
        }
      } else {
        toast.error("Network error. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    navigate("/dashboard");
  };

  const handleRegister = () => {
    navigate("/createaccount");
  };

  return (
    <>
    <div className="login-first-time">
      {/* Background Image */}
      <div className="background-container">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/1b117226f49a80ffb53196a9b2a166ff09d1dbc0?width=822"
          alt="Login-OTP-background"
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

      {/* Main Content Container */}
      <div className="main-content-container">
        <div className="welcome-card">
          <div className="card-handle"></div>
          <div className="card-content">
            <div className="welcome-section">
              <div className="welcome-header">
                <h1 className="welcome-title">Welcome to EasyLottery</h1>
              </div>
              <p className="welcome-subtitle">
                Enter your mobile number to login with us
              </p>
            </div>

            <div className="mobile-input-section">
              <label className="mobile-label">Mobile number</label>
              <div className="mobile-input-container">
                <div className="input-content">
                  <svg
                    className="india-flag"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M23.8125 3.9375H0.1875V20.0625H23.8125V3.9375Z" fill="#F4F5F4" />
                    <path d="M23.8125 3.9375H0.1875V9.28875H23.8125V3.9375Z" fill="#E97403" />
                    <path d="M23.8125 14.715H0.1875V20.0663H23.8125V14.715Z" fill="#258C05" />
                  </svg>
                  <div className="input-fields">
                    <span className="country-code">+91</span>
                    <div className="input-divider"></div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, "");
                        setPhone(digitsOnly);
                      }}
                      className="phone-input"
                      maxLength={10}
                      placeholder="0000000000"
                      autoComplete="tel"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="buttons-section">
              <button
                className="login-button"
                onClick={handleSendOtp}
                disabled={!phone || isLoading}
              >
                <span>{isLoading ? "Sending..." : "Send OTP"}</span>
              </button>

              <button className="guest-button" onClick={handleContinueAsGuest}>
                <div className="guest-button-content">
                  <span>Continue as guest</span>
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 21 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.66675 10H16.3334"
                      stroke="#AD1E24"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M10.5 4.16669L16.3333 10L10.5 15.8334"
                      stroke="#AD1E24"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="additional-sections">
          <div className="faq-section">
            <div className="faq-content">
              <span>How to buy tickets?</span>
            </div>
            <span className="faq-link">View FAQ</span>
          </div>

          <div className="register-section">
            <span className="register-text">Don't have an account? </span>
            <span className="register-link" onClick={handleRegister}>
              Register
            </span>
          </div>
        </div>
      </div>

      <div className="bottom-illustration">
        <img src={loginMeghalaya} className="cash-image" />
      </div>
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
          </div>43517443
        </div>
      )}
    </div>

    </>
  );
};

export default Login;
