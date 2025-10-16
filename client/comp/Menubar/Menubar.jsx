import React, { useState } from "react";
import "./Menubar.css";
import { useSelector } from "react-redux"; 
import {
  FaLanguage, FaGift, FaChartBar, FaUserFriends, FaQuestionCircle,FaHistory,
  FaSun, FaMoon, FaInfoCircle, FaClipboardList, FaPhoneAlt, FaCalendarAlt, FaChevronDown,FaShieldAlt,FaSignOutAlt,FaTicketAlt ,FaPalette ,FaUser
} from "react-icons/fa";

import { useNavigate } from 'react-router-dom';
const Menubar = ({ user, onLogout,closeMenu  }) => {
const navigate = useNavigate();
const refreshToken = user?.refreshToken;
const firstName = user?.user_name;
const dob = user?.dob;
const phone = user?.first_name.match(/\((\d+)\)/);
const phonenumber = phone ? phone[1] : null;
  const [darkMode, setDarkMode] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const toggleTheme = () => setDarkMode(prev => !prev);
  return (
    <div className="menubar-container">
      {/* User Info Section */}
      <div className="menubar-user">
        <div className="user-initials">{user?.user_name?.[0] || "U"}</div>
        <div className="user-details">
          <div className="user-name">{user?.user_name || "Unknown User"}</div>
          <div className="user-contact"><FaPhoneAlt /> {phonenumber || "- -"}</div>
          <div className="user-dob"><FaCalendarAlt /> {dob || "- -"}</div>
        </div>
      </div>
      {/* Menu Items */}
      <ul className="menubar-list">
        <li onClick={() => {navigate("/myprofile");closeMenu();}}><FaUser /> My Account</li>
        <li onClick={() => {navigate("/settings", { state: { type: "language" } });closeMenu();}}><FaLanguage /> Languages</li>
        <li onClick={() => {navigate("/purchasehistory");closeMenu();}}><FaHistory /> Purchase History</li>
        <li onClick={() => {navigate("/mywins");closeMenu();}} ><FaGift /> My Wins</li>
        <li onClick={() => {navigate("/mytickets");closeMenu();}}><FaTicketAlt />My Tickets</li>
        <li onClick={() => {
            window.open("https://easylottery.in/results/", "_blank"); // opens in a new tab
            closeMenu();
        }}><FaChartBar /> Results</li>
        <li onClick={() => {navigate("/settings", { state: { type: "refer" } });closeMenu();}}><FaUserFriends /> Refer a Friend</li>
        <li onClick={() => setResourcesOpen(!resourcesOpen)}>
          <FaQuestionCircle /> Resources <FaChevronDown className={resourcesOpen ? "rotate" : ""} />
        </li>
        {resourcesOpen && (
          <ul className="submenu">
            <li onClick={() => {
            window.open("https://easylottery.in/faq/", "_blank"); // opens in a new tab
            closeMenu();
        }}>FAQ</li>
            {/* <li onClick={() => {navigate("/settings", { state: { type: "rules" } });closeMenu();}}>Rules</li> */}
            <li onClick={() => {navigate("/settings", { state: { type: "news" } });closeMenu();}}> News & Media</li>
          </ul>
        )}
      </ul>
      
      {/* Theme Switcher */}
      <div className="theme-toggle">
        <div className="color-scheme-heading">
        <FaPalette />
          Colour Scheme
        </div>
        <div className="colur-theme-row">
          <p><FaSun /> Light <input type="radio" checked={!darkMode} onChange={() => setDarkMode(false)} /></p>
          <p><FaMoon /> Dark <input type="radio" checked={darkMode} onChange={() => setDarkMode(true)} /></p>
        </div>
      </div>

      {/* Footer Links */}
      <ul className="menubar-footer">
        <li onClick={() => {
            window.open("https://easylottery.in/", "_blank"); // opens in a new tab
            closeMenu();
        }}><FaInfoCircle /> About Us</li>
        <li onClick={() => {
            window.open("https://easylottery.in/rules/", "_blank"); // opens in a new tab
            closeMenu();
        }}><FaClipboardList /> Terms & Conditions</li>
        <li onClick={() => {
            window.open("https://easylottery.in/privacy-policy/", "_blank"); // opens in a new tab
            closeMenu();
        }}><FaShieldAlt /> Privacy & Policy</li>
        <button className="menu-logout-btn" onClick={onLogout}>
          Logout <FaSignOutAlt />
        </button>
      </ul>
    </div>
  );
};

export default Menubar;
