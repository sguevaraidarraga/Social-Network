import React from "react";
import { useSelector } from "react-redux";
import Post from "./Post";
import "../styles/Feed.css";

function Feed() {
  const posts = useSelector((state) => state.posts.posts);
  return (
    <div className="feed-container">
      <div className="feed">
        {posts && posts.length > 0 ? (
          posts.map((post) => <Post key={post.id} {...post} />)
        ) : (
          <p className="no-posts">No posts yet</p>
        )}
      </div>
    </div>
  );
}

export default Feed;