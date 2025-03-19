import React, { useState } from "react";
import SlidingSidebar from "./SlidingSidebar";
import { useDispatch } from "react-redux";
import { addPost } from "../features/postsSlice";
import "../styles/CreatePost.css";
import { FaTimes, FaUpload } from "react-icons/fa";

function CreatePost({ isOpen, onClose }) {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const dispatch = useDispatch();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreatePost = () => {
    if (image && description.trim()) {
      dispatch(addPost({
        id: Date.now(),
        name: "User",
        username: "User1",
        userImage: "https://randomuser.me/api/portraits/men/3.jpg",
        postImage: image,
        description: description,
        likes: 0,
      }));
      setImage(null);
      setDescription("");
      onClose();
    }
  };

  return (
    <SlidingSidebar isOpen={isOpen} onClose={onClose}>
      <div className="create-post-header">
        <h3>Create Post</h3>
        <button className="close-create-post-btn" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="create-post-content">
        {/* Preview */}
        {image && <img src={image} alt="Preview" className="image-preview" />}

        {/* Image Upload */}
        <label htmlFor="file-upload" className="file-input-label">
          <FaUpload />
          Click to upload an image
        </label>
        <input id="file-upload" type="file" accept="image/*" onChange={handleImageUpload} className="file-input" />

        {/* Description */}
        <textarea
          placeholder="Write a description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="description-input"
        />

        {/* Post button */}
        <button onClick={handleCreatePost} className="create-post-btn" disabled={!image || !description.trim()}>
          Post
        </button>
      </div>
    </SlidingSidebar>
  );
}

export default CreatePost;