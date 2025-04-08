import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { AiOutlineProfile, AiOutlineEye, AiOutlineStar, AiOutlineLogout, AiOutlineMenu } from 'react-icons/ai';
import { storages } from '../../stores';
import Swal from 'sweetalert2';
import './JudgeButtons.css';

const JudgeButtons = observer(() => {
  const [isOpen, setIsOpen] = useState(false);
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
      <div
        style={{ cursor: 'pointer', position: 'fixed', top: '20px', left: '20px', zIndex: 1000 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <AiOutlineMenu size={50} />
      </div>
      <div
        className={`side-menu ${isOpen ? 'open' : ''}`}
        style={{
          position: 'fixed',
          top: '70px',
          left: isOpen ? '0' : '-300px',
          width: '250px',
          height: '100%',
          background: 'linear-gradient(135deg,rgba(35, 117, 158, 0.3),rgb(2, 12, 22, 0.3))', // Applied gradient background
          padding: '20px',
          boxShadow: '2px 0px 5px rgba(0, 0, 0, 0.1)',
          zIndex: 999,
          transition: 'left 0.5s ease',
        }}
      >
        <div className="judge-buttons">
          <nav>
            <ul>
              <li onClick={handleProfileSetupClick}><span>Profile Setup</span></li>
              <li onClick={handleGradeProjectsClick}><span>Grade Projects</span></li>
              <li   onClick={handleLogout}><span>Logout</span></li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
});

export default JudgeButtons;
