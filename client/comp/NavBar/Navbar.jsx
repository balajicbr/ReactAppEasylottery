
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import "./Navbar.css";
import NavCurve2 from "../../assets/NavCurve2.png";
import { Home, CreditCard, Ticket, MoreHorizontal } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user.user);
  const refreshToken = user?.refreshToken;

   const handleBuyTickets = async (e) => {
    e.preventDefault();

    if (!refreshToken) {
      console.error("No refreshToken found, user must log in again.");
      return;
    }

    try {
          const requestData = {
            refreshToken,
            formstep: "getlatestsheme"
          };
    
          const response = await axios.post(
            "https://api.easylotto.in/easyshoping",
            requestData,{
        headers: {
          "lang-policies-mode" : "max-age=0"
        }}
          );
    
            console.log("RESp",response);
              console.log("API response:", response.data);

               //  Extract latest scheme
    const scheme = response.data?.[0]?.json;

if (!scheme) {
  console.error("No scheme found in response", response.data);
  return;
}

const { schemeid, image_url, subname } = scheme;

navigate("/buytickets", {
  state: {
    id: schemeid,
    imagename: image_url,
    subname,
  },
    });
    
        } catch (error) {
          console.error("Error fetching schemes:", error);
        }
  };

  return (
    <div className="navbar">
      {/* curve line */}
      <div className="nav-curve">
        <img src={NavCurve2} alt="curve" />
      </div>

      <div className="nav-items">
        <NavLink to="/dashboard" className="nav-item">
          {({ isActive }) => (
            <>
              <Home className={`icon ${isActive ? "active-icon" : ""}`} />
              <span className={isActive ? "active-text" : ""}>Home</span>
            </>
          )}
        </NavLink>

        <NavLink to="/AddCredits" className="nav-item">
          {({ isActive }) => (
            <>
              <CreditCard className={`icon ${isActive ? "active-icon" : ""}`} />
              <span className={isActive ? "active-text" : ""}>Credit</span>
            </>
          )}
        </NavLink>

        {/* Custom Buy Ticket with API call */}
        <button className="nav-item buy-ticket" onClick={handleBuyTickets}>
          <div className="buy-btn">
            <svg
              width="20"
              height="20"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.80334 7.49947C2.46639 7.49947 3.10227 7.76286 3.57111 8.2317C4.03995 8.70054 4.30334 9.33643 4.30334 9.99947C4.30334 10.6625 4.03995 11.2984 3.57111 11.7672C3.10227 12.2361 2.46639 12.4995 1.80334 12.4995V14.1661C1.80334 14.6082 1.97894 15.0321 2.2915 15.3446C2.60406 15.6572 3.02798 15.8328 3.47001 15.8328H16.8033C17.2454 15.8328 17.6693 15.6572 17.9819 15.3446C18.2944 15.0321 18.47 14.6082 18.47 14.1661V12.4995C17.807 12.4995 17.1711 12.2361 16.7022 11.7672C16.2334 11.2984 15.97 10.6625 15.97 9.99947C15.97 9.33643 16.2334 8.70054 16.7022 8.2317C17.1711 7.76286 17.807 7.49947 18.47 7.49947V5.8328C18.47 5.39078 18.2944 4.96685 17.9819 4.65429C17.6693 4.34173 17.2454 4.16614 16.8033 4.16614H3.47001C3.02798 4.16614 2.60406 4.34173 2.2915 4.65429C1.97894 4.96685 1.80334 5.39078 1.80334 5.8328V7.49947Z"
                stroke="url(#paint0_linear_ticket_nav)"
                strokeWidth="1.04167"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M7.64001 10.0008L9.30668 11.6674L12.64 8.33411"
                stroke="url(#paint1_linear_ticket_nav)"
                strokeWidth="1.04167"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_ticket_nav"
                  x1="1.80334"
                  y1="6.69101"
                  x2="20.5416"
                  y2="9.15633"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FFB940" />
                  <stop offset="1" stopColor="#FF8400" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_ticket_nav"
                  x1="7.64001"
                  y1="9.0555"
                  x2="13.2517"
                  y2="9.83072"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#FFB940" />
                  <stop offset="1" stopColor="#FF8400" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span className="buy-text">Buy Ticket</span>
        </button>

        <NavLink to="/mytickets" className="nav-item">
          {({ isActive }) => (
            <>
              <Ticket className={`icon ${isActive ? "active-icon" : ""}`} />
              <span className={isActive ? "active-text" : ""}>My Tickets</span>
            </>
          )}
        </NavLink>

        <NavLink to="/mywins" className="nav-item">
          {({ isActive }) => (
            <>
              <MoreHorizontal
                className={`icon ${isActive ? "active-icon" : ""}`}
              />
              <span className={isActive ? "active-text" : ""}>My Wins</span>
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
