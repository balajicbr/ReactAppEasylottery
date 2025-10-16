import React, { useEffect, useState } from "react";
import "./PurchaseConfirmation.css";
import { useSelector } from "react-redux";
import axios from "axios";
import purchaseBanner from "../../assets/Im_Buy.jpg";
import { useNavigate } from "react-router-dom";
import AlertPopup from "../../comp/AlertPopup/AlertPopup";
import BalancePopup from "../../comp/BalancePopup/BalancePopup";
import LimitedTicketsPopup from "../../comp/LimitedTicketsPopup/LimitedTicketsPopup";

const PurchaseConfirmation = ({
  type,
  id,
  onClose,
  totalAmount,
  randomQuantity,
  count,
  selectedNumber,
  ticketLength,
}) => {
  const navigate = useNavigate();
console.log("selected number is",selectedNumber);
  const user = useSelector((state) => state.auth.user.user);
  const refreshToken = user?.refreshToken;
  console.log("Request data for getCoupon is", id, refreshToken);

  const [couponData, setCouponData] = useState(null);
  const [couponId, setCouponId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tickets, setTickets] = useState([]);
  const [transactionId, setTransactionId] = useState("");

  // Terms PDF viewer state
  const [showTermsPdf, setShowTermsPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfName, setPdfName] = useState("terms.pdf");
  const [loadingTerms, setLoadingTerms] = useState(false);
  const [termsError, setTermsError] = useState(null);

  // unified popup state
  const [popup, setPopup] = useState(null);
  const [isProcessingLimited, setIsProcessingLimited] = useState(false);

  // Utility functions
  const generateKey = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    console.log("Result key is", result);
    return result;
  };

  const encodeshoping = (v1, v2, v3, v4, v5, v6) => {
    const code = `${v1}|${v2}|${v3}|${v4}|${v5}|${v6}`;
    const bytes = new TextEncoder().encode(code);
    const hashBuffer = crypto.subtle.digest("SHA-256", bytes);
    return hashBuffer.then((hash) => {
      const hmacBase64 = btoa(String.fromCharCode(...new Uint8Array(hash)));
      console.log("hmacBase64", hmacBase64);
      return hmacBase64;
    });
  };

  const encoding = (value) => {
    return btoa(value);
  };

  const base64ToBlob = (base64, mime = "application/pdf") => {
    try {
      const byteCharacters = atob(base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      return new Blob([byteArray], { type: mime });
    } catch (e) {
      console.error("base64ToBlob failed", e);
      return null;
    }
  };

  const fetchTerms = async () => {
    if (!id || !refreshToken) return;
    setLoadingTerms(true);
    setTermsError(null);

    try {
      const requestData = {
        refreshToken,
        formstep: "terms",
        id,
        isd: "en",
      };

      const response = await axios.post(
        "https://api.easylotto.in/elterms",
        requestData,
        {
          headers: {
            "lang-policies-mode": "max-age=0",
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const entries = response.data;
      const first = Array.isArray(entries) ? entries[0] : entries;
      const binary = first?.binary?.data;
      const fileName =
        first?.binary?.fileName ||
        first?.json?.name ||
        "terms_and_conditions.pdf";
      const base64data = binary?.data;

      if (!base64data) {
        throw new Error("No PDF data found in response");
      }

      const blob = base64ToBlob(base64data, binary?.mimeType || "application/pdf");
      if (!blob) throw new Error("Failed to create PDF blob");

      const url = URL.createObjectURL(blob);
      console.log("Blob URL:", url);
      window.open(url);
      setPdfUrl(url);
      setPdfName(fileName);
    } catch (err) {
      console.error("Terms fetch error:", err);
      setTermsError(err?.response?.data || err.message || "Failed to load terms");
    } finally {
      setLoadingTerms(false);
    }
  };


  const handleConfirmPurchase = async () => {
    const generatedKey = generateKey();
    const currentTime = Math.floor(Date.now() / 1000);

    const value1 = refreshToken;
    const value2 = id;
    const value5 = currentTime;
    const value6 = generatedKey;

    let value3, value4, session;

    if (type === "random") {
      value3 = totalAmount;
      value4 = randomQuantity;

      const encodedShoping = await encodeshoping(
        value1,
        value2,
        value3,
        value4,
        value5,
        value6
      );

      session = encoding(
        `${refreshToken}|11|${generatedKey}|${encodedShoping}|${value5}|${id}|${value3}|${value4}`
      );
    } else if (type === "luckyNum") {
      value3 = totalAmount;
      value4 = randomQuantity + "|" + count;

      const encodedShoping = await encodeshoping(
        value1,
        value2,
        value3,
        value4,
        value5,
        value6
      );

      session = encoding(
        `${refreshToken}|12|${generatedKey}|${encodedShoping}|${value5}|${id}|${value3}|${value4}`
      );
    } else if (type === "customSingle") {
      value3 = totalAmount;
      value4 = selectedNumber;

      const encodedShoping = await encodeshoping(
        value1,
        value2,
        value3,
        value4,
        value5,
        value6
      );

      session = encoding(
        `${refreshToken}|13|${generatedKey}|${encodedShoping}|${value5}|${id}|${value3}|${value4}|${ticketLength}`
      );
    } else if (type === "customMultiple") {
      value3 = totalAmount;
      value4 = selectedNumber;

      const encodedShoping = await encodeshoping(
        value1,
        value2,
        value3,
        value4,
        value5,
        value6
      );

      session = encoding(
        `${refreshToken}|14|${generatedKey}|${encodedShoping}|${value5}|${id}|${value3}|${selectedNumber.split(",").length}|${value4}|${ticketLength}`
      );
    }

    try {
      const response = await axios.post(
        `https://api.easylotto.in/reactDummy?session=${session}`,
        { version: "", coupon: couponId || "" },
        { headers: { "lang-policies-mode": "max-age=0" },
      validateStatus: (status) => status >= 200 && status < 400
      }
      );
      console.log("response 1 is", response.status);

      switch (response.status) {
        case 220:
          setPopup({ type: "alert", message: "No tickets are available." });
          break;

        case 210:
          setPopup({ type: "balance" });
          break;

        case 250:
          setPopup({
            type: "alert",
            message: "Scheme is closed, you can't buy the ticket.",
            onDismiss: () => navigate("/dashboard"),
          });
          break;
          
          case 350:
          setPopup({
            type: "alert",
            message: "selected number is not available.",
            onDismiss: () => navigate("/dashboard"),
          });
          break;

        case 300:
          if (response.data.count === 0) {
            setPopup({ type: "alert", message: "All tickets are sold." });
          } else {
            setPopup({
              type: "limited",
              data: { availableCount: response.data.count, requestedCount: count },
            });
          }
          break;

        case 200:
          setTickets(response.data);
          setTransactionId(response.data[0]?.transaction_id || "");
          break;
      }
    } catch (error) {
      console.error("Purchase failed:", error);
      onClose();
      setPopup({ type: "alert", message: "Tickets are not purchased. Try again." });
    }
  };

  const handleApplyCoupon = () => {
    if (couponData?.id) {
      setCouponId(couponData.id);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponId("");
  };

  return (
    <div className="alertOverlay">
      <div className="alertModal">
        <button className="closeBtn" onClick={onClose}>
          ×
        </button>

        <img
          src={purchaseBanner}
          alt="Purchase Banner"
          className="alertImage"
        />

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
              Confirm Purchase
            </button>
          </>
        )}
      </div>

      {/* Popups */}
      {popup?.type === "alert" && (
        <AlertPopup
        onClose={() => setPopup(null)}
          message={popup.message}
          onDismiss={() => {
            popup.onDismiss?.();
            setPopup(null);
             
          }}
        />
      )}

      {popup?.type === "balance" && (
        <BalancePopup
          onClose={() => setPopup(null)}
          onAddCredit={() => navigate("/addCredits", { state: { id } })}
        />
      )}

      {popup?.type === "limited" && (
        <LimitedTicketsPopup
          availableCount={popup.data.availableCount}
          requestedCount={popup.data.requestedCount}
          onClose={() => setPopup(null)}
          onProceed={() => {
            setIsProcessingLimited(true);
            setPopup(null);
            onClose();
            // trigger limited purchase logic here
          }}
        />
      )}
    </div>
  );
};

export default PurchaseConfirmation;
