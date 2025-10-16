import React from 'react';
import { useNavigate } from 'react-router-dom';
import './MyWinsClaimPrizeUploadFailed.css';

const MyWinsClaimPrizeUploadFailed = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleDownloadTemplate = () => {
    console.log('Download template clicked');
    // Handle template download logic
  };

  const handleUploadForm = () => {
    console.log('Upload form clicked');
    // Handle file upload logic
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Navigate to uploaded state or handle success
        navigate('/my-wins-claim-prize-uploaded');
      }
    };
    input.click();
  };

  const handleSubmit = () => {
    console.log('Submit claim form');
    // Handle form submission - currently disabled since no document uploaded
  };

  return (
    <div className="claim-prize-upload-failed-container">
      {/* Background blur effect */}
      <div className="background-blur"></div>

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
            src="https://api.builder.io/api/v1/image/assets/TEMP/1897d09b7856af8a7aca841b5da6433bfbfe33d1?width=471"
            alt="Celebration blur"
            className="celebration-blur"
          />
          <img 
            src="https://api.builder.io/api/v1/image/assets/TEMP/e19aea129c323b3626ae9cc8ca6cf7ab60b9561f?width=760"
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

              {/* Error Notification */}
              <div className="error-notification">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4.10742 4.10754L15.8916 15.8925" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9.99984 18.3333C14.6022 18.3333 18.3332 14.6023 18.3332 9.99996C18.3332 5.39759 14.6022 1.66663 9.99984 1.66663C5.39746 1.66663 1.6665 5.39759 1.6665 9.99996C1.6665 14.6023 5.39746 18.3333 9.99984 18.3333Z" stroke="#270659" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div className="error-message">
                  The claim form is rejected. Please re-upload the claim form
                </div>
              </div>

              <div className="form-actions">
                <button className="action-button download-btn" onClick={handleDownloadTemplate}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 12.5V2.5" stroke="#AD1E24" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="#AD1E24" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M5.8335 8.33337L10.0002 12.5L14.1668 8.33337" stroke="#AD1E24" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Download Template
                </button>

                <button className="action-button upload-btn" onClick={handleUploadForm}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 2.5V12.5" stroke="#AD1E24" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M14.1668 6.66667L10.0002 2.5L5.8335 6.66667" stroke="#AD1E24" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5" stroke="#AD1E24" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Upload Claim Form
                </button>
              </div>

              <div className="upload-status">
                No document uploaded
              </div>
            </div>

            <button 
              className="submit-button disabled"
              onClick={handleSubmit}
              disabled={true}
            >
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

export default MyWinsClaimPrizeUploadFailed;
