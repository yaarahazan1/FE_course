import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../../../firebase/config";
import "./PostForm.css";

const PostForm = ({ currentUser, onPostAdded }) => {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState("");

  // הוסף לוגים מפורטים לבדיקה
  console.log("PostForm - currentUser:", currentUser);
  console.log("PostForm - currentUser exists:", !!currentUser);
  console.log("PostForm - currentUser uid:", currentUser?.uid);
  console.log("PostForm - currentUser displayName:", currentUser?.displayName);
  console.log("PostForm - currentUser email:", currentUser?.email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;

    // בדיקה משופרת שהמשתמש מחובר
    if (!currentUser || !currentUser.uid) {
      console.error("No valid user found:", currentUser);
      alert("אנא התחבר קודם כדי לפרסם פוסט");
      return;
    }

    console.log("Creating post with user:", currentUser);

    setIsLoading(true);
    try {
      // יצירת שם מחבר מתוקן
      const authorName = currentUser.displayName || 
                        currentUser.email || 
                        `משתמש ${currentUser.uid.slice(-6)}`;

      const postData = {
        content: text.trim(),
        author: authorName,
        authorId: currentUser.uid, // וודא שזה תמיד קיים
        role: currentUser.role || "חבר קבוצה",
        tag: selectedTag,
        likes: 0,
        comments: 0,
        shares: 0,
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString(),
        isActive: true
      };

      console.log("Post data to be saved:", postData);

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

  // בדיקה משופרת אם המשתמש מחובר
  if (!currentUser || !currentUser.uid) {
    return (
      <div className="post-form-container">
        <div className="post-form-header">
          <div style={{ color: 'red', padding: '10px' }}>
            אנא התחבר כדי לפרסם פוסט
            <br />
            <small>Debug: currentUser = {JSON.stringify(currentUser)}</small>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="post-form-container">
      <div className="post-form-header">
        שתף עדכון
        <div style={{ fontSize: '14px', color: '#666', marginTop: '5px' }}>
          מחובר כ: {currentUser.displayName || currentUser.email || currentUser.uid}
        </div>
      </div>
      <form onSubmit={handleSubmit} className="post-form">
        <textarea
          className="post-input"
          placeholder="שתפו משהו עם חברי הקבוצה שלכם..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          disabled={isLoading}
        />
        
        <div className="post-form-actions">
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