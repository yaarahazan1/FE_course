import React, { useState, useEffect } from "react";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../../../firebase/config";
import "./ProjectChat.css";

const ProjectChat = ({ projectId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // קבלת ID המשתמש
  const getCurrentUserId = () => auth.currentUser?.uid || "demo-user";

  // טעינת הודעות מה־Firebase
  useEffect(() => {
    if (!projectId) return;

    const q = query(
      collection(db, "projects", projectId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = [];
      querySnapshot.forEach((doc) => {
        msgs.push({ id: doc.id, ...doc.data() });
      });
      setMessages(msgs);
    }, (error) => {
      console.error("שגיאה בטעינת הודעות:", error);
    });

    return () => unsubscribe();
  }, [projectId]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!newMessage.trim()) return;

    const userId = getCurrentUserId();
    const userName = auth.currentUser?.displayName || "אני";
    const currentTime = new Date();

    const msgData = {
      sender: userName,
      userId,
      message: newMessage,
      createdAt: currentTime,
      time: `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')}`,
      isMine: true
    };

    try {
      await addDoc(collection(db, "projects", projectId, "messages"), msgData);
      setNewMessage("");
    } catch (error) {
      console.error("שגיאה בשליחת הודעה:", error);
    }
  };

  return (
    <div className="project-chat" onClick={(e) => e.stopPropagation()}>
      <div className="chat-header">
        <h3>צ'אט צוות</h3>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`chat-message ${msg.userId === getCurrentUserId() ? 'my-message' : 'other-message'}`}
          >
            <div className="message-content">
              <p>{msg.message}</p>
              <div className="message-meta">
                <span className="message-time">{msg.time}</span>
                {msg.userId !== getCurrentUserId() && <span className="message-sender">{msg.sender}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form className="chat-input-form" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="כתוב הודעה..."
          className="chat-input"
        />
        <button type="submit" className="send-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 2L11 13M22 2L15 22L11 13L2 9L22 2z"></path>
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ProjectChat;
