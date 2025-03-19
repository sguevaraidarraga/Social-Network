import React, { useState } from "react";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import "../styles/Post.css";
import PostModal from "./PostModal";

function Post({ name, username, userImage, postImage, description }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showHeart, setShowHeart] = useState(false);

  const handleLike = () => {
    setLiked(!liked);
    setLikes(liked ? likes - 1 : likes + 1);
  };

  const handleDoubleClickLike = () => {
    if (!liked) {
      setLiked(true);
      setLikes(likes + 1);
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1200);
  };

  const handleComment = (e) => {
    e.preventDefault();
    const comment = e.target.elements.comment.value;
    if (comment) {
      setComments([...comments, comment]);
      e.target.reset();
    }
  };

  return (
    <>
      <div className="post">

        {/* User Info */}
        <div className="post-header">
          <img src={userImage} alt="User" className="user-image" />
          <div className="user-info">
            <h3 className="user-name">{name}</h3>
            <p className="username">@{username}</p>
          </div>
        </div>

        {/* Image and doubleclick like */}
        <div className="post-image-container" onDoubleClick={handleDoubleClickLike}>
          <img src={postImage} alt="Post" className="post-image" />
          {showHeart && <AiFillHeart className="big-heart" />}
        </div>

        {/* Actions */}
        <div className="post-actions">
          <button className="like-button" onClick={handleLike}>
            {liked ? <AiFillHeart className="icon liked" /> : <AiOutlineHeart className="icon" />}
          </button>
          <button className="comment-button" onClick={() => setShowModal(true)}>
            <AiOutlineComment className="icon" />
          </button>
        </div>

        {/* Post Info */}
        <div className="post-info">
          <p className="post-likes">{likes} likes</p>
          <p className="post-description"><strong>{username}</strong> {description}</p>
        </div>

        {/* Add Comment */}
        <div className="comment-section">
          <form onSubmit={handleComment} className="comment-form">
            <input type="text" name="comment" className="comment-input" placeholder="Add a comment..." autocomplete="off" />
            <button type="submit" className="comment-button">Post</button>
          </form>
        </div>
      </div>

      {/* Modal Post */}
      {showModal && (
        <PostModal 
          post={{ name, username, userImage, postImage, description, comments, handleComment }} 
          onClose={() => setShowModal(false)} 
          handleLike={handleLike} 
          liked={liked} 
          likes={likes} 
          showHeart={showHeart}
          handleDoubleClickLike={handleDoubleClickLike}
        />
      )}
    </>
  );
}

export default Post;