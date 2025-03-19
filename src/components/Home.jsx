import React from "react";
import Topbar from "./Topbar";
import Feed from "./Feed";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home">
      <Topbar />
      <Feed />
    </div>
  );
}

export default Home;