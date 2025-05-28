import React, { useEffect, useState } from "react";
import { getFirestore, collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import Sidebar from "./Sidebar";
import "../styles/Chats.css";

function Chats() {
  const [currentUser, setCurrentUser] = useState(undefined);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  // 1. Autenticación
  useEffect(() => {
    const auth = getAuth();
    const unsub = onAuthStateChanged(auth, setCurrentUser);
    return () => unsub();
  }, []);

  // 2. Usuarios a los que puede enviar mensajes (solo los que sigue o lo siguen)
  useEffect(() => {
    if (!currentUser) return;
    const db = getFirestore();
    const unsub = onSnapshot(collection(db, "users"), snap => {
      const allUsers = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Solo mostrar usuarios que el usuario sigue o que lo siguen (pero no él mismo)
      const myUser = allUsers.find(u => u.id === currentUser.uid);
      let allowedIds = [];
      if (myUser) {
        const following = Array.isArray(myUser.following) ? myUser.following : [];
        const followers = Array.isArray(myUser.followers) ? myUser.followers : [];
        allowedIds = Array.from(new Set([...following, ...followers])).filter(id => id !== currentUser.uid);
      }
      setUsers(allUsers.filter(u => allowedIds.includes(u.id)));
    });
    return () => unsub();
  }, [currentUser]);

  // 3. Chats del usuario autenticado
  useEffect(() => {
    if (!currentUser) return;
    const db = getFirestore();
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser.uid)
    );
    const unsub = onSnapshot(q, snap => {
      setChats(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [currentUser]);

  // 4. Mensajes del chat seleccionado
  useEffect(() => {
    if (!selectedChat) {
      setMessages([]);
      return;
    }
    const db = getFirestore();
    const q = query(
      collection(db, "chats", selectedChat.id, "messages"),
      orderBy("timestamp", "asc")
    );
    const unsub = onSnapshot(q, snap => {
      setMessages(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, [selectedChat]);

  // 5. Iniciar chat (o seleccionar si ya existe)
  const handleStartChat = async (userId) => {
    if (!currentUser || userId === currentUser.uid) return;
    const db = getFirestore();
    const q = query(
      collection(db, "chats"),
      where("participants", "in", [
        [currentUser.uid, userId],
        [userId, currentUser.uid]
      ])
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      setSelectedChat({ id: snap.docs[0].id, ...snap.docs[0].data() });
      return;
    }
    const docRef = await addDoc(collection(db, "chats"), {
      participants: [currentUser.uid, userId],
      createdAt: serverTimestamp()
    });
    setSelectedChat({ id: docRef.id, participants: [currentUser.uid, userId] });
  };

  // 6. Enviar mensaje
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat || !currentUser) return;
    const db = getFirestore();
    await addDoc(collection(db, "chats", selectedChat.id, "messages"), {
      sender: currentUser.uid,
      text: messageInput,
      timestamp: serverTimestamp()
    });
    setMessageInput("");
  };

  // 7. Mostrar nombre/foto del otro usuario en el chat
  const getOtherUser = (chat) => {
    if (!chat || !currentUser) return null;
    const otherUid = chat.participants.find(uid => uid !== currentUser.uid);
    return users.find(u => u.id === otherUid) || null;
  };

  // 8. Loader y protección
  if (typeof currentUser === "undefined") {
    return <div className="chats-loading">Loading...</div>;
  }
  if (!currentUser) {
    return <div className="chats-loading">Please log in to use chats.</div>;
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <Sidebar />
      <div className="chats-page-container" style={{ display: "flex", flex: 1, marginLeft: 350 }}>
        {/* Lista de chats a la izquierda */}
        <div className="chats-list-panel">
          <div className="chats-list-header">
            <h3>Your Chats</h3>
            <div className="chats-users-list">
              <h4>Start New Chat</h4>
              <ul>
                {users.map(u => (
                  <li key={u.id} onClick={() => handleStartChat(u.id)}>
                    <img
                      src={u.photoURL && typeof u.photoURL === "string" && u.photoURL.trim() !== "" ? u.photoURL : "https://randomuser.me/api/portraits/men/1.jpg"}
                      alt={u.username}
                      style={{ width: 28, height: 28, borderRadius: "50%", marginRight: 8 }}
                    />
                    {u.displayName || u.username}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <ul className="chats-list">
            {chats.map(chat => {
              const otherUser = getOtherUser(chat);
              return (
                <li
                  key={chat.id}
                  className={selectedChat && chat.id === selectedChat.id ? "active" : ""}
                  onClick={() => setSelectedChat(chat)}
                >
                  {otherUser ? (
                    <>
                      <img
                        src={otherUser.photoURL && typeof otherUser.photoURL === "string" && otherUser.photoURL.trim() !== "" ? otherUser.photoURL : "https://randomuser.me/api/portraits/men/1.jpg"}
                        alt={otherUser.username}
                        style={{ width: 28, height: 28, borderRadius: "50%", marginRight: 8 }}
                      />
                      {otherUser.displayName || otherUser.username}
                    </>
                  ) : (
                    <>Chat</>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
        {/* Mensajes del chat seleccionado a la derecha */}
        <div className="chats-messages-panel">
          {selectedChat ? (
            <>
              <div className="chats-messages-header">
                {(() => {
                  const otherUser = getOtherUser(selectedChat);
                  return otherUser ? (
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <img
                        src={otherUser.photoURL && typeof otherUser.photoURL === "string" && otherUser.photoURL.trim() !== "" ? otherUser.photoURL : "https://randomuser.me/api/portraits/men/1.jpg"}
                        alt={otherUser.username}
                        style={{ width: 32, height: 32, borderRadius: "50%" }}
                      />
                      <h4 style={{ margin: 0 }}>
                        {otherUser.displayName || otherUser.username}
                      </h4>
                    </div>
                  ) : (
                    <h4>Chat</h4>
                  );
                })()}
              </div>
              <div className="chats-messages">
                <div className="messages-list">
                  {messages.map(msg => (
                    <div key={msg.id} className={`message${msg.sender === currentUser.uid ? " own" : ""}`}>
                      <span>{msg.text}</span>
                    </div>
                  ))}
                </div>
                <form className="message-form" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <button type="submit">Send</button>
                </form>
              </div>
            </>
          ) : (
            <div className="chats-messages-empty">
              <p>Select a chat to start messaging</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chats;