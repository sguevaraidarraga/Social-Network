import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import Post from "./Post";
import "../styles/Feed.css";
import { getFirestore, collection, onSnapshot, query, orderBy, doc, getDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { setPosts } from "../features/postsSlice";

function Feed() {
  const posts = useSelector((state) => state.posts.posts);
  const dispatch = useDispatch();
  const [following, setFollowing] = useState([]);
  const [currentUid, setCurrentUid] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) return;
    setCurrentUid(user.uid);

    const db = getFirestore();
    const userRef = doc(db, "users", user.uid);
    getDoc(userRef).then((snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setFollowing(Array.isArray(data.following) ? data.following : []);
      }
    });
  }, []);

  useEffect(() => {
    const db = getFirestore();
    const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      dispatch(setPosts(postsData));
    });
    return () => unsubscribe();
  }, [dispatch]);

  // Filtrar posts: solo los de los usuarios seguidos y los propios
  const filteredPosts = posts.filter(
    (post) =>
      (currentUid && post.userId === currentUid) ||
      (Array.isArray(following) && following.includes(post.userId))
  );

  return (
    <div className="feed-container">
      <div className="feed">
        {filteredPosts && filteredPosts.length > 0 ? (
          filteredPosts.map((post) => <Post key={post.id} {...post} id={post.id} />)
        ) : (
          <p className="no-posts">No posts yet</p>
        )}
      </div>
    </div>
  );
}

export default Feed;