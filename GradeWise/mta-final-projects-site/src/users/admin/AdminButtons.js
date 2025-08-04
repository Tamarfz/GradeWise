//V
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { saveAs } from 'file-saver'; // For saving the CSV file
import Papa from 'papaparse'; // For CSV parsing
import axios from 'axios';
import ExportData from './export-data';
import { storages } from '../../stores';
import { AiOutlineUser, AiOutlineProject, AiOutlineStar, AiOutlineFileAdd, AiOutlineLogout, AiOutlineMenu } from 'react-icons/ai'; // Import icons
import Swal from 'sweetalert2';
import './AdminButtons.css'; // Import CSS file for styling

const AdminButtons = observer(() => {
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef(null);
  const navigate = useNavigate();
  const { userStorage } = storages;

  const handleManageJudgesClick = () => {
    navigate("/admin/manage-judges");
  };

  const handleManageProjectsClick = () => {
    navigate("/admin/manage-projects");
  };

  const handleAssignProjectsClick = () => {
    navigate("/admin/assign-projects");
  };

  const handleManageProjectsGradesClick = () => {
    navigate("/admin/manage-projects-grades");
  };

  const handlePodiumClick = () => {
    navigate("/admin/podium");
  };

  const handleAnalyticsClick = () => {
    navigate("/admin/analytics");
  };
  //DELETE!!
  const handleExportToCsvClick = async () => {
    try {
      console.log("hi");
      // Fetch all projects
      const projects = await fetchProjects();

      // Prepare CSV data using PapaParse
      const csvData = Papa.unparse(projects, {
        quotes: true, // Enable quotes around fields
        delimiter: ',', // CSV delimiter
        header: true, // Include header row based on field names
      });

      // Create a Blob containing the CSV data
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });

      // Save the CSV file using FileSaver.js
      saveAs(blob, 'projects.csv');
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      // Handle error (e.g., show error message to user)
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/projects/projectsList');
      return response.data; // Return the fetched projects
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error; // Handle or propagate the error
    }
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

  // Handle clicks outside the sidebar - closes the sidebar
  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false); // Close sidebar if clicked outside
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside); // Cleanup listener on unmount
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <div 
        style={{ cursor: 'pointer', position: 'fixed', top: '20px', left: '20px', zIndex: 1000 }}
        onClick={() => setIsOpen(!isOpen)}
      >
        <AiOutlineMenu size={50} />
      </div>
      <div
      
        ref={sidebarRef} // Add ref to the sidebar for outside click detection
        className={`side-menu ${isOpen ? 'open' : ''}`} // Toggle open/close class
        style={{
          position: 'fixed',
          top: '70px',
          // Use left: 0 to show the sidebar, and left: -300px to hide it
          left: isOpen ? '0' : '-300px',
          width: '250px',
          height: '100%',
        
          background: 'linear-gradient(135deg,rgba(222, 229, 232, 0.96))', // Applied gradient background
          padding: '20px',
          
          boxShadow: '2px 0px 5px rgba(222, 229, 232, 0.96)',
          zIndex: 999,
          transition: 'left 0.3s ease',
        }}
      >
        <div className="admin-buttons">
          <nav>
            <ul className="anton-regular">
              <li onClick={handleManageJudgesClick}><span>Manage Judges</span></li>
              <li onClick={handleManageProjectsClick}><span>Manage Projects</span></li>
              <li onClick={handleAssignProjectsClick}><span>Assign Projects</span></li>
              <li onClick={handleManageProjectsGradesClick}><span>Manage Grades</span></li>
              <li onClick={handlePodiumClick}><span>Podium</span></li>
              <li onClick={handleAnalyticsClick}><span>Analytics</span></li>
              <li onClick={handleLogout}><span>Logout</span></li>
            </ul>
          </nav>
        </div>
        </div>
      </div>
  );
});

export default AdminButtons;
