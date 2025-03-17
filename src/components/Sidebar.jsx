import React from "react";
import { FaHome, FaUser, FaBell, FaCog } from "react-icons/fa";
import "../styles/Sidebar.css";

function Sidebar() {
  return (
    <div className="sidebar">
        <h2>Social Network</h2>
        <ul>
            <li><FaHome /> Home</li>
            <li><FaUser /> Profile</li>
            <li><FaBell /> Notifications</li>
            <li><FaCog /> Settings</li>
        </ul>
    </div>
  );
}

export default Sidebar;