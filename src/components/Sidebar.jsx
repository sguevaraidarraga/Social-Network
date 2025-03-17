import React, { useState } from "react";
import { FaHome, FaBell, FaCog, FaBars } from "react-icons/fa";
import "../styles/Sidebar.css";

function Sidebar() {
  const [showLogout, setShowLogout] = useState(false);

  return (
    <div className="sidebar">
      <div className="sidebar-top">
        <h2>Social Network</h2>
        <ul>
          <li><FaHome /> Home</li>
          <li><FaBell /> Notifications</li>
          <li><FaCog /> Settings</li>
        </ul>
      </div>
      
      {/* Profile Section - Fixed at the Bottom */}
      <div className="sidebar-profile">
        <li className="profile-item">
          <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="User" className="profile-image" /> Profile
          <FaBars className="options-icon" onClick={() => setShowLogout(!showLogout)} />
        </li>
        {showLogout && (
          <div className="logout-popup">
            <button className="logout-button">Log Out</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;