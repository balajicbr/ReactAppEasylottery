import React, { useEffect,useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreditsAddCredits.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify'; 
import { FaUserPlus, FaTag, FaKey, FaUserFriends } from 'react-icons/fa';

const CreditsAddCredits = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user.user);
   const refreshToken = user?.refreshToken;
  const [activeTab, setActiveTab] = useState('Add Credit');
  const [amount, setAmount] = useState('1000');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [creditDetails, setcreditDetails] = useState({ creadits : "0"});
  const [creditHistory, setCreditHistory] = useState([]);
  const [historyFilter, setHistoryFilter] = useState('Credits');
  const [showLegend, setShowLegend] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = creditHistory.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(creditHistory.length / rowsPerPage);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc'});
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [dateError, setDateError] = useState("");
  
  useEffect(() => {
    fetchCreditDetails();
  }, []);
  const quickAmounts = [
    '₹1000', '₹2000', '₹4000', '₹6000',
    '₹8000', '₹10,000', '₹15,000', '₹20,000'
  ];

  const handleTabChange = (tab) => { 
    setActiveTab(tab);
      if (tab === "History") {
       fetchCreditHistoryDetails();
      }
  };
  // const handlehistoryTabChange = (tab) => { setHistoryFilter(tab);
  //         fetchCreditHistoryDetails();   
  // };
  const handlehistoryTabChange = (tab) => {
  setHistoryFilter(tab); // updates the UI
  fetchCreditHistoryDetails(tab); // fetch with correct tab value
};

  const handleAmountSelect = (selectedAmount) => {
    const numericAmount = selectedAmount.replace('₹', '').replace(',', '');
    setAmount(numericAmount);
  };


  const handleToggle = (e) => {
    setShowLegend(e.target.checked);
  };
  const handleCopyReferralCode = () => {
    navigator.clipboard.writeText('XUVE895EW');
    console.log('Referral code copied');
  };
