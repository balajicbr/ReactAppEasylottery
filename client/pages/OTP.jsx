import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import axios from "axios"; 
import { loginUser} from "../../client/redux/user/userActions";
import "./OTP.css";

export default function OTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loginResp_ = location.state?.loginResp;

  const phoneNumber = location.state?.phone || location.state?.phoneNumber || "";
    const firstName = location.state?.firstName || "";
  const lastName = location.state?.lastName || "";
  const action = location.state?.action || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  // timer state
  const [timeLeft, setTimeLeft] = useState(300); // 5 mins = 300 sec
  const timerRef = useRef(null);

  // start timer on mount
  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    clearInterval(timerRef.current);
    setTimeLeft(300);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleBack = () => {
    navigate("/");
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyOTP = async () => {
    if (timeLeft <= 0) {
      toast.error("OTP is expired. Please click on resend to receive a new OTP.");
      return;
    }

    const otpValue = otp.join("");
    if (otpValue.length !== 6) {
      toast.error("Please enter the 6-digit OTP");
      return;
    }

    const requestData = {
      phoneno: phoneNumber,
      formstep: "2",
      id: otpValue,
      applicationId: "b2b10a31-7370-4696-8706-7c5e0bc356f0",
      type: "easylottouser",
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
      // type1: "Login",
      // link: "https://web.easylottery.in/",
       ...(action === "Signup" && { firstName, lastName, type1:"SignUp" }), // only add if signup
        ...(action === "Login" && { type1: "Login", link: "https://web.easylottery.in/" }),
    };

try {
  setIsLoading(true);
  let response;

  if (action === "Login") {
    response = await dispatch(loginUser(requestData));
  } else if (action === "Signup") {
     response = await axios.post("http://localhost:9080/authn/signup", requestData, {
        headers: { "Content-Type": "application/json" },
      });
  }

  console.log("From - " + action + " action, the OTP Verification Response:", response);

  if (response?.status === 200) {
    if (action === "Login") {
      console.log("Inside login action");
      
        toast.success("Logged in successfully!");
       const userMeta = loginResp_?.user || loginResp_;
       console.log("userMeta is",userMeta)
    const stateId = userMeta?.stateid;
console.log("Stateid is",stateId)
    if (stateId?.trim() === "Accepted") {
      // to dashboard
        dispatch({ type: "LOGIN_SUCCESS", payload: loginResp_ });
      navigate("/dashboard");
    } else {
      console.log("Redirect to rules page - " + stateId);
      // if not accepted, navigate to rules and show welcome popup
      // const userId = userMeta?.id || userMeta?.user_id || userMeta?.userid;
       dispatch({ type: "LOGIN_SUCCESS", payload: loginResp_ });
      navigate("/rules", { state: { userId: userMeta?.id, stateId } });
    }
        // navigate("/dashboard");
    } else {
      toast.success("Signup successful! Please log in.");
      navigate("/login", { state: { showPopup: true } });
    }
  } else {
    toast.error(response?.data?.error || "Verification failed. Try again.");
  }
} catch (error) {
  console.error("Error verifying OTP:", error);
  toast.error("Something went wrong. Please try again.");
} finally {
  setIsLoading(false);
}

  };

  const handleResendOTP = async () => {
    try {
      const requestData = {
        phoneno: phoneNumber,
        formstep: "1", // resend OTP
      };

      const response = await axios.post(
        "https://api.easylotto.in/OTP",
        requestData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.status === 200) {
        toast.success("An OTP has been generated and sent to your phone number successfully.");
        startTimer(); // restart timer
        setOtp(["", "", "", "", "", ""]); // clear old OTP fields
      } else if (response.status === 300) {
        toast.error("Invalid OTP. Please try again.");
      } else {
        toast.error("Something went wrong while resending OTP.");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error("Server error. Try again later.");
    }
  };

  const isOtpComplete = otp.every((digit) => digit !== "");

const goToRules = () => {
  setShowPopup(false);
  navigate("/rules");
};

  return (
    <>
    <div className="otp-verification">
      {/* Background Image */}
      <div className="background-container">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/833d2053dc602c2041d74093fbcc195e94b043c7?width=822"
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

      {/* Main Content Card */}
      <div className="main-content-card">
        <div className="card-handle"></div>

        <div className="card-content">
          {/* Header Section */}
          <div className="header-section">
            <div className="header-row">
              <button onClick={handleBack} className="back-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 19L5 12L12 5" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 12H5" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h1 className="page-title">OTP Verification</h1>
            </div>

            <div className="subtitle-section">
              <p className="subtitle">
                Please enter the 6-digit OTP sent to your +91 {phoneNumber}
              </p>
            </div>
          </div>

          {/* OTP Input Section */}
          <div className="otp-input-section">
            <div className="otp-inputs-container">
              <div className="otp-inputs">
                {otp.map((digit, index) => (
                  <div key={index} className={`otp-box ${digit ? "filled" : ""}`}>
                    <input
                      id={`otp-${index}`}
                      type="text"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="otp-input"
                      maxLength="1"
                    />
                  </div>
                ))}
              </div>

              <div className="resend-section" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button onClick={handleResendOTP} className="resend-button">
                  <span className="resend-text">Didn't receive the OTP? </span>
                  <span className="resend-link">Resend</span>
                </button>
                <span className="timer">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <button
              onClick={handleVerifyOTP}
              disabled={!isOtpComplete || isLoading}
              className={`verify-button ${isOtpComplete ? "enabled" : "disabled"}`}
            >
              <span className="button-text">
                {isLoading ? "Verifying..." : "Verify & Proceed"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    </>
  );
}
