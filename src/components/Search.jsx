import React, { useState } from "react";
import SlidingSidebar from "./SlidingSidebar";
import "../styles/Search.css";
import { FaTimes } from "react-icons/fa";

function Search({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "" && !recentSearches.includes(searchTerm)) {
      setRecentSearches([searchTerm, ...recentSearches]);
    }
    setSearchTerm("");
  };

  return (
    <SlidingSidebar isOpen={isOpen} onClose={onClose}>
      <div className="search-top">
        <h3>Search</h3>
        <button className="close-search-btn" onClick={onClose}><FaTimes /></button>
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </form>

      <hr className="search-divider" />

      <div className="recent-searches">
        <h4>Recent</h4>
        {recentSearches.length > 0 ? (
          <ul>
            {recentSearches.map((search, index) => (
              <li key={index}>{search}</li>
            ))}
          </ul>
        ) : (
          <p className="no-recent">No recent searches</p>
        )}
      </div>
    </SlidingSidebar>
  );
}

export default Search;
