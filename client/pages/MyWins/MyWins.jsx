import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './MyWins.css';
import axios from "axios";
import { useSelector } from "react-redux";
import AlertPopup from "../../comp/AlertPopup/AlertPopup";
// import UpdateKycModal from '../components/UpdateKycModal';

const MyWins = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user.user);
  const refreshToken = user?.refreshToken;
  const [activeTab, setActiveTab] = useState('Active');
  const [allTickets, setAllTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [bottomSheetType, setbottomSheetType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [appliedSortBy, setAppliedSortBy] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
    const [uploadedFile, setUploadedFile] = useState(null);
    const [showModal, setShowModal] = useState(false);
  
    const [messageTitle, setMessageTitle] = useState('');
    const [message, setMessage] = useState('');
    const [buttonmessage, setbuttonmessage] = useState('');


  const formatDate = (dateStr) => dateStr ? `${dateStr} 00:00:00.000` : "0";
  const handleBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    fetchTickets();
  }, [activeTab]);

  const handleTabChange = (tab) => { 
    setActiveTab(tab);
    //console.log("activetab:",activeTab);
  };
const sortTickets = (tickets, sortBy) => {
  if (!sortBy) return tickets;

  const sorted = [...tickets];

  sorted.sort((a, b) => {
    const getValue = (t) => {
      switch (sortBy) {
        case "Cost": return t.json?.prize || 0;
        case "Draw Date": return new Date(t.json?.draw);
        case "Prize": return t.json?.prize_number || 0;
        default: return 0;
      }
    };

    const valA = getValue(a);
    const valB = getValue(b);

    if (sortOrder === "asc") {
      return valA > valB ? 1 : valA < valB ? -1 : 0;
    } else {
      return valA < valB ? 1 : valA > valB ? -1 : 0;
    }
  });

  return sorted;
};
const CheckKycStatus = async(ticket) => {
    try {
        const requestData = {
          refreshToken: refreshToken,
          formstep: 'ClaimPrizeDummy',
          id: ticket.id,
          ids: "en"
        };

    
      const response = await axios.post(
        "https://api.easylotto.in/reactDummy",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            "lang-policies-mode": "max-age=0",
          },
        },
      );


 if (response.data) {
         if(response.status === 210){// profile not updated
          setMessageTitle("Update profile details to claim prize");
          setMessage("To Intiate adding credit you will need to update your profile details");
          setbuttonmessage("Update Profile");
          setShowModal(true);
        }else if(response.status === 220){ //id proof
          setMessageTitle("Update KYC to claim prize");
          setMessage("To Intiate adding credit you will need to update your KYC");
          setbuttonmessage("Update KYC");
          setShowModal(true);
        }else if(response.status === 230){ //Bank details not updated
          setMessageTitle("Update bank details to claim prize");
          setMessage("To Intiate adding credit you will need to update your Bank Details");
          setbuttonmessage("Update bank details");
          setShowModal(true);
        }else if(response.status === 250){ //Claim expired
          setMessageTitle("Claim Expired");
          setbuttonmessage("Close");
          setShowModal(true);
        }else if(response.status === 350){ //Claimed already
          setMessageTitle("Claim Already Settled");
          setMessage("Claim Claim Already Settled!");
          setbuttonmessage("Close");
          setShowModal(true);
        } else {
          navigate("/claimprize", {state: {ticket: ticket}});
        }
      }

    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setIsLoading(false);
    }
  };
