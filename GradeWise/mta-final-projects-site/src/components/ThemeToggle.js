import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

const ToggleButton = styled.button`
    position: fixed;
    top: 20px;
    left: 100px;
    z-index: 10000;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    margin-top: 15px;
    
    /* Light theme styles - white background for sun button */
    .light-theme & {
        background: #ffffff;
        color: #1a202c;
        border: 1px solid rgba(102, 126, 234, 0.1);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    }
    
    /* Dark theme styles - black background for moon button */
    .dark-theme & {
        background: #000000;
        color: #f7fafc;
        border: 1px solid rgba(102, 126, 234, 0.2);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    }
    
    /* Sun icon styling - yellow color */
    .fa-sun {
        color: #fbbf24 !important;
        text-shadow: 0 0 10px rgba(251, 191, 36, 0.5);
    }
    
    /* Moon icon styling - purple color */
    .fa-moon {
        color: #8b5cf6 !important;
        text-shadow: 0 0 10px rgba(139, 92, 246, 0.5);
    }
    
    &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }
    
    &:active {
        transform: scale(0.95);
    }
    
    @media (max-width: 768px) {
        top: 15px;
        left: 95px;
        width: 45px;
        height: 45px;
        font-size: 16px;
    }
`;

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const location = useLocation();

    // Hide the toggle button on login and register screens
    const isLoginOrRegister = location.pathname === '/' || location.pathname === '/register';
    
    if (isLoginOrRegister) {
        return null;
    }

    const buttonStyle = {
        background: isDarkMode ? '#ffffff' : '#000000',
        color: isDarkMode ? '#1a202c' : '#f7fafc',
        border: isDarkMode ? '1px solid rgba(102, 126, 234, 0.1)' : '1px solid rgba(102, 126, 234, 0.2)',
        boxShadow: isDarkMode ? '0 4px 15px rgba(0, 0, 0, 0.1)' : '0 4px 15px rgba(0, 0, 0, 0.3)',
    };

    const sunIconStyle = {
        color: '#fbbf24',
        textShadow: '0 0 10px rgba(251, 191, 36, 0.5)',
    };

    const moonIconStyle = {
        color: '#8b5cf6',
        textShadow: '0 0 10px rgba(139, 92, 246, 0.5)',
    };

    return (
        <ToggleButton 
            onClick={toggleTheme} 
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={buttonStyle}
        >
            {isDarkMode ? 
                <i className="fas fa-sun" style={sunIconStyle}></i> : 
                <i className="fas fa-moon" style={moonIconStyle}></i>
            }
        </ToggleButton>
    );
};

export default ThemeToggle;
