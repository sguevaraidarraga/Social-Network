import React, { useState } from "react";
import { FaSearch, FaHome, FaBell, FaCog, FaComments, FaPlus } from "react-icons/fa";
import "../styles/Topbar.css";
import Search from "./Search";
import Notifications from "./Notifications";
import Chats from "./Chats";
import CreatePost from "./CreatePost";

function Topbar() {
  const [activeSidebar, setActiveSidebar] = useState(null);

  const openSidebar = (sidebar) => {
    setActiveSidebar(activeSidebar === sidebar ? null : sidebar);
  };

  return (
    <>
      <div className="topbar">
        <div className="topbar-left">
          <h2>Social Network</h2>
        </div>

        <div className="topbar-center">
          <ul>
            <li><FaHome /> Home</li>
            <li onClick={() => openSidebar("search")}><FaSearch /> Search</li>
            <li onClick={() => openSidebar("notifications")}><FaBell /> Notifications</li>
            <li onClick={() => openSidebar("chats")}><FaComments /> Chats</li>
          </ul>
        </div>

        <div className="topbar-right">
          {/* Create Post */}
          <button className="create-post-btn" onClick={() => openSidebar("createPost")}>
            <FaPlus />
          </button>

          {/* User pfp */}
          <img src="https://randomuser.me/api/portraits/men/1.jpg" alt="User" className="profile-image" />
        </div>
      </div>

      {/* Sidebars */}
      <Search isOpen={activeSidebar === "search"} onClose={() => setActiveSidebar(null)} />
      <Notifications isOpen={activeSidebar === "notifications"} onClose={() => setActiveSidebar(null)} />
      <Chats isOpen={activeSidebar === "chats"} onClose={() => setActiveSidebar(null)} />
      <CreatePost isOpen={activeSidebar === "createPost"} onClose={() => setActiveSidebar(null)} />
    </>
  );
}

export default Topbar;