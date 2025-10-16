// import React from "react";
// import "./LimitedTicketsPopup.css";

// const LimitedTicketsPopup = ({ count, onCancel, onConfirm }) => {
//   return (
//     <div className="alertOverlay">
//       <div className="alertModal">
//         <p style={{ fontWeight: "600", color: "#B13F3A" }}>
//           Only {count} tickets are available.  
//           Do you want to continue and purchase the {count} tickets?
//         </p>
//         <div style={{ display: "flex", justifyContent: "space-between", marginTop: "15px" }}>
//           <button className="cancelBtn" onClick={onCancel}>No</button>
//           <button className="confirmBtn" onClick={onConfirm}>Yes</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LimitedTicketsPopup;

import React from "react";
import "./LimitedTicketsPopup.css";
import {ImBuy} from "../../assets/Im_Buy.jpg"

const LimitedTicketsPopup = ({ availableCount,requestedCount, onCancel, onConfirm }) => {
  console.log("count, cancel and conConfirm are",availableCount,requestedCount, onCancel, onConfirm );
  return (
    <div className="limitedOverlay">
      <div className="limitedPopup">
        <img src={ImBuy} alt="Offer" className="limitedImage" />
        <p className="limitedMessage">
          Only {availableCount} tickets are available. <br />
          Do you want to continue and purchase the {availableCount} tickets?
        </p>
        <div className="limitedButtonGroup">
          <button className="limitedBtn cancel" onClick={onCancel}>No</button>
          <button className="limitedBtn confirm" onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  );
};

export default LimitedTicketsPopup;
