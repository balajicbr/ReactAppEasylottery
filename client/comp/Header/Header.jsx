import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./Header.css";
import Logo from "../../assets/Logo.png";
import { FaBell, FaSignOutAlt } from "react-icons/fa";
import { logoutUser } from "../../redux/user/userActions";
import Menubar from "../Menubar/Menubar";

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user.user);
  const firstName = user?.user_name;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const displayLetters = firstName
    ? firstName[0].toUpperCase().repeat(firstName.length > 1 ? 2 : 1)
    : "";

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="headermain">
      {/* Logo */}
      <div className="header-logo">
        <img src={Logo} alt="EasyLottery Logo" />
      </div>

      {/* Right Side */}
      <div className="header-right">
        <button className="notification-btn">
          <FaBell />
        </button>
        {/* <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt />
        </button> */}

        {/* User Circle with Menu */}
        {displayLetters && (
          <div className="user-menu-container" ref={menuRef}>
            <div
              className="user-circle"
              title={firstName}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {displayLetters}
            </div>

            {menuOpen && (
              <div className="user-dropdown">
                <Menubar user={user} onLogout={handleLogout} closeMenu={() => setMenuOpen(false)}/>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
