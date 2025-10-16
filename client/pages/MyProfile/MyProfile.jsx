import React, { useEffect, useState } from "react";
import './MyProfile.css';
import { useSelector } from "react-redux"; 
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { toast } from "react-toastify";
const MyProfile = () => {
const navigate = useNavigate();
const user = useSelector((state) => state.auth.user.user);
const refreshToken = user?.refreshToken;
const firstName = user?.user_name;
const phone = user?.first_name.match(/\((\d+)\)/);
const phonenumber = phone ? phone[1] : null;
const [loading, setLoading] = useState(false);
const [profileDetails, setProfileDetails] = useState({});
const [aadhaarFront, setAadhaarFront] = useState(null);
const [aadhaarBack, setAadhaarBack] = useState(null);
const [panFront, setPanFront] = useState(null);
const [panBack, setPanBack] = useState(null);
const [selectedImage, setSelectedImage] = useState(null);
const [showModal, setShowModal] = useState(false);
const [deletetext,setDelteText] = useState('');
//console.log(phonenumber);
const displayLetters = firstName ? firstName[0].toUpperCase().repeat(firstName.length > 1 ? 2 : 1) : "";

const handleBack = () => {
  navigate(-1);
};
  const handleCloseModal = () => {
    setShowModal(false);
  };
const handleConfirmtextModal = ()=> {
 if(deletetext === 'Delete'){
  setShowModal(false);
  console.log('Delete Account Confirmed!');
 }else {
  toast.error('To delete account please type "Delete" and confirm Deletion')
 }
}
useEffect(() => {
  fetchAllProfileData();
  console.log("Fetched profile details:", profileDetails);
  
}, []);
const fetchAllProfileData = async () => {
  setLoading(true);
  try {
    const endpoints = [
      { formstep: "getprofile" },
      { formstep: "getbank" },
      { formstep: "getidproff" }
    ];

    const requests = endpoints.map(({ formstep }) =>
      axios.post(
        "https://api.easylotto.in/kyc",
        { refreshToken, formstep },
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            "lang-policies-mode": "max-age=0",
          },
        }
      )
    );

    const responses = await Promise.all(requests);

    const combinedData = responses.reduce((acc, response) => {
      if (response.data && Array.isArray(response.data)) {
        const jsonData = response.data[0]?.json || {};
        return { ...acc, ...jsonData };
      }
      return acc;
    }, {});

    console.log("Combined Profile Details:", combinedData);  // <-- Here!

    setProfileDetails(combinedData);
        // Fetch and set images if IDs are available
    if (combinedData.aadhar_image) {
      const img = await fetchImageById(combinedData.aadhar_image);
      setAadhaarFront(img);
    }
    if (combinedData.aadhar_image2) {
      const img = await fetchImageById(combinedData.aadhar_image2);
      setAadhaarBack(img);
    }
    if (combinedData.pan_image) {
      const img = await fetchImageById(combinedData.pan_image);
      setPanFront(img);
    }
    if (combinedData.bank_image) {
      const img = await fetchImageById(combinedData.bank_image);
      setPanBack(img);
    }

  } catch (error) {
    console.error("Error fetching profile data:", error);
  } finally {
    setLoading(false);
  }
};

  const fetchImageById = async (id) => {
    try {
      const response = await axios.post(
        "https://api.easylotto.in/kyc",
        {
          refreshToken,
          formstep: "getimage",
          id,
        },
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            "lang-policies-mode": "max-age=0",
          },
        }
      );

      const base64Image = response?.data?.[0]?.binary?.data?.data;
      if (base64Image) {
        return `data:image/png;base64,${base64Image}`;
      }
      return null;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    }
  };

  return (
    <>
    <div className='main-container'>
        <div className="back-header" >
            <span className="back-arrow" onClick={handleBack}> <i className="fas fa-arrow-left" style={{ width: '24px', height: '24px', fontSize: '19px' }} ></i> </span>
            <span className="back-text">My Profile</span>
            <span className="edit-icon" onClick={() => navigate("/editprofile")}><i className="fas fa-edit" style={{ fontSize: '18px' }} ></i> </span>
        </div>
        <div className="warning-header">
            <span>To make any changes, you will have to connect with customer care. Please review carefully.</span>
        </div>
        {loading ? (
            <div className="loader-container">
              <div className="spinner"></div>
                <p className="spinner-text">Loading Profile...</p>
            </div>
            ) :  (
            <>
            <div className="Profile-card">
                <div className="profile-avatar">{displayLetters}</div>
                <div className="profile-info">
                    <div className="profile-name">Deepa D</div>
                    <div className="profile-row"> <i className="fas fa-phone"></i> <span>{phonenumber}</span></div>
                    <div className="profile-row"> <i className="fas fa-calendar-alt"></i> <span>{profileDetails.dob}</span></div>
                </div>
            </div>
            <div className="Profile-Details-card">
                <h3 className="kyc-heading">KYC Details</h3>
                <div className="divider"></div>
                <div className="kyc-section">
                    <div className="kyc-header">
                        <div className="kyc-icon"><i className="fa-solid fa-id-card" style={{color:' #270659'}}></i></div>
                            <div className="kyc-texts"><h4 className="kyc-title"><strong>ID Proof</strong></h4>
                        </div>
                    </div>
                    <div className="kyc-block">
                        <div className='kyc-fields'>
                            <div className="kyc-field-row">
                                <label className="kyc-label">Aadhaar No.</label>
                                <div className='kyc-data-value'>{profileDetails.aadhar_no}</div>
                            </div>
                            <div className="kyc-field-row">
                                <label className="kyc-label">Name</label>
                                <div className='kyc-data-value'>{profileDetails.aadhar_name}</div>
                            </div>
                        </div>

                        <div className="image-row">
                              {aadhaarFront ? (
                                    <img className="kyc-image" src={aadhaarFront} alt="Aadhaar Front" onClick={() => setSelectedImage(aadhaarFront)} />
                                ) : (
                                    <div className="image-placeholder">Front Image</div>
                                )}
                              {aadhaarBack ? (
                                    <img className="kyc-image" src={aadhaarBack} alt="Aadhaar Back" onClick={() => setSelectedImage(aadhaarBack)}/>
                                ) : (
                                    <div className="image-placeholder">Back Image</div>
                                )}
                        </div>
                    </div>
                    <div className="kyc-block">
                        <div className='kyc-fields'>
                            <div className="kyc-field-row">
                                <label className="kyc-label">Pan No.</label>
                                <div className='kyc-data-value'>{profileDetails.pan_no}</div>
                            </div>
                            <div className="kyc-field-row">
                                <label className="kyc-label">Name</label>
                                <div className='kyc-data-value'>{profileDetails.pan_name}</div>
                            </div>
                        </div>
                        <div className="image-row">
                              {panFront ? (
                                    <img className="kyc-image" src={panFront} alt="PAN Front" onClick={() => setSelectedImage(panFront)}/>
                                ) : (
                                    <div className="image-placeholder">Front Image</div>
                                )}
                        </div>
                    </div>
                    <div className="kyc-header">
                        <div className="kyc-icon"><i class="fa-solid fa fa-bank" style={{color:' #270659'}}></i></div>
                            <div className="kyc-texts"><h4 className="kyc-title"><strong>Bank Details</strong></h4>
                        </div>
                    </div>
                    <div className="kyc-block">
                        <div className='kyc-fields'>
                            <div className="kyc-field-row">
                                <label className="kyc-label">Bank Name</label>
                                <div className='kyc-data-value'>{profileDetails.bank_name}</div>
                            </div>
                            <div className="kyc-field-row">
                                <label className="kyc-label">IFSC Code</label>
                                <div className='kyc-data-value'>{profileDetails.ifsc}</div>
                            </div>
                        </div>
                        <div className='kyc-fields'>
                            <div className="kyc-field-row">
                                <label className="kyc-label">Name</label>
                                <div className='kyc-data-value'>{profileDetails.b_name}</div>
                            </div>
                            <div className="kyc-field-row">
                                <label className="kyc-label">Account Number</label>
                                <div className='kyc-data-value'>{profileDetails.acc_no}</div>
                            </div>
                        </div>
                        <div className="image-row">
                              {panBack ? (
                                    <img className="kyc-image" src={panBack} alt="Bank Image" onClick={() => setSelectedImage(panBack)}/>
                                ) : (
                                    <div className="image-placeholder">Back Image</div>
                                )}
                        </div>
                    </div>
                </div>
            </div> 
            {/* <button className="delete-account-btn" onClick={() => setShowModal(true)}>Delete Account</button> */}
            <button className="delete-account-btn" onClick={() => navigate("/deleteaccount")}>Delete Account</button>
            <button className="delete-account-btn-empty" disabled>Delete Account</button>
            onClick={() => navigate("/editprofile")}
            </>
        )}
    {selectedImage && (
    <div className="image-popup-overlay" onClick={() => setSelectedImage(null)}>
        <div className="image-popup-content" onClick={(e) => e.stopPropagation()}>
        <img src={selectedImage} alt="Full View" />
        <button className="close-popup" onClick={() => setSelectedImage(null)}>X</button>
        </div>
    </div>
    )}
    </div>
    {showModal && (
    <div className="modal-overlay">
        <div className="modal-content">
            <div className="modal-header">
                <img src="https://api.builder.io/api/v1/image/assets/TEMP/3d489db49fd51d4dc624b447669b77768ef74b86?width=764"
                alt="Gradient Background"className="gradient-background" />
                {/* Success Icon */}
                <div className="success-icon">
                    <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
                      <ellipse cx="56" cy="110" rx="26" ry="6" fill="#000" opacity=".08"/>
                      <rect x="24" y="36" width="64" height="6" rx="3" fill="#B98B12" opacity=".35"/>
                    <g filter="url(#shadow)">
                      <rect x="24" y="38" width="64" height="10" rx="5" fill="url(#lidGrad)" stroke="#E4A100" stroke-width="1.5"/>

                      <rect x="50" y="28" width="24" height="8" rx="4" fill="#F1BE1E" stroke="#E4A100" stroke-width="1.5"/>
                    </g>
                    <g filter="url(#shadow)">
                      <rect x="28" y="48" width="56" height="60" rx="8" fill="url(#binBody)" stroke="#E4A100" stroke-width="1.8"/>

                      <rect x="30" y="52" width="52" height="10" rx="5" fill="#FFF" opacity=".25"/>

                      <rect x="42" y="58" width="6"  height="40" rx="3" fill="url(#slotGrad)"/>
                      <rect x="56" y="58" width="6"  height="40" rx="3" fill="url(#slotGrad)"/>
                      <rect x="70" y="58" width="6"  height="40" rx="3" fill="url(#slotGrad)"/>
                    </g>
                    <g transform="translate(0,-2)">
                      <circle cx="94" cy="40" r="12" fill="#B4232C" stroke="#B4232C" stroke-width="3"/>
                      <g stroke="#FFFFFF" stroke-width="3" stroke-linecap="round">
                        <line x1="88.5" y1="34.5" x2="99.5" y2="45.5"/>
                        <line x1="99.5" y1="34.5" x2="88.5" y2="45.5"/>
                      </g>
                    </g>
                    <defs>
                      <linearGradient id="binBody" x1="0" x2="0" y1="36" y2="116" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stop-color="#FFE991"/>
                        <stop offset="1" stop-color="#FFC52E"/>
                      </linearGradient>
                      <linearGradient id="lidGrad" x1="0" x2="0" y1="26" y2="48" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stop-color="#FFE991"/>
                        <stop offset="1" stop-color="#F5B51E"/>
                      </linearGradient>
                      <linearGradient id="slotGrad" x1="0" x2="0" y1="54" y2="104" gradientUnits="userSpaceOnUse">
                        <stop offset="0" stop-color="#9C7B00" stop-opacity=".85"/>
                        <stop offset="1" stop-color="#5F4B00" stop-opacity=".95"/>
                      </linearGradient>
                      <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#000" flood-opacity=".25"/>
                      </filter>
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
                <div className="delete-modal-text">
                <h2 className="delete-modal-title">Delete Account</h2>
                <div className="form-group">
                  <div className="form-group-text">
                    <p>At any time or for any reason, you can request to delete your account.For your security, we verify all deletion requests. This process takes up to seven days. Your account will remain active while verification is in progress.</p>
                  </div>
                  <input type="text" id="bankName" onChange={(e) => { setDelteText( e.target.value)} }/>
                </div>
            </div>
            <button className="update-kyc-button"  style = {{marginBottom:"10px"}}onClick={() => {handleConfirmtextModal()}}>Confirm</button>
            </div>
        </div>
    </div>
    )};
    </>
  );
};

export default MyProfile;
