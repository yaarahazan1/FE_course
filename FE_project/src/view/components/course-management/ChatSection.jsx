import React, { useState } from "react";
import { Send } from "lucide-react";
import "./ChatSection.css";

const ChatSection = ({ initialMessages = [] }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (newMessage.trim()) {
      const newMsg = {
        id: messages.length + 1,
        sender: "אתה",
        message: newMessage,
        time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages([...messages, newMsg]);
      setNewMessage("");
    }
  };

  return (
    <div className="chat-card">
      <div className="chat-header">
        <h3 className="chat-title">צ'אט קבוצתי</h3>
      </div>
      <div className="chat-content">
        <div className="chat-messages-container">
          <div className="chat-messages">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`chat-message ${msg.sender === "אתה" ? "chat-message-self" : "chat-message-other"}`}
              >
                <div className="message-sender">{msg.sender}</div>
                <p className="message-text">{msg.message}</p>
                <div className="message-time">{msg.time}</div>
              </div>
            ))}
          </div>
        </div>
        
        <form onSubmit={handleSendMessage} className="chat-input-container">
          <textarea
            placeholder="לכתוב הודעה כאן..."
            className="chat-input"
            dir="rtl"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            rows={2}
          />
          <button 
            type="submit"
            className={`send-button ${!newMessage.trim() ? 'send-button-disabled' : ''}`}
            disabled={!newMessage.trim()}
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatSection;