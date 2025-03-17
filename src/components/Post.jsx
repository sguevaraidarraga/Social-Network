import React, { useState } from "react";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import "../styles/Post.css";

function Post({ name, username, userImage, postImage, description }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showHeart, setShowHeart] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  const handleComment = (e) => {
    e.preventDefault();
    const comment = e.target.elements.comment.value;
    if (comment) {
      setComments([...comments, comment]);
      e.target.reset();
    }
  };

  const handleDoubleClick = () => {
    if (!liked) {
      handleLike();
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1200); // Corazón desaparece después de 1.2s
  };

  return (
    <div className="post">
      {/* Usuario */}
      <div className="post-header" style={{ paddingLeft: "10px" }}>
        <img src={userImage} alt="User" className="user-image" />
        <div className="user-info">
          <h3 className="user-name">{name}</h3>
          <p className="username">@{username}</p>
        </div>
      </div>

      {/* Imagen del post */}
      <div className="post-image-container" onDoubleClick={handleDoubleClick}>
        <img src={postImage} alt="Post" className="post-image" />
        {showHeart && <AiFillHeart className="big-heart" />} {/* Corazón grande */}
      </div>

      {/* Acciones */}
      <div className="post-actions">
        <button className="like-button" onClick={handleLike}>
          {liked ? <AiFillHeart className="icon liked" /> : <AiOutlineHeart className="icon" />}
        </button>
        <button className="comment-button"><AiOutlineComment className="icon" /></button>
      </div>

      {/* Información del post */}
      <div className="post-info">
        <p className="post-likes">{likes} likes</p>
        <p className="post-description"><strong>{username}</strong> {description}</p>
      </div>

      {/* Comentarios */}
      <div className="comments">
        <form onSubmit={handleComment}>
          <input type="text" name="comment" placeholder="Add a comment..." />
          <button type="submit">Post</button>
        </form>
        {comments.map((c, index) => (
          <p key={index}><strong>Anon:</strong> {c}</p>
        ))}
      </div>
    </div>
  );
}

export default Post;