const fetchCreditDetails = async () => {
    try {
      const requestData = {
        refreshToken,
        formstep: "6"
      };
      console.log('Component loaded!');
      const response = await axios.post(
        "https://api.easylotto.in/transaction",
        requestData
      );
if (response.data) {
  const rawMaxLimit = parseInt(response.data[0].json.wallet_limit);
  const maxLimitFormatted = parseInt(response.data[0].json.wallet_limit).toLocaleString('en-IN');
  const creadits = response.data[0].json.creadits;

  setcreditDetails({
    creadits,
    maxLimit: maxLimitFormatted,
    rawMaxLimit
  });

  console.log("maxLimit:", rawMaxLimit); 
}
    } catch (error) {
      console.error("Error fetching schemes:", error);
    }
  };
  const fetchCreditHistoryDetails = async (tab = historyFilter,fromDate = "", toDate = "") => {
    try {
      const formatDate = (dateStr) =>
      dateStr ? `${dateStr} 00:00:00.000` : "0";
      const requestData = {
        refreshToken,
        formstep: tab === 'Credits'?"12":"13",
        date: toDate ? formatDate(toDate) : "0",
        ids: fromDate && toDate ? "true" : "false",
        sort:"1",
        id: tab === 'Credits'?"":"en",
        status : fromDate ? formatDate(fromDate) : "0"
      };

      const response = await axios.post(
        "https://api.easylotto.in/transaction",
        requestData
      );
if (response.data) {
      const historyData = response.data.map(item => item.json); 
      setCreditHistory(historyData);
  console.log("historyData:", historyData); 
}
    } catch (error) {
      console.error("Error fetching schemes:", error);
    }
  };
    const handlePaymentSelect = (paymentIndex) => {
      setSelectedPayment(paymentIndex);
     const numericAmount = Number(amount);
       if (!numericAmount) { 
          toast.error('Please enter a valid credit amount');
          return; 
        }
       // console.log('max maxLimitrawMaxLimit: ',creditDetails.rawMaxLimit );
        if (parseInt(amount) > creditDetails.rawMaxLimit) {
         toast.error(`Amount cannot exceed ₹${creditDetails.maxLimit.toLocaleString('en-IN')}`);
          return;
        }
  };
  const filteredData = searchTerm
  ? creditHistory.filter(item => {
      const search = searchTerm.toLowerCase();
      return (
        item.payment_method?.toLowerCase().includes(search) ||
        item.amount?.toString().includes(search) ||
        item.date?.toLowerCase().includes(search)
      );
    })
  : creditHistory;
  const handleSort = (key) => {
  let direction = 'asc';
  if (sortConfig.key === key && sortConfig.direction === 'asc') {
    direction = 'desc';
  }
  setSortConfig({ key, direction });
};
const sortedData = React.useMemo(() => {
  const data = [...filteredData];
  if (sortConfig.key !== null) {
    data.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (sortConfig.key === 'amount' || sortConfig.key === 'tickets') {
        // Sort as number
        return sortConfig.direction === 'asc'
          ? parseFloat(aValue) - parseFloat(bValue)
          : parseFloat(bValue) - parseFloat(aValue);
      }

      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc'
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }

      // Default string comparison
      return sortConfig.direction === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  }
  return data;
}, [filteredData, sortConfig]);

  return (
    <div className="credits-add-credits-container">

      {/* Main Content */}
      <main className="credits-main-content">
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button  className={`tab-button ${activeTab === 'Add Credit' ? 'active' : ''}`}onClick={() => handleTabChange('Add Credit')}>
            Add Credit
          </button>
          <button className={`tab-button ${activeTab === 'History' ? 'active' : ''}`} onClick={() => handleTabChange('History')}>
            History
          </button>
        </div>
        <div className="tab-content-container">
  {activeTab === 'Add Credit' && (
    <div className="tab-content">
        {/* Credit Balance Card */}
        <div className="credit-balance-card">
          <div className="balance-card-content">
            <div className="balance-text">
              <h3 className="balance-label">Credit Balance</h3>
                <div className="balance-amount"> {creditDetails.creadits}</div>
            </div>
            <div className="coin-stack">
              <svg width="120" height="80" viewBox="0 0 120 80" fill="none">
                <g>
                  <ellipse cx="90" cy="60" rx="15" ry="8" fill="#F9B42A"/>
                  <ellipse cx="85" cy="55" rx="15" ry="8" fill="#FEDB41"/>
                  <ellipse cx="80" cy="50" rx="15" ry="8" fill="#F9B42A"/>
                  <ellipse cx="75" cy="45" rx="15" ry="8" fill="#FEDB41"/>
                  <ellipse cx="70" cy="40" rx="15" ry="8" fill="#F9B42A"/>
                  <ellipse cx="65" cy="35" rx="15" ry="8" fill="#FEDB41"/>
                </g>
              </svg>
            </div>
          </div>
        </div>

        {/* Add Credit Form */}
        <div className="add-credit-form">
          <div className="form-header">
            <h2 className="form-title">Add Credit</h2>
            <p className="form-subtitle">Add up to {creditDetails.maxLimit} to your account</p>
          </div>

          {/* Amount Input */}
            <div className="amount-input-section">
              <label className="amount-label" htmlFor="amount-input">
                Enter amount ( ₹)
              </label>
              <div className="amount-input-wrapper">
                <input
                  id="amount-input"
                  type="text"
                  value={`₹ ${amount}`}
                    onChange={(e) => {
                        const numericValue = e.target.value.replace(/[^\d]/g, '');
                        setAmount(numericValue);
                      }}
                  // onChange={(e) => setAmount(e.target.value.replace('₹ ', ''))}
                  className="amount-input"
                />
              </div>
            </div>

          {/* Quick Amount Buttons */}
          <div className="quick-amounts">
            <div className="amount-row">
              {quickAmounts.slice(0, 4).map((amountText, index) => (
                <button
                  key={index}
                  className={`amount-button ${amount === amountText.replace('₹', '').replace(',', '') ? 'selected' : ''}`}
                  onClick={() => handleAmountSelect(amountText)}
                >
                  {amountText}
                </button>
              ))}
            </div>
            <div className="amount-row">
              {quickAmounts.slice(4).map((amountText, index) => (
                <button
                  key={index + 4}
                  className={`amount-button ${amount === amountText.replace('₹', '').replace(',', '') ? 'selected' : ''}`}
                  onClick={() => handleAmountSelect(amountText)}
                >
                  {amountText}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="payment-methods">
          <div className="payment-header">
            <h3 className="payment-title">Select Payment Methods</h3>
            <p className="payment-subtitle">Preferred method with secure transactions</p>
          </div>

          <div className="payment-options">
            <div 
              className={`payment-option ${selectedPayment === 0 ? 'selected' : ''}`}
              onClick={() => handlePaymentSelect(selectedPayment)}
            >
              <span className="payment-text">Pay with Cashfree</span>
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/a4f7a21ba7ad1f5055f83c00633678a137ff803e?width=132" 
                alt="PayU" 
                className="payment-logo"
              />
            </div>
            <div 
              className={`payment-option ${selectedPayment === 1 ? 'selected' : ''}`}
              onClick={() => handlePaymentSelect(1)}
            >
              <span className="payment-text">Pay with Cashfree</span>
              <img 
                src="https://api.builder.io/api/v1/image/assets/TEMP/957c00dc405ab85be058390c0b28c495fa0d0ff7?width=150" 
                alt="Cashfree Payments" 
                className="payment-logo"
              />
            </div>
          </div>
        </div>

        {/* Payment Notes */}
        <div className="payment-notes">
          <p className="note-text">
            <strong>Note:</strong> We accept Credit Cards, Debit Cards, UPI and Netbanking. 
            Please check the service providers above for your specific payment method.
          </p>
          <p className="note-text">
            If you using a Desktop/Laptop computer, please use the EasyLottery.in 
            App on your mobile phone browser to pay via UPI.
          </p>
        </div>
              {/* Refer Friends Section */}
      <div className="refer-friends-section">
        <div className="refer-content">
          <h3 className="refer-title">Refer Friends & Earn Credits!</h3>
          <p className="refer-subtitle">Share referral link with friends & Earn credits</p>
          <div className="referral-code">
            <span className="code-text">XUVE895EW</span>
            <button className="copy-button" onClick={handleCopyReferralCode}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M16.6641 6.66797H8.33073C7.41025 6.66797 6.66406 7.41416 6.66406 8.33464V16.668C6.66406 17.5884 7.41025 18.3346 8.33073 18.3346H16.6641C17.5845 18.3346 18.3307 17.5884 18.3307 16.668V8.33464C18.3307 7.41416 17.5845 6.66797 16.6641 6.66797Z" stroke="#AD1E24" strokeWidth="1.04167" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.33073 13.3346C2.41406 13.3346 1.66406 12.5846 1.66406 11.668V3.33464C1.66406 2.41797 2.41406 1.66797 3.33073 1.66797H11.6641C12.5807 1.66797 13.3307 2.41797 13.3307 3.33464" stroke="#AD1E24" strokeWidth="1.04167" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="refer-illustration">
          <svg width="200" height="196" viewBox="0 0 200 196" fill="none">
            <g>
              <rect x="20" y="35" width="167" height="161" fill="url(#pattern0_4010_8272)"/>
              <path d="M192.854 184.348L182.82 182.072C182.395 181.975 182.094 181.598 182.094 181.163V169.933C182.094 169.321 182.673 168.875 183.264 169.031L193.298 171.681C193.707 171.789 193.992 172.159 193.992 172.582V183.439C193.992 184.037 193.437 184.48 192.854 184.348Z" stroke="#6A538D" strokeMiterlimit="10"/>
              <path d="M175.505 37C173.339 70.8333 172.588 115.5 158 105.5C144.142 96 186 74 188.005 96C191.092 129.86 144 159 92 124.5" stroke="#270659" strokeDasharray="3 3"/>
            </g>
            <defs>
              <pattern id="pattern0_4010_8272" patternContentUnits="objectBoundingBox" width="1" height="1">
                <use xlinkHref="#image0_4010_8272" transform="matrix(0.00277283 0 0 0.00287514 -0.548821 -0.12987)"/>
              </pattern>
            </defs>
          </svg>
        </div>
      </div>
        </div>
)}
      {activeTab === 'History' && (
        <div className="history-tab-content">
          <div className="history-container">
            <div className="filter-tabs">
              <button className={historyFilter === 'Credits' ? 'active' : ''}  onClick={() => handlehistoryTabChange('Credits')}>
                Credits
              </button>
              <button className={historyFilter === 'Debits' ? 'active' : ''}  onClick={() => handlehistoryTabChange('Debits')}>
                Debits
              </button>
            </div>
            {/* Conditional content based on filter */}
            <div className="history-content">
                    <>
                      {/* Credit Summary Section */}
                      <div className="credit-summary">
                        <div className="credit-summary-left">
                          <p className="amount">₹ {creditDetails.creadits}</p>
                          <p className="label">Total Amount</p>
                        </div>
                        {historyFilter === 'Credits' && (
                        <div className="credit-summary-right">
                          <label className="toggle-switch">
                            <input type="checkbox" id="legend-toggle" checked={showLegend} onChange={handleToggle}/>
                            <span className="slider" />
                          </label>
                          <label htmlFor="legend-toggle" className="toggle-label">Show Legend</label>
                        </div>
                        )}
                      </div>
                      
                      {showLegend && (historyFilter === 'Credits') && (
                          <div className="info-container">
                            <div className="info-item">
                              <FaUserPlus className="info-icon" />
                              <span>Earned Credits via refer a friend</span>
                            </div>
                            <div className="info-item">
                              <FaTag className="info-icon" />
                              <span>Coupon Credits</span>
                            </div>
                            <div className="info-item">
                              <FaKey className="info-icon" />
                              <span>Sign Up reward</span>
                            </div>
                            <div className="info-item">
                              <FaUserFriends className="info-icon" />
                              <span>Earned Credits via refer a partner</span>
                            </div>
                          </div>
                      )}
                      {/* Search Bar */}
                      <div className="search-bar-container">
                        <div className="search-filter-wrapper">
                          <input
                            type="text"
                            className="search-input"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                          <button
                            className="filter-btn"
                            onClick={() => setIsBottomSheetOpen(true)}
                          >
                            <svg
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="#6A538D"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <line x1="3" y1="4" x2="21" y2="4" />
                              <line x1="6" y1="12" x2="18" y2="12" />
                              <line x1="10" y1="20" x2="14" y2="20" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      {/* Transaction Table */}
                      <div className="transaction-table-container">
                        <table className="transaction-table">
                          <thead>
                            {historyFilter === 'Credits' ? (
                              <tr>
                                <th onClick={() => handleSort('payment_method')}>
                                  Type {sortConfig.key === 'payment_method' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('amount')}>
                                  Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('date')}>
                                  Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                              </tr>
                            ) : (
                              <tr>
                                <th onClick={() => handleSort('name')}>
                                  Scheme {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('no')}>
                                  Tickets {sortConfig.key === 'no' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('amount')}>
                                  Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                                <th onClick={() => handleSort('date')}>
                                  Date {sortConfig.key === 'date' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                                </th>
                              </tr>
                            )}
                          </thead>

                        </table>
                        <div className="scrollable-tbody">
                          <table className="transaction-table">
                            <tbody>
                              {historyFilter === 'Credits' ? (
                                sortedData.length === 0 ? (
                                  <tr>
                                    <td colSpan="3">
                                      <div className="no-tickets-container">
                                        <div className="no-tickets-content">
                                          <h2 className="no-tickets-title">No tickets found!</h2>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ) : (
                                  sortedData.map((item, index) => (
                                    <tr key={item.id || index}>
                                      <td>{item.payment_method || 'N/A'}</td>
                                      <td>₹{item.amount}</td>
                                      <td>{item.date}</td>
                                    </tr>
                                  ))
                                )
                              ) : (
                                sortedData.length === 0 ? (
                                  <tr>
                                    <td colSpan="4">
                                      <div className="no-tickets-container">
                                        <div className="no-tickets-content">
                                          <h2 className="no-tickets-title">No tickets found!</h2>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                ) : (
                                  sortedData.map((item, index) => (
                                    <tr key={item.id || index}>
                                      <td>{item.name || 'N/A'}</td>
                                      <td>{item.no || 'N/A'}</td>
                                      <td>₹{item.amount}</td>
                                      <td>{item.date}</td>
                                    </tr>
                                  ))
                                )
                              )}
                            </tbody>

                          </table>
                        </div>
                      </div>
                      <div className="pagination">
                          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}disabled={currentPage === 1}>
                            Prev
                          </button>
                          <span>Page {currentPage} of {totalPages}</span>
                          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                            Next
                          </button>
                      </div>
                            {isBottomSheetOpen && (
                                <div
                                  className="bottom-sheet-overlay"
                                  onClick={() => setIsBottomSheetOpen(false)}
                                >
                                  <div
                                    className="bottom-sheet"
                                    onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                                  >
                                    <div className="bottom-sheet-header">
                                      <h3>Filter Options</h3>
                                    </div>
                                    <div className="bottom-sheet-content">
                                      {/* Example filter fields */}
                                      <label>
                                        From:
                                        <input type="date"  value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                                      </label>
                                      <label>
                                        To:
                                        <input type="date"  value={toDate} onChange={(e) => setToDate(e.target.value)}/>
                                      </label>
                                      {dateError && (
                                        <div className="date-error-message">
                                          <p style={{ color: "red", marginTop: "8px" }}>{dateError}</p>
                                        </div>
                                      )}
                                      <button className="apply-btn" 
                                      onClick={() => {  
                                        setDateError("");
                                            if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
                                          setDateError("From date cannot be later than To date.");
                                          return;
                                        }   
                                        fetchCreditHistoryDetails(historyFilter,fromDate, toDate);
                                        setIsBottomSheetOpen(false);  }}>
                                        Apply Filters
                                      </button>
                                      <button className="apply-btn" onClick={() => { setFromDate(""); setToDate("");setDateError(""); setIsBottomSheetOpen(false); fetchCreditHistoryDetails(historyFilter,fromDate, toDate); 
                                      }} >
                                        Clear Filters
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
                    </>
            </div>
          </div>
        </div>
      )}
        </div>

      </main>

      {/* Floating Phone Button */}
      <div className="floating-phone">
        <div className="phone-button">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M13.832 16.568C14.0385 16.6628 14.2712 16.6845 14.4917 16.6294C14.7122 16.5744 14.9073 16.4458 15.045 16.265L15.4 15.8C15.5863 15.5516 15.8279 15.35 16.1056 15.2111C16.3833 15.0723 16.6895 15 17 15H20C20.5304 15 21.0391 15.2107 21.4142 15.5858C21.7893 15.9609 22 16.4696 22 17V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22C15.2261 22 10.6477 20.1036 7.27208 16.7279C3.89642 13.3523 2 8.7739 2 4C2 3.46957 2.21071 2.96086 2.58579 2.58579C2.96086 2.21071 3.46957 2 4 2H7C7.53043 2 8.03914 2.21071 8.41421 2.58579C8.78929 2.96086 9 3.46957 9 4V7C9 7.31049 8.92771 7.61672 8.78885 7.89443C8.65 8.17214 8.44839 8.41371 8.2 8.6L7.732 8.951C7.54842 9.09118 7.41902 9.29059 7.36579 9.51535C7.31256 9.74012 7.33878 9.97638 7.44 10.184C8.80668 12.9599 11.0544 15.2048 13.832 16.568Z" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default CreditsAddCredits;
