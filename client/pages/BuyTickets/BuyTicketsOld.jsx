import React, { useState, useEffect } from "react";
import "./BuyTickets.css";
import big50Banner from "../../assets/Bn_BuyTicket.jpg";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import PrizeDetails from "../../comp/PrizeDetails/PrizeDetails"; 
import AlertPopup from "../../comp/AlertPopup/AlertPopup";

const BuyTickets = () => {
  const [activeTab, setActiveTab] = useState("random");
  const [mode, setMode] = useState("single");

  // Separate state for quantities
  const [randomQuantity, setRandomQuantity] = useState("");
  const [randomTotalAmount, setRandomTotalAmount] = useState(0);

  const [customQuantity, setCustomQuantity] = useState("");
  const [customTotalAmount, setCustomTotalAmount] = useState(0);

  const [count, setCount] = useState("");
  const [numbers, setNumbers] = useState([]);
  const [selected, setSelected] = useState("");
  const [showPrizes, setShowPrizes] = useState(false);

  const location = useLocation();
  const { id, imagename, subname } = location.state || {};
  const [schemes, setSchemes] = useState([]);
  const [selectedId, setSelectedId] = useState(id || ""); // default from navbar
  const user = useSelector((state) => state.auth.user.user);
  const refreshToken = user?.refreshToken;
  const [selectedScheme, setSelectedScheme] = useState(null);

  const [alertMessage, setAlertMessage] = useState("");
const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const fetchSchemeDetails = async () => {
      if (!refreshToken || !selectedId) {
        console.error("Missing refreshToken or scheme id");
        return;
      }

      try {
        const requestData = {
          refreshToken,
          formstep: "getSchemeDetails",
          id: selectedId,
          isd: "en",
          scheme: selectedId,
        };
        const response = await axios.post(
          "https://api.easylotto.in/easyshoping",
          requestData,
          {
            headers: {
              "lang-policies-mode": "max-age=0",
            },
          }
        );
        setSelectedScheme(response.data);
      } catch (error) {
        console.error("Error fetching scheme details:", error);
      }
    };

    fetchSchemeDetails();
  }, [selectedId, refreshToken]);

  useEffect(() => {
    const fetchSchemes = async () => {
      if (!refreshToken) return;
      try {
        const requestData = {
          refreshToken,
          formstep: "getSchemesData",
        };
        const response = await axios.post(
          "https://api.easylotto.in/GetSchemeDetails",
          requestData
        );
        setSchemes(response.data || []);
      } catch (error) {
        console.error("Error fetching schemes list:", error);
      }
    };
    fetchSchemes();
  }, [refreshToken]);
  // Calculate Random Total Amount
  useEffect(() => {
    const tAmount = parseInt(selectedScheme?.[0]?.json?.t_amount, 10) || 0;
    const qty = parseInt(randomQuantity, 10) || 0;
    setRandomTotalAmount(tAmount * qty);
  }, [randomQuantity, selectedScheme]);

  // Calculate Custom Total Amount
  useEffect(() => {
    const tAmount = parseInt(selectedScheme?.[0]?.json?.t_amount, 10) || 0;
    const qty = parseInt(customQuantity, 10) || 0;
    setCustomTotalAmount(tAmount * qty);
  }, [customQuantity, selectedScheme]);

  const handleAddNumber = () => {
    if (selected) {
      setNumbers([...numbers, selected]);
      setSelected("");
    }
  };

  const handleRemoveNumber = (index) => {
    const updated = [...numbers];
    updated.splice(index, 1);
    setNumbers(updated);
  };

