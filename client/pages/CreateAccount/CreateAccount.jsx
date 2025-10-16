import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "./CreateAccount.css";
import easyLottery from "../../assets/Logo.png";
import CreateAccountImg from "../../assets/CreateAccount.jpg";
import loginMeghalaya from "../../assets/loginMeghalaya.jpg";

const CreateAccount = () => {
    const navigate = useNavigate();
  const [mobile, setMobile] = useState("");
  const [referral, setReferral] = useState("");
  const [checkboxes, setCheckboxes] = useState({
    age: false,
    reside: false,
    terms: false,
  });

  const allChecked = checkboxes.age && checkboxes.reside && checkboxes.terms;
  const isFormValid = mobile.length === 10 && allChecked;

  const handleCheckbox = (e) => {
    setCheckboxes({ ...checkboxes, [e.target.name]: e.target.checked });
  };

  // only allow numbers
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, ""); 
    setMobile(value);
  };

  const handleRegister = async () => {
    try {
      const requestData = {
        loginId: mobile,
        type: "register",
        stateid: 17,
        is18: checkboxes.age,
        isAuthorisedState: checkboxes.reside,
        reg_terms: checkboxes.terms,
        referal_code: referral,
      };

      const res = await axios.post("https://api.easylotto.in/reactDummy", requestData);
console.log("Rssponse is",res.status);

      switch (res.status) {
        case 200:
          navigate("/createaccountdetails", { state: { phone: mobile } });
          break;
        case 210:
          toast.error("Please select a state.");
          break;
        case 220:
          toast.error("Please confirm that you are 18 years old.");
          break;
        case 230:
          toast.error("Please confirm your authorized lottery state.");
          break;
        case 240:
          toast.error("Please confirm that you accept the terms and conditions.");
          break;
        case 250:
          toast.error("Referral code is not valid. Try again.");
          break;
        default:
          toast.error("This mobile number is already registered. Please use a different mobile number!");
          break;
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="create-account-container">
      <img src={CreateAccountImg} alt="Top Banner" className="top-banner" />
      <img src={easyLottery} alt="Logo" className="logo" />

      <div className="form-box">
        <h2>Create an Account</h2>
        <p>
          Reunlock access to a world of exciting draws, and real-time result
          tracking.
        </p>

        {/* Phone input with prefix */}
        <div className="input-container">
             <label className="input-label">Mobile Number</label>
        <div className="input-group phone-input">
          <div className="prefix">
            <img src="https://flagcdn.com/w20/in.png" alt="India Flag" className="flag-icon"/>
            <span>+91</span>
          </div> 
          <input type="text" placeholder="0000000000" value={mobile} onChange={handleMobileChange} maxLength="10"/>
        </div>
        </div>
         <div className="input-container">
        <label className="input-label">Referral Code (Optional)</label>
        <div className="input-group">
          <input
            type="text"
            placeholder="Enter Referral Code"
            value={referral}
            onChange={(e) => setReferral(e.target.value)}
          />
        </div>
       </div>
        <div className="checkbox-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="age"
              checked={checkboxes.age}
              onChange={handleCheckbox}
            />
            I confirm that I am over 18 years old
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="reside"
              checked={checkboxes.reside}
              onChange={handleCheckbox}
            />
            I reside in a lottery-authorised state.
          </label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="terms"
              checked={checkboxes.terms}
              onChange={handleCheckbox}
            />
            I agree to the Terms and Conditions.
          </label>
        </div>

        <button className="register-btn" disabled={!isFormValid} onClick={handleRegister}>
          Register
        </button>

        <p className="login-text">
          Already a member? <span className="login-link">Login</span>
        </p>
      </div>

      <img
        src={loginMeghalaya}
        alt="Bottom Seal"
        className="bottom-banner"
      />
    </div>
  );
};

export default CreateAccount;