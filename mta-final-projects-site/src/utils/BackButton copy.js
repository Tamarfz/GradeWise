import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { storages } from '../stores';
import { useLocation } from 'react-router-dom';

// Styled component for the Back Button wrapper (positioned in the upper right)
const BackButtonWrapper = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
`;

// Styled component for the Back Button with a classic blue style
const BackButtonStyled = styled.button`
  background-color:rgb(31, 85, 144); /* Classic blue */
  color: #fff;
  border: none;
  border-radius: 30px;
  padding: 10px 20px;
  font-size: 30px;
  display: inline-flex;
  align-items: center;
  transition: background-color 0.3s ease, transform 0.2s ease;
  cursor: pointer;
  box-shadow: 4px 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateX(-2px);
    box-shadow: 4px 4px 6px rgb(0, 0, 0);
  }
`;

// Styled component for the arrow icon
const ArrowIcon = styled.span`
  font-size: 25px;
`;

// BackButton component using React Router's useNavigate hook
const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userStorage } = storages;
  // Determine destination based on user type
  const destination = userStorage.user?.type === 'admin' ? '/admin' : '/judge';

  return (
    location.pathname !== '/admin' &&
    location.pathname !== '/judge' &&
    location.pathname !== '/' && (
      <BackButtonWrapper>
        <BackButtonStyled onClick={() => navigate(destination)}>
          <ArrowIcon>&larr;</ArrowIcon>
        </BackButtonStyled>
      </BackButtonWrapper>
    )
  );
};

export default BackButton;