const handleRandomBuy = () => {
  const maxTicket = parseInt(selectedScheme?.[0]?.json?.maxticket, 10) || 0;
  const remainTicket = parseInt(selectedScheme?.[0]?.json?.remaingticket, 10) || 0;
  const maxDrawTicket = parseInt(selectedScheme?.[0]?.json?.maxdrawticket, 10) || 0;
  const availableCount = parseInt(selectedScheme?.[0]?.json?.count, 10) || 0;
  const credits = parseInt(selectedScheme?.[0]?.json?.creadits, 10) || 0;

  const qty = parseInt(randomQuantity, 10) || 0;
  const totalAmount = parseInt(selectedScheme?.[0]?.json?.t_amount, 10) * qty;

  if (qty <= 0) {
    setAlertMessage("Enter quantity of tickets.");
    setShowAlert(true);
    return;
  }

  if (qty > maxTicket) {
    setAlertMessage(`Maximum of ${maxTicket} tickets per transaction.`);
    setShowAlert(true);
    return;
  }

  if (qty > remainTicket) {
    setAlertMessage(`Maximum ${maxDrawTicket} tickets per draw.`);
    setShowAlert(true);
    return;
  }

  if (qty > availableCount) {
    setAlertMessage("These many tickets are not available. Please reduce the quantity.");
    setShowAlert(true);
    return;
  }

  if (totalAmount > credits) {
    setAlertMessage("Insufficient credits to buy tickets.");
    setShowAlert(true);
    return;
  }

  // Proceed with actual purchase flow here if all checks pass
  console.log("Proceed to buy", qty, totalAmount);
};


  return (
    <div className="buyTickets">
      {/* Banner */}
      <div className="banner">
        {selectedScheme && selectedScheme[0] && (
          <div className="bannerWrapper">
            <img src={big50Banner} alt="Scheme Banner" className="bannerBg" />

            <div className="schemeNameBox">
              {selectedScheme[0].json.sname}
            </div>

            <div className="bannerPrize">
              First Prize : ₹{selectedScheme[0].json.amountt}
            </div>

            <div className="drawDate">
              Draw Date : {selectedScheme[0].json.draw_date}
            </div>

            <div className="actionButtons">
              <button className="Termsbtn">Terms & Conditions</button>
              <button
                className="viewprizeBtn"
                onClick={() => setShowPrizes(true)}
              >
                Prize Details
              </button>
            </div>
          </div>
        )}
      </div>

      <p className="infoText">
        Please choose one of the methods to buy a ticket
      </p>

      <div className="schemeDropdown">
        <label>Scheme</label>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
        >
          {schemes.map((scheme) => (
            <option key={scheme.json.id} value={scheme.json.id}>
              {scheme.json.name}
            </option>
          ))}
        </select>
      </div>

      <div className="tabs">
        <button
          className={activeTab === "random" ? "active" : ""}
          onClick={() => setActiveTab("random")}
        >
          Random / Lucky Digits
        </button>
        <button
          className={activeTab === "choose" ? "active" : ""}
          onClick={() => setActiveTab("choose")}
        >
          Choose Your Numbers
        </button>
      </div>

      {activeTab === "random" && (
        <div className="randomTab">
          <div className="card">
            <h4>Random Tickets</h4>
            <p className="subtext">Purchase a random set of ticket</p>

            <label>Quantity</label>
            <input
              type="number"
              value={randomQuantity}
              onChange={(e) => setRandomQuantity(e.target.value)}
              placeholder="Enter quantity"
            />

            <div className="bottomRow">
              <div>
                <p className="small">Total</p>
                <p className="amount">₹{randomTotalAmount}</p>
              </div>
              <button className="buyBtn" onClick={handleRandomBuy} disabled={!randomQuantity}>
                Buy Now
              </button>
            </div>
          </div>

          <div className="card">
            <h4>Choose Your Own Number</h4>
            <p className="subtext">Number position based ticket search</p>

            <label>Enter total no. of count</label>
            <select
              value={count}
              onChange={(e) => setCount(e.target.value)}
            >
              <option value="">0</option>
              {[...Array(9)].map((_, i) => (
                <option key={i + 1}>{i + 1}</option>
              ))}
            </select>

            <label>Quantity</label>
            <input
              type="number"
              value={customQuantity}
              onChange={(e) => setCustomQuantity(e.target.value)}
              placeholder="Enter quantity"
            />

            <div className="bottomRow">
              <div>
                <p className="small">Total</p>
                <p className="amount">₹{customTotalAmount}</p>
              </div>
              <button className="buyBtn" disabled={!count}>
                Buy Now
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "choose" && (
        <div className="chooseTab">
          <div className="mode">
            <label>
              <input
                type="radio"
                name="mode"
                value="single"
                checked={mode === "single"}
                onChange={(e) => setMode(e.target.value)}
              />
              Single
            </label>
            <label>
              <input
                type="radio"
                name="mode"
                value="multiple"
                checked={mode === "multiple"}
                onChange={(e) => setMode(e.target.value)}
              />
              Multiple
            </label>
          </div>

          {mode === "single" && (
            <div className="card">
              <h4>Choose Your Number</h4>
              {[...Array(5)].map((_, i) => (
                <select key={i} className="numberField">
                  <option value="">A 00000</option>
                </select>
              ))}

              <label>Quantity</label>
              <input type="number" placeholder="Enter quantity" />

              <div className="bottomRow">
                <div>
                  <p className="small">Total</p>
                  <p className="amount">₹0</p>
                </div>
                <button className="buyBtn">Buy Now</button>
              </div>
            </div>
          )}

          {mode === "multiple" && (
            <div className="card">
              <h4>Choose Multiple Numbers</h4>

              {[...Array(5)].map((_, i) => (
                <select
                  key={i}
                  className="numberField"
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
                >
                  <option value="">A 00000</option>
                  <option value={`Num ${i + 1}`}>Num {i + 1}</option>
                </select>
              ))}

              <button className="addBtn" onClick={handleAddNumber}>
                + Add
              </button>

              {numbers.length > 0 && (
                <div className="numbersWrap">
                  <label>Numbers</label>
                  <div className="chipContainer">
                    {numbers.map((num, idx) => (
                      <div className="chip" key={idx}>
                        {num}
                        <span
                          className="removeChip"
                          onClick={() => handleRemoveNumber(idx)}
                        >
                          ×
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bottomRow">
                <div>
                  <p className="small">Total</p>
                  <p className="amount">₹0</p>
                </div>
                <button className="buyBtn">Buy Now</button>
              </div>
            </div>
          )}
        </div>
      )}

      {showPrizes && (
        <PrizeDetails
          selectedId={selectedId}
          refreshToken={refreshToken}
          onClose={() => setShowPrizes(false)}
        />
      )}

      {showAlert && (
  <AlertPopup
    message={alertMessage}
    onClose={() => setShowAlert(false)}
  />
)}
    </div>
  );
};

export default BuyTickets;
