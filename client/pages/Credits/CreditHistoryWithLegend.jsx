import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CreditHistoryWithLegend.css';

const CreditHistoryWithLegend = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('History');
  const [activeHistoryTab, setActiveHistoryTab] = useState('Credits');
  const [searchTerm, setSearchTerm] = useState('');
  const [showLegend, setShowLegend] = useState(true);

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
    <div className="credit-history-with-legend-container">
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

          {/* Total Amount and Hide Legend */}
          <div className="total-amount-section">
            <div className="total-amount-info">
              <div className="total-amount">₹100</div>
              <div className="total-label">Total Amount</div>
            </div>
            <div className="legend-toggle">
              <div className="toggle-switch active" onClick={() => setShowLegend(!showLegend)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 5H15C18.866 5 22 8.13401 22 12C22 15.866 18.866 19 15 19H9C5.13401 19 2 15.866 2 12C2 8.13401 5.13401 5 9 5Z" fill="#270659" stroke="#270659" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.5 12C19.5 13.6569 18.1569 15 16.5 15C14.8431 15 13.5 13.6569 13.5 12C13.5 10.3431 14.8431 9 16.5 9C18.1569 9 19.5 10.3431 19.5 12Z" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="legend-label">Hide Legend</span>
            </div>
          </div>

          {/* Legend Section */}
          {showLegend && (
            <div className="legend-section">
              <div className="legend-item">
                <svg className="legend-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M1.6665 17.5C1.66643 16.217 2.03662 14.9612 2.73263 13.8833C3.42863 12.8054 4.4209 11.9513 5.59034 11.4234C6.75978 10.8955 8.0567 10.7163 9.32547 10.9073C10.5942 11.0983 11.7809 11.6513 12.7432 12.5" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.33317 10.8333C10.6344 10.8333 12.4998 8.96785 12.4998 6.66667C12.4998 4.36548 10.6344 2.5 8.33317 2.5C6.03198 2.5 4.1665 4.36548 4.1665 6.66667C4.1665 8.96785 6.03198 10.8333 8.33317 10.8333Z" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M15.8335 13.3333V18.3333" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.3335 15.8333H13.3335" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="legend-text">Earned Credits via refer a friend</span>
              </div>

              <div className="legend-item">
                <svg className="legend-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <g clipPath="url(#clip0_4010_8398)">
                    <path d="M10.4882 2.15508C10.1757 1.8425 9.75183 1.66684 9.30984 1.66675H3.33317C2.89114 1.66675 2.46722 1.84234 2.15466 2.1549C1.8421 2.46746 1.6665 2.89139 1.6665 3.33341V9.31008C1.6666 9.75207 1.84225 10.1759 2.15484 10.4884L9.40817 17.7417C9.78693 18.1181 10.2992 18.3294 10.8332 18.3294C11.3671 18.3294 11.8794 18.1181 12.2582 17.7417L17.7415 12.2584C18.1179 11.8797 18.3291 11.3674 18.3291 10.8334C18.3291 10.2995 18.1179 9.78718 17.7415 9.40842L10.4882 2.15508Z" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6.25016 6.66659C6.48028 6.66659 6.66683 6.48004 6.66683 6.24992C6.66683 6.0198 6.48028 5.83325 6.25016 5.83325C6.02004 5.83325 5.8335 6.0198 5.8335 6.24992C5.8335 6.48004 6.02004 6.66659 6.25016 6.66659Z" fill="#270659" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_4010_8398">
                      <rect width="20" height="20" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
                <span className="legend-text">Coupon Credits</span>
              </div>

              <div className="legend-item">
                <svg className="legend-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2.15484 14.5116C1.84225 14.8241 1.6666 15.248 1.6665 15.69V17.5C1.6665 17.721 1.7543 17.9329 1.91058 18.0892C2.06686 18.2455 2.27882 18.3333 2.49984 18.3333H4.99984C5.22085 18.3333 5.43281 18.2455 5.58909 18.0892C5.74537 17.9329 5.83317 17.721 5.83317 17.5V16.6666C5.83317 16.4456 5.92097 16.2337 6.07725 16.0774C6.23353 15.9211 6.44549 15.8333 6.6665 15.8333H7.49984C7.72085 15.8333 7.93281 15.7455 8.08909 15.5892C8.24537 15.4329 8.33317 15.221 8.33317 15V14.1666C8.33317 13.9456 8.42097 13.7337 8.57725 13.5774C8.73353 13.4211 8.94549 13.3333 9.1665 13.3333H9.30984C9.75183 13.3332 10.1757 13.1576 10.4882 12.845L11.1665 12.1666C12.3247 12.5701 13.5855 12.5685 14.7427 12.1623C15.8999 11.756 16.885 10.969 17.5368 9.93007C18.1886 8.89115 18.4685 7.66178 18.3308 6.44309C18.193 5.22439 17.6458 4.08851 16.7785 3.22128C15.9113 2.35404 14.7754 1.80679 13.5567 1.66905C12.338 1.5313 11.1087 1.81122 10.0697 2.46301C9.03081 3.11479 8.24383 4.09986 7.83754 5.25707C7.43126 6.41428 7.42972 7.67511 7.83317 8.8333L2.15484 14.5116Z" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M13.7502 6.66659C13.9803 6.66659 14.1668 6.48004 14.1668 6.24992C14.1668 6.0198 13.9803 5.83325 13.7502 5.83325C13.52 5.83325 13.3335 6.0198 13.3335 6.24992C13.3335 6.48004 13.52 6.66659 13.7502 6.66659Z" fill="#270659" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="legend-text">Sign Up reward</span>
              </div>

              <div className="legend-item">
                <svg className="legend-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M14.9998 17.4999C14.9998 15.7318 14.2975 14.0361 13.0472 12.7859C11.797 11.5356 10.1013 10.8333 8.33317 10.8333C6.56506 10.8333 4.86937 11.5356 3.61913 12.7859C2.36888 14.0361 1.6665 15.7318 1.6665 17.4999" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8.33317 10.8333C10.6344 10.8333 12.4998 8.96785 12.4998 6.66667C12.4998 4.36548 10.6344 2.5 8.33317 2.5C6.03198 2.5 4.1665 4.36548 4.1665 6.66667C4.1665 8.96785 6.03198 10.8333 8.33317 10.8333Z" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.3333 16.6666C18.3333 13.8583 16.6667 11.2499 15 9.99992C15.5478 9.58889 15.9859 9.04916 16.2755 8.42848C16.565 7.80779 16.6971 7.12531 16.66 6.44142C16.6229 5.75753 16.4178 5.09332 16.0629 4.50759C15.7079 3.92185 15.2141 3.43264 14.625 3.08325" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="legend-text">Earned Credits via refer a partner</span>
              </div>
            </div>
          )}

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

export default CreditHistoryWithLegend;
