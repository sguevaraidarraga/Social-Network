import React, { useState } from "react";
import SlidingSidebar from "./SlidingSidebar";
import "../styles/Chats.css";
import { FaTimes, FaArrowLeft } from "react-icons/fa";

function Chats({ isOpen, onClose }) {
  const [activeChat, setActiveChat] = useState(null);

  const chatList = [
    { id: 1, name: "Alice", lastMessage: "Hey, how are you?" },
    { id: 2, name: "Bob", lastMessage: "Are you coming to the event?" },
    { id: 3, name: "Charlie", lastMessage: "Let’s catch up soon!" },
  ];

  return (
    <SlidingSidebar isOpen={isOpen} onClose={onClose}>
      {activeChat ? (
        /* Vista del chat individual */
        <div className="chat-view">
          {/* Header del chat con nombre y botón de regreso */}
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
          {/* Contenedor de mensajes con scroll */}
          <div className="sidebar-content chat-messages">
            <p className="message received">Hello!</p>
            <p className="message sent">Hi, how are you?</p>
            <p className="message received">I’m good, thanks for asking.</p>
          </div>

          {/* Input de mensaje (fijo en la parte inferior) */}
          <form className="sidebar-footer chat-input-form">
            <div className="chat-input-container">
              <input type="text" placeholder="Type a message..." className="chat-input" />
              <button type="submit" className="chat-send-btn">Send</button>
            </div>
          </form>
        </div>
      ) : (
        /* Vista de la lista de chats */
        <div className="chats-list-view">
          <div className="chats-header">
            <h3>Chats</h3>
            <button className="close-chats-btn" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <hr className="chats-divider" />

          <div className="sidebar-content chats-list">
            {chatList.map((chat) => (
              <div key={chat.id} className="chat-item" onClick={() => setActiveChat(chat)}>
                <p className="chat-name">{chat.name}</p>
                <p className="chat-last-message">{chat.lastMessage}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </SlidingSidebar>
  );
}

export default Chats;