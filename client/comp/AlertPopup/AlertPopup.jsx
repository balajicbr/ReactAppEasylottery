import React from "react";
import "./AlertPopup.css";
import ImBuy from "../../assets/Im_Buy.jpg"
import { useNavigate } from "react-router-dom";
const AlertPopup = ({ message, onClose }) => {
  const navigate = useNavigate();
  //console.log("onclose: ", onClose);
  return (
    <div className="alertOverlay" onClick={onClose}>
      <div className="alertPopup" onClick={e => e.stopPropagation()}>
        <button
          className="closeBtn"
          onClick={() => {
           // console.log("Close btn clicked");
            onClose();
          }}
        >
          ×
        </button>
        <img src={ImBuy} alt="Offer" className="alertImage" />
        <p className="alertMessage">{message}</p>
        {message === "Insufficient balance." ? <p className="alertMessage">You don't have enough credits. Please 'Add Credit' to continue.</p> : null}
        
        <div className="button-div" >
        <button className="okBtn" onClick={() => {
            if (message === "Insufficient balance.") {
              navigate("/addCredits");
            } else {
              onClose();
            }
          }}
        >
          {message === "Insufficient balance." ? "Add Credits" : "OK"}
        </button>
        </div>
      </div>
    </div>
  );
};


export default AlertPopup;
