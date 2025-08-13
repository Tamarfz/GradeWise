import React, { useState, useEffect } from 'react';
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
import { useTheme } from '../../context/ThemeContext';
import { getAvatarUrl } from '../../utils/avatarUtils';
import { backendURL } from '../../config';
import './JudgeButtons.css';

// Modern styled components
const MenuContainer = styled.div`
  position: relative;
`;

const ButtonContainer = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 1001;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const HamburgerButton = styled.button`
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
  overflow: hidden;
  position: relative;
  
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

const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
`;

const UserAvatar = styled.img`
  width: 90px;
  height: 70px;
  border-radius: 12px;
  object-fit: contain;
  border: 3px solid var(--accent-primary);
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
`;

const MenuHeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const ThemeToggleButton = styled.button`
  background: #000000;
  color: white;
  border: none;
  border-radius: 100%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  font-size: 24px;
  padding: 5px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  }

  .fa-sun {
    color: #fbbf24;
    text-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
  }

  .fa-moon {
    color: #8b5cf6;
    text-shadow: 0 0 8px rgba(139, 92, 246, 0.5);
  }
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
  const [showToggle, setShowToggle] = useState(false);
  const navigate = useNavigate();
  const { userStorage } = storages;
  const { isDarkMode, toggleTheme } = useTheme();

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

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setShowToggle(true);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setShowToggle(false);
    }
  }, [isOpen]);

  // Refresh user data when menu opens to ensure avatar is up to date
  useEffect(() => {
    if (isOpen) {
      const refreshUserData = async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`${backendURL}/current-judge`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
          });
          const data = await response.json();
          
          // Update userStorage with fresh data
          userStorage.user.email = data.email || '';
          userStorage.user.name = data.name || '';
          userStorage.user.avatar = data.avatar || 'default';
        } catch (error) {
          console.error('Error refreshing user data:', error);
        }
      };

      refreshUserData();
    }
  }, [isOpen, userStorage]);

  return (
    <MenuContainer>
      <ButtonContainer>
        <HamburgerButton onClick={toggleMenu}>
          {isOpen ? <FaTimes size={28} /> : <FaBars size={28} />}
        </HamburgerButton>
        {showToggle && (
          <ThemeToggleButton
            onClick={toggleTheme}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            style={{
              background: isDarkMode ? '#ffffff' : '#000000',
              color: isDarkMode ? '#1a202c' : '#f7fafc',
            }}
          >
            {isDarkMode ? (
              <i className="fas fa-sun"></i>
            ) : (
              <i className="fas fa-moon"></i>
            )}
          </ThemeToggleButton>
        )}
      </ButtonContainer>
      
      <Overlay isOpen={isOpen} onClick={toggleMenu} />
      
      <SideMenu isOpen={isOpen}>
        <MenuHeader>
          <AvatarContainer>
            <UserAvatar 
              src={getAvatarUrl(userStorage.user?.avatar)}
              alt="User Avatar"
            />
            <div>
              <MenuTitle>Judge Dashboard</MenuTitle>
              <MenuSubtitle>Welcome back, {userStorage.user?.name}</MenuSubtitle>
            </div>
          </AvatarContainer>
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
