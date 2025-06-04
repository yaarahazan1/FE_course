import React, { useState, useEffect } from "react";
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  increment,
  addDoc,
  serverTimestamp 
} from "firebase/firestore";
import { db } from "../../../../firebase/config";
import "./PostFeed.css";

const PostFeed = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});

  useEffect(() => {
    const q = query(
      collection(db, "socialPosts"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate() || new Date()
      }));
      setPosts(postsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLike = async (postId) => {
    try {
      const postRef = doc(db, "socialPosts", postId);
      await updateDoc(postRef, {
        likes: increment(1)
      });
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleShare = async (postId) => {
    try {
      const postRef = doc(db, "socialPosts", postId);
      await updateDoc(postRef, {
        shares: increment(1)
      });
      alert("הפוסט שותף בהצלחה!");
    } catch (error) {
      console.error("Error sharing post:", error);
    }
  };

  const handleComment = async (postId) => {
    const text = commentText[postId]?.trim();
    if (!text) return;

    try {
      // Add comment to comments subcollection
      await addDoc(collection(db, "socialPosts", postId, "comments"), {
        text,
        author: currentUser?.displayName || "משתמש אנונימי",
        authorId: currentUser?.uid || "anonymous",
        timestamp: serverTimestamp(),
        createdAt: new Date().toISOString()
      });

      // Update comment count
      const postRef = doc(db, "socialPosts", postId);
      await updateDoc(postRef, {
        comments: increment(1)
      });

      // Clear comment input
      setCommentText(prev => ({ ...prev, [postId]: "" }));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    
    const now = new Date();
    const postTime = timestamp instanceof Date ? timestamp : new Date(timestamp);
    const diffInMinutes = Math.floor((now - postTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return "עכשיו";
    if (diffInMinutes < 60) return `לפני ${diffInMinutes} דקות`;
    if (diffInMinutes < 1440) return `לפני ${Math.floor(diffInMinutes / 60)} שעות`;
    return `לפני ${Math.floor(diffInMinutes / 1440)} ימים`;
  };

  const getTagStyle = (tag) => {
    const tagColors = {
      "אירוע": "#FF6B6B",
      "מסמך": "#4ECDC4", 
      "תמונה": "#45B7D1",
      "שאלה": "#96CEB4",
      "עדכון": "#FFEAA7"
    };
    return {
      backgroundColor: tagColors[tag] || "#e5e1da",
      color: tag && tagColors[tag] ? "white" : "#4b4f55"
    };
  };

  if (loading) {
    return (
      <div className="post-feed-loading">
        <div className="loading-spinner"></div>
        <p>טוען פוסטים...</p>
      </div>
    );
  }

  return (
    <div className="post-feed">
      {posts.length === 0 ? (
        <div className="empty-feed">
          <div className="empty-icon">📝</div>
          <h3>אין פוסטים עדיין</h3>
          <p>היו הראשונים לשתף משהו עם הקבוצה!</p>
        </div>
      ) : (
        posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-avatar">
                {post.author?.charAt(0)?.toUpperCase() || "A"}
              </div>
              <div className="post-author-info">
                <div className="post-author-name">
                  <span className="post-author">{post.author}</span>
                  {post.tag && (
                    <span 
                      className="post-tag-badge"
                      style={getTagStyle(post.tag)}
                    >
                      {post.tag}
                    </span>
                  )}
                </div>
                <div className="post-meta">
                  <span className="post-role">{post.role}</span>
                  <span className="post-time">• {formatTime(post.timestamp)}</span>
                </div>
              </div>
            </div>

            <div className="post-content">{post.content}</div>

            {post.attachment && (
              <div className="post-attachment">
                <div className="file-icon">📄</div>
                <div className="file-details">
                  <div className="file-name">{post.attachment.name}</div>
                  <div className="file-size">{post.attachment.size}</div>
                </div>
              </div>
            )}

            <div className="post-footer">
              <div className="post-actions">
                <button 
                  className="post-action-btn like-btn"
                  onClick={() => handleLike(post.id, post.likes)}
                >
                  ❤️ {post.likes || 0}
                </button>
                
                <button 
                  className="post-action-btn comment-btn"
                  onClick={() => toggleComments(post.id)}
                >
                  💬 {post.comments || 0}
                </button>
                
                <button 
                  className="post-action-btn share-btn"
                  onClick={() => handleShare(post.id)}
                >
                  🔄 {post.shares || 0}
                </button>
              </div>
            </div>

            {showComments[post.id] && (
              <div className="comments-section">
                <div className="comment-input-section">
                  <input
                    type="text"
                    className="comment-input"
                    placeholder="הוסף תגובה..."
                    value={commentText[post.id] || ""}
                    onChange={(e) => setCommentText(prev => ({
                      ...prev,
                      [post.id]: e.target.value
                    }))}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleComment(post.id);
                      }
                    }}
                  />
                  <button 
                    className="comment-submit-btn"
                    onClick={() => handleComment(post.id)}
                    disabled={!commentText[post.id]?.trim()}
                  >
                    שלח
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default PostFeed;