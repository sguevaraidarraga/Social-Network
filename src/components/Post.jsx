import React, { useState } from "react";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment, AiOutlineClose } from "react-icons/ai";
import "../styles/Post.css";

function Post({ name, username, userImage, postImage, description }) {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showHeart, setShowHeart] = useState(false); // Para la animación en el feed
  const [showModalHeart, setShowModalHeart] = useState(false); // Para la animación en el modal

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
    setTimeout(() => setShowHeart(false), 1200); // Duración de la animación
  };

  const handleDoubleClickLikeModal = () => {
    if (!liked) {
      setLiked(true);
      setLikes(likes + 1);
    }
    setShowModalHeart(true);
    setTimeout(() => setShowModalHeart(false), 1200);
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
        {/* Usuario */}
        <div className="post-header">
          <img src={userImage} alt="User" className="user-image" />
          <div className="user-info">
            <h3 className="user-name">{name}</h3>
            <p className="username">@{username}</p>
          </div>
        </div>

        {/* Imagen del post con doble clic para dar like */}
        <div className="post-image-container" onDoubleClick={handleDoubleClickLike}>
          <img src={postImage} alt="Post" className="post-image" />
          {showHeart && <AiFillHeart className="big-heart" />}
        </div>

        {/* Acciones */}
        <div className="post-actions">
          <button className="like-button" onClick={handleLike}>
            {liked ? <AiFillHeart className="icon liked" /> : <AiOutlineHeart className="icon" />}
          </button>
          <button className="comment-button" onClick={() => setShowModal(true)}>
            <AiOutlineComment className="icon" />
          </button>
        </div>

        {/* Información del post */}
        <div className="post-info">
          <p className="post-likes">{likes} likes</p>
          <p className="post-description"><strong>{username}</strong> {description}</p>
        </div>

        {/* Sección de comentarios */}
        <div className="comment-section">
          <form onSubmit={handleComment} style={{ display: "flex", width: "100%" }}>
            <input type="text" name="comment" className="comment-input" placeholder="Add a comment..." />
            <button type="submit" className="comment-button">Post</button>
          </form>
        </div>
      </div>

      {/* Modal grande con el post completo y los comentarios */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {/* Botón de cierre con icono de "X" */}
            <button className="close-modal" onClick={() => setShowModal(false)}>
              <AiOutlineClose className="close-icon" />
            </button>

            {/* Post dentro del modal */}
            <div className="modal-post">
              <div className="modal-image-container" onDoubleClick={handleDoubleClickLikeModal}>
                <img src={postImage} alt="Post" className="modal-image" />
                {showModalHeart && <AiFillHeart className="big-heart" />}
              </div>
              <div className="modal-comments-section">
                <div className="post-header">
                  <img src={userImage} alt="User" className="user-image" />
                  <div className="user-info">
                    <h3 className="user-name">{name}</h3>
                    <p className="username">@{username}</p>
                  </div>
                </div>
                <p className="post-description"><strong>{username}</strong> {description}</p>
                <div className="modal-comments">
                  {comments.length > 0 ? (
                    comments.map((c, index) => (
                      <p key={index}><strong>{username}</strong> {c}</p>
                    ))
                  ) : (
                    <p className="no-comments">No comments yet</p>
                  )}
                </div>
                {/* Sección de añadir comentario */}
                <div className="comment-section">
                  <form onSubmit={handleComment} style={{ display: "flex", width: "100%" }}>
                    <input type="text" name="comment" className="comment-input" placeholder="Add a comment..." />
                    <button type="submit" className="comment-button">Post</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Post;