import { useSelector, useDispatch } from "react-redux";
import { sendMessage } from "../features/chatSlice";
import React, { useState } from "react";
import SlidingSidebar from "./SlidingSidebar";
import "../styles/Chats.css";
import { FaTimes, FaArrowLeft } from "react-icons/fa";

function Chats({ isOpen, onClose }) {
  const [activeChat, setActiveChat] = useState(null);
  const [messageText, setMessageText] = useState("");
  const chats = useSelector((state) => state.chat.chats);
  const dispatch = useDispatch();

  const chatList = [
    { id: 1, name: "Alice", profilePic: "https://randomuser.me/api/portraits/women/1.jpg" },
    { id: 2, name: "Bob", profilePic: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 3, name: "Charlie", profilePic: "https://randomuser.me/api/portraits/men/3.jpg" },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim() !== "" && activeChat) {
      dispatch(sendMessage({ userId: activeChat.id, message: { text: messageText, sender: "Me" } }));
      setMessageText("");
    }
  };

  return (
    <SlidingSidebar isOpen={isOpen} onClose={onClose}>
      {activeChat ? (
        <div className="chat-view">
          <div className="chat-header">
            <button className="back-btn" onClick={() => setActiveChat(null)}>
              <FaArrowLeft />
            </button>
            <h3>{activeChat.name}</h3>
            <button className="close-chat-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          <hr className="chat-divider" />

          <div className="sidebar-content chat-messages">
            {chats[activeChat.id]?.length ? (
              chats[activeChat.id].map((msg, index) => (
                <p key={index} className={`message ${msg.sender === "Me" ? "sent" : "received"}`}>
                  {msg.text}
                </p>
              ))
            ) : (
              <p className="no-messages">No messages yet</p>
            )}
          </div>

          <form className="sidebar-footer chat-input-form" onSubmit={handleSendMessage}>
            <div className="chat-input-container">
              <input
                type="text"
                placeholder="Type a message..."
                className="chat-input"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <button type="submit" className="chat-send-btn">Send</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="chats-list-view">
          <div className="chats-header">
            <h3>Chats</h3>
            <button className="close-chats-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>
          <hr className="chats-divider" />

          <div className="sidebar-content chats-list">
            {chatList.map((chat) => {
              const lastMessage = chats[chat.id]?.length
                ? chats[chat.id][chats[chat.id].length - 1].text
                : "No messages yet";

              return (
                <div key={chat.id} className="chat-item" onClick={() => setActiveChat(chat)}>
                  <img src={chat.profilePic} alt="Profile" className="chat-profile-pic" />
                  <div className="chat-details">
                    <p className="chat-name">{chat.name}</p>
                    <p className="chat-last-message">{lastMessage}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </SlidingSidebar>
  );
}

export default Chats;