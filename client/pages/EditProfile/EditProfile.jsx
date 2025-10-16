import React, { useEffect, useState } from "react";
import './EditProfile.css';
import { useSelector } from "react-redux"; 
import { useNavigate } from 'react-router-dom';
import axios from "axios";
const EditProfile = () => {
const navigate = useNavigate();
const user = useSelector((state) => state.auth.user.user);
const refreshToken = user?.refreshToken;
const firstName = user?.user_name;
const [loading, setLoading] = useState(false);
const [profileDetails, setProfileDetails] = useState({});
const [aadhaarFront, setAadhaarFront] = useState(null);
const [aadhaarBack, setAadhaarBack] = useState(null);
const [panFront, setPanFront] = useState(null);
const [panBack, setPanBack] = useState(null);
const [selectedImage, setSelectedImage] = useState(null);
const [activeTab, setActiveTab] = useState("personal");
const [idType, setIdType] = useState("aadhar");
const [aadharNo, setAadharNo] = useState(profileDetails?.aadhar_no || "");
const [aadharName, setAadharName] = useState(profileDetails?.aadhar_name || "");
const [panNo, setPanNo] = useState(profileDetails?.pan_no || "");
const [panName, setPanName] = useState(profileDetails?.pan_name || "");
const [aadharFrontFile, setAadharFrontFile] = useState(null);
const [aadharBackFile, setAadharBackFile] = useState(null);
const [panFrontFile, setPanFrontFile] = useState(null);
const [bankFrontFile, setbankFrontFile] = useState(null);
const [showModal, setShowModal] = useState(false);

const handleAadharImageUpload = (e, side,type) => {
  const file = e.target.files[0];
  if(type ==='pan'){
    setPanFrontFile(file);
  }
  if(type ==='aadhar'){
  if (side === 'front') {
    setAadharFrontFile(file);
  } else {
    setAadharBackFile(file);
  }
}
  if(type ==='bank'){
    setbankFrontFile(file);
  }
  console.log(`${type} ${side} image selected:`, file);
};
  const handleCloseModal = () => {
    setShowModal(false);
  };
//console.log(phonenumber);
const displayLetters = firstName ? firstName[0].toUpperCase().repeat(firstName.length > 1 ? 2 : 1) : "";

const handleBack = () => {
  window.history.back(); // This will take the user back to the previous page
};
useEffect(() => {
  fetchAllProfileData();
}, []);
useEffect(() => {
  if (profileDetails?.aadhar_no) {
    const clean = profileDetails.aadhar_no.replace(/\D/g, "").slice(0, 12);
    const formatted = clean.replace(/(\d{4})(?=\d)/g, "$1-");
    setAadharNo(formatted);
  }
    if (profileDetails?.pan_no) {
    const clean = profileDetails.pan_no;
    const formatted = clean.replace(/(\d{4})(?=\d)/g, "$1-");
    setPanNo(formatted);
  }

  if (profileDetails?.aadhar_name) {
    setAadharName(profileDetails.aadhar_name);
  }
  
  if (profileDetails?.pan_name) {
    setPanName(profileDetails.pan_name);
  }

}, [profileDetails]);

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
  const handleIdTypeChange = (e) => {
  const value = e.target.value;
  setIdType(value);
  //console.log("Selected ID Type:", value);
};
const handleAadharChange = (e) => {
  let value = e.target.value;

  // Remove all non-digit characters
  value = value.replace(/\D/g, "");

  // Limit to 12 digits
  value = value.slice(0, 12);

  // Insert dashes every 4 digits
  const formatted = value.replace(/(\d{4})(?=\d)/g, "$1-");

  setAadharNo(formatted);
 setProfileDetails(prev => ({ ...prev, aadhar_no: e.target.value }));
};

  return (
    <>
    <div className='main-container'>
        <div className="back-header">
            <span className="back-arrow" onClick={handleBack}>
            <i className="fas fa-arrow-left" style={{ width: '24px', height: '24px', fontSize: '19px' }}></i>
            </span>
            <span className="back-text">Edit Details</span>
        </div>
        <div className="warning-header">
            <span>To make any changes, you will have to connect with customer care. Please review carefully.</span>
        </div>
        <div className="tabs-container1">
            <div className="tabs">
                <button className={`tab-button1 ${activeTab === "personal" ? "active" : ""}`} onClick={() => setActiveTab("personal")}>Personal Info</button>
                <button className={`tab-button1 ${activeTab === "idproof" ? "active" : ""}`} onClick={() => setActiveTab("idproof")}>ID Proof</button>
                <button className={`tab-button1 ${activeTab === "bank" ? "active" : ""}`} onClick={() => setActiveTab("bank")}>Bank Details</button>
            </div>
        </div>
        {loading ? (
            <div className="loader-container">
              <div className="spinner"></div>
                <p>Loading tickets...</p>
            </div>
            ) :  (
            <>
            <div className='main'>
                <div className="tab-content">
                    {activeTab === "personal" && (
                    <div>
                        <div className="tab-section">
                            <h3 className="tab-header"><strong>Personal Info</strong></h3>
                            <div className="form-group">
                             <label htmlFor="firstName">First Name</label>
                             <input type="text" id="firstName" value={profileDetails.f_name || ""} onChange={(e) => setProfileDetails((prev) => ({ ...prev, f_name: e.target.value }))}/>
                            </div>
                            <div className="form-group">
                             <label htmlFor="lastName">Last Name</label>
                             <input type="text" id="lastName" value={profileDetails.l_name || ""} onChange={(e) => setProfileDetails((prev) => ({ ...prev, l_name: e.target.value }))}/>
                            </div> 
                             <div className="form-group">
                             <label htmlFor="dob">Date of Birth</label>
                             <input type="date" id="dob" value={profileDetails.dob ?profileDetails.dob.split(" ")[0] : "" } onChange={(e) => setProfileDetails((prev) => ({ ...prev, dob: e.target.value })) } />
                            </div> 
                            <button className="save-btn" onClick={() => {console.log({profileDetails }); setActiveTab("idproof");}}>Save</button> 
                        </div>
                    </div>
                    )}
                    {activeTab === "idproof" && (
                    <div>
                        <div className="tab-section">
                            <h3 className="tab-header"><strong>Please Choose one of the Methos to buy a tickets</strong></h3>
                            <div className="radio-group">
                            <label className="radio-label" style={{ alignItems: "center", marginRight: "20px" }}>
                             <input type="radio" checked= {idType === "aadhar"} name="idType" onChange={handleIdTypeChange} className="id-radio" value="aadhar" style={{ marginRight: "8px" }}/>
                                Aadhar Card
                            </label>
                            <label  className="radio-label" style={{  alignItems: "center" }}>
                            <input type="radio" checked={idType === "pan"} name="idType" onChange={handleIdTypeChange} className="id-radio" value="pan" style={{ marginRight: "8px" }} />
                                Pan Card
                            </label>
                            </div>
                            {idType === "aadhar" &&(
                            <>
                                <div className="form-group">
                                <label htmlFor="firstName">Aadhar No.</label>
                                <input type="text" id="aadharNo" value={aadharNo}  placeholder="XXXX-XXXX-XXXX" maxLength={14} onChange={handleAadharChange}/>
                                </div>
                                <div className="form-group">
                                <label htmlFor="lastName">Name.</label>
                                <input type="text"  id="aadharName" value={aadharName} onChange={(e) => setProfileDetails(prev => ({ ...prev, aadhar_name: e.target.value }))}/>
                                </div> 
                                {/* Aadhaar Front Image */}
                                <div className="form-group">
                                <label>Front Image</label>
                                {aadhaarFront ? (
                                    <div className="image-row">
                                    <img className="kyc-image-edit" src={aadhaarFront} alt="Aadhaar Front" onClick={() => setSelectedImage(aadhaarFront)} />
                                    <i className="fas fa-trash " style={{ fontSize: '18px', margin:"7px" ,fontSize: '20px',color:'#AD1E24'}} onClick={() => setAadhaarFront('')}></i>
                                    </div>
                                ) : (
                                <div className="image-upload-box">
                                    <p className="upload-title">Choose an Image</p>
                                    <p className="upload-subtitle">JPEG, PNG formats, upto 50 MB</p>
                                    <label className="upload-button">
                                    Browse Images
                                    <input type="file" accept="image/png, image/jpeg" style={{ display: 'none' }} onChange={(e) => handleAadharImageUpload(e, 'front','aadhar')} />
                                    </label>
                                </div>
                                )}

                                </div>

                                {/* Aadhaar Back Image */}
                                {aadhaarBack ? (
                                    <div className="image-row">
                                    <img className="kyc-image-edit" src={aadhaarBack} alt="Aadhaar Front" onClick={() => setSelectedImage(aadhaarBack)} />
                                    <i className="fas fa-trash " style={{ fontSize: '18px', margin:"7px" ,fontSize: '20px',color:'#AD1E24'}} onClick={() => setAadhaarBack('')}></i>
                                    </div>
                                ) : (
                                <div className="image-upload-box">
                                    <p className="upload-title">Choose an Image</p>
                                    <p className="upload-subtitle">JPEG, PNG formats, upto 50 MB</p>
                                    <label className="upload-button">
                                    Browse Images
                                    <input type="file" accept="image/png, image/jpeg" style={{ display: 'none' }} onChange={(e) => handleAadharImageUpload(e, 'back','aadhar')} />
                                    </label>
                                </div>
                                )}
                                                                                                                     
                            </>
                            )}
                            {idType === "pan" &&(
                            <>
                                <div className="form-group">
                                <label htmlFor="panNo">Pan No.</label>
                                <input type="text" id="panNo" value={panNo}  placeholder="XXXX-XXXX-XXXX" maxLength={14} onChange={(e) => setProfileDetails(prev => ({ ...prev, pan_no: e.target.value }))}/>
                                </div>
                                <div className="form-group">
                                <label htmlFor="lastName">Name.</label>
                                <input type="text"  id="panName" value={panName} onChange={(e) => setProfileDetails(prev => ({ ...prev, pan_name: e.target.value }))}/>
                                </div> 
                                {/* Pan Front Image */}
                                <div className="form-group">
                                <label>Front Image</label>
                                {panFront ? (
                                    <div className="image-row">
                                    <img className="kyc-image-edit" src={panFront} alt="Aadhaar Front" onClick={() => setSelectedImage(panFront)} />
                                    <i className="fas fa-trash " style={{ fontSize: '18px', margin:"7px" ,fontSize: '20px',color:'#AD1E24'}} onClick={() => setPanFront('')}></i>
                                    </div>
                                ) : (
                                <div className="image-upload-box">
                                    <p className="upload-title">Choose an Image</p>
                                    <p className="upload-subtitle">JPEG, PNG formats, upto 50 MB</p>
                                    <label className="upload-button">
                                    Browse Images
                                    <input type="file" accept="image/png, image/jpeg" style={{ display: 'none' }} onChange={(e) => handleAadharImageUpload(e, 'front','pan')} />
                                    </label>
                                </div>
                                )}
                                </div>
                            </>
                            )} 
                            <button className="save-btn" onClick={() => {console.log({ profileDetails,aadharFrontFile,aadharBackFile,panFront });setActiveTab("bank");}}>Save</button>     
                        </div>
                    </div>
                    )}
                    {activeTab === "bank" && (
                     <div>
                        <div className="tab-section">
                            <h3 className="tab-header"><strong>Bank Details</strong></h3>
                            <div className="form-group">
                             <label htmlFor="bankName">Bank Name</label>
                             <input type="text" id="bankName" value={profileDetails.bank_name || ""}  onChange={(e) => setProfileDetails(prev => ({ ...prev, bank_name: e.target.value }))}/>
                            </div>
                            <div className="form-group">
                             <label htmlFor="ifsc">IFSC Code</label>
                             <input type="text" id="ifsc" value={profileDetails.ifsc || ""} onChange={(e) => setProfileDetails(prev => ({ ...prev, ifsc: e.target.value }))} />
                            </div> 
                            <div className="form-group">
                             <label htmlFor="name">Name</label>
                             <input type="text" id="name" value={profileDetails.b_name || ""} onChange={(e) => setProfileDetails(prev => ({ ...prev, b_name: e.target.value }))}/>
                            </div>
                            <div className="form-group">
                             <label htmlFor="accno">Account Number</label>
                             <input type="text" id="accno" value={profileDetails.acc_no || ""} onChange={(e) => setProfileDetails(prev => ({ ...prev, acc_no: e.target.value }))}/>
                            </div>
                            <div className="form-group">
                             <label htmlFor="re-accno">Re-Enter Account Number</label>
                             <input type="text" id="re-accno" value={profileDetails.acc_no || ""} onChange={(e) => setProfileDetails(prev => ({ ...prev, acc_no: e.target.value }))}/>
                            </div>
                            <div className="form-group">
                                <label>Bank Image</label>
                                {panBack ? (
                                    <div className="image-row">
                                    <img className="kyc-image-edit" src={panBack} alt="Aadhaar Front" onClick={() => setSelectedImage(panBack)} />
                                    <i className="fas fa-trash " style={{ fontSize: '18px', margin:"7px" ,fontSize: '20px',color:'#AD1E24'}} onClick={() => setPanBack('')}></i>
                                    </div>
                                ) : (
                                <div className="image-upload-box">
                                    <p className="upload-title">Choose an Image</p>
                                    <p className="upload-subtitle">JPEG, PNG formats, upto 50 MB</p>
                                    <label className="upload-button">
                                    Browse Images
                                    <input type="file" accept="image/png, image/jpeg" style={{ display: 'none' }} onChange={(e) => handleAadharImageUpload(e, 'front','bank')} />
                                    </label>
                                </div>
                                )} 
                            </div>
                            <button className="save-btn" onClick={() => {console.log({ profileDetails,aadharFrontFile,aadharBackFile,panFront,panBack,panFrontFile,bankFrontFile });setShowModal(true);}}>Submit</button> 
                        </div>
                    </div>
                    )}
                </div>
            </div>
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
                <h2 className="modal-title">Submit KYC Details</h2>
                <p className="modal-description">Are you sure you want to submit your KYC Details.To make any changes you will have to connect with customer care. Please  review carefully</p>
            </div>
            <button className="update-kyc-button" onClick={() => {handleCloseModal();}}> Submit </button>
            </div>
        </div>
    </div>
    )};
    </>
  );
};

export default EditProfile;
