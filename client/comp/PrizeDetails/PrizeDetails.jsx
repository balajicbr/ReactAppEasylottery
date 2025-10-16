import React, { useEffect, useState } from "react";
import "./PrizeDetails.css";
import axios from "axios";

const PrizeDetails = ({ selectedId, refreshToken, onClose }) => {
  const [prizes, setPrizes] = useState([]);

  // PDF viewer states
  const [showTermsPdf, setShowTermsPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfName, setPdfName] = useState("terms.pdf");
  const [loadingTerms, setLoadingTerms] = useState(false);
  const [termsError, setTermsError] = useState(null);

  useEffect(() => {
    if (!selectedId || !refreshToken) return;

    const fetchPrizes = async () => {
      try {
        const requestData = {
          refreshToken,
          formstep: "10",
          id: selectedId,
          isd: "en",
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

        // response might be an array or object; normalize as necessary
        // your current code expects array-of-{json:...} structure
        setPrizes(response.data || []);
      } catch (err) {
        console.error("Error fetching prize details:", err);
        setPrizes([]);
      }
    };

    fetchPrizes();
  }, [selectedId, refreshToken]);

  // Convert base64 string to Blob
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

  // Fetch terms PDF and show viewer
  const fetchTerms = async () => {
    if (!selectedId || !refreshToken) return;
    setLoadingTerms(true);
    setTermsError(null);

    try {
      const requestData = {
        refreshToken,
        formstep: "terms",
        id: selectedId,
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
        binary?.fileName || first?.json?.name || "terms_and_conditions.pdf";
      const base64data = binary?.data;

      if (!base64data) {
        throw new Error("No PDF data found in response");
      }

      const blob = base64ToBlob(base64data, binary?.mimeType || "application/pdf");
      if (!blob) throw new Error("Failed to create PDF blob");

      const url = URL.createObjectURL(blob);
      window.open(url);
      setPdfUrl(url);
      setPdfName(fileName);
    } catch (err) {
      console.error("Error fetching terms:", err);
      setTermsError(err?.response?.data || err.message || "Failed to load terms");
    } finally {
      setLoadingTerms(false);
    }
  };

  return (
    <div className="prizeOverlay">
      <div className="prizeModal">
        {/* Header */}
        <div className="prizeHeader">
          <h3>Prizes | Terms and Conditions</h3>
          <button className="prizecloseBtn" onClick={onClose}>
            ×
          </button>
        </div>

        {/* Table */}
        <table className="prizeTable">
          <thead>
            <tr>
              <th>S No</th>
              <th>Title</th>
              <th>Winners</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {prizes.length > 0 ? (
              prizes.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.json?.sno ?? idx + 1}</td>
                  <td>{p.json?.prize ?? p.json?.title ?? "-"}</td>
                  <td>{p.json?.winners ?? "-"}</td>
                  <td>₹{p.json?.amount ?? p.json?.amountt ?? "0"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No prize data available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer: View Terms link + loading/error states */}
        <div className="termsFooter">
          {loadingTerms ? (
            <div className="termsLoading">Loading terms...</div>
          ) : termsError ? (
            <div className="termsError">{String(termsError)}</div>
          ) : (
            <button className="termsLinkBtn" onClick={fetchTerms}>
              View Terms and Conditions
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrizeDetails;
