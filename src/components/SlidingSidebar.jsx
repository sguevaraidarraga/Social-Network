import React from "react";
import "../styles/SlidingSidebar.css";

function SlidingSidebar({ isOpen, onClose, children }) {
  return (
    <div className={`slide-sidebar ${isOpen ? "open" : ""}`}>
      {children}
    </div>
  );
}

export default SlidingSidebar;