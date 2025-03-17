import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/index.css"
import "../styles/Login.css";

function Login({ setIsAuthenticated }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const handleLogin = (e) => {
        e.preventDefault();
        if(username === "admin" && password === "admin") {
            setIsAuthenticated(true);
            navigate("/home");
        }
        else {
            alert("Username or password is incorrect");
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
                <a href="#">Forgot password?</a>
            </div>
            <div className = "register-box">
                <p>Don't have an account? <a href="#">Sign up</a></p>
            </div>
        </div>
    );
}

export default Login;