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
    return { title: "Less Credits", message: "You don't have enough credits to buy a ticket. Please 'Add Credit' to continue." };
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
    console.log("drop:",count);
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
     // `https://api.easylotto.in/purchase?session=${session}`,
      `https://api.easylotto.in/reactDummy?session=${session}`,
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



      {/* Tabs */}
      <div className="tabs">
        <button className={activeTab === "random" ? "active" : ""} onClick={() => { resetAllFields(); setActiveTab("random"); }}>
          Random/Lucky Digits
        </button>
        <button className={activeTab === "choose" ? "active" : ""} onClick={() => { resetAllFields(); setActiveTab("choose"); }}>
          Choose Numbers
        </button>
      </div>

      {/* --- Random & Lucky Tabs --- */}
      {activeTab === "random" && (
        <div className="randomTab">
          {/* Random Buy */}
          <div className="card">
            <h4>Random Tickets</h4>
            <h5>Purchase a random set of tickets</h5>
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
            <h4>Choose Your Own Numbers</h4>
            <h5>Number Position based ticket search</h5>
            <label>Enter total no. of count</label>
            <select value={count} onChange={(e) => setCount(e.target.value)}>
              <option key="">select no of count</option>
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
          <div className="card">
            <h4><strong>Choose Your Own Numbers</strong></h4>
            <h5>Number position based ticket search</h5>
            {/* <div className="mode">
              <label><input type="radio"   id = "mode" className="mode" value="single" checked={mode === "single"} onChange={(e) => { resetAllFields(); setMode(e.target.value); }} />Single</label>
              <label><input type="radio" className="mode" id = "mode" value="multiple" checked={mode === "multiple"} onChange={(e) => { resetAllFields(); setMode(e.target.value); }} />Multiple</label>
            </div> */}
            <div className="mode">
  <label className={mode === "single" ? "active" : ""}>
    <input
      type="radio"
      name="mode"
      id="mode-single"
      value="single"
      checked={mode === "single"}
      onChange={(e) => {
        resetAllFields();
        setMode(e.target.value);
      }}
    />
    Single
  </label>

  <label className={mode === "multiple" ? "active" : ""}>
    <input
      type="radio"
      name="mode"
      id="mode-multiple"
      value="multiple"
      checked={mode === "multiple"}
      onChange={(e) => {
        resetAllFields();
        setMode(e.target.value);
      }}
    />
    Multiple
  </label>
</div>

            {/* --- Single --- */}
            {mode === "single" && (
              <>
              <h4>Choose Your own Numbers</h4>
              <div className="numberInputs">
                {alphanumFields.map((val, i) => (
                  <select key={`alp-${i}`} value={val} onChange={(e) => handleSingleFieldChange(i, e.target.value, true)}>
                    <option className="numberselect" value="">*</option>
                    {selectedScheme?.[0]?.json?.alpha_series?.map((a, idx) => (
                      <option className="numberselect" key={idx} value={a}>{a}</option>
                    ))}
                  </select>
                ))}
                {numFields.map((val, i) => (
                  <select key={`num-${i}`} value={val} onChange={(e) => handleSingleFieldChange(i, e.target.value, false)}>
                    {/* <option className="numberselect" value="">0</option> */}
                    <option value="_">*</option>
                    {[...Array(10)].map((_, idx) => <option className="numberselect" key={idx} value={idx}>{idx}</option>)}
                    
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
            </>
          )}
                    {/* --- Multiple --- */}
          {mode === "multiple" && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 >Choose Multiple Numbers</h4> <button className="addBtn" onClick={handleAddNumber}>Add</button>
              </div>
              <div className="numberInputs">
                {alphanumFields.map((val, i) => (
                  <select key={`alp-${i}`} value={val} onChange={(e) => handleSingleFieldChange(i, e.target.value, true)}>
                    <option value="">*</option>
                    {selectedScheme?.[0]?.json?.alpha_series?.map((a, idx) => (
                      <option key={idx} value={a}>{a}</option>
                    ))}
                  </select>
                ))}
                {numFields.map((val, i) => (
                  <select key={`num-${i}`} value={val} onChange={(e) => handleSingleFieldChange(i, e.target.value, false)}>
                    <option value="_">*</option>
                    {[...Array(10)].map((_, idx) => <option key={idx} value={idx}>{idx}</option>)}
                    
                  </select>
                ))}
              </div>

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
              </>
          )}
</div>

        </div>
        
      )}

      {showAlert && (
                      <div className="modal-overlay">
                        <div className="modal-content">
                          <div className="modal-header">
                            <img onClick={handleCloseModal}
                              src="https://api.builder.io/api/v1/image/assets/TEMP/3d489db49fd51d4dc624b447669b77768ef74b86?width=764"
                              alt="Gradient Background"
                              className="gradient-background"
                            />
                            {/* Success Icon */}
                            <div className="success-icon" >
                              {/* <svg width="105" height="105" viewBox="0 0 105 105" fill="none">
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
                              </svg> */}
                              
                              <svg width="100" height="105" viewBox="0 0 105 105" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <path d="M111.878 61.688V71.3887C111.878 72.3841 111.235 73.3268 110.086 74.2162C108.243 75.6146 105.427 76.594 103.182 77.1922C102.539 77.3723 101.875 77.5311 101.168 77.6793C99.6504 78.0289 98.006 78.3148 96.2667 78.5584C95.6131 78.6536 94.949 78.7277 94.2638 78.8125C89.7648 79.328 84.3892 79.4467 80.4335 79.2572C74.3942 78.992 64.8989 77.9556 59.7091 74.8835C57.9065 73.8457 56.8945 72.6383 56.8945 71.3887V61.7303C56.8945 64.0822 60.41 65.7162 62.5869 66.5488C64.7564 67.3483 67.8033 68.0629 68.6271 68.201C69.9938 68.5063 72.1435 68.8147 73.5289 68.9846C82.927 70.2175 97.2046 69.8568 106.176 66.5488C107.855 65.9096 108.363 65.5815 109.127 65.1721C109.148 65.1509 109.169 65.1403 109.19 65.1299C110.034 64.6207 111.253 63.6499 111.562 62.874C111.626 62.7893 111.657 62.7046 111.678 62.6198H111.689C111.689 62.5986 111.699 62.5774 111.71 62.5668C111.752 62.4717 111.773 62.3763 111.794 62.2915V62.281C111.826 62.1857 111.847 62.0903 111.847 61.995C111.868 61.8891 111.878 61.7937 111.878 61.688Z" fill="#FF9F00"/>
                              <path d="M111.706 62.5652C111.706 62.5797 111.692 62.5943 111.692 62.6235H111.677C111.648 62.7108 111.604 62.7836 111.561 62.8711C111.546 62.9294 111.503 62.9732 111.489 63.0169C111.459 63.0605 111.43 63.1043 111.401 63.1333C111.018 63.8411 109.796 64.8352 109.124 65.1735C107.586 66.0159 106.038 66.7278 103.178 67.4902V67.5046C91.1859 70.6781 71.1469 70.5207 60.725 65.7562C56.4347 63.6032 56.9812 61.8305 56.896 61.7053C56.896 58.8786 61.9578 56.4015 69.5723 54.9882C69.7203 54.9882 81.8083 52.4632 96.651 54.5801C102.712 55.4499 105.561 56.6637 105.687 56.6637C106.031 56.8371 111.192 58.4787 111.793 61.1372C111.931 61.7364 111.861 62.0986 111.706 62.5652Z" fill="#F9E662"/>
                              <path d="M64.2311 64.8726C60.9702 63.6446 59.8115 62.3899 59.8115 61.6894C59.8115 59.5863 68.2478 55.6639 84.3749 55.6639C100.512 55.6639 108.953 59.5863 108.953 61.6894C108.953 62.3899 107.794 63.6446 104.53 64.8741C94.4081 68.6508 74.3728 68.657 64.2311 64.8726Z" fill="#FFC700"/>
                              <path d="M73.0967 63.4737C71.2705 62.786 70.6216 62.0833 70.6216 61.691C70.6216 60.5132 75.3461 58.3166 84.3778 58.3166C93.4149 58.3166 98.1423 60.5132 98.1423 61.691C98.1423 62.0833 97.4934 62.786 95.6651 63.4745C89.9967 65.5896 78.7763 65.5931 73.0967 63.4737Z" fill="#FF9F00"/>
                              <path d="M73.0427 63.6195C71.1429 62.9037 70.4663 62.1537 70.4663 61.6907C70.4663 60.7551 72.8032 59.4236 77.2696 58.6895C77.4646 58.6475 77.5288 58.9643 77.3195 58.9973C72.8567 59.7327 70.7776 61.0384 70.7776 61.6907C70.7776 61.9472 71.2736 62.6191 73.1515 63.3263C78.7889 65.4309 89.9692 65.4317 95.6114 63.3275C95.8044 63.2567 95.9124 63.5479 95.7196 63.6207C90.0156 65.7484 78.7568 65.7526 73.0427 63.6195Z" fill="white"/>
                              <g opacity="0.5">
                              <path d="M61.7179 66.1964V75.8804C60.9678 75.5759 60.2975 75.2392 59.707 74.8865V65.2184C60.2975 65.555 60.9678 65.8756 61.7179 66.1964Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M68.6281 68.2003V77.9004C67.9259 77.7724 67.2555 77.6119 66.6172 77.4676V67.7515C67.2555 67.9116 67.9259 68.0721 68.6281 68.2003Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M75.5387 69.2283V78.9285C74.8525 78.8483 74.1822 78.7841 73.5278 78.7038V68.9877C74.1822 69.0838 74.8525 69.148 75.5387 69.2283Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M82.4489 69.6293V79.3135C81.7626 79.3135 81.0924 79.2975 80.438 79.2654V69.5651C81.1082 69.5972 81.7786 69.6133 82.4489 69.6293Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M89.359 69.5168V79.217C88.7046 79.2491 88.0344 79.2812 87.3481 79.2973V69.597C88.0344 69.581 88.6887 69.5489 89.359 69.5168Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M96.2696 68.8573V78.5575C95.6153 78.6536 94.945 78.7337 94.2588 78.8139V69.1137C94.945 69.0336 95.6153 68.9536 96.2696 68.8573Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M103.18 67.4949V77.1952C102.542 77.3717 101.871 77.5318 101.169 77.6763V67.976C101.871 67.8318 102.542 67.6715 103.18 67.4949Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M110.09 64.5142V74.2142C109.531 74.6471 108.861 75.048 108.079 75.4167V65.7327C108.861 65.3479 109.547 64.9471 110.09 64.5142Z" fill="#EA8318"/>
                              </g>
                              <path d="M68.334 76.9897V68.5968C68.334 68.3898 68.6452 68.3899 68.6452 68.5968V76.9897C68.6452 77.1967 68.334 77.1965 68.334 76.9897Z" fill="#EA8318"/>
                              <path d="M75.5508 77.3998V69.9376C75.5508 69.7307 75.862 69.7308 75.862 69.9376V77.3998C75.862 77.6068 75.5508 77.6066 75.5508 77.3998Z" fill="#EA8318"/>
                              <path d="M82.1665 78.5988V70.5418C82.1665 70.3348 82.4778 70.3349 82.4778 70.5418V78.5988C82.4778 78.8057 82.1665 78.8056 82.1665 78.5988Z" fill="#EA8318"/>
                              <path d="M89.3164 78.535V70.2728C89.3164 70.0658 89.6277 70.0659 89.6277 70.2728V78.535C89.6277 78.742 89.3164 78.7419 89.3164 78.535Z" fill="#EA8318"/>
                              <path d="M96.3548 78.0826C96.2691 78.0826 96.1992 78.013 96.1992 77.9263V69.1986C96.1992 68.9917 96.5105 68.9918 96.5105 69.1986V77.9263C96.5105 78.013 96.4406 78.0826 96.3548 78.0826Z" fill="#EA8318"/>
                              <path d="M103.237 76.2038C103.151 76.2038 103.082 76.1341 103.082 76.0474V68.0576C103.082 67.8506 103.393 67.8507 103.393 68.0576V76.0474C103.393 76.1341 103.323 76.2038 103.237 76.2038Z" fill="#EA8318"/>
                              <path d="M109.764 73.9171V65.2408C109.764 65.0339 110.075 65.034 110.075 65.2408V73.9171C110.075 74.1241 109.764 74.124 109.764 73.9171Z" fill="#EA8318"/>
                              <path d="M61.6742 74.1014C61.5885 74.1014 61.5186 74.0318 61.5186 73.9451V66.8506C61.5186 66.6437 61.8298 66.6438 61.8298 66.8506V73.9451C61.8298 74.0318 61.7599 74.1014 61.6742 74.1014Z" fill="#EA8318"/>
                              <g opacity="0.52">
                              <path d="M80.0412 75.196C79.3536 75.1825 78.8077 74.6109 78.821 73.9207C78.8356 73.2294 79.3998 72.7066 80.091 72.6943C80.7494 72.709 81.4084 72.7127 82.0655 72.7053C82.7908 72.6772 83.3154 73.2526 83.3221 73.9452C83.3282 74.6353 82.7762 75.2009 82.0886 75.207C81.6645 75.2118 80.8685 75.2111 80.0412 75.196Z" fill="white"/>
                              </g>
                              <g opacity="0.52">
                              <path d="M71.8287 74.5679C66.5975 73.8668 62.2921 72.6942 59.706 71.265C59.1035 70.9328 58.8835 70.1718 59.2148 69.5671C59.5461 68.9612 60.3012 68.7389 60.906 69.0736C63.1949 70.3379 67.296 71.436 72.1582 72.0883C72.8396 72.1799 73.3187 72.809 73.2275 73.493C73.1378 74.1708 72.5201 74.6585 71.8287 74.5679Z" fill="white"/>
                              </g>
                              <path d="M60.9248 61.5403L61.0695 61.3876C61.2111 61.2394 61.4364 61.451 61.2956 61.6026L61.1509 61.7553C61.0081 61.9045 60.7847 61.6912 60.9248 61.5403Z" fill="#FF9F00"/>
                              <path d="M67.3301 62.9101L67.1788 62.843C66.9861 62.7596 67.1195 62.4685 67.3028 62.5571L67.4542 62.6243C67.5332 62.6585 67.5691 62.7501 67.535 62.8295C67.4982 62.9141 67.3998 62.9441 67.3301 62.9101Z" fill="#FF9F00"/>
                              <path d="M65.9092 58.2118V58.1373C65.9092 57.9303 66.2204 57.9304 66.2204 58.1373V58.2118C66.2204 58.4188 65.9092 58.4186 65.9092 58.2118Z" fill="#FF9F00"/>
                              <path d="M114 41.4363V51.137C114 52.1325 113.357 53.0751 112.208 53.9646C110.364 55.363 107.549 56.3424 105.303 56.9405C104.66 57.1206 103.996 57.2795 103.29 57.4276C101.772 57.7772 100.128 58.0632 98.3883 58.3067C97.7347 58.402 97.0706 58.4761 96.3854 58.5609C91.8864 59.0763 86.5108 59.195 82.5551 59.0056C76.5158 58.7403 67.0205 57.704 61.8307 54.6319C60.0281 53.5941 59.0161 52.3866 59.0161 51.137V41.4786C59.0161 43.8306 62.5316 45.4645 64.7085 46.2972C66.878 47.0967 69.9249 47.8112 70.7487 47.9493C72.1154 48.2547 74.265 48.5631 75.6505 48.733C85.0486 49.9658 99.3262 49.6051 108.297 46.2972C109.977 45.6579 110.484 45.3298 111.249 44.9205C111.27 44.8993 111.291 44.8887 111.312 44.8782C112.156 44.369 113.375 43.3983 113.684 42.6223C113.747 42.5377 113.779 42.453 113.8 42.3682H113.81C113.81 42.347 113.821 42.3258 113.831 42.3152C113.874 42.22 113.895 42.1246 113.916 42.0398V42.0293C113.947 41.9341 113.968 41.8387 113.968 41.7434C113.99 41.6375 114 41.5421 114 41.4363Z" fill="#FF9F00"/>
                              <path d="M113.827 42.3138C113.827 42.3284 113.813 42.343 113.813 42.3721H113.798C113.769 42.4595 113.726 42.5322 113.682 42.6197C113.668 42.6781 113.624 42.7218 113.61 42.7656C113.581 42.8092 113.552 42.8529 113.523 42.8819C113.139 43.5898 111.917 44.5839 111.245 44.9221C109.707 45.7646 108.159 46.4765 105.299 47.2389V47.2533C93.307 50.4268 73.268 50.2693 62.8461 45.5048C58.5558 43.3519 59.1023 41.5791 59.0171 41.454C59.0171 38.6272 64.0789 36.1502 71.6934 34.7368C71.8414 34.7368 83.9293 32.2119 98.7721 34.3288C104.833 35.1986 107.682 36.4124 107.808 36.4124C108.152 36.5858 113.313 38.2274 113.914 40.8859C114.052 41.485 113.982 41.8473 113.827 42.3138Z" fill="#F9E662"/>
                              <path d="M66.3527 44.6214C63.0918 43.3935 61.9331 42.1387 61.9331 41.4382C61.9331 39.3351 70.3693 35.4128 86.4965 35.4128C102.633 35.4128 111.075 39.3351 111.075 41.4382C111.075 42.1387 109.916 43.3935 106.651 44.6229C96.5297 48.3996 76.4944 48.4059 66.3527 44.6214Z" fill="#FFC700"/>
                              <path d="M75.2183 43.2226C73.3921 42.5349 72.7432 41.8322 72.7432 41.4399C72.7432 40.2621 77.4677 38.0655 86.4994 38.0655C95.5364 38.0655 100.264 40.2621 100.264 41.4399C100.264 41.8322 99.615 42.5349 97.7867 43.2234C92.1183 45.3385 80.8979 45.342 75.2183 43.2226Z" fill="#FF9F00"/>
                              <path d="M75.1643 43.3673C73.2645 42.6515 72.5879 41.9015 72.5879 41.4386C72.5879 40.5029 74.9248 39.1715 79.3912 38.4374C79.5862 38.3954 79.6504 38.7121 79.441 38.7452C74.9783 39.4805 72.8991 40.7863 72.8991 41.4386C72.8991 41.6951 73.3952 42.3669 75.2731 43.0742C80.9105 45.1787 92.0908 45.1796 97.733 43.0754C97.926 43.0046 98.034 43.2957 97.8412 43.3686C92.1372 45.4963 80.8784 45.5004 75.1643 43.3673Z" fill="white"/>
                              <g opacity="0.5">
                              <path d="M63.8395 45.9444V55.6284C63.0894 55.3238 62.4191 54.9872 61.8286 54.6345V44.9664C62.4191 45.303 63.0894 45.6236 63.8395 45.9444Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M70.7496 47.949V57.649C70.0474 57.521 69.3771 57.3605 68.7388 57.2163V47.5002C69.3771 47.6603 70.0474 47.8208 70.7496 47.949Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M77.6603 48.9742V58.6744C76.9741 58.5942 76.3038 58.53 75.6494 58.4497V48.7336C76.3038 48.8297 76.9741 48.8939 77.6603 48.9742Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M84.5704 49.3776V59.0617C83.8842 59.0617 83.214 59.0457 82.5596 59.0136V49.3134C83.2298 49.3455 83.9002 49.3615 84.5704 49.3776Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M91.4806 49.2653V58.9655C90.8262 58.9976 90.156 59.0297 89.4697 59.0457V49.3455C90.156 49.3295 90.8102 49.2974 91.4806 49.2653Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M98.3912 48.6061V58.3064C97.7369 58.4025 97.0666 58.4825 96.3804 58.5628V48.8625C97.0666 48.7825 97.7369 48.7024 98.3912 48.6061Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M105.301 47.2431V56.9433C104.663 57.1199 103.993 57.28 103.291 57.4244V47.7242C103.993 47.5799 104.663 47.4196 105.301 47.2431Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M112.212 44.2624V53.9624C111.653 54.3954 110.983 54.7962 110.201 55.1649V45.4809C110.983 45.0962 111.669 44.6953 112.212 44.2624Z" fill="#EA8318"/>
                              </g>
                              <path d="M70.4561 56.7373V48.3444C70.4561 48.1374 70.7673 48.1375 70.7673 48.3444V56.7373C70.7673 56.9443 70.4561 56.9442 70.4561 56.7373Z" fill="#EA8318"/>
                              <path d="M77.6724 57.1479V49.6858C77.6724 49.4788 77.9836 49.4789 77.9836 49.6858V57.1479C77.9836 57.3549 77.6724 57.3547 77.6724 57.1479Z" fill="#EA8318"/>
                              <path d="M84.2881 58.3473V50.2903C84.2881 50.0834 84.5993 50.0835 84.5993 50.2903V58.3473C84.5993 58.5543 84.2881 58.5542 84.2881 58.3473Z" fill="#EA8318"/>
                              <path d="M91.438 58.283V50.0207C91.438 49.8138 91.7492 49.8139 91.7492 50.0207V58.283C91.7492 58.4899 91.438 58.4898 91.438 58.283Z" fill="#EA8318"/>
                              <path d="M98.4764 57.8307C98.3907 57.8307 98.3208 57.7611 98.3208 57.6744V48.9467C98.3208 48.7398 98.6321 48.7399 98.6321 48.9467V57.6744C98.6321 57.7611 98.5621 57.8307 98.4764 57.8307Z" fill="#EA8318"/>
                              <path d="M105.359 55.9521C105.273 55.9521 105.203 55.8824 105.203 55.7957V47.8059C105.203 47.5989 105.514 47.599 105.514 47.8059V55.7957C105.514 55.8824 105.444 55.9521 105.359 55.9521Z" fill="#EA8318"/>
                              <path d="M111.885 53.6644V44.9881C111.885 44.7811 112.197 44.7812 112.197 44.9881V53.6644C112.197 53.8713 111.885 53.8712 111.885 53.6644Z" fill="#EA8318"/>
                              <path d="M63.7958 53.8493C63.71 53.8493 63.6401 53.7797 63.6401 53.693V46.5985C63.6401 46.3915 63.9514 46.3916 63.9514 46.5985V53.693C63.9514 53.7797 63.8815 53.8493 63.7958 53.8493Z" fill="#EA8318"/>
                              <g opacity="0.52">
                              <path d="M82.1627 54.9438C81.4752 54.9304 80.9292 54.3587 80.9426 53.6686C80.9572 52.9772 81.5214 52.4544 82.2126 52.4422C82.871 52.4569 83.53 52.4605 84.1871 52.4532C84.9124 52.4251 85.437 53.0004 85.4437 53.693C85.4498 54.3832 84.8978 54.9487 84.2102 54.9548C83.7861 54.9597 82.99 54.9589 82.1627 54.9438Z" fill="white"/>
                              </g>
                              <g opacity="0.52">
                              <path d="M73.9502 54.316C68.719 53.6149 64.4137 52.4423 61.8276 51.0131C61.2251 50.6809 61.0051 49.9199 61.3364 49.3152C61.6677 48.7094 62.4227 48.487 63.0276 48.8217C65.3165 50.086 69.4175 51.1841 74.2797 51.8364C74.9612 51.928 75.4403 52.5571 75.3491 53.2411C75.2594 53.9189 74.6416 54.4066 73.9502 54.316Z" fill="white"/>
                              </g>
                              <path d="M63.0464 41.2882L63.1911 41.1355C63.3327 40.9873 63.5579 41.1989 63.4172 41.3505L63.2725 41.5031C63.1297 41.6524 62.9063 41.4391 63.0464 41.2882Z" fill="#FF9F00"/>
                              <path d="M69.4512 42.6578L69.2999 42.5906C69.1072 42.5072 69.2406 42.2161 69.4239 42.3047L69.5753 42.3719C69.6543 42.4061 69.6902 42.4977 69.6561 42.5771C69.6193 42.6617 69.5209 42.6917 69.4512 42.6578Z" fill="#FF9F00"/>
                              <path d="M68.0308 37.9598V37.8853C68.0308 37.6783 68.342 37.6784 68.342 37.8853V37.9598C68.342 38.1667 68.0308 38.1666 68.0308 37.9598Z" fill="#FF9F00"/>
                              <path d="M72.3552 62.367V72.0629C72.3552 73.0579 71.7102 74.0001 70.5576 74.8891C62.0223 81.3401 30.6424 81.8197 20.0226 75.5561C18.2144 74.5188 17.1992 73.3119 17.1992 72.0629V62.4093C17.1992 64.4798 20.134 66.1237 22.0423 66.8762C22.1163 66.908 22.1798 66.9396 22.2538 66.9714C33.6118 71.5234 58.6481 71.6898 69.5953 65.8494C69.6164 65.8282 69.6376 65.8177 69.6588 65.8072C70.458 65.3266 71.7154 64.3597 72.038 63.5524C72.1014 63.4678 72.1331 63.3831 72.1543 63.2984H72.1649C72.1649 63.2772 72.1755 63.256 72.186 63.2454C72.2283 63.1503 72.2494 63.0549 72.2706 62.9702V62.9597C72.3024 62.8645 72.3235 62.7691 72.3235 62.6739C72.3446 62.5681 72.3552 62.4727 72.3552 62.367Z" fill="#FF9F00"/>
                              <path d="M72.3398 62.3776C72.3398 62.6321 72.3062 62.8428 72.2671 62.9604V62.9749C72.238 63.0622 72.2235 63.1495 72.1798 63.2516C72.1798 63.2516 72.1652 63.2807 72.1652 63.2953H72.1506C72.1135 63.4069 71.953 63.7408 71.8743 63.8194C71.7869 63.9798 71.6706 64.14 71.525 64.3001C71.0214 64.9313 70.3073 65.4038 69.6628 65.8149C69.6029 65.8149 69.3406 66.0025 69.1245 66.1207C68.9353 66.2081 68.7462 66.31 68.5425 66.4119C61.6241 69.8762 42.6231 72.1216 26.9462 68.4365C23.4349 67.5569 22.246 66.9434 22.0432 66.8926V66.878C21.479 66.6661 20.135 66.007 19.3952 65.4945C18.687 64.9877 18.0229 64.4807 17.562 63.674C17.3113 63.2349 17.1982 62.8081 17.1982 62.4067V62.3776C17.1982 59.5668 22.2759 57.0764 29.9143 55.6637C44.7964 53.2302 58.7363 54.7753 66.0255 57.3093C66.0691 57.3239 66.1128 57.3385 66.1419 57.353C66.1709 57.3676 66.1855 57.3676 66.2146 57.3676C66.2437 57.3822 66.2582 57.3968 66.3019 57.3968C68.5826 58.253 72.3398 59.9255 72.3398 62.3776Z" fill="#FFC700"/>
                              <path d="M24.5589 65.5506C21.2878 64.3233 20.1255 63.0692 20.1255 62.369C20.1255 60.2669 28.5881 56.3465 44.7657 56.3465C60.9529 56.3465 69.4207 60.2669 69.4207 62.369C69.4207 63.0692 68.2584 64.3233 64.9836 65.5521C54.8303 69.327 34.7323 69.3332 24.5589 65.5506Z" fill="#F9E662"/>
                              <path d="M44.769 65.7402C40.3616 65.7402 36.1311 65.1456 33.4526 64.1497C31.6207 63.4623 30.9697 62.76 30.9697 62.3679C30.9697 61.1907 35.7091 58.9951 44.769 58.9951C53.8343 58.9951 58.5766 61.1907 58.5766 62.3679C58.5766 62.76 57.9256 63.4623 56.0916 64.1505C53.4152 65.1456 49.1814 65.7402 44.769 65.7402Z" fill="#FFC700"/>
                              <path d="M44.7688 65.9006C40.3433 65.9006 36.0922 65.3024 33.3979 64.3C31.4922 63.5845 30.8135 62.8349 30.8135 62.3722C30.8135 61.437 33.1577 60.1062 37.6381 59.3724C37.7234 59.3578 37.8027 59.4164 37.8174 59.5006C37.8308 59.5861 37.7735 59.6667 37.6881 59.6801C33.2113 60.4151 31.1257 61.7202 31.1257 62.3722C31.1257 62.6286 31.6233 63.3001 33.5071 64.007C36.1684 64.9971 40.378 65.588 44.7688 65.588C49.1638 65.588 53.3759 64.9971 56.0372 64.0082C56.1159 63.9801 56.2074 64.0192 56.2379 64.0998C56.2677 64.1816 56.2269 64.2707 56.1458 64.3012C53.4522 65.3024 49.1986 65.9006 44.7688 65.9006Z" fill="white"/>
                              <g opacity="0.5">
                              <path d="M22.0382 66.8686V76.5478C21.2857 76.2434 20.6133 75.907 20.021 75.5545V65.8911C20.6133 66.2275 21.2857 66.548 22.0382 66.8686Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M28.9703 68.8736V78.5689C28.2659 78.441 27.5934 78.2806 26.9531 78.1364V68.425C27.5934 68.5851 28.2659 68.7455 28.9703 68.8736Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M35.9019 69.8972V79.5927C35.2135 79.5125 34.5412 79.4483 33.8848 79.3681V69.6568C34.5412 69.7529 35.2135 69.817 35.9019 69.8972Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M42.8341 70.2975V79.9769C42.1457 79.9769 41.4733 79.9609 40.8169 79.9288V70.2333C41.4893 70.2654 42.1617 70.2815 42.8341 70.2975Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M49.7662 70.186V79.8815C49.1098 79.9136 48.4374 79.9457 47.749 79.9617V70.2662C48.4374 70.2502 49.0937 70.2181 49.7662 70.186Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M56.6977 69.5306V79.2261C56.0414 79.3222 55.369 79.4022 54.6807 79.4824V69.7869C55.369 69.7069 56.0414 69.6269 56.6977 69.5306Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M63.63 68.1688V77.8643C62.9896 78.0408 62.3172 78.2008 61.6128 78.3451V68.6497C62.3172 68.5055 62.9896 68.3453 63.63 68.1688Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M70.5621 65.1865V74.8818C70.0017 75.3145 69.3293 75.7152 68.5449 76.0837V66.4045C69.3293 66.0199 70.0177 65.6192 70.5621 65.1865Z" fill="#EA8318"/>
                              </g>
                              <path d="M28.6748 77.6599V69.2711C28.6748 69.0643 28.987 69.0644 28.987 69.2711V77.6599C28.987 77.8668 28.6748 77.8667 28.6748 77.6599Z" fill="#EA8318"/>
                              <path d="M35.9141 78.0692V70.6107C35.9141 70.4038 36.2263 70.4039 36.2263 70.6107V78.0692C36.2263 78.276 35.9141 78.2759 35.9141 78.0692Z" fill="#EA8318"/>
                              <path d="M42.5503 79.268V71.215C42.5503 71.0081 42.8625 71.0082 42.8625 71.215V79.268C42.8625 79.4749 42.5503 79.4748 42.5503 79.268Z" fill="#EA8318"/>
                              <path d="M49.7227 79.2044V70.9474C49.7227 70.7405 50.0349 70.7407 50.0349 70.9474V79.2044C50.0349 79.4112 49.7227 79.4111 49.7227 79.2044Z" fill="#EA8318"/>
                              <path d="M56.6265 78.5945V69.8712C56.6265 69.6643 56.9387 69.6644 56.9387 69.8712V78.5945C56.9387 78.8014 56.6265 78.8013 56.6265 78.5945Z" fill="#EA8318"/>
                              <path d="M63.5312 76.7194V68.7335C63.5312 68.5266 63.8435 68.5267 63.8435 68.7335V76.7194C63.8435 76.9262 63.5312 76.9261 63.5312 76.7194Z" fill="#EA8318"/>
                              <path d="M70.2344 74.5866V65.9146C70.2344 65.7077 70.5466 65.7078 70.5466 65.9146V74.5866C70.5466 74.7935 70.2344 74.7934 70.2344 74.5866Z" fill="#EA8318"/>
                              <path d="M21.8374 74.6183V67.5273C21.8374 67.3204 22.1496 67.3206 22.1496 67.5273V74.6183C22.1496 74.8252 21.8374 74.825 21.8374 74.6183Z" fill="#EA8318"/>
                              <g opacity="0.52">
                              <path d="M40.4185 75.8663C39.7288 75.8528 39.1812 75.2814 39.1946 74.5916C39.2086 73.9006 39.7916 73.3951 40.4685 73.3658C41.5884 73.3886 42.5885 73.3768 42.4602 73.3768C43.145 73.3768 43.703 73.9287 43.7091 74.616C43.7152 75.3059 43.1615 75.8711 42.4718 75.8772C42.0463 75.8821 41.2484 75.8813 40.4185 75.8663Z" fill="white"/>
                              </g>
                              <g opacity="0.52">
                              <path d="M32.1801 75.2418C26.9313 74.5397 22.6125 73.3664 20.0195 71.9392C19.4152 71.6071 19.1944 70.8465 19.5268 70.2422C19.8592 69.6366 20.6166 69.4156 21.2233 69.7489C23.5181 71.0113 27.6326 72.1101 32.5107 72.7633C33.1943 72.8549 33.6748 73.4837 33.5834 74.1686C33.4934 74.8397 32.8787 75.333 32.1801 75.2418Z" fill="white"/>
                              </g>
                              <path d="M21.2474 62.4401C21.1852 62.3803 21.1828 62.2814 21.2426 62.2191L21.3883 62.0665C21.5268 61.9164 21.7588 62.1305 21.6139 62.2814L21.4682 62.434C21.41 62.4969 21.3115 62.4991 21.2474 62.4401Z" fill="#FF9F00"/>
                              <path d="M27.6674 63.589L27.5155 63.5219C27.321 63.438 27.4583 63.1459 27.6399 63.2362L27.7918 63.3033C27.8711 63.3375 27.9071 63.4291 27.8729 63.5084C27.8359 63.593 27.7373 63.6229 27.6674 63.589Z" fill="#FF9F00"/>
                              <path d="M26.2422 58.8936V58.8192C26.2422 58.6123 26.5544 58.6124 26.5544 58.8192V58.8936C26.5544 59.1005 26.2422 59.1004 26.2422 58.8936Z" fill="#FF9F00"/>
                              <g opacity="0.18">
                              <path d="M57.0922 57.8189C57.0922 63.0036 43.9397 67.1981 27.7319 67.1981C25.9278 67.1981 24.1527 67.1397 22.4359 67.0525C22.3707 67.0198 22.1181 66.9111 22.0432 66.8923V66.8777C21.479 66.6657 20.135 66.0066 19.3952 65.4942C18.687 64.9874 18.0229 64.4804 17.562 63.6737C17.3113 63.2346 17.1982 62.8078 17.1982 62.4064V62.3773C17.1982 59.5665 22.2759 57.0761 29.9143 55.6634C38.8133 54.2082 47.4616 54.0548 55.841 55.0952C56.6558 55.9546 57.0922 56.8722 57.0922 57.8189Z" fill="black"/>
                              </g>
                              <path d="M55.156 48.5381V58.234C55.156 59.229 54.511 60.1712 53.3583 61.0602C51.509 62.4579 48.6843 63.4368 46.4321 64.0347C45.7871 64.2147 45.1209 64.3735 44.4124 64.5215C42.8897 64.8709 41.2401 65.1568 39.4953 65.4002C38.8397 65.4954 38.1736 65.5695 37.4862 65.6542C32.9731 66.1694 27.5807 66.2881 23.6126 66.0987C17.5544 65.8336 8.02941 64.7977 2.82341 61.7272C1.01516 60.6898 0 59.483 0 58.234V48.5803C0 50.9311 3.52645 52.5643 5.71019 53.3965C7.88644 54.1957 10.9429 54.9099 11.7693 55.0479C13.1403 55.3531 15.2966 55.6613 16.6864 55.8312C26.1139 57.0634 40.4362 56.7029 49.4352 53.3965C51.1203 52.7576 51.6292 52.4296 52.3961 52.0205C52.4172 51.9993 52.4384 51.9887 52.4595 51.9783C53.3059 51.4693 54.5289 50.499 54.8388 49.7235C54.9022 49.6389 54.9339 49.5542 54.9551 49.4695H54.9657C54.9657 49.4483 54.9763 49.4271 54.9868 49.4165C55.0291 49.3214 55.0502 49.226 55.0714 49.1413V49.1308C55.1031 49.0356 55.1243 48.9402 55.1243 48.845C55.1454 48.7391 55.156 48.6438 55.156 48.5381Z" fill="#FF9F00"/>
                              <path d="M54.9825 49.4132C54.9825 49.4278 54.9679 49.4424 54.9679 49.4715H54.9535C54.9243 49.5588 54.8806 49.6316 54.837 49.719C54.8225 49.7773 54.7789 49.8211 54.7643 49.8648C54.7352 49.9084 54.7061 49.9521 54.677 49.9811C54.2919 50.6886 53.0661 51.6822 52.3928 52.0203C50.8491 52.8623 49.297 53.5739 46.4275 54.3359V54.3503C34.3981 57.5222 14.2965 57.3649 3.842 52.6027C-0.461772 50.4508 0.0864443 48.6789 0.000976562 48.5538C0.000976562 45.7285 5.07865 43.2527 12.717 41.84C12.8654 41.84 24.9912 39.3163 39.8804 41.4321C45.9604 42.3015 48.8183 43.5147 48.9446 43.5147C49.2898 43.688 54.4667 45.3288 55.0698 47.986C55.2081 48.5849 55.1378 48.947 54.9825 49.4132Z" fill="#F9E662"/>
                              <path d="M7.35922 51.7197C4.0881 50.4924 2.92578 49.2383 2.92578 48.5381C2.92578 46.4361 11.3884 42.5156 27.566 42.5156C43.7532 42.5156 52.221 46.4361 52.221 48.5381C52.221 49.2383 51.0587 50.4924 47.7839 51.7212C37.6306 55.4961 17.5326 55.5023 7.35922 51.7197Z" fill="#FFC700"/>
                              <path d="M16.2534 50.3241C14.4214 49.6368 13.7705 48.9344 13.7705 48.5423C13.7705 47.3651 18.5098 45.1696 27.5698 45.1696C36.6351 45.1696 41.3773 47.3651 41.3773 48.5423C41.3773 48.9344 40.7264 49.6368 38.8924 50.325C33.2062 52.439 21.9508 52.4425 16.2534 50.3241Z" fill="#FF9F00"/>
                              <path d="M16.1987 50.4673C14.293 49.7519 13.6143 49.0023 13.6143 48.5395C13.6143 47.6043 15.9584 46.2735 20.4389 45.5398C20.6345 45.4978 20.6988 45.8144 20.4889 45.8474C16.0121 46.5824 13.9265 47.8876 13.9265 48.5395C13.9265 48.7959 14.4241 49.4674 16.3079 50.1743C21.9629 52.2778 33.1782 52.2787 38.838 50.1755C39.0316 50.1048 39.14 50.3958 38.9466 50.4686C33.2247 52.5952 21.9307 52.5994 16.1987 50.4673Z" fill="white"/>
                              <g opacity="0.5">
                              <path d="M4.83845 53.0423V62.7216C4.08598 62.4172 3.41362 62.0807 2.82129 61.7282V52.0648C3.41362 52.4013 4.08598 52.7217 4.83845 53.0423Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M11.7706 55.0475V64.7428C11.0662 64.6149 10.3937 64.4544 9.75342 64.3103V54.5989C10.3937 54.759 11.0662 54.9194 11.7706 55.0475Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M18.7022 56.0712V65.7667C18.0138 65.6865 17.3415 65.6223 16.6851 65.5421V55.8307C17.3415 55.9268 18.0138 55.991 18.7022 56.0712Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M25.6344 56.4751V66.1546C24.946 66.1546 24.2736 66.1385 23.6172 66.1064V56.4109C24.2895 56.443 24.962 56.4591 25.6344 56.4751Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M32.566 56.3565V66.052C31.9096 66.0841 31.2372 66.1162 30.5488 66.1322V56.4367C31.2372 56.4207 31.8935 56.3886 32.566 56.3565Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M39.498 55.7013V65.3968C38.8417 65.4928 38.1693 65.5728 37.481 65.653V55.9576C38.1693 55.8776 38.8417 55.7975 39.498 55.7013Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M46.4303 54.3414V64.0368C45.7899 64.2133 45.1175 64.3733 44.4131 64.5177V54.8222C45.1175 54.678 45.7899 54.5178 46.4303 54.3414Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M53.3619 51.3573V61.0526C52.8015 61.4853 52.1292 61.8859 51.3447 62.2545V52.5753C52.1292 52.1907 52.8175 51.79 53.3619 51.3573Z" fill="#EA8318"/>
                              </g>
                              <path d="M11.4756 63.8302V55.4414C11.4756 55.2346 11.7878 55.2347 11.7878 55.4414V63.8302C11.7878 64.0371 11.4756 64.037 11.4756 63.8302Z" fill="#EA8318"/>
                              <path d="M18.7148 64.243V56.7846C18.7148 56.5777 19.0271 56.5778 19.0271 56.7846V64.243C19.0271 64.4499 18.7148 64.4498 18.7148 64.243Z" fill="#EA8318"/>
                              <path d="M25.3511 65.4421V57.389C25.3511 57.1821 25.6633 57.1822 25.6633 57.389V65.4421C25.6633 65.6489 25.3511 65.6488 25.3511 65.4421Z" fill="#EA8318"/>
                              <path d="M32.5229 65.3772V57.119C32.5229 56.9121 32.8352 56.9122 32.8352 57.119V65.3772C32.8352 65.584 32.5229 65.5839 32.5229 65.3772Z" fill="#EA8318"/>
                              <path d="M39.5839 64.9261C39.4979 64.9261 39.4277 64.8566 39.4277 64.7699V56.0465C39.4277 55.8397 39.74 55.8398 39.74 56.0465V64.7699C39.74 64.8566 39.6698 64.9261 39.5839 64.9261Z" fill="#EA8318"/>
                              <path d="M46.4877 63.046C46.4017 63.046 46.3315 62.9764 46.3315 62.8897V54.9038C46.3315 54.697 46.6438 54.6971 46.6438 54.9038V62.8897C46.6438 62.9764 46.5736 63.046 46.4877 63.046Z" fill="#EA8318"/>
                              <path d="M53.0347 60.76V52.088C53.0347 51.8811 53.3469 51.8812 53.3469 52.088V60.76C53.3469 60.9669 53.0347 60.9668 53.0347 60.76Z" fill="#EA8318"/>
                              <path d="M4.79479 60.9452C4.7088 60.9452 4.63867 60.8756 4.63867 60.7889V53.6979C4.63867 53.4911 4.9509 53.4912 4.9509 53.6979V60.7889C4.9509 60.8756 4.88077 60.9452 4.79479 60.9452Z" fill="#EA8318"/>
                              <g opacity="0.52">
                              <path d="M23.2188 62.04C22.5291 62.0265 21.9815 61.4551 21.9949 60.7653C22.0095 60.0743 22.5754 59.5518 23.2688 59.5396C23.9292 59.5542 24.5903 59.5579 25.2495 59.5505C25.9771 59.5225 26.5033 60.0975 26.51 60.7898C26.5161 61.4796 25.9624 62.0448 25.2727 62.0509C24.8472 62.0558 24.0487 62.055 23.2188 62.04Z" fill="white"/>
                              </g>
                              <g opacity="0.52">
                              <path d="M14.9809 61.4098C9.73334 60.709 5.41453 59.5369 2.82032 58.1085C2.21598 57.7764 1.99522 57.0157 2.32758 56.4114C2.65994 55.8058 3.41734 55.5836 4.02412 55.9182C6.32013 57.1818 10.434 58.2794 15.3114 58.9313C15.9951 59.0229 16.4756 59.6517 16.3841 60.3354C16.2941 61.0128 15.6745 61.5003 14.9809 61.4098Z" fill="white"/>
                              </g>
                              <path d="M4.04309 48.3893L4.18823 48.2367C4.33028 48.0886 4.55626 48.3001 4.41509 48.4516L4.26995 48.6042C4.12665 48.7534 3.90257 48.5401 4.04309 48.3893Z" fill="#FF9F00"/>
                              <path d="M10.4681 49.7582L10.3163 49.691C10.123 49.6077 10.2568 49.3168 10.4407 49.4053L10.5925 49.4725C10.6718 49.5067 10.7078 49.5982 10.6736 49.6776C10.6367 49.7621 10.538 49.7921 10.4681 49.7582Z" fill="#FF9F00"/>
                              <path d="M9.04297 45.0633V44.9888C9.04297 44.782 9.3552 44.7821 9.3552 44.9888V45.0633C9.3552 45.2702 9.04297 45.27 9.04297 45.0633Z" fill="#FF9F00"/>
                              <g opacity="0.18">
                              <path d="M55.0697 47.9847L38.2944 48.0139L49.0172 43.5426C49.2623 43.6653 50.3155 43.9601 51.8979 44.7951C53.161 45.485 54.7527 46.5883 55.0697 47.9847Z" fill="black"/>
                              </g>
                              <path d="M67.7124 22.7499C67.9539 28.0913 66.3449 33.2164 63.7531 37.0219C59.5117 43.4392 52.455 47.3034 45.0105 47.6406L37.4047 47.9852L35.252 0.368881L42.8577 0.024317C49.4395 -0.27386 55.668 2.18983 60.0898 6.33244C61.0735 7.25202 61.9976 8.25915 62.8295 9.3341C63.1443 9.7437 63.4381 10.1543 63.7113 10.5762C65.9337 13.8524 67.3921 17.8782 67.6818 22.3063L67.6832 22.338C67.6995 22.4645 67.7062 22.6125 67.7124 22.7499Z" fill="#FF9F00"/>
                              <g opacity="0.5">
                              <path d="M50.9372 1.05267C51.9638 1.36006 52.9655 1.74506 53.9224 2.1991L29.3586 3.31192L29.3008 2.03287C34.7807 1.78461 45.4245 1.30241 50.9372 1.05267Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M60.0904 6.32981L29.5573 7.71306L29.4995 6.4339L58.6595 5.11285C59.1549 5.50164 59.6315 5.90096 60.0904 6.32981Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M63.713 10.5767L29.7566 12.1151L29.6987 10.836L62.8256 9.33527C63.1401 9.74193 63.4357 10.1493 63.713 10.5767Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M66 14.8813L29.9553 16.5143L29.8975 15.2351L65.4463 13.6246C65.6465 14.0365 65.8281 14.4586 66 14.8813Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M67.2858 19.2241L30.154 20.9063L30.0962 19.6272L66.9991 17.9554C67.1134 18.371 67.2092 18.797 67.2858 19.2241Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M67.7127 22.7525C67.7256 23.0388 67.729 23.3256 67.7325 23.6125L30.3528 25.3059L30.2949 24.0267L67.6842 22.3329C67.6998 22.4662 67.7062 22.6093 67.7127 22.7525Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M67.5497 26.7477C67.5118 27.1798 67.4454 27.6131 67.3596 28.038L30.552 29.7055L30.4941 28.4264L67.5497 26.7477Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M66.566 31.2024C66.4713 31.5082 66.3124 31.9681 66.0993 32.5052L30.7507 34.1066L30.6929 32.8276L66.566 31.2024Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M64.581 35.6936C64.3243 36.1452 64.0482 36.5882 63.7525 37.0225L30.9499 38.5086L30.8916 37.2198L64.581 35.6936Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M61.1682 40.2546C60.5473 40.935 59.9048 41.4813 59.7788 41.5997L31.1516 42.8966L31.0938 41.617L61.1682 40.2546Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M54.9666 44.9493C53.7959 45.5593 52.7961 45.9775 51.6201 46.3827L31.3474 47.3011L31.2896 46.0219L54.9666 44.9493Z" fill="#EA8318"/>
                              </g>
                              <path d="M35.3082 1.62378L37.3477 46.7351C27.8715 44.0214 20.6697 35.4889 20.1504 25.008L20.146 24.9124C19.6514 13.9708 26.7267 4.73983 35.3082 1.62378Z" fill="#FF9F00"/>
                              <path d="M31.3174 47.478C25.1421 46.1508 19.8233 42.4223 16.437 37.2671C12.187 30.8251 11.4493 22.8332 13.9828 15.953C14.808 13.7061 15.9652 11.6163 17.3999 9.74355C27.3652 -3.35061 47.4216 -2.64972 56.37 11.3162C67.8484 29.2019 51.7006 52.0615 31.3174 47.478Z" fill="#F9E662"/>
                              <path d="M47.611 36.7453C44.4036 39.6293 40.1822 41.2614 35.4605 41.0548C25.1138 40.5312 17.6887 30.8318 19.8333 20.6625C20.4159 17.9102 21.6681 15.3857 23.4275 13.2973C31.4598 3.76698 46.9647 5.85853 51.8975 17.6413C54.5973 24.0657 53.1136 31.7826 47.611 36.7453Z" fill="#FFC700"/>
                              <g opacity="0.5">
                              <path d="M51.8974 17.6384C50.6889 17.7504 49.3994 18.182 48.3337 17.6467C46.5741 16.77 46.6383 13.9646 44.949 12.9507C43.1622 11.8934 40.5882 13.5022 38.8993 12.2875C37.2132 11.0806 37.8106 7.87407 35.3306 7.32236C35.4064 7.30935 35.4923 7.30546 35.5685 7.302C42.8442 6.97239 49.2408 11.2928 51.8974 17.6384Z" fill="#FF9F00"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M51.9905 30.4858C51.0291 32.8919 49.5203 35.0261 47.6107 36.7483C47.5718 36.7309 47.5327 36.7137 47.4933 36.6868C45.8642 35.737 46.0181 33.0137 44.3708 32.0839C42.7531 31.1721 40.5656 32.6677 38.9035 31.8343C37.1435 30.948 37.2078 28.1425 35.519 27.1382C33.7318 26.0714 31.1577 27.6801 29.4692 26.4749C28.0468 25.449 28.274 23.0761 26.9059 21.9807C25.6366 20.9575 23.7822 21.5771 22.1279 21.5468C21.4972 21.5467 20.8904 21.4402 20.3691 21.11C20.1723 20.985 19.9933 20.8304 19.833 20.6656C20.4156 17.9132 21.6678 15.3888 23.4272 13.3004C23.8652 14.1477 24.3628 14.7845 25.2658 15.0822C27.1377 15.6957 29.6212 14.4066 31.2076 15.6835C32.5759 16.7789 32.3486 19.1517 33.7804 20.1772C35.4594 21.3828 38.043 19.7736 39.8202 20.8314C41.5095 21.8452 41.4453 24.6506 43.2049 25.5274C44.8674 26.3704 47.0549 24.8747 48.6821 25.7862C50.3198 26.7164 50.1655 29.4302 51.7951 30.3893C51.8635 30.4245 51.9224 30.4602 51.9905 30.4858Z" fill="#FF9F00"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M35.4604 41.0535C28.9767 40.7254 23.3863 36.6936 20.8813 30.9535C21.9336 30.8537 23.0833 30.8181 23.8962 31.4864C25.2642 32.5817 25.0468 34.9541 26.469 35.9802C28.1479 37.1857 30.7315 35.5766 32.5093 36.6439C34.0412 37.5597 34.1309 39.9659 35.4604 41.0535Z" fill="#FF9F00"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M21.6727 26.2673C21.9174 31.6796 24.6813 36.3846 28.7876 39.2881C23.508 36.6387 19.7685 31.2795 19.4819 24.9414C19.0607 15.6251 26.2617 7.72358 35.5684 7.30195C39.4971 7.12397 43.172 8.30605 46.135 10.4388C43.6312 9.16526 40.7729 8.5009 37.7596 8.63742C28.4528 9.05904 21.2515 16.951 21.6727 26.2673Z" fill="#EA8318"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M60.0836 22.6532C58.9816 22.7989 57.856 23.0507 56.9238 22.5094C54.7953 21.2644 55.73 17.1942 51.8973 17.639C49.2408 11.2935 42.8442 6.97304 35.5685 7.30266C35.4923 7.30611 35.4064 7.31 35.3305 7.32301C35.321 7.32344 35.321 7.32344 35.3115 7.32388C35.3019 7.32431 35.3019 7.32431 35.2924 7.32474C33.5735 6.92436 31.3632 7.91397 29.7991 6.92314C28.2264 5.95185 28.1446 3.50688 26.811 2.33338C29.0132 1.37287 31.392 0.729414 33.8933 0.472717C33.9531 0.527334 34.032 0.581091 34.1008 0.625843C36.0177 1.81121 38.8826 0.0840392 40.6377 1.49659C42.0059 2.59192 41.7788 4.96483 43.201 5.99081C44.8895 7.19598 47.4635 5.58731 49.2508 6.65408C50.9397 7.65841 50.8754 10.4639 52.6355 11.3502C53.7596 11.9113 55.1134 11.4196 56.3699 11.3148C58.4875 14.6145 59.8182 18.4758 60.0836 22.6532Z" fill="#FFC700"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M58.7219 32.2734C57.8147 34.8205 56.4684 37.1676 54.7846 39.2334C54.3058 38.3655 53.8539 37.4581 53.0031 37.028C51.3698 36.1934 49.2244 37.5628 47.6108 36.7463C49.5204 35.0241 51.0292 32.8898 51.9906 30.4837C53.5912 31.2242 55.701 29.9139 57.3049 30.7308C57.9406 31.0558 58.349 31.6304 58.7219 32.2734Z" fill="#FFC700"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M23.4275 13.2976C21.6682 15.3861 20.416 17.9105 19.8334 20.6629C18.629 19.3879 18.5039 17.0406 16.9072 16.1755C16.0353 15.6986 15.0093 15.8311 13.9829 15.9542C14.8081 13.7073 15.9653 11.6175 17.4 9.74475C18.7051 9.6569 20.0822 9.25988 21.2086 9.86877C22.4233 10.5311 22.788 12.0449 23.4275 13.2976Z" fill="#FFC700"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M44.9514 46.392C40.9642 47.9534 37.3372 47.9793 37.2077 47.9958C37.158 47.9501 37.1185 47.9233 37.0696 47.8968C36.0398 47.3122 34.7866 47.7037 33.5796 47.8445C32.8115 47.7644 32.0609 47.6455 31.3176 47.4783C29.8381 46.4548 29.8082 43.8929 28.2077 42.9419C26.4303 41.8842 23.8467 43.4934 22.1675 42.2782C20.7456 41.2618 20.9632 38.8894 19.5946 37.7845C18.7322 37.0966 17.5979 37.1576 16.4371 37.2675C14.1701 33.8312 12.7727 29.7624 12.5542 25.3535C15.8056 25.4015 15.2655 29.3122 17.3691 30.616C18.3719 31.2401 19.6441 31.0581 20.8816 30.9543C23.3865 36.6944 28.977 40.7262 35.4606 41.0543C37.1278 42.4576 39.609 40.6032 41.3709 41.59C43.1522 42.5952 42.8749 45.8438 44.9514 46.392Z" fill="#FFC700"/>
                              </g>
                              <path d="M20.7614 21.0296C20.2778 21.0296 19.7655 20.7916 19.3874 20.3728C18.9673 19.9088 18.7459 19.313 18.5709 18.7905L18.502 18.5829C18.3489 18.1178 18.1903 17.6367 17.9287 17.229C17.4177 16.4305 16.4822 15.9214 15.5345 15.9214C15.5162 15.9214 15.4937 15.9153 15.4809 15.9214C15.3961 15.9214 15.3266 15.853 15.3247 15.7675C15.3229 15.6821 15.3918 15.61 15.4778 15.6088C15.4967 15.6088 15.515 15.6088 15.5339 15.6088C16.5859 15.6088 17.6244 16.1741 18.1922 17.0605C18.4745 17.5024 18.6392 18.0018 18.7989 18.4853L18.8672 18.6904C19.0319 19.1836 19.2392 19.744 19.6192 20.1628C20.0082 20.5926 20.5522 20.8001 21.0114 20.689C21.0937 20.6658 21.1803 20.7195 21.1998 20.8038C21.22 20.888 21.1687 20.9723 21.0846 20.9918C20.9797 21.0174 20.8711 21.0296 20.7614 21.0296Z" fill="#FF9F00"/>
                              <path d="M27.9293 5.03295C27.6174 4.23349 27.5094 3.26907 26.8146 2.88539C26.6352 2.78612 26.7834 2.51047 26.9658 2.6119C27.7828 3.06248 27.9023 4.09835 28.2208 4.92063C28.9544 6.80673 31.0921 7.75934 32.9958 7.01204C33.0775 6.98029 33.1672 7.02058 33.1983 7.09994C33.23 7.18052 33.1903 7.27087 33.1104 7.30261C31.0556 8.1103 28.7301 7.09111 27.9293 5.03295Z" fill="#FF9F00"/>
                              <path d="M50.3526 7.89549C50.3026 7.89549 50.2526 7.87107 50.2227 7.8259C49.4348 6.64284 47.9054 5.97501 46.5046 6.20698C46.221 6.25338 45.9277 6.33396 45.6435 6.41209C44.9434 6.60378 44.2189 6.80156 43.5213 6.54273C42.7127 6.24117 42.276 5.44025 42.0516 4.82248C41.8048 4.13774 41.6838 3.38378 41.3967 2.73229C41.071 1.99487 40.5295 1.5004 39.9483 1.4125C39.7407 1.37983 39.7976 1.06879 39.9959 1.10239C40.6832 1.20861 41.3131 1.77022 41.6821 2.60532C41.985 3.29232 42.0959 4.02635 42.3456 4.71504C42.5102 5.17166 42.8968 5.97623 43.6299 6.24971C44.4988 6.57526 45.4626 6.061 46.454 5.89931C47.9676 5.64903 49.6281 6.37058 50.4825 7.65253C50.5301 7.72456 50.5112 7.82102 50.4392 7.86985C50.4124 7.88694 50.3825 7.89549 50.3526 7.89549Z" fill="#FF9F00"/>
                              <path d="M58.76 23.1044C57.5403 23.1019 56.3322 22.3779 55.7547 21.3023C55.3555 20.5568 55.2456 19.6731 54.8162 18.9789C54.2771 18.1121 53.1886 17.6054 52.1884 17.7544C51.9763 17.7812 51.944 17.4728 52.1433 17.4443C53.2727 17.2892 54.4802 17.8459 55.0815 18.8141C55.3297 19.2146 55.4748 19.6614 55.6157 20.0936C55.7322 20.4526 55.8529 20.8237 56.0304 21.1534C56.5548 22.1313 57.6519 22.7894 58.7606 22.7918C58.8466 22.7918 58.9161 22.8626 58.9161 22.9481C58.9161 23.0348 58.8459 23.1044 58.76 23.1044Z" fill="#FF9F00"/>
                              <path d="M57.967 31.5195C57.7663 30.9787 57.2248 30.566 56.651 30.5172C56.2777 30.4781 55.91 30.5856 55.521 30.6906C54.2575 31.039 53.0594 31.0255 51.8589 30.577C51.6725 30.5063 51.7642 30.2173 51.9687 30.284C53.1457 30.7267 54.2686 30.7091 55.4386 30.3902C55.8368 30.2803 56.2503 30.1668 56.6778 30.2046C57.3785 30.2657 58.0145 30.7504 58.2597 31.4097C58.2896 31.4915 58.2487 31.5806 58.1676 31.6111C58.0777 31.6422 57.9946 31.5938 57.967 31.5195Z" fill="#FF9F00"/>
                              <path d="M54.1071 38.2924C53.4515 37.3584 52.2477 36.8419 51.125 37.0141C51.0342 37.03 50.9598 36.9665 50.9476 36.8822C50.9348 36.7968 50.9933 36.7174 51.0787 36.704C52.3203 36.5233 53.6406 37.0849 54.362 38.1117C54.412 38.1825 54.3949 38.2802 54.3242 38.3302C54.2478 38.3812 54.1541 38.3595 54.1071 38.2924Z" fill="#FF9F00"/>
                              <path d="M44.3785 45.6398C44.3718 45.6398 44.3657 45.6398 44.359 45.6386C43.3271 45.507 42.86 44.414 42.5612 43.4776C42.3642 42.8598 42.1605 42.22 41.691 41.8159C40.4486 40.7482 38.5745 41.8008 37.102 41.7671C36.3428 41.7598 35.3274 41.4387 34.9658 40.5572C34.8885 40.368 35.174 40.2427 35.2548 40.4375C35.5397 41.1326 36.3907 41.4545 37.1435 41.4545C37.9152 41.4545 38.6795 41.2031 39.4688 41.0858C40.192 40.9784 41.1952 40.9784 41.8947 41.5791C42.5367 42.1318 42.7194 42.9971 42.9844 43.7669C43.1692 44.3066 43.5991 45.2259 44.398 45.3284C44.484 45.3394 44.5444 45.4176 44.5334 45.503C44.523 45.5824 44.4559 45.6398 44.3785 45.6398Z" fill="#FF9F00"/>
                              <path d="M29.8499 45.3126C29.2245 44.1481 28.4345 42.7663 27.0203 42.6877C26.9343 42.6828 26.8685 42.6083 26.8728 42.5229C26.8776 42.4362 26.9533 42.3593 27.0374 42.3751C27.7119 42.413 28.3937 42.7683 28.9578 43.3763C29.4499 43.9074 29.7926 44.5459 30.1244 45.1637C30.1652 45.2406 30.1372 45.3346 30.0609 45.3761C29.9851 45.4161 29.8907 45.3888 29.8499 45.3126Z" fill="#FF9F00"/>
                              <path d="M16.5794 30.0041C15.4117 28.6771 15.1826 26.2954 13.4247 25.7798C13.2297 25.7224 13.3098 25.4253 13.5126 25.4795C15.4454 26.0469 15.6719 28.4998 16.8136 29.7966C17.5801 30.6671 18.8108 31.0919 19.9505 30.8783C20.1615 30.8479 20.2055 31.1489 20.0079 31.186C19.7944 31.225 17.4014 30.9369 16.5794 30.0041Z" fill="#FF9F00"/>
                              <path d="M29.7644 18.3465C29.737 18.3465 29.7095 18.3392 29.6845 18.3245C29.6107 18.2806 29.5863 18.1854 29.6302 18.1109L29.7248 17.9534C29.7687 17.8777 29.8656 17.8545 29.9394 17.9009C30.0132 17.9448 30.0364 18.0413 29.9919 18.1145L29.8986 18.2696C29.8693 18.3197 29.8175 18.3465 29.7644 18.3465Z" fill="#FF9F00"/>
                              <path d="M32.1635 16.2495C32.0824 16.2495 32.0141 16.1872 32.008 16.1042C31.9897 15.8715 32.3691 15.8951 32.3702 16.0907C32.3702 16.1774 32.3001 16.247 32.2141 16.247L32.1751 16.2495C32.1708 16.2495 32.1671 16.2495 32.1635 16.2495Z" fill="#FF9F00"/>
                              <path d="M33.179 20.1544L33.0198 20.0592C32.946 20.014 32.9223 19.9176 32.9668 19.8443C33.0113 19.771 33.1083 19.7491 33.1808 19.7906L33.3363 19.8834C33.4107 19.9273 33.4357 20.0226 33.3924 20.097C33.3521 20.1674 33.2626 20.1993 33.179 20.1544Z" fill="#FF9F00"/>
                              <path d="M29.0582 32.0351C28.9752 32.0351 28.9063 31.9704 28.9021 31.8862C28.8978 31.8007 28.9643 31.7275 29.0508 31.7226L29.2033 31.7152C29.3921 31.6804 29.4406 32.0152 29.2179 32.0278L29.0655 32.0351H29.0582Z" fill="#FF9F00"/>
                              <path d="M32.5265 30.9615L32.524 30.9102C32.521 30.8235 32.5887 30.7515 32.6747 30.7478C32.7753 30.749 32.8332 30.8113 32.8363 30.898L32.6801 30.9041L32.8375 30.9212L32.6826 30.9554L32.5265 30.9615Z" fill="#FF9F00"/>
                              <path d="M33.2497 25.63C33.1686 25.63 33.1003 25.5677 33.0942 25.4847C33.0875 25.3992 33.1522 25.3248 33.2381 25.3174C33.2418 25.3174 33.2717 25.3162 33.2753 25.3162C33.3583 25.3162 33.4394 25.3797 33.4437 25.464C33.4479 25.5482 33.3967 25.6214 33.3113 25.6276L33.2747 25.4725L33.2613 25.63C33.2571 25.63 33.2534 25.63 33.2497 25.63Z" fill="#FF9F00"/>
                              <path d="M38.1722 34.449L38.0661 34.2976C38.0167 34.2268 38.0344 34.1292 38.1051 34.0803C38.174 34.0303 38.2735 34.0486 38.3222 34.1194L38.4271 34.2683C38.4771 34.3392 38.4601 34.4368 38.3899 34.4869C38.3156 34.5365 38.2216 34.5182 38.1722 34.449Z" fill="#FF9F00"/>
                              <path d="M54.5892 26.6879C54.388 26.6879 54.3793 26.3869 54.5819 26.3754L54.6587 26.3717C54.738 26.3607 54.8179 26.434 54.8222 26.5207C54.8258 26.6073 54.7594 26.6794 54.6734 26.6843L54.5965 26.6879H54.5892Z" fill="#FF9F00"/>
                              <path d="M57.0126 25.3305L56.9358 25.1754C56.8448 24.9903 57.1273 24.8518 57.2163 25.0387L57.2919 25.1913C57.3304 25.2682 57.2993 25.3622 57.2218 25.4001C57.1537 25.4379 57.054 25.4132 57.0126 25.3305Z" fill="#FF9F00"/>
                              <path d="M58.1298 27.6414L58.2042 27.5596C58.2616 27.4949 58.361 27.4913 58.4244 27.5486C58.4884 27.6072 58.4933 27.7061 58.4347 27.7696L58.364 27.849C58.2245 28.0023 57.9937 27.7967 58.1298 27.6414Z" fill="#FF9F00"/>
                              <path d="M19.3394 12.3284L19.4729 12.0854C19.5769 11.9041 19.8447 12.0568 19.7461 12.2368L19.6138 12.4774C19.5149 12.6585 19.2409 12.5109 19.3394 12.3284Z" fill="#FF9F00"/>
                              <path d="M24.2615 6.1714L24.1853 6.01635C24.0945 5.83166 24.3764 5.6919 24.4658 5.87961L24.5408 6.03222C24.5792 6.10914 24.5481 6.20315 24.4707 6.24099C24.4026 6.27885 24.3028 6.25414 24.2615 6.1714Z" fill="#FF9F00"/>
                              <path d="M25.1957 8.96354L24.9591 8.82069C24.7836 8.71328 24.9396 8.44597 25.1201 8.55209L25.3567 8.69494C25.4305 8.74011 25.4543 8.83656 25.4098 8.90982C25.3655 8.98366 25.2705 9.00738 25.1957 8.96354Z" fill="#FF9F00"/>
                              <path d="M15.8643 24.6053C15.7813 24.6053 15.7124 24.5405 15.7082 24.4563C15.7045 24.3696 15.771 24.2976 15.857 24.2927L15.9338 24.289C16.1103 24.2439 16.1795 24.5885 15.9484 24.6016L15.8716 24.6053H15.8643Z" fill="#FF9F00"/>
                              <path d="M21.4531 35.2001L21.3719 35.1256C21.2191 34.9844 21.4367 34.7571 21.5842 34.8961L21.6628 34.9681C21.7269 35.0267 21.7317 35.1256 21.6732 35.1891C21.6164 35.2528 21.5176 35.2581 21.4531 35.2001Z" fill="#FF9F00"/>
                              <path d="M23.2905 43.6326L23.2106 43.5594C23.0573 43.419 23.2677 43.1908 23.4204 43.3274L23.5003 43.4007C23.5643 43.4593 23.5692 43.5581 23.5107 43.6216C23.4538 43.6854 23.3551 43.6906 23.2905 43.6326Z" fill="#FF9F00"/>
                              <path d="M39.6691 45.0608L39.9575 44.6627C40.0836 44.4964 40.3304 44.6828 40.21 44.8483L39.9216 45.2439C39.8021 45.4112 39.5467 45.229 39.6691 45.0608Z" fill="#FF9F00"/>
                              <path d="M46.7561 39.6097L46.6 39.5401C46.4112 39.4558 46.5379 39.1721 46.7268 39.2544L46.8829 39.324C46.9622 39.3594 46.997 39.4522 46.9622 39.5304C46.9282 39.6062 46.8404 39.6455 46.7561 39.6097Z" fill="#FF9F00"/>
                              <path d="M37.9878 5.34521C37.9049 5.34521 37.836 5.2805 37.8317 5.19626C37.828 5.10957 37.8945 5.03754 37.9805 5.03265L38.0573 5.02899C38.2908 5.0632 38.253 5.33126 38.072 5.34154L37.9951 5.34521H37.9878Z" fill="#FF9F00"/>
                              <path d="M46.2021 4.54159L46.0424 4.39508C45.8894 4.25371 46.104 4.02617 46.2534 4.16555L46.4131 4.31206C46.4766 4.37066 46.4808 4.46955 46.4223 4.53304C46.3642 4.59582 46.265 4.60062 46.2021 4.54159Z" fill="#FF9F00"/>
                              <path d="M50.8858 12.5831C50.8028 12.5831 50.7339 12.5184 50.7296 12.4342C50.726 12.3475 50.7924 12.2755 50.8784 12.2706L50.9547 12.2669C51.1544 12.2481 51.1825 12.5674 50.9693 12.5795L50.8931 12.5831H50.8858Z" fill="#FF9F00"/>
                              <path d="M19.6808 20.629C21.2275 13.319 27.5098 7.51644 35.551 7.14777C35.5541 7.14655 35.5589 7.14655 35.5589 7.14655C35.6419 7.14655 35.7157 7.21247 35.7199 7.2955C35.7236 7.38218 35.662 7.45421 35.576 7.4591C35.4992 7.46276 35.4242 7.4652 35.3583 7.47741C35.3516 7.47863 35.3181 7.48107 35.3113 7.48107C27.5259 7.94345 21.4852 13.6095 19.9857 20.6937C17.7369 31.3572 26.1041 41.3883 37.0878 40.8996C40.9358 40.725 44.6362 39.2075 47.5067 36.6277C47.5695 36.5691 47.6695 36.574 47.7269 36.6387C47.7848 36.7034 47.7793 36.8023 47.7153 36.8597C44.7917 39.4883 41.0218 41.0339 37.1018 41.2122C25.7866 41.6965 17.408 31.3816 19.6808 20.629Z" fill="white"/>
                              <path d="M44.8952 46.2482C48.6975 44.7831 52.0754 42.3242 54.6629 39.134C66.4506 24.6844 57.5467 2.55705 38.7744 0.630369C38.5634 0.609403 38.6058 0.283579 38.8061 0.32026C57.8261 2.27237 66.8476 24.6843 54.905 39.3318C52.2833 42.5635 48.8609 45.0554 45.0074 46.5388C44.8165 46.6152 44.7011 46.3218 44.8952 46.2482Z" fill="white"/>
                              <path d="M58.2751 14.1554C58.0729 14.1554 58.0665 13.8514 58.2678 13.8428L65.1698 13.5291C65.4 13.5569 65.3693 13.8337 65.1845 13.8416L58.2824 14.1554H58.2751Z" fill="#E26C24"/>
                              <path d="M60.5901 22.9343C60.3873 22.9343 60.382 22.6303 60.5828 22.6218L67.0879 22.3275C67.1818 22.3422 67.2476 22.391 67.2513 22.4765C67.255 22.5631 67.1885 22.6364 67.1025 22.6401L60.5975 22.9343H60.5901Z" fill="#E26C24"/>
                              <path d="M59.9229 31.6353C59.8399 31.6353 59.7704 31.5694 59.7667 31.4863C59.7631 31.3996 59.8296 31.3264 59.9155 31.3227L64.7362 31.1042C64.9507 31.1042 64.95 31.4083 64.7509 31.4167L59.9302 31.6353H59.9229Z" fill="#E26C24"/>
                              <path d="M58.5967 36.175C58.5138 36.175 58.4442 36.1091 58.4406 36.0261C58.4369 35.9394 58.5034 35.8661 58.5894 35.8625L62.7642 35.6732C62.849 35.6757 62.9234 35.7367 62.9277 35.8222C62.9314 35.9089 62.8649 35.9821 62.7789 35.9858L58.604 36.175H58.5967Z" fill="#E26C24"/>
                              <path d="M55.6216 40.7349C55.5387 40.7349 55.4691 40.6689 55.4655 40.5859C55.4618 40.4992 55.5283 40.426 55.6143 40.4223L59.9203 40.227C60.1068 40.1863 60.1583 40.53 59.9349 40.5395L55.6289 40.7349H55.6216Z" fill="#E26C24"/>
                              <path d="M52.2622 5.50683C52.1793 5.50683 52.1098 5.4409 52.1061 5.35788C52.1024 5.2712 52.1689 5.19794 52.2549 5.19428L57.1896 4.97085C57.3753 4.9324 57.4285 5.27385 57.2043 5.2834L52.2695 5.50683H52.2622Z" fill="#E26C24"/>
                              <path d="M45.949 1.37081C45.7462 1.37081 45.7409 1.06682 45.9417 1.05826L49.2756 0.90687C49.3592 0.892219 49.4354 0.970357 49.4391 1.05582C49.4427 1.1425 49.3763 1.21576 49.2903 1.21942L45.9563 1.37081H45.949Z" fill="#E26C24"/>
                              <path d="M49.5794 45.1912C49.3766 45.1912 49.3712 44.8872 49.5721 44.8787C49.9454 44.8618 48.2197 44.94 53.2231 44.7139C53.426 44.7139 53.4313 45.0179 53.2304 45.0264L49.5867 45.1912H49.5794Z" fill="#E26C24"/>
                              <path d="M56.4351 9.72807C56.3521 9.72807 56.2826 9.66214 56.279 9.57912C56.2753 9.49243 56.3418 9.41918 56.4278 9.41552L61.1265 9.20308C61.2052 9.18354 61.2863 9.26657 61.2899 9.35203C61.2936 9.43871 61.2271 9.51197 61.1411 9.51563L56.4424 9.72807H56.4351Z" fill="#E26C24"/>
                              <path d="M62.0662 27.0694C61.8634 27.0694 61.8581 26.7654 62.0589 26.7569L65.763 26.5896C65.9549 26.5552 65.9974 26.8928 65.7776 26.9022L62.0735 27.0694H62.0662Z" fill="#E26C24"/>
                              <path d="M60.5799 18.2056C60.377 18.2056 60.3717 17.9016 60.5726 17.893L66.583 17.6207C66.6696 17.6 66.7422 17.6842 66.7465 17.7697C66.7501 17.8564 66.6837 17.9296 66.5977 17.9333L60.5872 18.2056H60.5799Z" fill="#E26C24"/>
                              <g opacity="0.52">
                              <path d="M56.4699 28.2857C55.7851 28.2027 55.2978 27.5788 55.3814 26.8939C55.4296 26.5008 55.4637 26.1077 55.4851 25.7133C55.5229 25.0223 56.1181 24.4704 56.8005 24.5339C57.4896 24.5718 58.0171 25.1602 57.9793 25.85C57.9543 26.3006 57.9152 26.7498 57.861 27.1967C57.775 27.8996 57.1221 28.379 56.4699 28.2857Z" fill="white"/>
                              </g>
                              <g opacity="0.52">
                              <path d="M54.1046 17.3516C52.5647 13.4215 49.8675 10.0506 46.5091 7.86034C45.931 7.48308 45.7682 6.70903 46.1445 6.13032C46.5213 5.55283 47.2964 5.39167 47.8727 5.76527C51.6628 8.2376 54.7022 12.0285 56.4305 16.4384C56.6823 17.0818 56.3658 17.807 55.7237 18.0585C55.0754 18.3118 54.3547 17.9899 54.1046 17.3516Z" fill="white"/>
                              </g>
                              <g opacity="0.52">
                              <path d="M16.1835 21.8759C16.1457 21.8759 16.1079 21.8747 16.0695 21.871C15.3828 21.8087 14.8761 21.2007 14.9383 20.5134C15.32 16.2951 17.4184 12.3418 20.6963 9.66563C21.2323 9.22732 22.0178 9.30913 22.4538 9.84388C22.8898 10.3786 22.8099 11.1661 22.2757 11.602C19.5553 13.824 17.7429 17.2389 17.4264 20.738C17.3672 21.3875 16.8226 21.8759 16.1835 21.8759Z" fill="white"/>
                              </g>
                              <g opacity="0.5">
                              <path d="M41.2926 17.4808L45.6707 17.2824L44.3614 20.0923L41.8893 20.2043C42.0074 22.4702 41.0487 24.8631 39.1415 26.0748C37.5276 27.096 35.5409 26.8943 33.6401 26.9804L43.6821 38.6791L38.9872 38.8918L29.2537 27.226L29.1312 24.5174L35.0726 24.2483C36.5786 24.18 38.1457 22.5369 38.1448 20.374L28.3135 20.8194L29.8306 18L37.3975 17.6572C37.08 17.0653 36.5097 16.2896 35.6548 15.4857L28.0879 15.8285L29.6044 12.9987L45.4446 12.2811L44.1357 15.1014L40.1939 15.28C40.6314 15.9792 41.0081 16.7122 41.2926 17.4808Z" fill="#EA8318"/>
                              </g>
                              <path d="M39.5211 17.5616L43.8992 17.3633L42.5899 20.1732L40.1178 20.2852C40.2359 22.5511 39.2772 24.944 37.37 26.1557C35.7561 27.1769 33.7694 26.9752 31.8686 27.0613L41.9106 38.7599L37.2157 38.9726L27.4822 27.3069L27.3598 24.5983L33.3011 24.3291C34.8071 24.2609 36.3742 22.6178 36.3733 20.4548L26.5421 20.9002L28.0591 18.0809L35.626 17.7381C35.5578 17.611 35.4846 17.4892 35.4063 17.3678C34.9806 16.6994 34.4595 16.1083 33.8833 15.5665L26.3164 15.9093L27.833 13.0796L43.6731 12.362L42.3643 15.1823L38.4224 15.3609C38.8599 16.06 39.2366 16.7931 39.5211 17.5616Z" fill="#F9E662"/>
                              <path d="M26.3163 16.0672C26.2913 16.0672 26.2657 16.0611 26.2425 16.0489C26.1663 16.0073 26.1382 15.9133 26.1785 15.8364L27.6951 13.0064C27.7214 12.9588 27.7708 12.927 27.8256 12.9246C44.2477 12.2542 43.8163 12.0522 43.8294 12.3568C43.833 12.4435 43.7666 12.5168 43.6806 12.5205L27.9287 13.2335L26.4541 15.9854C26.4255 16.0379 26.3718 16.0672 26.3163 16.0672Z" fill="white"/>
                              <path d="M26.4679 21.0402C26.3917 20.9987 26.3636 20.9047 26.4045 20.8278L27.9217 18.0087C27.9474 17.9611 27.9968 17.9294 28.0516 17.9269C28.2064 17.9199 35.4322 17.5926 35.6257 17.5839C35.8286 17.5839 35.8339 17.8879 35.633 17.8964L28.1547 18.2358L26.6789 20.9768C26.6382 21.053 26.5437 21.0802 26.4679 21.0402Z" fill="white"/>
                              <path d="M37.0964 39.0746C27.0158 26.9753 27.333 27.4411 27.3263 27.3161L27.2038 24.6081C27.2019 24.5666 27.2166 24.5263 27.2446 24.4958C27.2727 24.4653 27.3117 24.4469 27.3526 24.4445C27.8827 24.4205 25.4321 24.5316 32.5373 24.2101C32.7402 24.2101 32.7455 24.5141 32.5446 24.5226L27.5227 24.7497L27.6361 27.2489L37.3355 38.8743C37.4685 39.0324 37.2286 39.2334 37.0964 39.0746Z" fill="white"/>
                              <path d="M36.3887 14.1317C36.3057 14.1317 36.2362 14.0658 36.2326 13.9828C36.2289 13.8961 36.2954 13.8228 36.3814 13.8192L40.9868 13.6116C41.0777 13.6251 41.1466 13.6751 41.1502 13.7606C41.1539 13.8473 41.0874 13.9205 41.0014 13.9242L36.396 14.1317H36.3887Z" fill="#FF9F00"/>
                              <path d="M38.4033 18.9341C38.3204 18.9341 38.2515 18.8682 38.2472 18.7852C38.2436 18.6985 38.31 18.6252 38.396 18.6216L41.1226 18.497C41.3353 18.4939 41.338 18.801 41.1372 18.8096L38.4106 18.9341H38.4033Z" fill="#FF9F00"/>
                              <path d="M34.9841 26.0974C34.9091 26.0974 34.8432 26.0437 34.8304 25.9668C34.8158 25.8825 34.8731 25.8007 34.9585 25.7873C36.5074 25.526 37.8564 24.3405 38.3144 22.8376C38.3738 22.6403 38.6736 22.7302 38.6132 22.928C38.121 24.5432 36.6733 25.8154 35.0097 26.095C35.0012 26.0962 34.9926 26.0974 34.9841 26.0974Z" fill="#FF9F00"/>
                              <path d="M38.0564 36.7255C38.01 36.7255 37.9637 36.7047 37.9332 36.6656L32.0032 29.024C31.9502 28.9556 31.9624 28.8567 32.0307 28.8042C32.099 28.7517 32.1965 28.7627 32.2496 28.8311L38.1796 36.4727C38.2326 36.5411 38.2204 36.64 38.1521 36.6925C38.1235 36.7145 38.0899 36.7255 38.0564 36.7255Z" fill="#FF9F00"/>
                              <path d="M59.611 59.995L59.7116 59.8949C59.8527 59.7494 60.0807 59.9707 59.9299 60.1171L59.8293 60.2172C59.6865 60.3631 59.461 60.1407 59.611 59.995Z" fill="#FF9F00"/>
                              <path d="M65.3815 62.6631L65.1803 62.563C64.9976 62.4701 65.131 62.1931 65.3193 62.2822L65.5193 62.3823C65.5968 62.4201 65.6285 62.5142 65.5907 62.5911C65.5515 62.6713 65.4559 62.7004 65.3815 62.6631Z" fill="#FF9F00"/>
                              <path d="M60.9265 63.8859H60.8259C60.6192 63.8859 60.6193 63.5733 60.8259 63.5733H60.9265C61.0125 63.5733 61.0826 63.6429 61.0826 63.7296C61.0826 63.8163 61.0125 63.8859 60.9265 63.8859Z" fill="#FF9F00"/>
                              </svg>
                            </div>
                            
                            {/* <button className="close-button" onClick={handleCloseModal}>X</button> */}
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
       {showPrizes &&   <PrizeDetails selectedId={selectedId} refreshToken={refreshToken} onClose={() => setShowPrizes(false)}
  />}
      {/*{showAlert && <AlertPopup message={alertMessage} onClose={() => setShowAlert(false)} />}*/}
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
X
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
            {couponId ? (
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
            </div>):null}

            <p className="termsText">
              I have read the{" "}
              <span
                style={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  color: "#b71c1c",
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
      <button className="close-button" onClick={() => setShowTicketPopup(false)}>X</button>
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
