import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import './Login.css';
import { observer } from 'mobx-react-lite';
import { storages } from './stores';
import { backendURL } from './config';
import Swal from 'sweetalert2';

// Logo animations
const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

// Styled components for logo animations
const AnimatedLogo = styled.img`
  max-width: 60%;
  height: auto;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.3));
  transition: all 0.3s ease;
  animation: ${float} 3s ease-in-out infinite;

  &:hover {
    transform: scale(1.05);
    filter: drop-shadow(0 15px 40px rgba(0, 0, 0, 0.4));
    animation: ${pulse} 1s ease-in-out;
  }
`;

const Register = observer(() => {
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { userStorage } = storages;
  const navigate = useNavigate();

  const validateForm = () => {
    if (!userID.trim()) {
      setError('ID Number is required');
      return false;
    }
    if (userID.length < 9) {
      setError('ID Number must be at least 9 characters long');
      return false;
    }
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!fullName.trim()) {
      setError('Full Name is required');
      return false;
    }
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    setError('');
    return true;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`${backendURL}/registerFullInfo`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ 
          userID: userID.trim(), 
          fullName: fullName.trim(), 
          email: email.trim(), 
          password 
        }),
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Registration successful! You can now log in.',
          icon: 'success',
          confirmButtonColor: '#2196f3',
          confirmButtonText: 'OK'
        }).then(() => {
          navigate('/');
        });
      } else {
        const errorMessage = data.error || 'Registration failed. Please try again.';
        setError(errorMessage);
        Swal.fire({
          title: 'Registration Failed',
          text: errorMessage,
          icon: 'error',
          confirmButtonColor: '#2196f3',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error("Error during registration:", error);
      const errorMessage = 'Network error. Please check your connection and try again.';
      setError(errorMessage);
      Swal.fire({
        title: 'Connection Error',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#2196f3',
        confirmButtonText: 'OK'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="left-half">
        <AnimatedLogo
          src="/Assets/Logos/MTA_Logo_Black.svg"
          alt="TA Logo"
        />
      </div>
      <div className="right-half">
        <div className="login-box">
          <h2>Register</h2>
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label htmlFor="userID">ID Number:</label>
              <input 
                required
                type="text"
                id="userID"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
                className="input-with-icon-id"
                disabled={isLoading}
                placeholder="Enter your ID number"
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input 
                required
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-with-icon-password"
                disabled={isLoading}
                placeholder="Enter your password"
              />
            </div>
            <div className="form-group">
              <label htmlFor="fullName">Full Name:</label>
              <input 
                required
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="input-with-icon-name"
                disabled={isLoading}
                placeholder="Enter your full name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input 
                required
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-with-icon-email"
                disabled={isLoading}
                placeholder="Enter your email"
              />
            </div>
            
            {error && (
              <div style={{
                color: '#dc3545',
                fontSize: '14px',
                marginBottom: '16px',
                textAlign: 'center',
                padding: '8px 12px',
                backgroundColor: 'rgba(220, 53, 69, 0.1)',
                borderRadius: '8px',
                border: '1px solid rgba(220, 53, 69, 0.2)'
              }}>
                {error}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isLoading}
              style={{
                opacity: isLoading ? 0.7 : 1,
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
            
            <br />
            <Link to="/" className="login-link" style={{ pointerEvents: isLoading ? 'none' : 'auto' }}>
              Already have an account? Log in
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
});

export default Register;
