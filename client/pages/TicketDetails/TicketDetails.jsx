import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "./TicketDetails.css";
import { QRCodeCanvas } from "qrcode.react";
import { useSelector } from 'react-redux';
import axios from 'axios';
import '@fortawesome/fontawesome-free/css/all.min.css';


const TicketDetails = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user.user);
  const refreshToken = user?.refreshToken;
  const [expandAll, setExpandAll] = useState(false);
  var [ticket, setTicket] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [ticketDetails, setTicketDetails] = useState([]);
  const [showQR, setShowQR] = useState(false);
  const [qrValue, setQrValue] = useState("");
 const [isExpanded, setIsExpanded] = useState(false);
 const [storedWholeTicket, setStoredWholeTicket] = useState([]);
 const [allTicketDetails, setAllTicketDetails] = useState({});
 const [expandedTickets, setExpandedTickets] = useState({});
 const [isLoading, setIsLoading] = useState(false);
 useEffect(() => {
  if (expandAll && storedWholeTicket.length > 0) {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const ticketsToFetch = storedWholeTicket.filter(
          (ticket) => !allTicketDetails[ticket.tid]
        );

        if (ticketsToFetch.length === 0) return; // All ticket details already fetched

        const requests = ticketsToFetch.map((ticket) => {
          const requestData = {
            refreshToken,
            formstep: "169",
            id: ticket.tid,
            ids: "en",
            schemeid: ticket.scheme_id,
            sort: "0",
            status: "false",
          };
          return axios.post("https://api.easylotto.in/transaction", requestData);
        });

        const responses = await Promise.all(requests);

        const newTicketData = {};
        responses.forEach((res, idx) => {
          const tid = ticketsToFetch[idx].tid;
          newTicketData[tid] = res.data;
        });

        // Merge with existing data
        setAllTicketDetails((prev) => ({
          ...prev,
          ...newTicketData,
        }));
      } catch (error) {
        console.error("Error fetching ticket details:", error);
      } finally{
        setIsLoading(false);
      }
    };

    fetchDetails();
  }
}, [expandAll, storedWholeTicket, refreshToken, allTicketDetails]);


const getTotalTickets = () => {

  return storedWholeTicket.reduce((sum, item) => {
   // console.log(item.ticket);
    const count = Number(item.ticket || item?.json?.ticket || 0);
   // console.log(count);
    return sum + count;
  }, 0);
};
  useEffect(() => {
  var storedWholeTicket = localStorage.getItem("wholeticketDetails");
  var storedTicket = localStorage.getItem("ticketDetails");
// console.log('storedWholeTicket:',storedWholeTicket);
  if (storedTicket) {
       var parsedTicket = JSON.parse(storedTicket);
      setTicket(parsedTicket);
      
  }
  if (storedWholeTicket) {
    setStoredWholeTicket(JSON.parse(storedWholeTicket));
  }
  }, []);
  useEffect(() => {
 // console.log('on page load of ticket details1: ',ticket);
  if (ticket) {
    fetchTicketDetails(ticket);
  }
}, [ticket]);  // Runs only when 'ticket' is set
  const handleBack = () => {
    navigate(-1);
  };
const fetchTicketDetails = async (ticketData) => {
  setIsLoading(true);
  //console.log('on page load of ticket details2: ',ticketData);
    try {
      const requestData = {
        refreshToken,
        formstep: "169",
        id: ticketData.tid,
        ids:"en",
        schemeid:ticketData.scheme_id,
        sort:"0",
        status:"false"
      };
     // console.log('Component loaded!');
      const response = await axios.post(
        "https://api.easylotto.in/transaction",
        requestData
      );
if (response.data) {
  //console.log("response.data:", response.data); 
  setTicketDetails(response.data);
}
    } catch (error) {
      console.error("Error fetching schemes:", error);
    } finally{
      setIsLoading(false);
    }
  };
  const toggleSection = (date) => {
    setExpandedSections((prev) => ({
      ...prev,
      [date]: !prev[date],
    }));
  };

  const toggleExpandAll = (e) => {
    //console.log('expandAll: ',expandAll);
    setExpandAll(e.target.checked);
  };

  const handleShowQR = (value) => {
  //console.log("value: ", value);
  setQrValue(value);
  setShowQR(true);
};
const toggleTicketExpand = (tid) => {
  setExpandedTickets(prev => ({
    ...prev,
    [tid]: !prev[tid],
  }));
};

