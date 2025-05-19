import React, { useState } from "react";
import "./ProjectChat.css";

const ProjectChat = ({ messages: initialMessages = [] }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    e.stopPropagation(); // מונע מהאירוע להתפשט למעלה לכרטיס הפרויקט
    if (!newMessage.trim()) return;
    
    const currentTime = new Date();
    const timeString = `${currentTime.getHours()}:${String(currentTime.getMinutes()).padStart(2, '0')}`;
    
    // בעתיד, כאן תהיה קריאה ל-API שתשמור את ההודעה ב-DB
    const newMsg = {
      id: Date.now(), // משמש כ-unique id זמני
      sender: "אני", // בעתיד יגיע משם המשתמש המחובר
      message: newMessage,
      time: timeString,
      isMine: true // סימון שזו הודעה שלי
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage("");
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
            className={`chat-message ${msg.isMine ? 'my-message' : 'other-message'}`}
          >
            <div className="message-content">
              <p>{msg.message}</p>
              <div className="message-meta">
                <span className="message-time">{msg.time}</span>
                {!msg.isMine && <span className="message-sender">{msg.sender}</span>}
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