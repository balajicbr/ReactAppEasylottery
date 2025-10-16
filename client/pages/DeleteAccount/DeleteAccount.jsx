import React, { useEffect, useState } from "react";
import './DeleteAccount.css';
import { useSelector } from "react-redux"; 
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";
const DeleteAccount = () => {
const navigate = useNavigate();
const user = useSelector((state) => state.auth.user.user);
const refreshToken = user?.refreshToken;
const [loading, setLoading] = useState(false);
const [showModal, setShowModal] = useState(false);
const [otp, setOtp] = useState(["", "", "", "", "", ""]);
const [deleteAccountStatus, setDeleteAccountStatus] = useState(false);
//console.log(phonenumber);


const handleBack = () => {
  navigate(-1);
};

  const handleCloseModal = () => {
    setShowModal(false);
  };
  const handleConfirmtextModal = ()=> {
    setShowModal(false);
    setDeleteAccountStatus(true);
    console.log('Delete Account Confirmed with otp: ',otp);
  }
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

  return (
    <>
    <div className='main-container1'>
        <div className="back-header" >
            <span className="back-arrow" onClick={handleBack}> <i className="fas fa-arrow-left" style={{ width: '24px', height: '24px', fontSize: '19px' }} ></i> </span>
            <span className="back-text">Delete Account</span>
        </div>
        <div className="delete-content">
            <div className="delete-modal-text">
                <h2 className="delete-modal-title">Delete Account</h2>
            </div>
            {!deleteAccountStatus && (
            <>
            <div className="form-group-text">
                <p>At any time or for any reason, you can request to delete your account.For your security, we verify all deletion requests. This process takes up to seven days. Your account will remain active while verification is in progress.</p>
            </div>
            <button className="delete-account-btn" onClick={() => setShowModal(true)}>Delete Account</button>
            </>
            )}
            {deleteAccountStatus && (
                <>
              <svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" fill="none">
                    <circle cx="50" cy="50" r="50" fill="#C4F0D3" />
                    <path
                    d="M30 52 L45 67 L70 38"
                    stroke="#04A24C"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                    />
                </svg>
           <div className="submited-text">
                <p>We have received your request to delete your account and we are currently processing it. We will re-verify the information and proceed with the deletion accordingly.</p>
            </div>
            </>
            )}
        </div>
    </div>
    {showModal && (
    <div className="modal-overlay">
        <div className="modal-content">
            <div className="modal-header">
                <img src="https://api.builder.io/api/v1/image/assets/TEMP/3d489db49fd51d4dc624b447669b77768ef74b86?width=764"
                alt="Gradient Background"className="gradient-background" />
                {/* Success Icon */}
                <div className="success-icon">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                      <ellipse cx="56" cy="110" rx="26" ry="6" fill="#000" opacity=".08"/>
                      <rect x="24" y="36" width="64" height="6" rx="3" fill="#B98B12" opacity=".35"/>
                    <g filter="url(#shadow)">
                      <rect x="24" y="38" width="64" height="10" rx="5" fill="url(#lidGrad)" stroke="#E4A100" strokeWidth="1.5"/>

                      <rect x="50" y="28" width="24" height="8" rx="4" fill="#F1BE1E" stroke="#E4A100" strokeWidth="1.5"/>
                    </g>
                    <g filter="url(#shadow)">
                      <rect x="28" y="48" width="56" height="60" rx="8" fill="url(#binBody)" stroke="#E4A100" strokeWidth="1.8"/>

                      <rect x="30" y="52" width="52" height="10" rx="5" fill="#FFF" opacity=".25"/>

                      <rect x="42" y="58" width="6"  height="40" rx="3" fill="url(#slotGrad)"/>
                      <rect x="56" y="58" width="6"  height="40" rx="3" fill="url(#slotGrad)"/>
                      <rect x="70" y="58" width="6"  height="40" rx="3" fill="url(#slotGrad)"/>
                    </g>
                    <g transform="translate(0,-2)">
                      <circle cx="94" cy="40" r="12" fill="#B4232C" stroke="#B4232C" stroke-width="3"/>
                      <g stroke="#FFFFFF" stroke-width="3" strokeLinecap="round">
                        <line x1="88.5" y1="34.5" x2="99.5" y2="45.5"/>
                        <line x1="99.5" y1="34.5" x2="88.5" y2="45.5"/>
                      </g>
                    </g>
                    <defs>
                      <linearGradient id="binBody" x1="0" x2="0" y1="36" y2="116" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#FFE991"/>
                        <stop offset="1" stopColor="#FFC52E"/>
                      </linearGradient>
                      <linearGradient id="lidGrad" x1="0" x2="0" y1="26" y2="48" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#FFE991"/>
                        <stop offset="1" stopColor="#F5B51E"/>
                      </linearGradient>
                      <linearGradient id="slotGrad" x1="0" x2="0" y1="54" y2="104" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stopColor="#9C7B00" stopOpacity=".85"/>
                        <stop offset="1" stopColor="#5F4B00" stopOpacity=".95"/>
                      </linearGradient>
                      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000" floodOpacity=".25"/>
                      </filter>
                    </defs>
                    </svg> 
                </div>
                <button className="close-button" onClick={handleCloseModal}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M15 5L5 15M5 5L15 15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>
            <div className="modal-body">
                <div className="delete-modal-text">
                <h2 className="delete-modal-title">Delete Account</h2>
                <div className="form-group">
                  <div className="form-group-text">
                    <p>Are you sure you want to delete your account? This action is irreversible and will permanently remove all of your account data, including your profile, preferences, and saved information.</p>
                  </div>
                  <div className="otp-text">
                    <p>Please enter the last OTP sent to your telephone number to continue.</p>
                  </div>
                  <div className="otp-inputs-container">
                    <div className="otp-inputs">
                        {otp.map((digit, index) => (
                             <div key={index} className={`otp-box ${digit ? "filled" : ""}`}>
                                <input id={`otp-${index}`} type="text" value={digit} onChange={(e) => handleOtpChange(index, e.target.value)} onKeyDown={(e) => handleKeyDown(index, e)} className="otp-input" maxLength="1"/>
                             </div>
                        ))}
                    </div>
                  </div>
                </div>
            </div>
            <button className="delete-account-button" onClick={() => {handleConfirmtextModal()}}>Delete Account</button>
            </div>
        </div>
    </div>
    )};
    </>
  );
};

export default DeleteAccount;
