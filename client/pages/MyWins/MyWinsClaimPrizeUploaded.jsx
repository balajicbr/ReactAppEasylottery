import React , { useEffect, useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import './MyWinsClaimPrizeUploaded.css';
import axios from "axios";
import { useSelector } from "react-redux";

const MyWinsClaimPrizeUploaded = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user.user);
  const refreshToken = user?.refreshToken;
  const [isLoading, setIsLoading] = useState(false);
  const { ticket } = location.state || {};
  const [allTicket, setAllTickets] = useState([]);
  // console.log("on load ticket:",ticket.id);
  const handleBack = () => {
    navigate(-1);
  };

  const handleDownloadTemplate = () => {
    console.log('Download template clicked');
    // Handle template download logic
  };

  const handleRemoveFile = () => {
    // Navigate back to the original claim prize page or show empty state
    navigate('/claim-prize');
  };

  const handleSubmit = () => {
    console.log('Submit claim form');
    // Handle form submission
    // Could navigate to a success page or show confirmation
  };
   useEffect(() => {
      fetchTickets();
    }, [allTicket]);
  const fetchTickets = async () => {
    setIsLoading(true);
      try {
        const requestData = {
          refreshToken: refreshToken,
          formstep: 'claimTicketsid',
          id: ticket.id,
          ids: "en"
        };
      
        const response = await axios.post(
          "https://api.easylotto.in/redeem",
          requestData,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              "lang-policies-mode": "max-age=0",
            },
          },
        );
  
        if (response.data) {
  
          const allTickets = response.data;
          setAllTickets(allTickets);
          //console.log("allTickets: ",allTickets);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

  return (
    <div className="claim-prize-uploaded-container">

      <div className="page-wrapper">
        {/* Header */}
        <div className="header">
          <div className="header-content">
            <button className="back-button" onClick={handleBack}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 19L5 12L12 5" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M19 12H5" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <h1 className="header-title">My Wins</h1>
          </div>
        </div>
      </div>

      {/* Winner Banner */}
      <div className="winner-banner">
        <div className="banner-header">
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/c50223c50d071c51739f282e044d51ba81d089a1?width=471"
            alt="Celebration blur"
            className="celebration-blur"
          />
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/b200abb0aa8bc5c08c2583b74896a4984da652a9?width=760"
            alt="Winner banner"
            className="winner-banner-bg"
          />
        </div>
        <div className="banner-footer">
          <svg className="confetti-left" width="39" height="46" viewBox="0 0 39 46" fill="none">
            <path d="M18.0802 41.7304C22.4598 41.7304 26.0101 41.531 26.0101 41.2851C26.0101 41.0392 22.4598 40.8398 18.0802 40.8398C13.7007 40.8398 10.1504 41.0392 10.1504 41.2851C10.1504 41.531 13.7007 41.7304 18.0802 41.7304Z" fill="#010529"/>
            <path d="M29.8814 41.5504C30.7339 41.5504 31.425 41.4316 31.425 41.285C31.425 41.1384 30.7339 41.0195 29.8814 41.0195C29.029 41.0195 28.3379 41.1384 28.3379 41.285C28.3379 41.4316 29.029 41.5504 29.8814 41.5504Z" fill="#010529"/>
            <path d="M8.13477 17.8753L9.99068 39.1299C10.0475 39.7785 10.4467 40.3474 11.0376 40.6208L11.8206 40.983C12.434 41.2668 13.1539 41.1869 13.6898 40.7753L30.8105 27.6348L8.13477 17.875V17.8753Z" fill="#5F98FB"/>
            <path d="M16.6414 21.5352C15.8834 22.6426 15.4552 24.8407 17.824 25.9821C27.506 30.6467 12.4395 41.6512 10.1504 39.7274C10.328 40.1153 10.6394 40.435 11.0387 40.6199L11.8217 40.982C12.4351 41.2659 13.155 41.186 13.691 40.7746L30.8116 27.6341L16.6417 21.5355L16.6414 21.5352Z" fill="#0F2376"/>
          </svg>
          <div className="congratulations-text">
            Congratulations! You are the lucky winner
          </div>
          <svg className="confetti-right" width="39" height="46" viewBox="0 0 39 46" fill="none">
            <path d="M18.0802 41.7304C22.4598 41.7304 26.0101 41.531 26.0101 41.2851C26.0101 41.0392 22.4598 40.8398 18.0802 40.8398C13.7007 40.8398 10.1504 41.0392 10.1504 41.2851C10.1504 41.531 13.7007 41.7304 18.0802 41.7304Z" fill="#010529"/>
            <path d="M29.8814 41.5504C30.7339 41.5504 31.425 41.4316 31.425 41.285C31.425 41.1384 30.7339 41.0195 29.8814 41.0195C29.029 41.0195 28.3379 41.1384 28.3379 41.285C28.3379 41.4316 29.029 41.5504 29.8814 41.5504Z" fill="#010529"/>
            <path d="M8.13477 17.8714L9.99068 39.126C10.0475 39.7746 10.4467 40.3435 11.0376 40.6169L11.8206 40.9791C12.434 41.2629 13.1539 41.183 13.6898 40.7714L30.8105 27.6308L8.13477 17.8711V17.8714Z" fill="#5F98FB"/>
            <path d="M16.6414 21.5352C15.8834 22.6426 15.4552 24.8407 17.824 25.9821C27.506 30.6467 12.4395 41.6512 10.1504 39.7274C10.328 40.1153 10.6394 40.435 11.0387 40.6199L11.8217 40.982C12.4351 41.2659 13.155 41.186 13.691 40.7746L30.8116 27.6341L16.6417 21.5355L16.6414 21.5352Z" fill="#0F2376"/>
          </svg>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="main-content-inner">
          {/* Prize Details Card */}
          <div className="prize-details-card">
            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-label">Ticket</div>
                <div className="detail-value">U088</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Prize</div>
                <div className="detail-value">₹ 10,000</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Claim Expiry</div>
                <div className="detail-value">14 Aug 2025</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Time Left</div>
                <div className="detail-value">30 days</div>
              </div>
            </div>
          </div>

          {/* Claim Form Section */}
          <div className="claim-form-section">
            <div className="form-content">
              <div className="form-header">
                <h2 className="form-title">Claim Prize</h2>
                <p className="form-description">
                  To claim the prize please download the PDF format & Upload
                </p>
              </div>

              <div className="form-actions">
                <button className="action-button download-btn" onClick={handleDownloadTemplate}>
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <path d="M10 12.8672V2.86719" stroke="#AD1E24" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 12.8672V16.2005C17.5 16.6425 17.3244 17.0665 17.0118 17.379C16.6993 17.6916 16.2754 17.8672 15.8333 17.8672H4.16667C3.72464 17.8672 3.30072 17.6916 2.98816 17.379C2.67559 17.0665 2.5 16.6425 2.5 16.2005V12.8672" stroke="#AD1E24" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.8335 8.70056L10.0002 12.8672L14.1668 8.70056" stroke="#AD1E24" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download Template
                </button>

                <button className="action-button upload-btn disabled">
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <path d="M10 2.86719V12.8672" stroke="#AD1E24" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.1668 7.03385L10.0002 2.86719L5.8335 7.03385" stroke="#AD1E24" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 12.8672V16.2005C17.5 16.6425 17.3244 17.0665 17.0118 17.379C16.6993 17.6916 16.2754 17.8672 15.8333 17.8672H4.16667C3.72464 17.8672 3.30072 17.6916 2.98816 17.379C2.67559 17.0665 2.5 16.6425 2.5 16.2005V12.8672" stroke="#AD1E24" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Upload Claim Form
                </button>
              </div>

              {/* Uploaded File Display */}
              <div className="uploaded-file-display">
                <div className="file-info">
                  <div className="pdf-icon">
                    <svg width="32" height="33" viewBox="0 0 32 33" fill="none">
                      <path d="M26.7103 5.44214V27.2921C26.7103 27.5574 26.605 27.8117 26.4174 27.9992C26.2299 28.1868 25.9755 28.2921 25.7103 28.2921H10.0703C9.8051 28.2921 9.55074 28.1868 9.36321 27.9992C9.17567 27.8117 9.07031 27.5574 9.07031 27.2921V11.9121L14.5703 4.44214H25.7103C25.9755 4.44214 26.2299 4.5475 26.4174 4.73503C26.605 4.92257 26.7103 5.17692 26.7103 5.44214Z" fill="#EDEEEF"/>
                      <path d="M14.5702 4.45239V10.8674C14.5702 11.1326 14.4649 11.387 14.2773 11.5745C14.0898 11.762 13.8354 11.8674 13.5702 11.8674H9.09521L14.5702 4.45239Z" fill="#CFD0D1"/>
                      <path d="M20.2601 17.9672H6.6001C6.04781 17.9672 5.6001 18.3753 5.6001 18.8788V23.4555C5.6001 23.959 6.04781 24.3672 6.6001 24.3672H20.2601C20.8124 24.3672 21.2601 23.959 21.2601 23.4555V18.8788C21.2601 18.3753 20.8124 17.9672 20.2601 17.9672Z" fill="#FF3717"/>
                      <path d="M8.7998 22.7671V19.5671H10.1465C10.4364 19.5671 10.6843 19.6129 10.89 19.7043C11.0989 19.7957 11.2594 19.9268 11.3717 20.0974C11.4839 20.2681 11.54 20.4708 11.54 20.7054C11.54 20.9401 11.4839 21.1428 11.3717 21.3134C11.2594 21.4841 11.0989 21.6151 10.89 21.7066C10.6843 21.798 10.4364 21.8437 10.1465 21.8437H9.13648L9.4077 21.5649V22.7671H8.7998ZM9.4077 21.6289L9.13648 21.3409H10.1185C10.3866 21.3409 10.5876 21.286 10.7217 21.1763C10.8588 21.0635 10.9274 20.9066 10.9274 20.7054C10.9274 20.5012 10.8588 20.3443 10.7217 20.2346C10.5876 20.1249 10.3866 20.07 10.1185 20.07H9.13648L9.4077 19.7774V21.6289Z" fill="#EDEEEF"/>
                      <path d="M12.1471 22.7671V19.5671H13.5779C13.9333 19.5671 14.2451 19.6342 14.5132 19.7683C14.7813 19.9024 14.9901 20.0883 15.1398 20.326C15.2894 20.5637 15.3642 20.8441 15.3642 21.1671C15.3642 21.4871 15.2894 21.7675 15.1398 22.0083C14.9901 22.246 14.7813 22.4319 14.5132 22.566C14.2451 22.7001 13.9333 22.7671 13.5779 22.7671H12.1471ZM12.7549 22.2643H13.5499C13.7962 22.2643 14.0081 22.2186 14.1858 22.1271C14.3666 22.0357 14.5054 21.9077 14.602 21.7431C14.7018 21.5786 14.7516 21.3866 14.7516 21.1671C14.7516 20.9447 14.7018 20.7527 14.602 20.5911C14.5054 20.4266 14.3666 20.2986 14.1858 20.2071C14.0081 20.1157 13.7962 20.07 13.5499 20.07H12.7549V22.2643Z" fill="#EDEEEF"/>
                      <path d="M16.5668 21.0391H18.1987V21.542H16.5668V21.0391ZM16.6182 22.7671H16.0103V19.5671H18.3998V20.0654H16.6182V22.7671Z" fill="#EDEEEF"/>
                    </svg>
                  </div>
                  <div className="file-details">
                    <div className="file-name">Claim Form.pdf</div>
                    <div className="file-size">1.6 MB</div>
                  </div>
                </div>
                <button className="remove-file-btn" onClick={handleRemoveFile}>
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <path d="M15 5.36719L5 15.3672" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5 5.36719L15 15.3672" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            <button className="submit-button enabled" onClick={handleSubmit}>
              Submit
            </button>
          </div>
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

export default MyWinsClaimPrizeUploaded;
