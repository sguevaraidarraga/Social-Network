import React, { useState } from "react";
import SlidingSidebar from "./SlidingSidebar";
import "../styles/CreatePost.css";
import { FaTimes, FaUpload } from "react-icons/fa";
import { getAuth } from "firebase/auth";
import { getFirestore, collection, addDoc, doc, updateDoc, arrayUnion, setDoc } from "firebase/firestore";

function CreatePost({ isOpen, onClose }) {
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");

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

  const handleCreatePost = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;

    const db = getFirestore();
    const post = {
      name: user.displayName || user.email || "Usuario",
      username: user.email ? user.email.split("@")[0] : "",
      userImage: user.photoURL || "https://randomuser.me/api/portraits/men/1.jpg",
      postImage: image,
      description: description,
      likes: [], // array de uids
      comments: [],
      timestamp: Date.now(),
      userId: user.uid,
    };

    try {
      // Guardar post global y obtener ID de Firestore
      const docRef = await addDoc(collection(db, "posts"), post);
      await updateDoc(doc(db, "posts", docRef.id), { id: docRef.id });

      // Guardar solo la referencia (id) en el perfil del usuario
      const userRef = doc(db, "users", user.uid);
      try {
        await updateDoc(userRef, {
          posts: arrayUnion(docRef.id)
        });
      } catch (e) {
        await setDoc(userRef, {
          posts: [docRef.id]
        }, { merge: true });
      }
    } catch (e) {
      console.error("Error al guardar el post en Firestore:", e);
      alert("Error al guardar el post. Revisa la consola para más detalles.");
    }

    setImage(null);
    setDescription("");
    onClose();
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
        <button onClick={handleCreatePost} className="create-post-btn" disabled={!image}>
          Post
        </button>
      </div>
    </SlidingSidebar>
  );
}

export default CreatePost;