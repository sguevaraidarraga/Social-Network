import React, { useState } from "react";
import SlidingSidebar from "./SlidingSidebar";
import "../styles/Notifications.css";
import { FaTimes, FaBell } from "react-icons/fa";

function Notifications({ isOpen, onClose }) {
  const [notifications, setNotifications] = useState([
    { id: 1, text: "New comment on your post" },
    { id: 2, text: "Someone liked your photo" },
    { id: 3, text: "You have a new follower" },
  ]);

  return (
    <SlidingSidebar isOpen={isOpen} onClose={onClose}>
      <div className="notifications-header">
        <h3>Notifications</h3>
        <button className="close-notifications-btn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      <hr className="notifications-divider" />
      <div className="notifications-list">
        {notifications.length > 0 ? (
          <ul>
            {notifications.map((notification) => (
              <li key={notification.id}>
                <FaBell className="notification-icon" />
                {notification.text}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-notifications">No notifications</p>
        )}
      </div>
    </SlidingSidebar>
  );
}

export default Notifications;