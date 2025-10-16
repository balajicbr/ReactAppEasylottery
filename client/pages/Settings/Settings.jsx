import React, { useEffect, useState } from "react";
import './Settings.css';
import { useSelector } from "react-redux"; 
import { useNavigate } from 'react-router-dom';
import { useLocation } from "react-router-dom";
import Refer from "../../comp/Settings/Refer/Refer";
import News from "../../comp/Settings/NewsAndMedia/NewsAndMedia";
import Language from "../../comp/Settings/Language/Language";

import axios from "axios";
import { toast } from "react-toastify";
const Settings = () => {
const navigate = useNavigate();
const location = useLocation();
const type = location.state?.type;
const user = useSelector((state) => state.auth.user.user);
const refreshToken = user?.refreshToken;
const firstName = user?.user_name;
const phone = user?.first_name.match(/\((\d+)\)/);
const phonenumber = phone ? phone[1] : null;
const [loading, setLoading] = useState(false);

//console.log(phonenumber);
const displayLetters = firstName ? firstName[0].toUpperCase().repeat(firstName.length > 1 ? 2 : 1) : "";

const handleBack = () => {
  navigate(-1);
};


useEffect(() => {
  
}, []);



  return (
    <>
    <div className='main-container'>
        <div className="back-header" >
            <span className="back-arrow" onClick={handleBack}> <i className="fas fa-arrow-left" style={{ width: '24px', height: '24px', fontSize: '19px' }} ></i> </span>
            <span className="back-text">
              {type === "language"?"Language":type === "refer"?"Refer a Friend":type === "faq"?"FAQs":type === "aboutus"?"About Us":type === "news"?"News And Media":type === "terms"?"Terms & Conditions":type === "privacy"?"Privacy policy":""}
            </span>
        </div>
      <div className="main-container">
        {type === "language" && <Language />}
        {type === "refer" && <Refer />}
        {type === "news" && <News />}
        </div>
    </div>
    </>
  );
};

export default Settings;
