import React from "react";
import Sidebar from "./Sidebar";
import Feed from "./Feed";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home">
      <Sidebar />
      <div className="feed-container">
        <Feed />
      </div>
    </div>
  );
}

export default Home;