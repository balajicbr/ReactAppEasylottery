import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import "./MyTickets.css";
import axios from "axios";
import { useSelector } from "react-redux";

const MyTickets = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user.user);
  const refreshToken = user?.refreshToken;
  const [activeScheme, setActiveScheme] = useState(null);
  const [tabs, setTabs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [dateError, setDateError] = useState("");
  const [bottomSheetType, setbottomSheetType] = useState("");
  const [ticketsDetails, setTicketsDetails] = useState([]);
  const [jsonData, setjsonData] = useState([]);
  const [expandAll, setExpandAll] = useState(false);

  useEffect(() => {
    fetchLatestSchemes();
  }, []);
  useEffect(() => {
    if (activeScheme) {
      fetchTickets(activeScheme.id);
    }
  }, [activeScheme]);
  //api calls
  const fetchLatestSchemes = async () => {
    setLoading(true);
    try {
      const requestData = {
        refreshToken,
        formstep: "getAllSchemesData",
      };

      const response = await axios.post(
        "https://api.easylotto.in/GetSchemeDetails",
        requestData,
      );

      if (response.data && Array.isArray(response.data)) {
        const schemeList = response.data.map((item) => item.json);

        // Add a default "All" tab with ID "all"
        const allTab = { scheme_name: "All", id: "all" };
        const finalSchemes = [allTab, ...schemeList];

        setTabs(finalSchemes);
        console.log("finalSchemes: ", finalSchemes);
        // Set default selected scheme
        const defaultScheme =
          finalSchemes.find((s) => s.scheme_name === "All") || allTab;

        setActiveScheme(defaultScheme);
      }
    } catch (error) {
      console.error("Error fetching schemes:", error);
    }finally{
      setLoading(false);
    }
  };

  const fetchTickets = async (schemeId, fromDate = "", toDate = "") => {
    try {
      setLoading(true);
      const formatDate = (dateStr) =>
        dateStr ? `${dateStr} 00:00:00.000` : "0";
      const requestData = {
        refreshToken: refreshToken,
        formstep: "mytickets",
        id: "en",
        ids: fromDate && toDate ? "true" : "false",
        status: fromDate ? formatDate(fromDate) : "0",
        date: toDate ? formatDate(toDate) : "0",
        schemeid: schemeId === "all" ? "null" : schemeId,
        schemeBased: "Yes",
        amount: "",
        price: "",
        sort: "t_amount",
      };

      const response = await axios.post(
        "https://api.easylotto.in/myticket",
        requestData,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            "lang-policies-mode": "max-age=0",
          },
        },
      );

      if (response.data) {
        // Extract and flatten the tickets from the response
        const allTickets = response.data
          .map((item) => item.json?.json_data || []) // safely access json_data
          .flat() // flatten all arrays into one
          .filter((ticket) => ticket); // remove any nulls

        setjsonData(allTickets); // Store valid tickets in state
        const groupedByDraw = {};
        allTickets.forEach((ticket) => {
          const drawDate = ticket.draw;
          const ticketCount = parseInt(ticket.ticket) || 0;
          if (groupedByDraw[drawDate]) {
            groupedByDraw[drawDate].totalTickets += ticketCount;
          } else {
            groupedByDraw[drawDate] = {
              ...ticket, // Use this ticket as the base display card
              totalTickets: ticketCount,
            };
          }
        });
        const groupedTicketsArray = Object.values(groupedByDraw);
        console.log("groupedTicketsArray: ", groupedTicketsArray);
        setTickets(groupedTicketsArray);
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };
 
  const openBottomsheet = async (type) => {
    setIsBottomSheetOpen(true);
    setbottomSheetType(type);
    //console.log('TicketDetails: ',ticketsDetails);
  };
  const toggleExpandAll = (e) => {
    console.log('expandAll: ',expandAll);
    setExpandAll(e.target.checked);
  };

  const filteredTickets = tickets.filter((ticket) => {
  if (expandAll) {
    // First filter for won tickets
    const isWonTicket = Number(ticket.won_status) === 1;

    // Then apply the search term filter on won tickets
    if (isWonTicket) {
      if (!searchTerm) return true; // If no search term, show all won tickets
      const lower = searchTerm.toLowerCase();
      return (
        ticket.name?.toLowerCase().includes(lower) ||
        ticket.draw?.toLowerCase().includes(lower) ||
        ticket.totalTickets?.toString().toLowerCase().includes(lower)
      );
    }
    return false; 
  }
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    console.log("ticket: ", ticket.totalTickets);
    return (
      ticket.name?.toLowerCase().includes(lower) ||
      ticket.draw?.toLowerCase().includes(lower)  ||
      ticket.totalTickets?.toString().toLowerCase().includes(lower)
    );
  });

  return (
    <div className="my-tickets-container">
      <div className="curved-container">
        {/* Filter Tabs */}
        <div className="filter-tabs">
          {tabs.map((scheme) => (
            <button
              key={scheme.id}
              className={`tab ${activeScheme?.id === scheme.id ? "active" : ""}`}
              onClick={() => {
                setActiveScheme(scheme);
                console.log("Selected Scheme ID:", scheme.id); // Log the selected scheme ID
              }}
            >
              {scheme.scheme_name}
            </button>
          ))}
        </div>
        {/* Search and Filter Bar */}
        <div className="tab-content">
          <div className="search-bar-container">
            <div className="search-filter-wrapper">
              <input
                type="text"
                className="search-input"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)} 
              />
              <button
                className="filter-btn"
                onClick={() => openBottomsheet("Filter")} // Placeholder filter action
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6A538D"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="3" y1="4" x2="21" y2="4" />
                  <line x1="6" y1="12" x2="18" y2="12" />
                  <line x1="10" y1="20" x2="14" y2="20" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {/* Tickets List */}
      <div className="expand-all-toggle" style={{margin:'10px',paddingLeft:'0px'}}>
        <label className="toggle-switch">
            <input type="checkbox" id="legend-toggle" checked ={expandAll}  onChange={toggleExpandAll}/>
              <span className="slider"/>
        </label>
        <label htmlFor="legend-toggle" className="toggle-label">Won Tickets</label>
      </div>
        <div className="tickets-list">
          {loading ? (
            <div className="loader-container">
              <div className="spinner"></div>
                <p>Loading tickets...</p>
            </div>
            ) :filteredTickets.length > 0 ? (
            filteredTickets.map((ticket, index) => (
              <div
                key={ticket.tid || index}
                className="ticket-card"
                style={{
                  backgroundImage: `url(${ticket.m_image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
                onClick={() => {
                  const selectedDrawDate = ticket.draw;
                  ////console.log('selectedDrawDate:',selectedDrawDate);
                  // console.log('tickets:',jsonData);
                  // console.log('json data:',jsonData.filter(t => t.draw === selectedDrawDate));
                  const allJsonData = jsonData.filter(
                    (t) => t.draw === selectedDrawDate,
                  );
                  console.log(
                    `Tickets with draw date "${selectedDrawDate}":`,
                    allJsonData,
                  );
                  setTicketsDetails(allJsonData);
                  //console.log(`setTicketsDetails"${selectedDrawDate}":`, ticketsDetails);
                  openBottomsheet("TicketDetails");
                }}
              >
                <div className="ticket-background"></div>
                <div className="ticket-details">
                  <div className="ticket-header">
                    <div
                      className="status-badge"
                      style={{
                        backgroundColor:
                        (ticket.d_status === 1 && Number(ticket.won_status) === 0) ? "#53426C":(ticket.d_status === 1 && Number(ticket.won_status) === 1)  ? "#007E57"  : "#D92D20",
                      }}
                    >
                      {(ticket.d_status === 1 && Number(ticket.won_status) === 0) ? "Drawn":(ticket.d_status === 1 && Number(ticket.won_status) === 1)  ? "Won"  : "Pending"}

                    </div>

                    <div className="ticket-count">
                      <span className="count-label"></span>
                      <div
                        className="count-badge"
                        style={{ marginTop: "20px", marginRight: "20px" }}
                      >
                        <span className="count-number">
                          {ticket.totalTickets}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: "17px" }}>
                    <span className="date-value">{ticket.draw}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-tickets-container">
              <div className="no-tickets-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon-warning"
                >
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <div className="no-tickets-content">
                <h2 className="no-tickets-title">No tickets found!</h2>
              </div>
            </div>
          )}
        </div>
      </div>

      {isBottomSheetOpen && (
        <div
          className="bottom-sheet-overlay"
          onClick={() => setIsBottomSheetOpen(false)}
        >
          <div className="bottom-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="bottom-sheet-header">
              <h3>
                {bottomSheetType === "Filter"
                  ? "Filter Options"
                  : bottomSheetType === "TicketDetails"
                    ? "Ticket Details"
                    : ""}
              </h3>
            </div>
            {bottomSheetType === "Filter" && (
              <>
                <div className="bottom-sheet-content">
                  {/* Example filter fields */}
                  <label>
                    {" "}
                    From:
                    <input
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </label>
                  <label>
                    To:
                    <input
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </label>
                  {dateError && (
                    <div className="date-error-message">
                      <p style={{ color: "red", marginTop: "8px" }}>
                        {dateError}
                      </p>
                    </div>
                  )}
                  <button
                    className="apply-btn"
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
                      if (activeScheme) {
                        fetchTickets(activeScheme.id, fromDate, toDate);
                      }
                      setIsBottomSheetOpen(false);
                    }}
                  >
                    Apply Filters
                  </button>
                  <button
                    className="apply-btn"
                    onClick={() => {
                      setFromDate("");
                      setToDate("");
                      setDateError("");
                      setIsBottomSheetOpen(false);
                      if (activeScheme) {
                        fetchTickets(activeScheme.id); // Fetch tickets without filters
                      }
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              </>
            )}
            {bottomSheetType === "TicketDetails" && (
              <div className="tickets-list">
                {ticketsDetails.map((ticket, index) => (
                  // <div className="ticket-details-card" key={index}>
                  <NavLink
                    to="/ticketdetails"
                    className="ticket-details-card"
                    key={index}
                    style={{ textDecoration: "none", color: "inherit" }}
                    onClick={() => { 
                      localStorage.setItem("ticketDetails", JSON.stringify(ticket));
                      localStorage.setItem("wholeticketDetails", JSON.stringify(ticketsDetails));
                      localStorage.setItem("type", "mytickets");
                      setTicketsDetails(ticket);
                      console.log("selected ticket: ", ticket);
                    }}
                  >
                    <div className="ticket-detail-row">
                      <div
                        style={{
                          marginTop: "10px",
                          color: "#270659",
                          fontWeight: "normal",
                          fontSize: "22px",
                        }}
                      >
                        <span className="value">₹ {ticket.total_amount}</span>
                      </div>
                      <div
                        className="ticket-count"
                        style={{ marginRight: "20px" }}
                      >
                        <span className="count-label"></span>
                        <div
                          className="count-badge"
                          style={{ marginRight: "10px" }}
                        >
                          <span className="count-number">{ticket.ticket}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ticket-detail-row">
                      <div
                        style={{
                          marginTop: "20px",
                          color: "#270659",
                          fontWeight: "bold",
                        }}
                      >
                        <span className="t-date-value">{ticket.pdate}</span>
                      </div>
                      <div
                        className="status-badge"
                        style={{
                          marginTop: "15px",
                          color: "#FFFF",
                          height: "30px",
                        }}
                      >
                        <span className="value">{ticket.type}</span>
                      </div>
                    </div>
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
