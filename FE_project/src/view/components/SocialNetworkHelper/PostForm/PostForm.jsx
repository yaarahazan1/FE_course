import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import "./PostForm.css";

const PostForm = ({ currentUser, onPostAdded }) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const postData = {
        content: text.trim(),
        author: currentUser?.displayName || "משתמש אנונימי",
        authorId: currentUser?.uid || "anonymous",
        role: currentUser?.role || "חבר קבוצה",
        tag: selectedTag,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(),
        isActive: true
      };

      const docRef = await addDoc(collection(db, "socialPosts"), postData);
      
      // Reset form
      setText("");
      setSelectedTag("");
      
      // Call callback if provided
      if (onPostAdded) {
        onPostAdded({ id: docRef.id, ...postData });
      }

      alert("הפוסט פורסם בהצלחה!");
    } catch (error) {
      console.error("שגיאה בפרסום הפוסט:", error);
      alert("שגיאה בפרסום הפוסט. נסה שוב.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? "" : tag);
  };

  const tags = [
    { name: "אירוע", emoji: "📅", color: "#FF6B6B" },
    { name: "מסמך", emoji: "📄", color: "#4ECDC4" },
    { name: "תמונה", emoji: "📸", color: "#45B7D1" },
    { name: "שאלה", emoji: "❓", color: "#96CEB4" },
    { name: "עדכון", emoji: "📢", color: "#FFEAA7" }
  ];

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
          disabled={isLoading}
        />
        
        <div className="post-actions">
          <div className="post-tags">
            {tags.map((tag) => (
              <button
                key={tag.name}
                type="button"
                className={`post-tag ${selectedTag === tag.name ? 'selected' : ''}`}
                onClick={() => handleTagClick(tag.name)}
                style={{
                  backgroundColor: selectedTag === tag.name ? tag.color : undefined,
                  color: selectedTag === tag.name ? 'white' : undefined
                }}
                disabled={isLoading}
              >
                {tag.emoji} {tag.name}
              </button>
            ))}
          </div>
          
          <button 
            type="submit" 
            className="post-submit"
            disabled={!text.trim() || isLoading}
          >
            {isLoading ? "מפרסם..." : "פרסם"}
          </button>
        </div>
        
        {text.length > 0 && (
          <div className="character-count">
            {text.length}/500 תווים
          </div>
        )}
      </form>
    </div>
  );
};

export default PostForm;