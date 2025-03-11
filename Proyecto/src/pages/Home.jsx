import React from "react";
import "../styles/index.css"
import "../styles/Home.css";

function Home() {
    return (
        <div className="login-container">
            <div className="login-box">
                <h1>name</h1>
                <form>
                  <input type="text" placeholder="Username" required />
                  <input type="password" placeholder="Password" required />
                  <button type="submit">Log In</button>
                </form>
                <a href="">Forgot password?</a>
            </div>
            <div className = "register-box">
                <p>Don't have an account? <a href="#">Sign up</a></p>
            </div>
        </div>
    );
}

export default Home;