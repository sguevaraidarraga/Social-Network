import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/index.css"
import "../styles/Login.css";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigate("/home");
            }
        });
        return () => unsubscribe();
    }, [auth, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, username, password);
            // Solo crear usuario en Firestore si no existe
            const user = auth.currentUser;
            if (user) {
                const db = getFirestore();
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        uid: user.uid,
                        username: user.email ? user.email.split("@")[0] : "",
                        email: user.email,
                        displayName: user.displayName || "",
                        photoURL: user.photoURL || "",
                        following: [],
                        followers: [],
                        posts: [],
                        postsCount: 0,
                        followersCount: 0,
                        followingCount: 0
                    });
                }
            }
            // El resto lo maneja onAuthStateChanged
        } catch (error) {
            alert("Username or password is incorrect");
        }
    };

    const handleGoogleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            // Solo crear usuario en Firestore si no existe
            const user = auth.currentUser;
            if (user) {
                const db = getFirestore();
                const userRef = doc(db, "users", user.uid);
                const userSnap = await getDoc(userRef);
                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        uid: user.uid,
                        username: user.email ? user.email.split("@")[0] : "",
                        email: user.email,
                        displayName: user.displayName || "",
                        photoURL: user.photoURL || "",
                        following: [],
                        followers: [],
                        posts: [],
                        postsCount: 0,
                        followersCount: 0,
                        followingCount: 0
                    });
                }
            }
        } catch (error) {
            alert("Google login failed");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Social Network</h1>
                <form onSubmit={handleLogin}>
                  <input type="text" placeholder="Username" required onChange={(e) => setUsername(e.target.value)} />
                  <input type="password" placeholder="Password" required onChange={(e) => setPassword(e.target.value)} />
                  <button type="submit">Log In</button>
                </form>
                <button onClick={handleGoogleLogin} type="button" style={{ marginTop: "10px" }}>
                  Log In with Google
                </button>
                <a href="#">Forgot password?</a>
            </div>
            <div className = "register-box">
                <p>Don't have an account? <a href="#">Sign up</a></p>
            </div>
        </div>
    );
}

export default Login;