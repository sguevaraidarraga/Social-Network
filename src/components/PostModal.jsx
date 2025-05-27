import React, { useState } from "react";
import { AiOutlineClose, AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import "../styles/PostModal.css";

function PostModal({ post, onClose, handleLike, liked, likes, showHeart }) {
  if(!post) return null;

  const [lastClickTime, setLastClickTime] = useState(0);

  const handleImageClick = () => {
    const currentTime = new Date().getTime();
    if(currentTime - lastClickTime < 300) {
      handleLike();
    }
    setLastClickTime(currentTime);
  };

  const allComments = [{ text: post.description, username: post.username }, ...post.comments.map(c => ({ text: c, username: post.username }))];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>

        {/* Exit icon */}
        <button className="close-modal" onClick={onClose}>
          <AiOutlineClose className="close-icon" />
        </button>

        {/* Post in modal */}
        <div className="modal-post">
          <div className="modal-image-container" onClick={handleImageClick}>
            <img src={post.postImage} alt="Post" className="modal-image" />
            {showHeart && <AiFillHeart className="big-heart" />}
          </div>
          <div className="modal-comments-section">
            {/* User Info */}
            <div className="modal-header">
              <div className="post-header">
                <img src={post.userImage} alt="User" className="user-image" />
                <div className="user-info">
                  <h3 className="user-name">{post.name}</h3>
                  <p className="username">@{post.username}</p>
                </div>
              </div>
            </div>

            {/* Comments */}
            <div className="modal-comments">
              {allComments.length > 0 ? (
                allComments.map((c, index) => (
                  <p key={index}><strong>{c.username}</strong> {c.text}</p>
                ))
              ) : (
                <p className="no-comments">No comments yet</p>
              )}
            </div>

            {/* Like and post button with comment box */}
            <div className="comment-section">
              <button className="like-button" onClick={handleLike}>
                {liked ? <AiFillHeart className="icon liked" /> : <AiOutlineHeart className="icon" />}
              </button>
              <form onSubmit={post.handleComment} className="comment-form">
                <input type="text" name="comment" className="comment-input" placeholder="Add a comment..." autoComplete="off" />
                <button type="submit" className="comment-button">Post</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostModal;