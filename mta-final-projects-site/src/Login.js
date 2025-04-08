import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { storages } from "./stores";
import { backendURL } from "./config";
import "./Login.css";

const Login = observer(() => {
  const { userStorage } = storages;
  const [userID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const checkValidInputs = (userID, password) => {
    if (!userID.trim() || !password.trim()) {
      alert("Please enter both ID number and password");
      return false;
    }
    if (userID.length < 9) {
      alert("ID number must be at least 9 characters long");
      return false;
    }
    return true;
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (checkValidInputs(userID, password)) {
      sendLoginRequest(userID, password);
    }
  };

  const sendLoginRequest = (userID, password) => {
    fetch(`${backendURL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("token", data.token);
          userStorage.user = data.user;
          if (data.user.type === "admin") {
            navigate("/admin");
          } else if (data.user.type === "judge") {
            navigate("/judge");
          }
        } else {
          alert("Invalid credentials");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className="login-container">
      <div className="left-half">
        <img
          src={`${process.env.PUBLIC_URL}/Assets/Logos/GradeWiseLogoRemoveBg.png`}
          alt="TA Logo"
          className="logo_TA"
        />
      </div>
      <div className="right-half">
        <div className="login-box">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="userID">ID Number:</label>
              <input
                type="text"
                id="userID"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
				className="input-with-icon-id"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
				className="input-with-icon-password"
              />
            </div>
            <button type="submit">Log in</button>
            <button type="button">
              <Link to="/register" className="register-button">
                Sign up
              </Link>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
});

export default Login;
