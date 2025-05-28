import React, { useState } from "react";
import { AiOutlineHeart, AiFillHeart, AiOutlineComment } from "react-icons/ai";
import "../styles/Post.css";
import PostModal from "./PostModal";
import { useDispatch } from "react-redux";
import { updatePost } from "../features/postsSlice";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

function Post(props) {
  const { id, name, username, userImage, postImage, description, likes: initialLikes = [], comments: initialComments = [], userId } = props;
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const currentUid = currentUser ? currentUser.uid : null;

  // likes es un array de uids
  const [likes, setLikes] = useState(Array.isArray(initialLikes) ? initialLikes : []);
  const [liked, setLiked] = useState(currentUid ? likes.includes(currentUid) : false);
  const [comments, setComments] = useState(initialComments);
  const [showModal, setShowModal] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const dispatch = useDispatch();

  const handleLike = async () => {
    if (!currentUid) return;
    let newLikes;
    let newLiked;
    if (liked) {
      newLikes = likes.filter(uid => uid !== currentUid);
      newLiked = false;
    } else {
      newLikes = [...likes, currentUid];
      newLiked = true;
    }
    setLikes(newLikes);
    setLiked(newLiked);

    // Actualiza en Firestore el documento actual
    if (id) {
      const db = getFirestore();
      const postRef = doc(db, "posts", id);
      await updateDoc(postRef, { likes: newLikes });
      dispatch(updatePost({ ...props, likes: newLikes, comments }));
    }
  };

  const handleDoubleClickLike = () => {
    if (!liked && currentUid) {
      const newLikes = [...likes, currentUid];
      setLiked(true);
      setLikes(newLikes);
      if (id) {
        const db = getFirestore();
        const postRef = doc(db, "posts", id);
        updateDoc(postRef, { likes: newLikes });
        dispatch(updatePost({ ...props, likes: newLikes, comments }));
      }
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1200);
  };

  const handleComment = async (e) => {
    e.preventDefault();
    const comment = e.target.elements.comment.value;
    if (comment) {
      const newComments = [...comments, comment];
      setComments(newComments);
      e.target.reset();

      // Actualiza en Firestore el documento actual
      if (id) {
        const db = getFirestore();
        const postRef = doc(db, "posts", id);
        await updateDoc(postRef, { comments: newComments });
        dispatch(updatePost({ ...props, likes, comments: newComments }));
      }
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
          {/* Mostrar likes solo si hay al menos 1 */}
          {likes.length > 0 && (
            <p className="post-likes">
              {likes.length} like{likes.length > 1 ? "s" : ""}
            </p>
          )}
          {/* Solo mostrar descripción si existe */}
          {description && description.trim() && (
            <p className="post-description"><strong>{username}</strong> {description}</p>
          )}
          {/* Mostrar link de comentarios si hay comentarios */}
          {comments.length === 1 && (
            <p
              className="view-comments"
              onClick={() => setShowModal(true)}
            >
              View 1 comment
            </p>
          )}
          {comments.length > 1 && (
            <p
              className="view-comments"
              onClick={() => setShowModal(true)}
            >
              View all {comments.length} comments
            </p>
          )}
        </div>

        {/* Add Comment */}
        <div className="comment-section">
          <form onSubmit={handleComment} className="comment-form">
            <input type="text" name="comment" className="comment-input" placeholder="Add a comment..." autoComplete="off" />
            <button type="submit" className="comment-button">Post</button>
          </form>
        </div>
      </div>

      {/* Modal Post */}
      {showModal && (
        <PostModal 
          post={{ ...props, comments, handleComment }} 
          onClose={() => setShowModal(false)} 
          handleLike={handleLike} 
          liked={liked} 
          likes={likes.length} 
          showHeart={showHeart}
          handleDoubleClickLike={handleDoubleClickLike}
        />
      )}
    </>
  );
}

export default Post;