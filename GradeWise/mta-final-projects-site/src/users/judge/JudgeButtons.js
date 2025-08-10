import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { 
  FaUserShield, 
  FaGavel, 
  FaSignOutAlt, 
  FaTimes,
  FaHome,
  FaBars
} from 'react-icons/fa';
import { storages } from '../../stores';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import './JudgeButtons.css';

// Modern styled components
const MenuContainer = styled.div`
  position: relative;
`;

const HamburgerButton = styled.button`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 15px;
  width: 65px;
  height: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  color: white;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }
`;

const SideMenu = styled.div`
  position: fixed;
  top: 0;
  left: ${props => props.isOpen ? '0' : '-320px'};
  width: 320px;
  height: 100vh;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 1000;
  transition: left 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 100px 0 20px 0;
  overflow-y: auto;
`;

const MenuHeader = styled.div`
  padding: 0 30px 30px 30px;
  border-bottom: 1px solid rgba(102, 126, 234, 0.1);
  margin-bottom: 20px;
`;

const MenuTitle = styled.h2`
  font-size: 1.65rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const MenuSubtitle = styled.p`
  font-size: 0.99rem;
  color: #718096;
  margin: 0;
  font-weight: 500;
`;

const NavigationList = styled.nav`
  padding: 0 20px;
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  margin: 8px 0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #4a5568;
  font-weight: 600;
  font-size: 1.1rem;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    transform: translateX(8px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
  }
  
  &:active {
    transform: translateX(8px) scale(0.98);
  }
`;

const MenuIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 1.1rem;
`;

const MenuText = styled.span`
  flex: 1;
`;

const LogoutItem = styled(MenuItem)`
  margin-top: 30px;
  border-top: 1px solid rgba(102, 126, 234, 0.1);
  padding-top: 20px;
  
  &:hover {
    background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
    box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
  z-index: 999;
  opacity: ${props => props.isOpen ? 1 : 0};
  visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
  transition: all 0.3s ease;
`;

const JudgeButtons = observer(() => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { userStorage } = storages;

  const handleProfileSetupClick = () => {
    navigate("/judge/profile-setup");
    setIsOpen(false);
  };

  const handleGradeProjectsClick = () => {
    navigate("/judge/grade-projects");
    setIsOpen(false);
  };

  const handleHomeClick = () => {
    navigate("/judge");
    setIsOpen(false);
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Confirm Logout',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ff6b6b',
      cancelButtonColor: '#667eea',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      background: 'var(--card-bg)',
      color: 'var(--text-primary)',
      backdrop: 'rgba(0, 0, 0, 0.4)',
      customClass: {
        popup: 'swal2-popup-dark-mode',
        title: 'swal2-title-dark-mode',
        content: 'swal2-content-dark-mode',
        confirmButton: 'swal2-confirm-dark-mode',
        cancelButton: 'swal2-cancel-dark-mode'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setIsOpen(false);
        userStorage.logout();
      }
    });
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <MenuContainer>
      <HamburgerButton onClick={toggleMenu}>
        {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
      </HamburgerButton>
      
      <Overlay isOpen={isOpen} onClick={toggleMenu} />
      
      <SideMenu isOpen={isOpen}>
        <MenuHeader>
          <MenuTitle>Judge Dashboard</MenuTitle>
          <MenuSubtitle>Welcome back, {userStorage.user?.name}</MenuSubtitle>
        </MenuHeader>
        
        <NavigationList>
          <MenuItem onClick={handleHomeClick}>
            <MenuIcon>
              <FaHome />
            </MenuIcon>
            <MenuText>Home</MenuText>
          </MenuItem>
          
          <MenuItem onClick={handleProfileSetupClick}>
            <MenuIcon>
              <FaUserShield />
            </MenuIcon>
            <MenuText>Profile Setup</MenuText>
          </MenuItem>
          
          <MenuItem onClick={handleGradeProjectsClick}>
            <MenuIcon>
              <FaGavel />
            </MenuIcon>
            <MenuText>Grade Projects</MenuText>
          </MenuItem>
          
          <LogoutItem onClick={handleLogout}>
            <MenuIcon>
              <FaSignOutAlt />
            </MenuIcon>
            <MenuText>Logout</MenuText>
          </LogoutItem>
        </NavigationList>
      </SideMenu>
    </MenuContainer>
  );
});

export default JudgeButtons;
