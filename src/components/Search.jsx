import React, { useState, useEffect } from "react";
import SlidingSidebar from "./SlidingSidebar";
import "../styles/Search.css";
import { FaTimes } from "react-icons/fa";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

function Search({ isOpen, onClose }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Buscar usuarios en Firestore según el searchTerm (por username o displayName, case-insensitive)
  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const fetchUsers = async () => {
      const db = getFirestore();
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      const term = searchTerm.trim().toLowerCase();
      const filtered = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(user =>
          (user.username && user.username.toLowerCase().includes(term)) ||
          (user.displayName && user.displayName.toLowerCase().includes(term))
        );
      setResults(filtered);
      setLoading(false);
    };
    fetchUsers();
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim() !== "" && !recentSearches.includes(searchTerm)) {
      setRecentSearches([searchTerm, ...recentSearches]);
    }
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
          placeholder="Search users or names"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </form>

      <hr className="search-divider" />

      {searchTerm.trim() ? (
        <div className="search-results">
          {loading ? (
            <p>Loading...</p>
          ) : results.length > 0 ? (
            <ul>
              {results.map(user => (
                <li
                  key={user.id}
                  onClick={() => {
                    onClose();
                    navigate(`/profile/${user.id}`);
                  }}
                >
                  <img
                    src={user.photoURL || "https://randomuser.me/api/portraits/men/1.jpg"}
                    alt={user.username}
                  />
                  <div className="search-user-info">
                    <span className="search-user-name">{user.displayName || user.username}</span>
                    <span className="search-user-username">@{user.username}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-recent">No users found</p>
          )}
        </div>
      ) : (
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
      )}
    </SlidingSidebar>
  );
}

export default Search;