const fetchTickets = async (fromDate = "", toDate = "") => {
  setIsLoading(true);
 const formstep = activeTab === "Active" ? "claimTickets" : "expiredTickets";
    try {
      const requestData = {
        refreshToken: refreshToken,
        formstep: formstep,
        id: fromDate && toDate ? "true" : "false",
        ids: "en",
        startdate:  fromDate ? formatDate(fromDate) : "0",
        enddate: toDate ? formatDate(toDate) : "0",
        sort: "",
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
const filteredTickets = searchTerm.trim()
  ? allTickets.filter(ticket => {
      const t = ticket.json;
      const term = searchTerm.toLowerCase();
      return (
        t?.name?.toLowerCase().includes(term) ||
        t?.ticket?.toString().toLowerCase().includes(term) ||
        t?.prize?.toString().toLowerCase().includes(term) ||
        t?.count?.toString().toLowerCase().includes(term) ||
        t?.draw?.toString().toLowerCase().includes(term)
      );
    })
  : allTickets;
const sortedTickets = sortTickets(filteredTickets, appliedSortBy);
const getOrdinalSuffix = (num) => {
  const j = num % 10,
        k = num % 100;
  if (j === 1 && k !== 11) return `${num}st`;
  if (j === 2 && k !== 12) return `${num}nd`;
  if (j === 3 && k !== 13) return `${num}rd`;
  return `${num}th`;
};
  const openBottomsheet = async (type) => {
    setIsBottomSheetOpen(true);
    setbottomSheetType(type);
    //console.log('TicketDetails: ',ticketsDetails);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };
    const handleUpdateKYC = () => {
    navigate('/my-profile'); // adjust route to your KYC/profile page
  };
  //console.log("filteredTickets: ",filteredTickets);
  return (
    <>
    <div className="my-wins-container">
      {/* Amount Won Card */}
      <div className="amount-won-card">
        <div className="amount-card-background">
          <svg className="pattern-svg" width="380" height="105" viewBox="0 0 380 105" fill="none">
            <path d="M20.132 1.61307C29.3697 -20.6887 42.9096 -40.9526 59.9787 -58.0216C77.0477 -75.0907 97.3116 -88.6305 119.613 -97.8682L189.957 71.957L20.132 1.61307Z" fill="#6522C6"/>
            <path d="M20.132 1.61307C29.3697 -20.6887 42.9096 -40.9526 59.9787 -58.0216C77.0477 -75.0907 97.3116 -88.6305 119.613 -97.8682L189.957 71.957L20.132 1.61307Z" fill="white" style={{mixBlendMode: 'color-burn'}}/>
            <path d="M20.2101 142.379C29.4478 164.681 42.9877 184.945 60.0568 202.014C77.1258 219.083 97.3897 232.623 119.692 241.86L190.035 72.0352L20.2101 142.379Z" fill="#6522C6"/>
            <path d="M20.2101 142.379C29.4478 164.681 42.9877 184.945 60.0568 202.014C77.1258 219.083 97.3897 232.623 119.692 241.86L190.035 72.0352L20.2101 142.379Z" fill="white" style={{mixBlendMode: 'color-burn'}}/>
            <path d="M260.301 241.782C282.603 232.544 302.867 219.004 319.936 201.935C337.005 184.866 350.545 164.602 359.782 142.301L189.957 71.9569L260.301 241.782Z" fill="#6522C6"/>
            <path d="M260.301 241.782C282.603 232.544 302.867 219.004 319.936 201.935C337.005 184.866 350.545 164.602 359.782 142.301L189.957 71.9569L260.301 241.782Z" fill="white" style={{mixBlendMode: 'color-burn'}}/>
            <path d="M260.301 -97.868C282.603 -88.6303 302.867 -75.0904 319.936 -58.0213C337.005 -40.9523 350.545 -20.6884 359.782 1.61339L189.957 71.9572L260.301 -97.868Z" fill="#6522C6"/>
            <path d="M260.301 -97.868C282.603 -88.6303 302.867 -75.0904 319.936 -58.0213C337.005 -40.9523 350.545 -20.6884 359.782 1.61339L189.957 71.9572L260.301 -97.868Z" fill="white" style={{mixBlendMode: 'color-burn'}}/>
          </svg>
        </div>
        <div className="amount-content">
          <div className="amount-label">Amount Won</div>
          <div className="amount-value"> ₹{Number(allTickets[0]?.json?.prize || 0).toLocaleString('en-IN')} </div>

        </div>
        <img src="https://api.builder.io/api/v1/image/assets/TEMP/3de5387c05e303b8907f19c55759244719cddb80?width=758" alt="Coins blur" className="coins-blur" />
        <img src="https://api.builder.io/api/v1/image/assets/TEMP/f490255d073a77f7c549fe9c28991fda348807cb?width=176" alt="Coins" className="coins-image" />
      </div>

      {/* Main Content */}
      <div className="main-container">
        <div className="mywins-tab-navigation">
          <button  className={`tab-button ${activeTab === 'Active' ? 'active' : ''}`}onClick={() => handleTabChange('Active')}>
            Active 
          </button>
          <button className={`tab-button ${activeTab === 'Past' ? 'active' : ''}`} onClick={() => handleTabChange('Past')}>
            Past 
          </button>
        </div>
        <div className="tab-details-content-container">
            <>
            <div className="mywins-search-bar-container">
            <div className="search-filter-wrapper">
              <input type="text" className="search-input" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/>
              <button className="filter-btn" onClick={() => openBottomsheet("Filter")}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6A538D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" >
                      <line x1="3" y1="4" x2="21" y2="4" />
                      <line x1="6" y1="12" x2="18" y2="12" />
                      <line x1="10" y1="20" x2="14" y2="20" />
                </svg>
              </button>
            </div>
          </div>
          <div className="mywins-tickets-list">
              {isLoading ? (
                  <div className="loader-container">
                    <div className="spinner"></div>
                    <p className="spinner-text">Loading tickets...</p>
                  </div>
                ) :sortedTickets.length > 0 ? (
              sortedTickets.map((ticket, index) => {
                const t = ticket.json;
                return (
                  <div key={index} className="ticket-detail-card" onClick={() => {
                  if(t.r_status===null){
                    setShowAlert(true);
                  }else{
                    CheckKycStatus(t);
                  }
                          // if (t.r_status != "Completed") {
                          //   if(t.r_status === "Intiated" || t.r_status != "In-Progres"){
                          //     setShowAlert(true);
                          //   }
                          // } else if (t.r_status === "Pre-initiated"|| t.r_status === "Re-upload"){
                          //   navigate("/mywins-claim-form-uploaded", {state: {ticekt: t}});
                          // } else{
                            
                          // }
                         // CheckKycStatus(t);
                          // navigate("/claimprize", {state: {ticket: t}});

                      }}>
                    {/* Optional banner image */}
                    <img src={t.w_image_url} alt={t.name} className="ticket-image" />
                    <div className="ticket-content">

                      {/* Top Right Fields */}
                      <div className="ticket-top-right">
                        <p className='mywin-ticket-item'><strong>Prize No:</strong> {getOrdinalSuffix(t.prize_number)}</p>
                        <p className='mywin-ticket-item'><strong>Prize:</strong> ₹{t.prize}</p>
                        <p className='mywin-ticket-item'><strong>Tickets:</strong> {t.count}</p>
                      </div>
                      {/* Middle Left - Ticket Number Block */}
                       <div className="ticket-top-left">
                          <div className="mywin-ticket-number">{t.ticket}</div>
                          <div className="ticket-number-label">Tickets No.</div>
                      </div>
                      {/* Bottom Info */}
                    <div className="ticket-bottom">
                      <span className="draw-date-label">Draw Date: <strong style={{paddingLeft:"10px"}}>{t.draw}</strong></span>
                      {/* <span className={`status-badge ${t.r_status.toLowerCase()}`}>{t.r_status}</span> */}
                      <span className={`status-badge ${(t.r_status || 'Expired').toLowerCase()}`}>
                        {t.r_status || 'Expired'}
                      </span>
                    </div>
                    </div>
                    {showAlert && (
                      <AlertPopup
                        message= {t.r_status === "Initiated"
                              ? "The Claim Process has been initiated"
                              :  t.r_status === "In-Progress"? "The claim process has been in progress."  : "The Claim has been Expired"}
                        onClose={() => {
                          //console.log("Close clicked");
                          setShowAlert(false);
                        }}
                      />
                    )}
                  </div>
                );
              })
            ) : (
              <p>No claims are available.</p>
            )}
          </div>

        </>

          
        </div>
      </div>
            {isBottomSheetOpen && (
              <div
                className="bottom-sheet-overlay"
                onClick={() => setIsBottomSheetOpen(false)}
              >
                <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
                  <div className="bottom-sheet-header">
                    <h3>Filter Options </h3>
                  </div>
                    <>
                      <div className="bottom-sheet-content">
                        {/* Example filter fields */}
                        <label>
                          From:
                          <input className= "mywin-date-input" 
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                          />
                        </label>
                        <label>
                          To:
                          <input className= "mywin-date-input"
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                          />
                        </label>
                        <label>
                            Sort by:
                            <div className='sort-options' style={{display:"flex",flexDirection:"row",width:"100%",gap:"10px", margin:"10px"}}>
                              {["Cost", "Draw Date", "Prize"].map((option) => (
                                <button
                                  key={option}
                                  type="button"
                                  className={`sort-option ${sortBy === option ? 'selected' : ''}`}
                                  onClick={() => {
                                    console.log("Selected sort option:", option);
                                    setSortBy(option);
                                  }} >
                                  {option} 
                                </button>
                              ))}
                              {/* <div className='sort-option' onClick={(e) => setSortBy(e.target.value)}>Cost</div>
                              <div className='sort-option'>Draw Date</div>
                              <div className='sort-option'>Prize</div> */}
                            </div>
                          </label>
                        {dateError && (
                          <div className="date-error-message">
                            <p style={{ color: "red", marginTop: "8px" }}>
                              {dateError}
                            </p>
                          </div>
                        )}
                        <div className= "button-group" style={{display:"flex",justifyContent:"space-between"}} >
                        <button
                          className="apply-btn" style={{width:"150px"}}
                          onClick={() => {
                            setDateError("");
                            if (
                              fromDate &&
                              toDate &&
                              new Date(fromDate) > new Date(toDate)
                            ) {
                              setDateError("From date cannot be later than To date.");
                              return;
                            }
                            setAppliedSortBy(sortBy);
                            fetchTickets(fromDate, toDate);
                            setIsBottomSheetOpen(false);
                          }}
                        >
                          Apply
                        </button>
                        <button
                          className="apply-btn" style={{width:"150px",backgroundColor:"grey"}}
                          onClick={() => {
                            setFromDate("");
                            setToDate("");
                            setDateError("");
                            setSortBy("");  
                            setIsBottomSheetOpen(false);
                            fetchTickets(fromDate, toDate); 
                          }}
                        >
                          Clear
                        </button>
                        </div>
                        
                      </div>
                    </>

                </div>
              </div>
            )}  
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
                              {buttonmessage !="Close" &&
                              <p className="modal-description">{message}</p>
                              }
                              
                            </div>
                            <button
                              className="update-kyc-button"
                              onClick={() => {
                                if (buttonmessage === "Close") {
                                  handleCloseModal();
                                } else {
                                  handleUpdateKYC();
                                }
                              }}
                            >
                              {buttonmessage}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    </>
  );
};

export default MyWins;
