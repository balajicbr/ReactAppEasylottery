import React from "react";
import "./AlertPopup.css";
import ImBuy from "../../assets/Im_Buy.jpg"
const AlertPopup = ({ message, onClose }) => {
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
        <button className="okBtn" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
};


export default AlertPopup;