const filterTicketsBySearch = (ticketsArray) => {
  if (!searchTerm.trim()) return ticketsArray;

  const lowerSearch = searchTerm.toLowerCase();

  return ticketsArray.filter((item) => {
    const ticket = item?.json?.ticket?.toLowerCase();
    const date = item?.json?.transaction_date?.toLowerCase();

    return ticket?.includes(lowerSearch) || date?.includes(lowerSearch);
  });
};
if (!ticket) return <div>Loading ticket details...</div>;
const filteredTickets = storedWholeTicket.filter((ticket) => {
  const details = allTicketDetails[ticket.tid];
  if (!details) return false;

  const hasMatchingTickets = filterTicketsBySearch(details).length > 0;
  const drawDateMatch = details[0]?.json?.transaction_date?.toLowerCase()?.includes(searchTerm.toLowerCase());
  const ticketTypeMatch = details[0]?.json?.type?.toLowerCase()?.includes(searchTerm.toLowerCase());

  return !searchTerm.trim() || drawDateMatch || hasMatchingTickets || ticketTypeMatch;
});


  return (
    <div className="ticket-details-container">
      {/* 🔙 Back Header */}
      <div className="back-header" onClick={() => navigate(-1)}>
        <span className="back-arrow"><i className="fas fa-arrow-left" style={{ width: '24px', height: '24px', fontSize: '19px' }}></i></span>
        <span className="back-text"> {localStorage.getItem("type") === "purchase" ? "Purchase History" : "My Tickets"}</span>
      </div>
      {/* ticket-card */}
    <div className="main-container">
      <div className="ticket-details-card" style={{ backgroundImage: `url(${ticket.m_image})`, backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat", }}>
        <div className="ticket-background"></div>
          <div className="ticket-details">
            <div className="ticket-header">
              {localStorage.getItem("type") === "purchase" && (
              <div className="middle-container">
                <div className="status-badge" style={{ backgroundColor: (ticket.d_status === 1 && Number(ticket.won_status) === 1)  ? "#007E57"  : "#3426C", }} >
                  {(ticket.d_status === 1 && Number(ticket.won_status) === 1)  ? "Won"  : "Not Won"}
                </div>
                <div  className="prize-container">
                  <span>Price:</span>
                  <span>{ticket.total_amount}</span>
                </div>
              </div>
              )}
              {localStorage.getItem("type") != "purchase" && (
              <div className="status-badge"style={{ backgroundColor: (ticket.d_status === 1 && Number(ticket.won_status) === 0) ? "#53426C":(ticket.d_status === 1 && Number(ticket.won_status) === 1)  ? "#007E57"  : "#D92D20", }}>
                      {(ticket.d_status === 1 && Number(ticket.won_status) === 0) ? "Drawn":(ticket.d_status === 1 && Number(ticket.won_status) === 1)  ? "Won"  : "Pending"}
              </div>
                )}
              <div className="ticket-count">
                <span className="count-label"></span>
                  <div  className="count-badge" style={{ marginTop: "20px", marginRight: "20px" }}>
                    <span className="count-number"> { !expandAll ? ticket.ticket : getTotalTickets()}</span>
                  </div>
              </div>
            </div>
            {localStorage.getItem("type") != "purchase" && (
            <div style={{ marginTop: "17px", marginRight: "20px" }}>
              <span className="date-value">{ticket.draw}</span>
            </div>
            )}
            {localStorage.getItem("type") === "purchase" && (
            <div  className="date-container">
              <div className="date-label">Purchase Date:</div>
              <span className="date-value1">{ticket.pdate}</span>
            </div>
            )}
          </div>
      </div>
      <div className="ticketdetails-main-content">
        <div className="curved-ticket-container">
        <div className="search-bar-container">
          <div className="search-filter-wrapper">
              <input type="text" className="search-input" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={!expandAll}/>
          </div>
        </div>
        </div>
      </div>
      <div className="expand-all-toggle">
        <label className="toggle-switch">
            <input type="checkbox" id="legend-toggle" checked ={expandAll}  onChange={toggleExpandAll}/>
              <span className="slider"/>
        </label>
        <label htmlFor="legend-toggle" className="toggle-label">Expand All</label>
      </div>
      <div className="ticket-sections">
          {isLoading ? (
                  <div className="loader-container">
                    <div className="spinner"></div>
                    <p className="spinner-text" >Loading tickets...</p>
                  </div>
          ) : !expandAll && (
        <div className="ticket-section">
          <div className ="ticket-details-header" onClick={() => setIsExpanded(!isExpanded)}>
            <div className="ticket-date"><p className="section-title" style= {{color:"#270659",fontWeight:"600",fontSize:"16px",padding:"10px"}}>{ticketDetails[0]?.json?.transaction_date}</p></div>
            <div className="expand-container" style={{padding:"12px"}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
                <path d="M6 9L12 15L18 9" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="ticket-content">
            <div className="ticket-detail-card" style={{height:"auto",backgroundColor:"#FFF1D1",margin:"10px",borderRadius:"10px"}}>
              <div className="ticket-details-info" style={{margin:"12px"}}>
                <h4 className="ticket-detail-type" style={{color:"#270659",fontWeight:"600",fontSize:"14px",padding:"10px"}}>{ticketDetails[0]?.json?.type} Ticket</h4>
                <div className="ticket-detail-summary" style={{ padding:"10px",display:"flex",justifyContent:"space-between" }}>
                   <div className="summary-item">
                      <span className="summary-label">Total Tickets:</span>
                      <span className="summary-value">{ticketDetails[0]?.json?.no_tickets}</span>
                   </div>
                   <div className="summary-item">
                    <span className="summary-label">Price:</span>
                    <span className="summary-value">₹ {ticketDetails[0]?.json?.t_amount}</span>
                    </div>
                </div>
              </div>
            </div>
          {isExpanded &&(
            <>
            <div className ="ticket-header" style= {{padding:"5px",height:"30px",alignItems:"center"}}>
              <div className="ticket-date"><p className="section-title" style= {{color:"#270659",fontSize:"14px"}}>Ticket Numbers</p></div>
              <div className="ticket-date"><p className="section-title" style= {{color:"#270659",fontSize:"14px"}}>QR Code</p></div>
            </div>
            {ticketDetails.map((item, index) => {
            const data = item.json;
            const qrString  = `Scheme: ${data.sname}\nDraw Date: ${data.drawdate}\nTicket #: ${data.ticket}`;

              return (
                <div key={index} className="ticket-header" style={{  paddingTop: "10px",paddingBottom: "20px", paddingLeft: "5px", height: "35px", alignItems: "center", display: "flex", justifyContent: "space-between", }} onClick={() => handleShowQR(qrString )}>
                  <div className="ticket-date">
                    <p className="section-title" style={{ color: "#270659", fontSize: "12px", fontWeight: "200" }} > {data.ticket} </p>
                  </div>
                  <div className="ticket-date"> <QRCodeCanvas value={qrString} size={38} /> </div>
                </div>
              );
          })}
          {showQR && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, }}  onClick={() => setShowQR(false)}>
              <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", textAlign: "center", }} onClick={(e) => e.stopPropagation()}>
                <QRCodeCanvas value={qrValue} size={200} />
                <button onClick={() => setShowQR(false)} style={{ marginTop: "10px" }}> Close </button>
              </div>
            </div>
          )}
            </>
          )}
        </div>
      </div>
      )} 
      {/* expandall==> fasle */}
      {isLoading ? (
                  <div className="loader-container">
                    <div className="spinner"></div>
                    <p className="spinner-text" >Loading tickets...</p>
                  </div>
      ) : expandAll && storedWholeTicket.length > 0 && filteredTickets.map((ticket, index) => {
      const isExpanded = expandedTickets[ticket.tid];
      const details = allTicketDetails[ticket.tid];
       // console.log("expanded tickets:",details);
        if (!details) return <div key={ticket.tid}>Loading details...</div>;
        return(
        <div key={ticket.tid} className="ticket-section">
          <div className ="ticket-details-header" onClick={() => toggleTicketExpand(ticket.tid)}>
            <div className="ticket-date"><p className="section-title" style= {{color:"#270659",fontWeight:"600",fontSize:"16px",padding:"10px"}}>{details[0]?.json?.transaction_date}</p></div>
            <div className="expand-container" style={{padding:"12px"}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" >
                <path d="M6 9L12 15L18 9" stroke="#270659" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>
          <div className="ticket-content">
            <div className="ticket-detail-card" style={{height:"auto",backgroundColor:"#FFF1D1",margin:"10px",borderRadius:"10px"}}>
              <div className="ticket-details-info" style={{margin:"12px"}}>
                <h4 className="ticket-detail-type" style={{color:"#270659",fontWeight:"600",fontSize:"14px",padding:"10px"}}>{details[0]?.json?.type} Ticket</h4>
                <div className="ticket-detail-summary" style={{ padding:"10px",display:"flex",justifyContent:"space-between" }}>
                   <div className="summary-item">
                      <span className="summary-label">Total Tickets:</span>
                      <span className="summary-value">{details[0]?.json?.no_tickets}</span>
                   </div>
                   <div className="summary-item">
                    <span className="summary-label">Each Ticket Price:</span>
                    <span className="summary-value">₹ {details[0]?.json?.t_amount}</span>
                    </div>
                </div>
              </div>
            </div>
          {isExpanded &&(
            <>
            <div className ="ticket-header" style= {{padding:"5px",height:"30px",alignItems:"center"}}>
              <div className="ticket-date"><p className="section-title" style= {{color:"#270659",fontSize:"14px"}}>Ticket Numbers</p></div>
              <div className="ticket-date"><p className="section-title" style= {{color:"#270659",fontSize:"14px"}}>QR Code</p></div>
            </div>
            {details.map((item, index) => {
            const data = item.json;
            const qrString  = `Scheme: ${data.sname}\nDraw Date: ${data.drawdate}\nTicket #: ${data.ticket}`;

              return (
                <div key={index} className="ticket-header" style={{  paddingTop: "10px",paddingBottom: "20px", paddingLeft: "5px", height: "35px", alignItems: "center", display: "flex", justifyContent: "space-between", }} onClick={() => handleShowQR(qrString )}>
                  <div className="ticket-date">
                    <p className="section-title" style={{ color: "#270659", fontSize: "12px", fontWeight: "200" }} > {data.ticket} </p>
                  </div>
                  <div className="ticket-date"> <QRCodeCanvas value={qrString} size={38} /> </div>
                </div>
              );
          })}
          {showQR && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 9999, }}  onClick={() => setShowQR(false)}>
              <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "8px", textAlign: "center", }} onClick={(e) => e.stopPropagation()}>
                <QRCodeCanvas value={qrValue} size={200} />
                <button onClick={() => setShowQR(false)} style={{ marginTop: "10px" }}> Close </button>
              </div>
            </div>
          )}
            </>
          )} {/* expandall==> true */}
        </div>
      </div>
        );
        })}
        {/* {expandAll && filteredTickets.length === 0 && (
          <p style={{ padding: "20px", color: "#888" }}>No tickets found.</p>
        )} */}
    </div>
    </div>
    </div>
  );
};

export default TicketDetails;
