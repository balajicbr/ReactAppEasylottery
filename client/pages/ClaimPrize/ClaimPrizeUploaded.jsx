import React from 'react';
import { useNavigate } from 'react-router-dom';
// import './ClaimPrizeUploaded.css';

const ClaimPrizeUploaded = () => {
  const navigate = useNavigate();

  const handleBackToMyWins = () => {
    navigate('/my-wins');
  };

  return (
    <div className="claim-prize-uploaded-container">
      {/* Background blur effect */}
      <div className="background-blur"></div>

      <div className="page-wrapper">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <button className="back-button" onClick={handleBackToMyWins}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 19L5 12L12 5" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 12H5" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="header-title">My Wins</h1>
          </div>
        </div>
      </div>

      {/* Confirmation Section */}
      <div className="confirmation-section">
        <div className="confirmation-content">
          {/* Success Icon */}
          <div className="success-icon-container">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="40" fill="url(#paint0_linear_success)"/>
              <path d="M58.3334 30L35 53.3333L21.6667 40" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              <defs>
                <linearGradient id="paint0_linear_success" x1="0" y1="0" x2="80" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#F9B42B"/>
                  <stop offset="1" stopColor="#FED604"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Confirmation Message */}
          <div className="confirmation-message">
            <h2 className="message-title">Claim Submitted Successfully</h2>
            <p className="message-description">
              Your claim has been submitted. We will notify you once it is approved.
            </p>
          </div>

          {/* Prize Details */}
          <div className="prize-details-summary">
            <h3 className="details-title">Prize Details</h3>
            <div className="details-grid-summary">
              <div className="detail-item-summary">
                <div className="detail-label-summary">Ticket</div>
                <div className="detail-value-summary">U088</div>
              </div>
              <div className="detail-item-summary">
                <div className="detail-label-summary">Prize</div>
                <div className="detail-value-summary">₹ 10,000</div>
              </div>
              <div className="detail-item-summary">
                <div className="detail-label-summary">Claim Expiry</div>
                <div className="detail-value-summary">14 Aug 2025</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button className="view-my-wins-button" onClick={handleBackToMyWins}>
            Back to My Wins
          </button>
        </div>
      </div>

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

export default ClaimPrizeUploaded;
