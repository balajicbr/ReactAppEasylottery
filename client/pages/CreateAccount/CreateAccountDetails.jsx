import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./CreateAccountDetails.css";
import easyLottery from "../../assets/Logo.png";
import CreateAccountImg from "../../assets/CreateAccount.jpg";
import loginMeghalaya from "../../assets/loginMeghalaya.jpg";


const CreateAccountDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const phone = location?.state?.phone || "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isFormValid = firstName.trim() && lastName.trim();

  const handleContinue = async () => {
    if (!phone) {
      toast.error("Phone number is missing. Please go back and register again.");
      return;
    }

    try {
      setIsLoading(true);

      // Step 1: Login Authentication
      const otpResponse = await axios.post(
        //"https://api.easylotto.in/OTP",
        "https://api.easylotto.in/reactDummy",
        {
          phoneno: phone,
          formstep: "1"
        },
        { headers: { "Content-Type": "application/json" } }
      );


        if (otpResponse?.status === 200) {
            
          toast.success("OTP sent successfully!");
          navigate("/otp", {
            state: {
              phoneNumber: phone,
              phone: phone,
              firstName,
              lastName,
              action:"Signup"
            },
          });
        } else {
          toast.error("Failed to send OTP, please try again.");
        }
      
    } catch (err) {
      console.error("SendOtp error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-details-container">
      <img src={CreateAccountImg} alt="Top Banner" className="top-banner" />
      <img src={easyLottery} alt="Logo" className="logo" />

      <div className="form-box">
        <h2>Add Your Name</h2>
        <p>We'll use it to personalize your experience</p>

        {/* First Name */}
        <div className="input-container">
          <label className="input-label">First Name</label>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter First Name"
              value={firstName}
            //   onChange={(e) => setFirstName(e.target.value)}
            onChange={(e) => {
            const value = e.target.value.replace(/[^A-Za-z]/g, "");
            setFirstName(value);
            }}
            />
          </div>
        </div>

        {/* Last Name */}
        <div className="input-container">
          <label className="input-label">Last Name</label>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter Last Name"
              value={lastName}
            //   onChange={(e) => setLastName(e.target.value)}
           onChange={(e) => {
           const value = e.target.value.replace(/[^A-Za-z]/g, "");
           setLastName(value);
         }}
            />
          </div>
        </div>

        <button
          className="register-btn"
          disabled={!isFormValid || isLoading}
          onClick={handleContinue}

        >
          {isLoading ? "Processing..." : "Continue"}
        </button>
      </div>

      <img src={loginMeghalaya} alt="Bottom Seal" className="bottom-banner" />
    </div>
  );
};

export default CreateAccountDetails;
