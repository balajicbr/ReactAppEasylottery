import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import { useSelector } from "react-redux";
import { jsPDF } from 'jspdf';
import './ClaimPrize.css';
import DownloadClaimPdfForm from '../../comp/DownloadClaimPdfForm/DownLoadClaimPdfForm';
const ClaimPrize = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = useSelector((state) => state.auth.user.user);
  const refreshToken = user?.refreshToken;

  const [isLoading, setIsLoading] = useState(false);
  const { ticket } = location.state || {};

  const [uploadedFile, setUploadedFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [messageTitle, setMessageTitle] = useState('');
  const [message, setMessage] = useState('');
const [buttonmessage, setbuttonmessage] = useState('');
  if (!ticket) {
    return (
      <div className="claim-prize-error">
        <p>No ticket data found. Please go back and select your prize.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

const handleBack = () => {
  window.history.back(); // This will take the user back to the previous page
};

  const handleUploadForm = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.pdf,.doc,.docx';

    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setUploadedFile(file);
      }
    };

    input.click();
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
  };

  const getOrdinalSuffix = (num) => {
    const j = num % 10,
          k = num % 100;
    if (j === 1 && k !== 11) return `${num}st`;
    if (j === 2 && k !== 12) return `${num}nd`;
    if (j === 3 && k !== 13) return `${num}rd`;
    return `${num}th`;
  };

  const getDaysDifferenceFromToday = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(diffDays, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

  if (!uploadedFile) {
    setMessage("Please upload a claim form first.");
    setMessageType('error');
    return;
  }

        const requestData = {
          refreshToken: refreshToken,
          formstep: 'ClaimPrizeDummy',
          id: ticket.id,
          ids: "en"
        };

    setIsLoading(true);
    setMessage('');
    setMessageTitle('');
    try {
      const response = await axios.post(
        'https://api.easylotto.in/reactDummy', // replace with your actual endpoint
        requestData,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            'lang-policies-mode': 'max-age=0',
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data) {
         if(response.status === 200){//claim uploaded 
          setMessageTitle("Claim Form Uploaded");
          setMessage("Your claim form for the prize has been updated");
          setbuttonmessage("Close");
          setShowModal(true);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      // Optionally set some error state here
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleUpdateKYC = () => {
    navigate('/my-profile'); // adjust route to your KYC/profile page
  };

  return (
    <>
   <div className="claim-prize-container">
      <div className="back-header" onClick={handleBack}>
        <span className="back-arrow"><i className="fas fa-arrow-left" style={{ width: '24px', height: '24px', fontSize: '19px' }}></i></span>
        <span className="back-text">My Wins</span>
      </div>
      <div className="ticket-detail-card">
        <img src={ticket.w_image_url} alt={ticket.name} className="ticket-image" />
        <div className="ticket-content">
          <div className="ticket-top-right">
            <p className='mywin-ticket-item'><strong>Prize No:</strong> {getOrdinalSuffix(ticket.prize_number)}</p>
            <p className='mywin-ticket-item'><strong>Prize:</strong> ₹{ticket.prize}</p>
            <p className='mywin-ticket-item'><strong>Tickets:</strong> {ticket.count}</p>
          </div>
          <div className="ticket-top-left">
            <div className="mywin-ticket-number">{ticket.ticket}</div>
            <div className="ticket-number-label">Tickets No.</div>
          </div>
          <div className="ticket-bottom">
            <div className="congratulations-text">
              Congratulations! You are the lucky winner
            </div>
          </div>
        </div>
      </div>
      <div className="mywin-main-content">
        <div className="mywin-main-content-inner">
          <div className="prize-details-card">
             <div className="details-grid">
              <div className="detail-item">
                <div className="detail-label">Ticket</div>
                <div className="detail-value">{ticket.ticket}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Prize</div>
                <div className="detail-value">₹ {ticket.prize}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Claim Expiry</div>
                <div className="detail-value">{ticket.duedate}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Time Left</div>
                <div className="detail-value">{getDaysDifferenceFromToday(ticket.duedate)} days</div>
              </div>
             </div>
          </div>
         
          {/* Claim Form Section */}
          <div className="claim-form-section">
            <div className="form-content">
              <div className="form-header">
                <h2 className="form-title">Claim Prize</h2>
                <p className="form-description">
                  To claim the prize please download the PDF format & upload it
                </p>
              </div>
              <div className='claim-inprogress' style={{backgroundColor:"#FFF1D1"}}>
              <svg width="35" height="35" viewBox="0 0 24 24" fill="none" stroke="#270659" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="14" r="8" />
                <line x1="12" y1="10" x2="12" y2="14" />
                <line x1="9" y1="7" x2="15" y2="7" />
                <line x1="10" y1="2" x2="14" y2="2" />
              </svg>
                <div className="status-message">
                  Your claim request is in process. The claim request reference number is <strong>TRA-1410eaa1</strong>
                </div>
              </div>

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
                <DownloadClaimPdfForm schemeid ={ticket.scheme_id} />
                <button
                  className={`action-button upload-btn ${uploadedFile ? 'disabled' : ''}`}
                  onClick={handleUploadForm}
                  disabled={!!uploadedFile}
                >
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <path d="M10 2.86719V12.8672" stroke="#AD1E24" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14.1668 7.03385L10.0002 2.86719L5.8335 7.03385" stroke="#AD1E24" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M17.5 12.8672V16.2005C17.5 16.6425 17.3244 17.0665 17.0118 17.379C16.6993 17.6916 16.2754 17.8672 15.8333 17.8672H4.16667C3.72464 17.8672 3.30072 17.6916 2.98816 17.379C2.67559 17.0665 2.5 16.6425 2.5 16.2005V12.8672" stroke="#AD1E24" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Upload Claim Form
                </button>
              </div>

              {uploadedFile ? (
                <div className="uploaded-file-display">
                  <div className="file-info">
                    <div className="pdf-icon">
                      {/* Optionally an icon */}
                    </div>
                    <div className="file-details">
                      <div className="file-name">{uploadedFile.name}</div>
                      <div className="file-size">
                        {((uploadedFile.size / (1024 * 1024)).toFixed(1))} MB
                      </div>
                    </div>
                  </div>
                  <button className="remove-file-btn" onClick={handleRemoveFile}>
                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                      <path d="M15 5.36719L5 15.3672" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5 5.36719L15 15.3672" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div className="upload-status">No document uploaded</div>
              )}
            </div>

            <button
              className={`submit-button ${uploadedFile ? 'enabled' : 'disabled'}`}
              onClick={handleSubmit}
              disabled={!uploadedFile || isLoading}
            >
              {isLoading ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>    
   </div>
    {/* Modal */}
          {showModal && (
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
                  <div className="modal-text">
                    <h2 className="modal-title">{messageTitle}</h2>
                    <p className="modal-description">{message}</p>
                  </div>
                  <button className="update-kyc-button" onClick={handleCloseModal}>
                    {buttonmessage}
                  </button>
                </div>
              </div>
            </div>
          )}
          </>
  );
};

export default ClaimPrize;
