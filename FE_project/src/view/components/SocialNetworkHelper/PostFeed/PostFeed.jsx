import React from "react";
import "./PostFeed.css";

const PostFeed = ({ posts }) => {
  return (
    <div className="post-feed">
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <div className="post-header">
            <div className="post-avatar">{post.author.slice(0, 1)}</div>
            <div className="post-author-info">
              <div className="post-author">{post.author}</div>
              <div className="post-role">{post.role}</div>
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
            <button className="post-button">שתף ↩</button>
            <div className="post-stats">
              <span className="stat">💬 {post.comments}</span>
              <span className="stat">❤️ {post.likes}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostFeed;
