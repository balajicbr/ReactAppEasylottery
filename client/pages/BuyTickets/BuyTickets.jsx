import React, { useState, useEffect } from "react";
import "./BuyTickets.css";
import big50Banner from "../../assets/Bn_BuyTicket.jpg";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import axios from "axios";
import purchaseBanner from "../../assets/Im_Buy.jpg";
import PrizeDetails from "../../comp/PrizeDetails/PrizeDetails";
import AlertPopup from "../../comp/AlertPopup/AlertPopup";
import PurchaseConfirmation from "../../comp/PurchaseConfirmation/PurchaseConfirmation";
import logo from "../../assets/Meghalayalogo.png";
import { useNavigate } from "react-router-dom";
const BuyTickets = () => {
    const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("random");
  const [mode, setMode] = useState("single");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [couponData, setCouponData] = useState(null);
  const [couponId, setCouponId] = useState("");
  const [confirmAvailableTickets,setConfirmAvailableTickets] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [transactionId, setTransactionId] = useState("");
  const [selectedImageUrl,setSelectedImageUrl] = useState("");
  // Quantities and totals
  const [randomQuantity, setRandomQuantity] = useState("");
  const [luckyQuantity, setLuckyQuantity] = useState("");
  const [customQuantity, setCustomQuantity] = useState("");
  const [singleQuantity, setSingleQuantity] = useState("");

  const [randomTotalAmount, setRandomTotalAmount] = useState(0);
  const [luckyTotalAmount, setLuckyTotalAmount] = useState(0);
  const [customTotalAmount, setCustomTotalAmount] = useState(0);
  const [singleTotalAmount, setSingleTotalAmount] = useState(0);
  const [multipleTotalAmount, setMultipleTotalAmount] = useState(0);

  const [count, setCount] = useState("");
  const [numbers, setNumbers] = useState([]);
  const [showPrizes, setShowPrizes] = useState(false);

  const location = useLocation();
  const { id } = location.state || {};
  const [schemes, setSchemes] = useState([]);
  const [selectedId, setSelectedId] = useState(id || "");
  const [selectedScheme, setSelectedScheme] = useState(null);

  const user = useSelector((state) => state.auth.user.user);
  const refreshToken = user?.refreshToken;

  const [alertMessage, setAlertMessage] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  const [alphanumFields, setAlphanumFields] = useState([]);
  const [numFields, setNumFields] = useState([]);
  const [singleNumber, setSingleNumber] = useState("");
  const [showPurchaseConfirm, setShowPurchaseConfirm] = useState(false);
  const [purchaseType, setPurchaseType] = useState("");

  const [loadingTerms, setLoadingTerms] = useState(false);
  const [termsError, setTermsError] = useState(null);
  const [messageTitle, setMessageTitle] = useState('');
  const [showTicketPopup, setShowTicketPopup] = useState(false);
  // ✅ Fetch selected scheme details
  useEffect(() => {
    const fetchSchemeDetails = async () => {
      if (!refreshToken || !selectedId) return;
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
          { headers: { "lang-policies-mode": "max-age=0" } }
        );
        setSelectedScheme(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSchemeDetails();
  }, [selectedId, refreshToken]);
  const handleRemoveCoupon = () => {
    setCouponId("");
  };
    const handleApplyCoupon = () => {
    if (couponData?.id) {
      setCouponId(couponData.id);
    }
  };
  
  const output = {
    "json": {
        "tickets": "11698",
        "lottery_id": "E00690",
        "transation_id": "254201",
        "is_free": 0,
        "available_credit": 110,
        "transactions": 1
    },
        "json": {
        "tickets": "11699",
        "lottery_id": "E00690",
        "transation_id": "254201",
        "is_free": 0,
        "available_credit": 110,
        "transactions": 1
    },
}
  // ✅ Fetch all schemes
  useEffect(() => {
    const fetchSchemes = async () => {
      if (!refreshToken) return;
      try {
        const requestData = { refreshToken, formstep: "getSchemesData" };
        const response = await axios.post(
          "https://api.easylotto.in/GetSchemeDetails",
          requestData
        );
        setSchemes(response.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchSchemes();
    getCoupons();
  }, [refreshToken]);

  // ✅ Calculate all totals in one place
  useEffect(() => {
    const tAmount = parseInt(selectedScheme?.[0]?.json?.t_amount, 10) || 0;
    setRandomTotalAmount(tAmount * (parseInt(randomQuantity, 10) || 0));
    setLuckyTotalAmount(tAmount * (parseInt(luckyQuantity, 10) || 0));
    setCustomTotalAmount(tAmount * (parseInt(customQuantity, 10) || 0));
    setSingleTotalAmount(tAmount * (parseInt(singleQuantity, 10) || 0));
    setMultipleTotalAmount(tAmount * numbers.length);
  }, [randomQuantity, luckyQuantity, customQuantity, singleQuantity, numbers, selectedScheme]);

  // ✅ Setup alphanumeric and numeric dropdown fields
  useEffect(() => {
    const alpLen = parseInt(selectedScheme?.[0]?.json?.alp_len, 10) || 0;
    const numLen = parseInt(selectedScheme?.[0]?.json?.length, 10) || 0;
    setAlphanumFields(Array(alpLen).fill(""));
    setNumFields(Array(numLen).fill(""));
  }, [selectedScheme]);

  const resetAllFields = () => {
    setRandomQuantity("");
    setLuckyQuantity("");
    setCustomQuantity("");
    setSingleQuantity("");
    setCount("");
    setNumbers([]);
    setAlphanumFields(Array(parseInt(selectedScheme?.[0]?.json?.alp_len || 0)).fill(""));
    setNumFields(Array(parseInt(selectedScheme?.[0]?.json?.length || 0)).fill(""));
    setSingleNumber("");
  };

  const formatNumberFromFields = (alpArr = [], numArr = []) => {
    const alp = alpArr.map((v) => (v === "" ? "_" : v));
    const num = numArr.map((v) => (v === "" ? "_" : v));
    return [...alp, ...num].join("");
  };
  const handleSingleFieldChange = (index, value, isAlp) => {
    if (isAlp) {
      const updated = [...alphanumFields];
      updated[index] = value;
      setAlphanumFields(updated);
      setSingleNumber(formatNumberFromFields(updated, numFields));
      // console.log("singleNumber: ",singleNumber);
    } else {
      const updated = [...numFields];
      updated[index] = value;
      setNumFields(updated);
      setSingleNumber(formatNumberFromFields(alphanumFields, updated));
    }
  };

  const handleAddNumber = () => {
    const formatted = formatNumberFromFields(alphanumFields, numFields);
    if (formatted.split("").every((ch) => ch === "_")) return;
    setNumbers((prev) => [...prev, formatted]);
    setAlphanumFields(Array(alphanumFields.length).fill(""));
    setNumFields(Array(numFields.length).fill(""));
    setSingleNumber("");
  };

  const handleRemoveNumber = (index) => {
    setNumbers((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Shared validation logic
  // const validateQty = (qty, scheme) => {
  //   const maxTicket = parseInt(scheme?.maxticket, 10) || 0;
  //   const remainTicket = parseInt(scheme?.remaingticket, 10) || 0;
  //   const maxDrawTicket = parseInt(scheme?.maxdrawticket, 10) || 0;
  //   const availableCount = parseInt(scheme?.count, 10) || 0;
  //   const totalCredits = parseInt(scheme?.creadits, 0) || 0;
  //   const ticketAmount = parseInt(selectedScheme?.[0]?.json?.t_amount, 10) || 0;
  //   console.log("totalCredits: ",totalCredits);
  //   console.log("qtyvalue: ",qty*ticketAmount);
  //   if (qty <= 0) return "Enter quantity of tickets.";
  //   if (qty > maxTicket) return `Maximum of ${maxTicket} tickets per transaction.`;
  //   if (qty > remainTicket) return `Maximum ${maxDrawTicket} tickets per draw.`;
  //   if (qty > availableCount) return "These many tickets are not available. Please reduce the quantity.";
  //   if (qty*ticketAmount > totalCredits) return "You Don't have enough credit to buy a ticket, Please 'Add Credit' to continue buying tickets. "
  //   return null;
  // };


  const validateQty = (qty, scheme) => {
  const maxTicket = parseInt(scheme?.maxticket, 10) || 0;
  const remainTicket = parseInt(scheme?.remaingticket, 10) || 0;
  const maxDrawTicket = parseInt(scheme?.maxdrawticket, 10) || 0;
  const availableCount = parseInt(scheme?.count, 10) || 0;
  const totalCredits = parseInt(scheme?.creadits, 10) || 0;
  const ticketAmount = parseInt(scheme?.t_amount, 10) || 0;
    console.log("totalCredits: ",totalCredits);
    console.log("qtyvalue: ",qty*ticketAmount);
  if (qty <= 0) {
    return { title: "Invalid Quantity", message: "Enter quantity of tickets." };
  }

  if (qty > availableCount) {
    return { title: "Insufficient Tickets", message: "These many tickets are not available. Please reduce the quantity." };
  }

  if (qty > remainTicket) {
    return { title: "Draw Limit Reached", message: `Only ${remainTicket} tickets remaining for this draw.` };
  }

  if (qty > maxDrawTicket) {
    return { title: "Draw Limit", message: `Maximum ${maxDrawTicket} tickets allowed per draw.` };
  }

  if (qty > maxTicket) {
    return { title: "Transaction Limit", message: `Maximum of ${maxTicket} tickets per transaction.` };
  }

  if (qty * ticketAmount > totalCredits) {
    return { title: "Insufficient Credits", message: "You don't have enough credits. Please 'Add Credit' to continue." };
  }

  return null;
};
const handleRandomBuy = () => {
  const scheme = selectedScheme?.[0]?.json;
  const qty = parseInt(randomQuantity, 10) || 0;
  const err = validateQty(qty, scheme);

  if (err) {
    setMessageTitle(err.title);
    setAlertMessage(err.message);
    setShowAlert(true);
    return;
  }

  setPurchaseType("random");
  setShowPurchaseConfirm(true);
};


  // const handleRandomBuy = () => {
  //   const scheme = selectedScheme?.[0]?.json;
  //   const qty = parseInt(randomQuantity, 10) || 0;
  //   const err = validateQty(qty, scheme);
  //   cons
  //   if (err) return (setAlertMessage(err), setShowAlert(true));

  //   setPurchaseType("random");
  //   setShowPurchaseConfirm(true);
  // };

  const handleLuckyBuy = () => {
    const scheme = selectedScheme?.[0]?.json;
    const qty = parseInt(luckyQuantity, 10) || 0;
    const err = validateQty(qty, scheme);
    // if (err) return (setAlertMessage(err), setShowAlert(true));
  if (err) {
    setMessageTitle(err.title);
    setAlertMessage(err.message);
    setShowAlert(true);
    return;
  }
    setPurchaseType("luckyNum");
    setShowPurchaseConfirm(true);
  };

  const handleCustomSingleBuy = () => {
    const scheme = selectedScheme?.[0]?.json;
    const qty = parseInt(singleQuantity, 10) || 0;
    const err = validateQty(qty, scheme);
    if (err) {
      setMessageTitle(err.title);
      setAlertMessage(err.message);
      setShowAlert(true);
      return;
    }
    console.log("setSingleQuantity :",singleQuantity);
    console.log("singleNumber :",singleNumber.replace(/_/g, ""));
    console.log("singleNumber length :",singleNumber.replace(/_/g, "").length);

    // if (err) return (setAlertMessage(err), setShowAlert(true));
    if (!singleNumber.trim()) return ( setMessageTitle("Oops"),setAlertMessage("Please select a number."), setShowAlert(true));

    setPurchaseType("customSingle");
    setShowPurchaseConfirm(true);
  };
  const handleCloseModal = () => {
    setShowAlert(false);
  };
  const handleCustomMultipleBuy = () => {
    const scheme = selectedScheme?.[0]?.json;
    const qty = numbers.length;
    const err = validateQty(qty, scheme);
    // if (err) return (setAlertMessage(err), setShowAlert(true));
      if (err) {
        setMessageTitle(err.title);
        setAlertMessage(err.message);
        setShowAlert(true);
        return;
      }
    if (qty <= 0) return (setMessageTitle("Oops"),setAlertMessage("Please add at least one number."), setShowAlert(true));

    setPurchaseType("customMultiple");
    setShowPurchaseConfirm(true);
  };

  const base64ToBlob = (base64, mime = "application/pdf") => {
    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length).fill().map((_, i) => byteCharacters.charCodeAt(i));
      return new Blob([new Uint8Array(byteNumbers)], { type: mime });
    } catch (e) {
      console.error("base64ToBlob failed", e);
      return null;
    }
  };
const getCoupons = async () => {
    if (!selectedId || !refreshToken) return;
    
    try {
      const response = await axios.post("https://api.easylotto.in/getcoupon", {
        refreshToken,
        formstep: "getcoupon",
        id: selectedId,
      },{
          headers: {
            "lang-policies-mode": "max-age=0",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
    if(response.data){
      console.log("response.log:",response.data);
    }
    } catch (err) {
      console.error("Error fetching Coupons:", err);
    } finally {
    }
  };
  const fetchTerms = async () => {
    if (!selectedId || !refreshToken) return;
    setLoadingTerms(true);
    setTermsError(null);
    try {
      const response = await axios.post("https://api.easylotto.in/elterms", {
        refreshToken,
        formstep: "terms",
        id: selectedId,
        isd: "en",
        
      },        {
          headers: {
            "lang-policies-mode": "max-age=0",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

      const data = Array.isArray(response.data) ? response.data[0] : response.data;
      const binary = data?.binary?.data;
      const base64data = binary?.data;

      if (!base64data) throw new Error("No PDF data found in response");

      const blob = base64ToBlob(base64data, binary?.mimeType || "application/pdf");
      const url = URL.createObjectURL(blob);
      window.open(url);
    } catch (err) {
      console.error("Error fetching terms:", err);
      setTermsError(err.message || "Failed to load terms");
    } finally {
      setLoadingTerms(false);
    }
  };
    const generateKey = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    console.log("Result key is", result);
    return result;
  };

console.log("firstlength:", numbers?.[0]?.length ?? 0);
  // const encodeshoping = async (v1, v2, v3, v4, v5, v6) => {
  //   const code = `${v1}|${v2}|${v3}|${v4}|${v5}|${v6}`;
  //   const bytes = new TextEncoder().encode(code);
  //   const hashBuffer = crypto.subtle.digest("SHA-256", bytes);
  //   const hash = await hashBuffer;
  //   console.log("hash: ",hash);
  //   const hmacBase64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
  //   console.log("hmacBase64", hmacBase64);
  //   return hmacBase64;
  // };
  async function encodeshoping(v1, v2, v3, v4, v5, v6) {
  const code = `${v1}|${v2}|${v3}|${v4}|${v5}|${v6}`;
    console.log("code: ",code);

  const keyData = new TextEncoder().encode(v6); // key = v6
  const message = new TextEncoder().encode(code);

  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', cryptoKey, message);
  const hmacBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)));
  console.log("hmacBase64: ",hmacBase64);
  return hmacBase64;
}


  const encoding = (value) => {
    return btoa(value);
  };
  console.log(numbers);
 const handleConfirmPurchase = async () => {
  const generatedKey = generateKey();
  const currentTime = Math.floor(Date.now() / 1000);

  const value1 = refreshToken;
  const value2 = selectedId;
  const value5 = currentTime;
  const value6 = generatedKey;

  let value3, value4, session;

  try {
    if (purchaseType === "random") {
      value3 = randomTotalAmount;
      value4 = randomQuantity;
    } else if (purchaseType === "luckyNum") {
      value3 = luckyTotalAmount;
      value4 = `${luckyQuantity}`;
    } else if (purchaseType === "customSingle") {
      value3 = singleTotalAmount;
      value4 = singleQuantity;
    } else if (purchaseType === "customMultiple") {
      value3 = multipleTotalAmount;
      value4 = numbers.length ;
    }

    const encodedShoping = await encodeshoping(
      value1,
      value2,
      value3,
      value4,
      value5,
      value6
    );

    // Construct session payload based on purchaseType
    let sessionParts = [value1];

    switch (purchaseType) {
      case "random":
        sessionParts.push("11", value6, encodedShoping, value5, value2, value3, value4);
        break;

      case "luckyNum":
        sessionParts.push("12", value6, encodedShoping, value5, value2, value3, value4, `${count}`);
        break;

      case "customSingle":
        sessionParts.push("13", value6, encodedShoping, value5, value2, value3, value4, `${singleNumber}`,`${singleNumber.length}` );
        break;

      case "customMultiple":
        sessionParts.push(
          "14",
          value6,
          encodedShoping,
          value5,
          value2,
          value3,
          value4,
          numbers,
          numbers?.[0]?.length ?? 0
        );
        break;
    }

    session = encoding(sessionParts.join("|"));

    // API Call
    const response = await axios.post(
      //`https://api.easylotto.in/purchase?session=${session}`,
      // `https://api.easylotto.in/reactDummy?session=${session}`,
      { version: "", coupon: couponId || "" },
      {
        headers: { "lang-policies-mode": "max-age=0" },
        validateStatus: (status) => status >= 200 && status < 400,
      }
    );

    switch (response.status) {
      case 200:
        setShowPurchaseConfirm(false);
        console.log("Purchase successful:", response.data); 
        setTickets(response.data);
        setTransactionId(response.data[0]?.transaction_id || "");
        setShowTicketPopup(true);
        break;

       case 210:
        setShowPurchaseConfirm(false);
        setMessageTitle("Insufficient Credits");
        setAlertMessage("You don't have enough credits. Please 'Add Credit' to continue.");
        setShowAlert(true);
        break;

        case 220:
          setShowPurchaseConfirm(false);
          setMessageTitle("Tickets Unavailable");
          setAlertMessage("No tickets are available.");
          setShowAlert(true);
          break;

        case 250:
          setShowPurchaseConfirm(false);
          setMessageTitle("Scheme Closed");
          setAlertMessage("Scheme is closed, you can't buy the ticket.");
          setShowAlert(true);
          navigate("/dashboard");
          break;

        case 300:
          if (response.data.count === 0) {
            setShowPurchaseConfirm(false);
            setMessageTitle("Sold Out");
            setAlertMessage("All tickets are sold.");
            setShowAlert(true);
          } else {
            setShowPurchaseConfirm(false);
            setConfirmAvailableTickets(true);
            setMessageTitle(`${response.data.count} Tickets Available`);
            setAlertMessage(`Only ${response.data.count} tickets are available. Do you want to continue and purchase the ${response.data.count}  available tickets?`);
            setShowAlert(true);    
          }
          break;

        case 350:
          setShowPurchaseConfirm(false);
          setMessageTitle("Invalid Number");
          setAlertMessage("Selected number is not available.");
          setShowAlert(true);
          navigate("/dashboard");
          break;
      }
        } catch (error) {
        console.error("Purchase failed:", error);
        setMessageTitle("Purchase Failed");
        setAlertMessage("Tickets are not purchased. Try again.");
        setShowAlert(false);
      }
};

  const handleDropdownChange = (e) => {
    const selectedValue = e.target.value;
    console.log("inside dropdown change");
    const selectedScheme = schemes.find(
      (scheme) => scheme.json.id === selectedValue
    );

    if (selectedScheme) {
      console.log(selectedScheme.json.imageurl);
      setSelectedImageUrl(selectedScheme.json.imageurl);
    } else {
      setSelectedImageUrl(''); // fallback if not found
    }
  };
  return (
    <div className="buyTickets">
      {/* Banner */}
      <div className="banner">
        {selectedScheme?.[0] && (
          <div className="bannerWrapper">
            <img src={big50Banner} alt="Scheme Banner" className="bannerBg" />
            <div className="schemeNameBox">{selectedScheme[0].json.sname}</div>
            <div className="bannerPrize">First Prize : ₹{selectedScheme[0].json.amountt}</div>
            <div className="drawDate">Draw Date : {selectedScheme[0].json.draw_date}</div>
            <div className="actionButtons">
              <button className="Termsbtn" onClick={fetchTerms}>Terms & Conditions</button>
              <button className="viewprizeBtn" onClick={() => setShowPrizes(true)}>Prize Details</button>
            </div>
          </div>
        )}
      </div>

      <p className="infoText">Please choose one of the methods to buy a ticket</p>

      {/* Scheme Dropdown */}
      <div className="schemeDropdown">
        <label>Scheme</label>
        <select value={selectedId} onChange={(e) => {setSelectedId(e.target.value);{handleDropdownChange(e);}}}>
          {schemes.map((scheme) => (
            <option key={scheme.json.id} value={scheme.json.id}>
              {scheme.json.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button className={activeTab === "random" ? "active" : ""} onClick={() => { resetAllFields(); setActiveTab("random"); }}>
          Random / Lucky Digits
        </button>
        <button className={activeTab === "choose" ? "active" : ""} onClick={() => { resetAllFields(); setActiveTab("choose"); }}>
          Choose Your Numbers
        </button>
      </div>

      {/* --- Random & Lucky Tabs --- */}
      {activeTab === "random" && (
        <div className="randomTab">
          {/* Random Buy */}
          <div className="card">
            <h4>Random Tickets</h4>
            <label>Quantity</label>
            <input
              className="quantity"
              type="text"
              value={randomQuantity}
              onChange={(e) => setRandomQuantity(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="Enter quantity"
            />
            <div className="bottomRow">
              <div><p className="small">Total</p><p className="amount">₹{randomTotalAmount}</p></div>
              <button className="buyBtn" onClick={handleRandomBuy} disabled={!randomQuantity}>Buy Now</button>
            </div>
          </div>

          {/* Lucky Buy */}
          <div className="card">
            <h4>Choose Your Own Number</h4>
            <label>Enter total no. of count</label>
            <select value={count} onChange={(e) => setCount(e.target.value)}>
              <option value="">0</option>
              {[...Array(9)].map((_, i) => <option key={i + 1}>{i + 1}</option>)}
            </select>

            <label>Quantity</label>
            <input
              className="quantity"
              type="text"
              value={luckyQuantity}
              onChange={(e) => setLuckyQuantity(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="Enter quantity"
            />

            <div className="bottomRow">
              <div><p className="small">Total</p><p className="amount">₹{luckyTotalAmount}</p></div>
              <button className="buyBtn" disabled={!count} onClick={handleLuckyBuy}>Buy Now</button>
            </div>
          </div>
        </div>
      )}

      {/* --- Choose Tab --- */}
      {activeTab === "choose" && (
        <div className="chooseTab">
          <div className="mode">
            <label><input type="radio" name="mode" value="single" checked={mode === "single"} onChange={(e) => { resetAllFields(); setMode(e.target.value); }} /> Single</label>
            <label><input type="radio" name="mode" value="multiple" checked={mode === "multiple"} onChange={(e) => { resetAllFields(); setMode(e.target.value); }} /> Multiple</label>
          </div>

          {/* --- Single --- */}
          {mode === "single" && (
            <div className="card">
              <h4>Choose Your Number</h4>
              <div className="numberInputs">
                {alphanumFields.map((val, i) => (
                  <select key={`alp-${i}`} value={val} onChange={(e) => handleSingleFieldChange(i, e.target.value, true)}>
                    <option value="">A</option>
                    {selectedScheme?.[0]?.json?.alpha_series?.map((a, idx) => (
                      <option key={idx} value={a}>{a}</option>
                    ))}
                  </select>
                ))}
                {numFields.map((val, i) => (
                  <select key={`num-${i}`} value={val} onChange={(e) => handleSingleFieldChange(i, e.target.value, false)}>
                    <option value="">0</option>
                    {[...Array(10)].map((_, idx) => <option key={idx} value={idx}>{idx}</option>)}
                    <option value="_">*</option>
                  </select>
                ))}
              </div>

              <label>Quantity</label>
              <input
                className="quantity"
                type="text"
                value={singleQuantity}
                onChange={(e) => setSingleQuantity(e.target.value.replace(/[^\d]/g, ""))}
                placeholder="Enter quantity"
              />
              <div className="bottomRow">
                <div><p className="small">Total</p><p className="amount">₹{singleTotalAmount}</p></div>
                <button className="buyBtn" onClick={handleCustomSingleBuy}>Buy Now</button>
              </div>
            </div>
          )}

          {/* --- Multiple --- */}
          {mode === "multiple" && (
            <div className="card">
              <h4>Choose Multiple Numbers</h4>
              <div className="numberInputs">
                {alphanumFields.map((val, i) => (
                  <select key={`alp-${i}`} value={val} onChange={(e) => handleSingleFieldChange(i, e.target.value, true)}>
                    <option value="">A</option>
                    {selectedScheme?.[0]?.json?.alpha_series?.map((a, idx) => (
                      <option key={idx} value={a}>{a}</option>
                    ))}
                  </select>
                ))}
                {numFields.map((val, i) => (
                  <select key={`num-${i}`} value={val} onChange={(e) => handleSingleFieldChange(i, e.target.value, false)}>
                    <option value="">0</option>
                    {[...Array(10)].map((_, idx) => <option key={idx} value={idx}>{idx}</option>)}
                    <option value="_">*</option>
                  </select>
                ))}
              </div>

              <button className="addBtn" onClick={handleAddNumber}>Add Number</button>

              {numbers.length > 0 && (
                <div className="numbersList">
                  {numbers.map((num, idx) => (
                    <div key={idx} className="numBox">
                      <span>{num}</span>
                      <button className="removeBtn" onClick={() => handleRemoveNumber(idx)}>×</button>
                    </div>
                  ))}
                </div>
              )}

              <div className="bottomRow">
                <div><p className="small">Total</p><p className="amount">₹{multipleTotalAmount}</p></div>
                <button className="buyBtn" onClick={handleCustomMultipleBuy}>Buy Now</button>
              </div>
            </div>
          )}
        </div>
      )}

      {showAlert && (
                      <div className="modal-overlay">
                        <div className="modal-content">
                          <div className="modal-header">
                            <img 
                              src="https://api.builder.io/api/v1/image/assets/TEMP/3d489db49fd51d4dc624b447669b77768ef74b86?width=764"
                              alt="Gradient Background"
                              className="gradient-background"
                            />
                            {/* Success Icon */}
                            <div className="success-icon">
                              <svg width="105" height="105" viewBox="0 0 105 105" fill="none">
                                <path d="M67.2656 3.28125H11.4844C8.77734 3.28125 6.5625 5.49609 6.5625 8.20312V83.6719C6.5625 86.3789 8.77734 88.5938 11.4844 88.5938H14.7656C15.2906 88.5938 15.7828 88.3477 16.0781 87.9211L71.8594 12.4523C72.0727 12.1734 72.1875 11.8289 72.1875 11.4844V8.20312C72.1875 5.49609 69.9727 3.28125 67.2656 3.28125Z" fill="#C68400"/>
                                <path d="M73.8281 9.84375H18.0469C15.3286 9.84375 13.125 12.0473 13.125 14.7656V90.2344C13.125 92.9527 15.3286 95.1562 18.0469 95.1562H73.8281C76.5464 95.1562 78.75 92.9527 78.75 90.2344V14.7656C78.75 12.0473 76.5464 9.84375 73.8281 9.84375Z" fill="url(#paint0_linear_4010_9789)"/>
                                <path d="M56.5359 23.1168C52.4672 21.7879 49.5797 19.852 48.218 18.802C46.8727 17.7848 45.0023 17.7848 43.657 18.802C42.2953 19.8355 39.4078 21.7879 35.3391 23.1168C33.8297 23.609 32.8125 25.0035 32.8125 26.5785V30.1387C32.8125 38.998 40.5727 44.8715 43.9031 46.9879C44.5266 47.3816 45.232 47.5785 45.9375 47.5785C46.643 47.5785 47.3484 47.3816 47.9555 46.9879C51.2859 44.8715 59.0625 38.998 59.0625 30.1387V26.5785C59.0625 25.0035 58.0453 23.609 56.5359 23.1168Z" fill="#007E57"/>
                                <path d="M44.9859 37.4883C44.543 37.4883 44.1 37.3078 43.7883 36.9797L41.393 34.4531C40.7695 33.7969 40.8023 32.7633 41.4586 32.1398C42.1148 31.5164 43.1484 31.5492 43.7719 32.2055L44.9695 33.4688L49.5141 28.6617C50.1375 28.0055 51.1711 27.9727 51.8273 28.5961C52.4836 29.2195 52.5164 30.2531 51.893 30.9094L46.1508 36.9633C45.8391 37.2914 45.4125 37.4719 44.9531 37.4719L44.9859 37.4883ZM62.3438 55.7813H26.25C25.3477 55.7813 24.6094 55.043 24.6094 54.1406C24.6094 53.2383 25.3477 52.5 26.25 52.5H62.3438C63.2461 52.5 63.9844 53.2383 63.9844 54.1406C63.9844 55.043 63.2461 55.7813 62.3438 55.7813ZM62.3438 65.625H26.25C25.3477 65.625 24.6094 64.8867 24.6094 63.9844C24.6094 63.082 25.3477 62.3438 26.25 62.3438H62.3438C63.2461 62.3438 63.9844 63.082 63.9844 63.9844C63.9844 64.8867 63.2461 65.625 62.3438 65.625ZM57.4219 75.4688H26.25C25.3477 75.4688 24.6094 74.7305 24.6094 73.8281C24.6094 72.9258 25.3477 72.1875 26.25 72.1875H57.4219C58.3242 72.1875 59.0625 72.9258 59.0625 73.8281C59.0625 74.7305 58.3242 75.4688 57.4219 75.4688ZM54.1406 85.3125H26.25C25.3477 85.3125 24.6094 84.5742 24.6094 83.6719C24.6094 82.7695 25.3477 82.0313 26.25 82.0313H54.1406C55.043 82.0313 55.7812 82.7695 55.7812 83.6719C55.7812 84.5742 55.043 85.3125 54.1406 85.3125Z" fill="white"/>
                                <path d="M86.5922 66.3961L85.8047 63.2133L90.0539 54.8953C90.4312 54.157 90.2016 53.2383 89.4961 52.7789C89.2828 52.6312 84.0984 49.2188 78.75 49.2188C73.4016 49.2188 68.2172 52.6312 68.0039 52.7789C67.3148 53.2383 67.0688 54.1406 67.4461 54.8953L71.6953 63.2133L70.9078 66.3961C64.2141 70.6125 59.0625 80.2102 59.0625 88.5938C59.0625 100.127 68.5289 101.719 78.75 101.719C88.9711 101.719 98.4375 100.127 98.4375 88.5938C98.4375 80.1938 93.2859 70.6125 86.5922 66.3961Z" fill="#F28B2E"/>
                                <path d="M86.1328 80.3203H83.4258C83.1797 79.5068 82.6875 78.6934 82.1953 77.9961H86.1328C86.8711 77.9961 87.3633 77.5312 87.3633 76.834C87.3633 76.1367 86.8711 75.6719 86.1328 75.6719H72.5977C71.8594 75.6719 71.3672 76.1367 71.3672 76.834C71.3672 77.5312 71.8594 77.9961 72.5977 77.9961H76.9043C78.5039 77.9961 80.1035 78.9258 80.7188 80.3203H72.5977C71.8594 80.3203 71.3672 80.7852 71.3672 81.4824C71.3672 82.1797 71.8594 82.6445 72.5977 82.6445H81.0879C80.8418 84.6201 78.9961 86.1309 76.9043 86.1309H72.5977H72.4746C72.3516 86.1309 72.3516 86.1309 72.2285 86.1309C72.1055 86.1309 72.1055 86.2471 71.9824 86.2471C71.9824 86.2471 71.8594 86.2471 71.8594 86.3633C71.7363 86.4795 71.6133 86.5957 71.6133 86.7119C71.6133 86.8281 71.6133 86.8281 71.6133 86.9443C71.6133 87.0605 71.6133 87.0605 71.6133 87.1768V87.293C71.6133 87.4092 71.7363 87.6416 71.7363 87.7578C71.7363 87.7578 71.7363 87.874 71.8594 87.874L79.2422 96.0088C79.7344 96.4736 80.4727 96.5898 80.9648 96.125C81.457 95.6602 81.5801 94.9629 81.0879 94.498L75.3047 88.4551H76.9043C80.3496 88.4551 83.3027 85.8984 83.6719 82.6445H86.1328C86.8711 82.6445 87.3633 82.1797 87.3633 81.4824C87.3633 80.7852 86.8711 80.3203 86.1328 80.3203Z" fill="white"/>
                                <path d="M78.75 60.7031C76.2398 60.7031 73.8609 60.982 71.7445 61.4906C70.0711 61.8844 68.9062 63.1313 68.9062 64.575C68.9062 66.593 71.1211 68.1023 73.5 67.6922C75.1406 67.4133 76.9125 67.2656 78.75 67.2656C80.5875 67.2656 82.3594 67.4133 84 67.6922C86.3789 68.0859 88.5938 66.593 88.5938 64.575C88.5938 63.1313 87.4289 61.8844 85.7555 61.4906C83.6391 60.982 81.2602 60.7031 78.75 60.7031Z" fill="url(#paint1_linear_4010_9789)"/>
                                <defs>
                                  <linearGradient id="paint0_linear_4010_9789" x1="13.125" y1="28.3069" x2="87.8092" y2="33.5978" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#F9B42B"/>
                                    <stop offset="1" stopColor="#FED604"/>
                                  </linearGradient>
                                  <linearGradient id="paint1_linear_4010_9789" x1="68.9063" y1="62.2303" x2="90.0294" y2="67.6577" gradientUnits="userSpaceOnUse">
                                    <stop stopColor="#F9B42B"/>
                                    <stop offset="1" stopColor="#FED604"/>
                                  </linearGradient>
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
                            <div className="modal-text" style={{textAlign:"left",marginBottom:"10px"}}>
                              <h2 className="modal-title">{messageTitle}</h2>
                              <p className="modal-description">{alertMessage}</p>
                            </div>
                            <button  className="update-kyc-button" onClick={() => { 
                              {confirmAvailableTickets ? handleConfirmPurchase() : handleCloseModal();}}}>
                              {confirmAvailableTickets ? "Yes" :"Close"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
      {/* Modals */}
      {/* {showPrizes && <PrizeDetails setShowPrizes={setShowPrizes} />}
      {showAlert && <AlertPopup message={alertMessage} onClose={() => setShowAlert(false)} />}*/}
      {showPurchaseConfirm && (
        // <PurchaseConfirmation
        //   type={purchaseType}
        //   setShowPurchaseConfirm={setShowPurchaseConfirm}
        //   selectedScheme={selectedScheme}
        //   randomQuantity={randomQuantity}
        //   luckyQuantity={luckyQuantity}
        //   singleQuantity={singleQuantity}
        //   singleNumber={singleNumber}
        //   numbers={numbers}
        // />
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <img src={purchaseBanner} alt="Gradient Background" className="gradient-background"/>
                  <button className="close-button" onClick={() => setShowPurchaseConfirm(false)}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M15 5L5 15M5 5L15 15" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
              </div>
              <div className="modal-body">
                <div className="modal-text" style={{textAlign:"left",marginBottom:"10px"}}>
              {loading ? (
                <p>Loading coupon...</p>
              ) : error ? (
                <p style={{ color: "red" }}>{error}</p>
              ) : (
            <>
            <div className="couponBox">
              <span className="couponText">
                {couponData?.dis || "No discount available"}
              </span>
              {couponId ? (
                <button className="removeBtn" onClick={handleRemoveCoupon}>
                  Remove
                </button>
              ) : (
                <button className="applyBtn" onClick={handleApplyCoupon}>
                  Apply
                </button>
              )}
            </div>

            <p className="termsText">
              I have read the{" "}
              <span
                style={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  color: "blue",
                }}
                onClick={fetchTerms}
              >
                Terms and Conditions
              </span>
              , and agree to the purchase
            </p>
            <button className="confirmBtn" onClick={handleConfirmPurchase}>
            {/* <button className="confirmBtn" > */}
              Confirm Purchase
            </button>
          </>
        )}
                            </div>
                            
                          </div>
                        </div>
                      </div>
      )} 
   {/* {console.log("showTicketPopup",showTicketPopup)} */}
{showTicketPopup && (
  <div className="ticket-popup-overlay">
    <div className="ticket-popup">
      <img src= {logo} alt="Lottery Logo" className="popup-logo"/>
      <button className="close-button" onClick={() => setShowTicketPopup(false)}></button>
      <h2 className="congrats-text" style={{color:"#ee2424",fontSize:"20px"}}>Congratulations!</h2>
      <p>Meghalaya State Lottery congratulates you on buying your ticket(s).</p>
        <div style={{ marginTop: '1rem' }}>
          {console.log("selectedImageUrl", selectedImageUrl)}
          <img  src={selectedImageUrl} alt="Selected Scheme" style={{ maxWidth: '300px', height: 'auto' }} />
        </div>     
        <div className="ticket-list">
          {tickets.map((ticket, index) => (
            <div key={index} className="ticket-card1">
              {ticket.json.is_free ? <div className="free-tag">FREE</div> : null}
              <div className="ticket">{ticket.json.tickets}</div>
            </div>
          ))}
      </div>

      <button onClick={() => setShowTicketPopup(false)}>Close</button>
    </div>
  </div>
)}

 

    </div>
  );
};

export default BuyTickets;
