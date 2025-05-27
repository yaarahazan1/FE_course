import React, { useState } from "react";
import "./PostForm.css";

const PostForm = () => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      alert(`פוסט פורסם: ${text}`);
      setText("");
    }
  };

  return (
    <div className="post-form-container">
      <div className="post-form-header">שתף עדכון</div>
      <form onSubmit={handleSubmit} className="post-form">
        <textarea
          className="post-input"
          placeholder="שתפו משהו עם חברי הקבוצה שלכם..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        ></textarea>
        <div className="post-actions">
          <button type="button" className="post-tag">אירוע</button>
          <button type="button" className="post-tag">מסמך</button>
          <button type="button" className="post-tag">תמונה</button>
          <button type="submit" className="post-submit">פרסם</button>
        </div>
      </form>
    </div>
  );
};

export default PostForm;
