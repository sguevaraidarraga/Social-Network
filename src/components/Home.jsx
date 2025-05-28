import React from "react";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import "../styles/Home.css";

function Home({ onLogout }) {
  return (
    <div className="home">
      <Sidebar onLogout={onLogout} />
      <Feed />
    </div>
  );
}

export default Home;