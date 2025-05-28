import React, { useEffect, useState, useRef } from "react";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, collection, query, where, updateDoc, arrayUnion, arrayRemove, onSnapshot, getDoc } from "firebase/firestore";
import PostModal from "./PostModal";
import Sidebar from "./Sidebar";
import "../styles/Profile.css";
import { useParams, useNavigate } from "react-router-dom";

function Profile() {
  const { uid } = useParams();
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState("");
  const [editPhotoURL, setEditPhotoURL] = useState("");
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    let unsubscribePosts = null;
    let unsubscribeUser = null;
    let unsubscribeCurrentUser = null;
    const db = getFirestore();
    const auth = getAuth();
    const currentUser = auth.currentUser;
    // Corrige: userId debe ser uid si existe, si no, el usuario actual
    const userId = uid ? uid : (currentUser && currentUser.uid);

    if (!userId) {
      setLoading(false);
      return;
    }

    // Suscribirse en tiempo real a los datos del usuario (visitado o propio)
    const userRef = doc(db, "users", userId);
    unsubscribeUser = onSnapshot(userRef, (userSnap) => {
      if (userSnap.exists()) {
        setUserData(userSnap.data());
        setEditDisplayName(userSnap.data().displayName || "");
        setEditPhotoURL(userSnap.data().photoURL || "");
      } else {
        setUserData(null);
      }
    });

    // Saber si el usuario actual sigue a este perfil (en tiempo real)
    if (uid && currentUser && currentUser.uid !== uid) {
      const currentUserRef = doc(db, "users", currentUser.uid);
      if (unsubscribeCurrentUser) unsubscribeCurrentUser();
      unsubscribeCurrentUser = onSnapshot(currentUserRef, (currentUserSnap) => {
        if (currentUserSnap.exists()) {
          const following = Array.isArray(currentUserSnap.data().following) ? currentUserSnap.data().following : [];
          setIsFollowing(following.includes(uid));
        }
      });
    } else {
      setIsFollowing(false);
    }

    // Obtener posts del usuario en tiempo real
    const postsRef = collection(db, "posts");
    const q = query(postsRef, where("userId", "==", userId));
    unsubscribePosts = onSnapshot(q, (postsSnap) => {
      setUserPosts(postsSnap.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      setLoading(false);
    });

    return () => {
      if (unsubscribePosts) unsubscribePosts();
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribeCurrentUser) unsubscribeCurrentUser();
    };
  }, [uid]);

  // Botón de seguir
  const handleFollow = async () => {
    if (followLoading || isFollowing) return;
    setFollowLoading(true);
    const db = getFirestore();
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser || !uid || currentUser.uid === uid) {
      setFollowLoading(false);
      return;
    }
    const currentUserRef = doc(db, "users", currentUser.uid);
    const profileUserRef = doc(db, "users", uid);

    // Lee los datos actuales de ambos usuarios para los contadores correctos
    const [currentUserSnap, profileUserSnap] = await Promise.all([
      getDoc(currentUserRef),
      getDoc(profileUserRef)
    ]);

    await Promise.all([
      updateDoc(currentUserRef, {
        following: arrayUnion(uid),
        followingCount: (currentUserSnap.data()?.followingCount || 0) + 1
      }),
      updateDoc(profileUserRef, {
        followers: arrayUnion(currentUser.uid),
        followersCount: (profileUserSnap.data()?.followersCount || 0) + 1
      })
    ]);
    setFollowLoading(false);
  };

  // Botón de dejar de seguir
  const handleUnfollow = async () => {
    if (followLoading || !isFollowing) return;
    setFollowLoading(true);
    const db = getFirestore();
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser || !uid || currentUser.uid === uid) {
      setFollowLoading(false);
      return;
    }
    const currentUserRef = doc(db, "users", currentUser.uid);
    const profileUserRef = doc(db, "users", uid);

    // Lee los datos actuales de ambos usuarios para los contadores correctos
    const [currentUserSnap, profileUserSnap] = await Promise.all([
      getDoc(currentUserRef),
      getDoc(profileUserRef)
    ]);

    await Promise.all([
      updateDoc(currentUserRef, {
        following: arrayRemove(uid),
        followingCount: Math.max(0, (currentUserSnap.data()?.followingCount || 1) - 1)
      }),
      updateDoc(profileUserRef, {
        followers: arrayRemove(currentUser.uid),
        followersCount: Math.max(0, (profileUserSnap.data()?.followersCount || 1) - 1)
      })
    ]);
    setFollowLoading(false);
  };

  const handleEditProfile = () => {
    setEditing(true);
  };

  const handleSaveProfile = async () => {
    if (!userData) return;
    const db = getFirestore();
    const userRef = doc(db, "users", userData.uid);
    await updateDoc(userRef, {
      displayName: editDisplayName,
      photoURL: editPhotoURL
    });
    setUserData({ ...userData, displayName: editDisplayName, photoURL: editPhotoURL });
    setEditing(false);
  };

  const handleCancelEdit = () => {
    setEditDisplayName(userData.displayName || "");
    setEditPhotoURL(userData.photoURL || "");
    setEditing(false);
  };

  const isOwnProfile = () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    return !uid || (currentUser && currentUser.uid === uid);
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <div className="profile-container" style={{ marginLeft: 350 }}>
        {loading ? (
          <div style={{ width: "100%" }}>Loading...</div>
        ) : !userData ? (
          <div className="profile-container">User not found.</div>
        ) : (
          <>
            <div className="profile-header">
              <img
                src={editing ? editPhotoURL || "https://randomuser.me/api/portraits/men/1.jpg" : userData.photoURL || "https://randomuser.me/api/portraits/men/1.jpg"}
                alt={userData.username}
                className="profile-avatar"
              />
              <div className="profile-info">
                {editing ? (
                  <>
                    <input
                      className="profile-edit-input"
                      type="text"
                      value={editDisplayName}
                      onChange={e => setEditDisplayName(e.target.value)}
                      placeholder="Display name"
                    />
                    <input
                      className="profile-edit-input"
                      type="text"
                      value={editPhotoURL}
                      onChange={e => setEditPhotoURL(e.target.value)}
                      placeholder="Photo URL"
                    />
                    <div className="profile-edit-actions">
                      <button className="profile-edit-save" onClick={handleSaveProfile}>Save</button>
                      <button className="profile-edit-cancel" onClick={handleCancelEdit}>Cancel</button>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="profile-name">{userData.displayName || userData.username}</h2>
                    <p className="profile-username">@{userData.username}</p>
                    <div className="profile-stats">
                      <span><strong>{userData.postsCount ?? userPosts.length}</strong> posts</span>
                      <span>
                        <strong>
                          {userData.followersCount ?? (userData.followers ? userData.followers.length : 0)}
                        </strong> followers
                      </span>
                      <span>
                        <strong>
                          {userData.followingCount ?? (userData.following ? userData.following.length : 0)}
                        </strong> following
                      </span>
                    </div>
                    {/* Botón de seguir solo si no es tu propio perfil */}
                    {!isOwnProfile() && (
                      isFollowing ? (
                        <button
                          className="profile-follow-btn following"
                          onClick={handleUnfollow}
                          disabled={followLoading}
                        >
                          Unfollow
                        </button>
                      ) : (
                        <button
                          className="profile-follow-btn"
                          onClick={handleFollow}
                          disabled={followLoading}
                        >
                          Follow
                        </button>
                      )
                    )}
                    {isOwnProfile() && (
                      <button className="profile-edit-btn" onClick={handleEditProfile}>
                        Edit Profile
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
            <div className="profile-posts">
              {userPosts.length > 0 ? (
                userPosts.map(post => (
                  <div
                    className="profile-post-thumb"
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                  >
                    <img src={post.postImage} alt="Post" />
                  </div>
                ))
              ) : (
                <p className="no-posts">No posts yet</p>
              )}
            </div>
            {selectedPost && (
              <PostModal
                post={selectedPost}
                onClose={() => setSelectedPost(null)}
                handleLike={() => {}}
                liked={false}
                likes={selectedPost.likes ? selectedPost.likes.length : 0}
                showHeart={false}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
