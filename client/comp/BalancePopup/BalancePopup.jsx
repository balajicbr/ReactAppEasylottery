// import React from "react";
// import "../AlertPopup/AlertPopup.css"; // reuse same styling as AlertPopup
// import ImBuy from "../../assets/Im_buy.jpg";

// const BalancePopup = ({ onClose, onAddCredit }) => {
//   return (
//     <div className="alertOverlay">
//       <div className="alertPopup">
//         <button className="closeBtn" onClick={onClose}>
//           ×
//         </button>
//         <img src={ImBuy} alt="Offer" className="alertImage" />
//         <p className="alertMessage">
//           You don’t have enough credits to complete this purchase.
//         </p>
//         <div className="buttonGroup">
//           <button className="okBtn" onClick={onClose}>Cancel</button>
//           <button className="okBtn" style={{ backgroundColor: "#B13F3A" }} onClick={onAddCredit}>
//             Add Credit
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BalancePopup;

import React from "react";
import "./BalancePopup.css";
import ImBuy from "../../assets/Im_buy.jpg";

const BalancePopup = ({ onClose, onAddCredit }) => {
  return (
    <div className="balanceOverlay">
      <div className="balancePopup">
        <button className="balanceCloseBtn" onClick={onClose}>
          ×
        </button>
        <img src={ImBuy} alt="Offer" className="balanceImage" />
        <p className="balanceMessage">
          You don’t have enough credits to complete this purchase.
        </p>
        <div className="balanceButtonGroup">
          <button className="balanceBtn cancel" onClick={onClose}>Cancel</button>
          <button className="balanceBtn confirm" onClick={onAddCredit}>Add Credit</button>
        </div>
      </div>
    </div>
  );
};

export default BalancePopup;
