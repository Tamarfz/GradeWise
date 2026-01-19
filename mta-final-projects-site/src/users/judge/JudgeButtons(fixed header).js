import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { AiOutlineProfile, AiOutlineEye, AiOutlineStar, AiOutlineLogout, AiOutlineMenu } from 'react-icons/ai';
import { storages } from '../../stores';
import Swal from 'sweetalert2';
import './JudgeButtons.css';

const JudgeButtons = observer(({ hideMenuIcon, toggleFunction }) => {
  const [isOpen, setIsOpen] = useState(true); // In this usage, the side menu is controlled by GradeProjects
  const navigate = useNavigate();
  const { userStorage } = storages;

  const handleProfileSetupClick = () => {
    navigate("/judge/profile-setup");
  };

  const handleGradeProjectsClick = () => {
    navigate("/judge/grade-projects");
  };

  const handleLogout = () => {
    Swal.fire({
      title: 'Confirm Logout',
      text: 'Are you sure you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Logout'
    }).then((result) => {
      if (result.isConfirmed) userStorage.logout();
    });
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Only render the menu icon if hideMenuIcon is false */}
      {!hideMenuIcon && (
        <div
          style={{ cursor: 'pointer', position: 'fixed', top: '20px', left: '20px', zIndex: 1000 }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {/* Original menu icon */}
          <AiOutlineMenu size={50} />
        </div>
      )}
      <div
        className={`side-menu ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: '70px',
          left: isOpen ? '0' : '-300px',
          width: '250px',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(231, 238, 241, 0.93))',
          padding: '20px',
          boxShadow: '2px 0px 5px rgba(222, 229, 232, 0.96)',
          zIndex: 999,
          transition: 'left 0.5s ease',
        }}
      >
        <div className="judge-buttons">
          <nav>
            <ul>
              <li onClick={handleProfileSetupClick}><span>Profile Setup</span></li>
              <li onClick={handleGradeProjectsClick}><span>Grade Projects</span></li>
              <li onClick={handleLogout}><span>Logout</span></li>
            </ul>
          </nav>
          {/* Optionally include a button to close the menu */}
          {hideMenuIcon && (
            <button onClick={toggleFunction} style={{ marginTop: '20px' }}>
              Close Menu
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default JudgeButtons;
