import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreditHistoryNoLegend.css';

const CreditHistoryNoLegend = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('History');
  const [activeHistoryTab, setActiveHistoryTab] = useState('Credits');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLegend, setShowLegend] = useState(false);

  // Sample transaction data
  const transactions = [
    {
      id: 1,
      type: 'referral',
      amount: 1000,
      date: '30 July 2025, 1:00 pm',
      icon: 'refer'
    },
    {
      id: 2,
      type: 'coupon',
      amount: 1000,
      date: '30 July 2025, 11:48 am',
      icon: 'coupon'
    }
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'Add Credit') {
      navigate('/credits-add-credits');
    }
  };

  const handleBottomNavigation = (section) => {
    switch (section) {
      case 'Home':
        navigate('/dashboard');
        break;
      case 'Credit':
        break;
      case 'Buy Ticket':
        navigate('/buy-ticket-01');
        break;
      case 'My Tickets':
        navigate('/my-tickets');
        break;
      case 'More':
        console.log('Navigate to more section');
        break;
      default:
        break;
    }
  };

  const renderTransactionIcon = (type) => {
    if (type === 'refer') {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M1.6665 17.5C1.66643 16.217 2.03662 14.9612 2.73263 13.8833C3.42863 12.8054 4.4209 11.9513 5.59034 11.4234C6.75978 10.8955 8.0567 10.7163 9.32547 10.9073C10.5942 11.0983 11.7809 11.6513 12.7432 12.5" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M8.33317 10.8333C10.6344 10.8333 12.4998 8.96785 12.4998 6.66667C12.4998 4.36548 10.6344 2.5 8.33317 2.5C6.03198 2.5 4.1665 4.36548 4.1665 6.66667C4.1665 8.96785 6.03198 10.8333 8.33317 10.8333Z" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M15.8335 13.3333V18.3333" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M18.3335 15.8333H13.3335" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    } else {
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <g clipPath="url(#clip0_4010_8340)">
            <path d="M10.4882 2.15508C10.1757 1.8425 9.75183 1.66684 9.30984 1.66675H3.33317C2.89114 1.66675 2.46722 1.84234 2.15466 2.1549C1.8421 2.46746 1.6665 2.89139 1.6665 3.33341V9.31008C1.6666 9.75207 1.84225 10.1759 2.15484 10.4884L9.40817 17.7417C9.78693 18.1181 10.2992 18.3294 10.8332 18.3294C11.3671 18.3294 11.8794 18.1181 12.2582 17.7417L17.7415 12.2584C18.1179 11.8797 18.3291 11.3674 18.3291 10.8334C18.3291 10.2995 18.1179 9.78718 17.7415 9.40842L10.4882 2.15508Z" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.25016 6.66659C6.48028 6.66659 6.66683 6.48004 6.66683 6.24992C6.66683 6.0198 6.48028 5.83325 6.25016 5.83325C6.02004 5.83325 5.8335 6.0198 5.8335 6.24992C5.8335 6.48004 6.02004 6.66659 6.25016 6.66659Z" fill="#270659" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <defs>
            <clipPath id="clip0_4010_8340">
              <rect width="20" height="20" fill="white"/>
            </clipPath>
          </defs>
        </svg>
      );
    }
  };

  return (
    <div className="credit-history-no-legend-container">
      {/* Background blur effect */}
      <div className="background-blur"></div>


      {/* Main Content */}
      <main className="credits-main-content">
        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-button ${activeTab === 'Add Credit' ? 'active' : ''}`}
            onClick={() => handleTabChange('Add Credit')}
          >
            Add Credit
          </button>
          <button 
            className={`tab-button ${activeTab === 'History' ? 'active' : ''}`}
            onClick={() => handleTabChange('History')}
          >
            History
          </button>
        </div>

        {/* History Content */}
        <div className="history-content">
          {/* Credits/Debits Tabs */}
          <div className="history-tabs">
            <button 
              className={`history-tab ${activeHistoryTab === 'Credits' ? 'active' : ''}`}
              onClick={() => setActiveHistoryTab('Credits')}
            >
              Credits
            </button>
            <button 
              className={`history-tab ${activeHistoryTab === 'Debits' ? 'active' : ''}`}
              onClick={() => setActiveHistoryTab('Debits')}
            >
              Debits
            </button>
          </div>

          {/* Total Amount and Show Legend */}
          <div className="total-amount-section">
            <div className="total-amount-info">
              <div className="total-amount">₹100</div>
              <div className="total-label">Total Amount</div>
            </div>
            <div className="legend-toggle">
              <div className="toggle-switch" onClick={() => setShowLegend(!showLegend)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 12C12 13.6569 10.6569 15 9 15C7.34315 15 6 13.6569 6 12C6 10.3431 7.34315 9 9 9C10.6569 9 12 10.3431 12 12Z" fill="#270659" stroke="#270659" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15 5H9C5.13401 5 2 8.13401 2 12C2 15.866 5.13401 19 9 19H15C18.866 19 22 15.866 22 12C22 8.13401 18.866 5 15 5Z" stroke="#270659" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="legend-label">Show Legend</span>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="search-filter-section">
            <div>
              <div className="search-input-wrapper">
                <div>
                  <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M17.5 17.5L13.8833 13.8833" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9.16667 15.8333C12.8486 15.8333 15.8333 12.8486 15.8333 9.16667C15.8333 5.48477 12.8486 2.5 9.16667 2.5C5.48477 2.5 2.5 5.48477 2.5 9.16667C2.5 12.8486 5.48477 15.8333 9.16667 15.8333Z" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
              </div>
              <button className="filter-button">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6H21" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M7 12H17" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 18H14" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Transaction Table */}
          <div className="transaction-table">
            <div className="table-header">
              <div className="header-cell type-column">Type</div>
              <div className="header-cell amount-column">
                Amount
                <svg className="sort-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5.8335 12.5L10.0002 16.6667L14.1668 12.5" stroke="#76688B" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.8335 7.49992L10.0002 3.33325L14.1668 7.49992" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="header-cell date-column">
                Date
                <svg className="sort-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M5.8335 12.5L10.0002 16.6667L14.1668 12.5" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M5.8335 7.49992L10.0002 3.33325L14.1668 7.49992" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
            
            <div className="table-body">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="table-row">
                  <div className="table-cell type-cell">
                    {renderTransactionIcon(transaction.type)}
                  </div>
                  <div className="table-cell amount-cell">
                    ₹ {transaction.amount}
                  </div>
                  <div className="table-cell date-cell">
                    {transaction.date}
                  </div>
                </div>
              ))}
            </div>
          </div>
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

export default CreditHistoryNoLegend;
