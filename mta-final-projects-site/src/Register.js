import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { observer } from 'mobx-react-lite';
import { storages } from './stores';
import { backendURL } from './config';

const Register = observer(() => {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const { userStorage } = storages;
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    sendRegisterRequest(userID, fullName, email, password);
  };

  const sendRegisterRequest = (userID, fullName, email, password) => {
    fetch(`${backendURL}/registerFullInfo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userID, fullName, email, password }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // Registration successful, log the user in
          localStorage.setItem('token', data.token);
          userStorage.user = data.user;
          if (data.user.type === 'admin') {
            navigate('/admin');
          } else if (data.user.type === 'judge') {
            navigate('/judge');
          }
        } else {
          alert('Registration failed! Please try again.');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div className="login-container">
      <div className="left-half">
        <img
          src="/Assets/Logos/MTA_Logo_Black.svg"
          alt="TA Logo"
          className="logo_TA"
        />
      </div>
      <div className="right-half">
        <div className="login-box">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
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
            <div className="form-group">
              <label htmlFor="fullName">Full Name:</label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-with-icon-name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-with-icon-email"
              />
            </div>
            <button type="submit">Register</button>
            <br />
            <Link to="/" className="login-link">
              Already have an account? Log in
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
});

export default Register;
