import React from "react";
import Post from "./Post";
import "../styles/Feed.css";

function Feed() {
  const posts = [
    {
      name: "Santiago",
      username: "User1",
      userImage: "https://randomuser.me/api/portraits/men/1.jpg", 
      postImage: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0", 
      description: "¡Disfrutando el día!"
    },
    { 
      name: "Maria",
      username: "User2", 
      userImage: "https://randomuser.me/api/portraits/women/2.jpg", 
      postImage: "https://images.unsplash.com/photo-1519681393784-d120267933ba", 
      description: "Nueva aventura 🚀"
    }
  ];    

  return (
    <div className="feed-container">
      <div className="feed">
        {posts.map((post, index) => (
          <Post 
            key={index} 
            name={post.name}
            username={post.username} 
            userImage={post.userImage} 
            postImage={post.postImage} 
            description={post.description} 
          />
        ))}
      </div>
    </div>
  );
}

export default Feed;