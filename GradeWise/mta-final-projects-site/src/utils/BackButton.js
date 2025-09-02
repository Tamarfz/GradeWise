import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { storages } from '../stores';
import { useLocation } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

// Styled component for the Back Button wrapper (positioned in the upper right)
const BackButtonWrapper = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
`;

// Styled component for the Back Button with modern blue gradient style
const BackButtonStyled = styled.button`
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  border: none;
  border-radius: 0 80px 0 70px;
  padding: 12px 20px;
  font-size: 14px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(79, 172, 254, 0.4);
    background: linear-gradient(135deg, #3a9bf0 0%, #00d8e0 100%);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 10px rgba(79, 172, 254, 0.3);
  }
`;

// Styled component for the arrow icon
const ArrowIcon = styled(FaArrowLeft)`
  font-size: 16px;
`;

// BackButton component using React Router's useNavigate hook
const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userStorage } = storages;
  
  // Determine destination based on current pathname and user type
  const destination =
    location.pathname === '/register'
      ? '/'
      : userStorage.user?.type === 'admin'
      ? '/admin'
      : '/judge';

  return (
    location.pathname !== '/admin' &&
    location.pathname !== '/judge' &&
    location.pathname !== '/' && (
      <BackButtonWrapper>
        <BackButtonStyled onClick={() => navigate(destination)}>
          <ArrowIcon />
          Back
        </BackButtonStyled>
      </BackButtonWrapper>
    )
  );
};

export default BackButton;
