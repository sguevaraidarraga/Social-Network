import React, { useState, useEffect } from "react";
import { FaSearch, FaHome, FaBell, FaComments, FaPlus, FaEllipsisV } from "react-icons/fa";
import "../styles/Sidebar.css";
import Search from "./Search";
import Notifications from "./Notifications";
import CreatePost from "./CreatePost";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Sidebar() {
  const [activeSidebar, setActiveSidebar] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [user, setUser] = useState({
    name: "",
    username: "",
    image: ""
  });
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          name: currentUser.displayName || currentUser.email || "Usuario",
          username: currentUser.email ? currentUser.email.split("@")[0] : "",
          image: currentUser.photoURL || "https://randomuser.me/api/portraits/men/1.jpg"
        });
      } else {
        setUser({
          name: "",
          username: "",
          image: "https://randomuser.me/api/portraits/men/1.jpg"
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const openSidebar = (sidebar) => {
    setActiveSidebar(activeSidebar === sidebar ? null : sidebar);
  };

  const handleLogout = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  return (
    <>
      <div className="sidebar">
        <div className="sidebar-logo">
          <h2>Social Network</h2>
        </div>
        <div className="sidebar-menu-section">
          <span className="sidebar-menu-title">Menú</span>
          <ul className="sidebar-menu">
            <li className={location.pathname === "/home" ? "active" : ""}>
              <Link to="/home" style={{ display: "flex", alignItems: "center", gap: 6, color: "inherit", textDecoration: "none" }}>
                <FaHome /> <span>Home</span>
              </Link>
            </li>
            <li onClick={() => openSidebar("search")}><FaSearch /> <span>Search</span></li>
            <li onClick={() => openSidebar("notifications")}><FaBell /> <span>Notifications</span></li>
            <li className={location.pathname === "/chats" ? "active" : ""}>
              <Link to="/chats" style={{ display: "flex", alignItems: "center", gap: 6, color: "inherit", textDecoration: "none" }}>
                <FaComments /> <span>Chats</span>
              </Link>
            </li>
            <li onClick={() => openSidebar("createPost")}><FaPlus /> <span>Create Post</span></li>
          </ul>
        </div>
        <div
          className="sidebar-user-section"
          style={{ cursor: "pointer" }}
          onClick={() => navigate("/profile")}
        >
          <img
            src={user.image}
            alt="User"
            className="sidebar-user-image"
          />
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">{user.name}</span>
            <span className="sidebar-user-username">@{user.username}</span>
          </div>
          <div className="sidebar-user-menu">
            <button
              className="sidebar-user-menu-btn"
              onClick={e => {
                e.stopPropagation();
                setShowUserMenu((v) => !v);
              }}
            >
              <FaEllipsisV />
            </button>
            {showUserMenu && (
              <div className="sidebar-user-dropdown">
                <button onClick={handleLogout}>Cerrar sesión</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebars */}
      <Search isOpen={activeSidebar === "search"} onClose={() => setActiveSidebar(null)} />
      <Notifications isOpen={activeSidebar === "notifications"} onClose={() => setActiveSidebar(null)} />
      {/* Elimina la línea de <Chats ... /> aquí, los chats deben ser una página, no un sidebar */}
      {/* <Chats isOpen={activeSidebar === "chats"} onClose={() => setActiveSidebar(null)} /> */}
      <CreatePost isOpen={activeSidebar === "createPost"} onClose={() => setActiveSidebar(null)} />
    </>
  );
}

export default Sidebar;