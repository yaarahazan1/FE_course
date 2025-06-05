import { useState, useEffect } from "react";
import "./PostFeed.css";

const PostFeed = ({ posts, currentUser = { id: 'user1', isAdmin: false }, onDeletePost = () => {} }) => {
  const [loading, setLoading] = useState(true);
 
  useEffect(() => {
    setLoading(false)
  }, [posts]);

  const handleDelete = (postId) => {
    if (window.confirm("האם אתה בטוח שברצונך למחוק את הפוסט?")) {
      onDeletePost(postId);
    }
  };

  const canDeletePost = (post) => {
    console.log("=== DELETE PERMISSION CHECK ===");
    console.log("Current User:", currentUser);
    console.log("Current User UID:", currentUser?.uid);
    console.log("Post:", post);
    console.log("Post Author ID:", post.authorId);
    console.log("Post Author:", post.author);
    
    if (!currentUser || !currentUser.uid) {
      console.log("❌ No current user or UID");
      return false;
    }
    
    if (!post.authorId) {
      console.log("❌ No post authorId");
      return false;
    }
    
    const canDelete = currentUser.uid === post.authorId;
    console.log("🔍 Permission result:", canDelete);
    console.log("================================");
    
    return canDelete;
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
      posts.map((post) => {
        
        return (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="post-avatar">{post.author.slice(0, 1)}</div>
              <div className="post-author-info">
                <div className="post-author">{post.author}</div>
                <div className="post-role">{post.role}</div>
              </div>
                           {canDeletePost(post) && (
                <div className="post-actions-menu">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(post.id)}
                    title="מחק פוסט"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              )}
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
              <button className="post-button">שתף ↩</button>
              <div className="post-stats">
                <span className="stat">💬 {post.comments}</span>
                <span className="stat">❤️ {post.likes}</span>
              </div>
            </div>
          </div>
        );
      }))}
    </div>
  );
};

export default PostFeed;