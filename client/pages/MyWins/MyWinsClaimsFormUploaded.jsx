import React , { useEffect, useState } from 'react';
import { useNavigate,useLocation } from 'react-router-dom';
import './MyWinsClaimsFormUploaded.css';
import axios from "axios";
import { useSelector } from "react-redux";

const MyWinsClaimsFormUploaded = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user.user);
  const refreshToken = user?.refreshToken;
  const [isLoading, setIsLoading] = useState(false);
  const { ticket } = location.state || {};
  const [allTicket, setAllTickets] = useState([]);
  console.log("on load ticket:",ticket.id);
  const handleBack = () => {
    navigate(-1);
  };

  const handleClose = () => {
    // Navigate back to the claim prize page or close modal
    navigate('/my-wins-claim-prize-uploaded');
  };

  const handleUpdateKYC = () => {
    console.log('Update KYC clicked');
     navigate('/my-wins-claim-prize-uploaded');
    // Handle KYC update logic - could navigate to KYC page
    // navigate('/update-kyc');
  };

  const handleDownloadTemplate = () => {
    console.log('Download template clicked');
  };

  const handleRemoveFile = () => {
    navigate('/claim-prize');
  };

  const handleSubmit = () => {
    console.log('Submit claim form');
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
    <div className="claims-form-uploaded-container">
      {/* Background page content (blurred) */}
      <div className="background-page">

        <div className="page-wrapper">
          <div className="header">
            <div className="header-content">
              <button className="back-button" onClick={handleBack}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M12 19L5 12L12 5" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19 12H5" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <h1 className="header-title">Claim Prize</h1>
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
            </svg>
            <div className="congratulations-text">
              Congratulations! You are the lucky winner
            </div>
            <svg className="confetti-right" width="39" height="46" viewBox="0 0 39 46" fill="none">
              <path d="M18.0802 41.7304C22.4598 41.7304 26.0101 41.531 26.0101 41.2851C26.0101 41.0392 22.4598 40.8398 18.0802 40.8398C13.7007 40.8398 10.1504 41.0392 10.1504 41.2851C10.1504 41.531 13.7007 41.7304 18.0802 41.7304Z" fill="#010529"/>
            </svg>
          </div>
        </div>

        {/* Background content - blurred claim form */}
        <div className="background-content">
          <div className="prize-details-card">
            <div className="details-grid">
              <div className="detail-item">
                <div className="detail-label">Ticket</div>
                <div className="detail-value">{allTicket.ticket}</div>
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

          <div className="claim-form-section">
            <div className="uploaded-file-display">
              <div className="file-info">
                <div className="pdf-icon">
                  <svg width="32" height="33" viewBox="0 0 32 33" fill="none">
                    <rect width="32" height="33" fill="#FF3717"/>
                    <text x="16" y="20" textAnchor="middle" fill="white" fontSize="8">PDF</text>
                  </svg>
                </div>
                <div className="file-details">
                  <div className="file-name">Claim Form.pdf</div>
                  <div className="file-size">1.6 MB</div>
                </div>
              </div>
              <button className="remove-file-btn">
                <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                  <path d="M15 5.36719L5 15.3672" stroke="#270659" strokeWidth="1.5"/>
                  <path d="M5 5.36719L15 15.3672" stroke="#270659" strokeWidth="1.5"/>
                </svg>
              </button>
            </div>

            <button className="submit-button">Submit</button>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      <div className="modal-overlay">
        <div className="modal-content">
          {/* Gradient background with icon */}
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

            {/* Close button */}
            <button className="close-button" onClick={handleClose}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5L15 15" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Modal body */}
          <div className="modal-body">
            <div className="modal-text">
              <h2 className="modal-title">Claim Form Uploaded</h2>
              <p className="modal-description">Your claim form for the prize has been updated</p>
            </div>

            <button className="update-kyc-button" onClick={handleUpdateKYC}>
              Update KYC
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyWinsClaimsFormUploaded;
