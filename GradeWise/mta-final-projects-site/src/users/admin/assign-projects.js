//V
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import axios from 'axios'; 
import AdminButtons from './AdminButtons';
import { backendURL } from '../../config';

// Modern styled components
const ModernContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: var(--bg-primary);
  color: var(--text-primary);
`;

const ModernButton = styled.button`
  padding: 15px 30px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  font-size: 17.6px; /* Increased by 10% */
  font-weight: 600;
  min-width: 200px;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
  }
  
  &:active {
    transform: translateY(-1px);
  }
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 600px;
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px var(--shadow-light);
  border: 1px solid var(--card-border);
  color: var(--text-primary);
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1000px;
  margin: 20px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 15px;
  }
`;

const ProjectCard = styled.div`
  padding: 20px;
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border: 2px solid var(--card-border);
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px var(--shadow-light);
  font-weight: 500;
  font-size: 15.4px; /* Increased by 10% */
  line-height: 1.4;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  word-wrap: break-word;
  color: var(--text-primary);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.2);
    border-color: rgba(102, 126, 234, 0.4);
  }

  &.selected {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 8px 30px rgba(102, 126, 234, 0.4);
  }
`;

const SectionTitle = styled.h3`
  font-size: 19.8px; /* Increased by 10% */
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 15px 0;
  text-align: center;
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 4px 20px var(--shadow-light);
  border: 1px solid var(--card-border);
  color: var(--text-primary);
`;

const StatNumber = styled.div`
  font-size: 26.4px; /* Increased by 10% */
  font-weight: 700;
  color: #667eea;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 15.4px; /* Increased by 10% */
  color: var(--text-secondary);
  font-weight: 500;
`;

// Custom styles for react-select
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    background: 'var(--input-bg)',
    border: '2px solid var(--input-border)',
    borderRadius: '12px',
    boxShadow: '0 4px 20px var(--shadow-light)',
    color: 'var(--text-primary)',
    '&:hover': {
      borderColor: 'var(--accent-primary)',
    },
  }),
  menu: (provided) => ({
    ...provided,
    background: 'var(--card-bg)',
    backdropFilter: 'blur(10px)',
    border: '1px solid var(--card-border)',
    borderRadius: '12px',
    boxShadow: '0 8px 32px var(--shadow-light)',
    zIndex: 9999, // Add high z-index to ensure it appears above other elements
  }),
  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999, // Ensure the portal also has high z-index
  }),
  option: (provided, state) => ({
    ...provided,
    background: state.isSelected ? 'var(--accent-primary)' : 'transparent',
    color: state.isSelected ? 'white' : 'var(--text-primary)',
    '&:hover': {
      background: state.isSelected ? 'var(--accent-primary)' : 'var(--bg-secondary)',
    },
  }),
  multiValue: (provided) => ({
    ...provided,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '8px',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'white',
    fontWeight: '500',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    color: 'white',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.2)',
      color: 'white',
    },
  }),
};

// Main component
const AssignProjectsToJudges = () => {
  const [judges, setJudges] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedJudges, setSelectedJudges] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const [judgeResponse, projectResponse] = await Promise.all([
          axios.get(`${backendURL}/admin/judges/judgesList`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendURL}/admin/projects/projectsList`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const judgeOptions = judgeResponse.data.map((judge) => ({
          value: judge.ID,
          label: judge.name,
        }));

        const projectOptions = projectResponse.data
          .sort((a, b) => a.Title.localeCompare(b.Title))
          .map((project) => ({
            value: project.ProjectNumber,
            label: project.Title,
          }));

        setJudges(judgeOptions);
        setProjects(projectOptions);
      } catch (error) {
        console.error('Error fetching data:', error);
        Swal.fire('Error', 'Failed to fetch data. Please try again.', 'error');
      }
    };

    fetchData();
  }, []);

  const handleAssignClick = async () => {
    if (selectedJudges.length === 0 || selectedProjects.length === 0) {
      Swal.fire('Error', 'Please select both judges and projects before assigning.', 'error');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to assign selected projects to the selected judges.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#667eea',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, assign them!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('token');

          const projectIds = selectedProjects.map((project) => project.value);
          const judgeIds = selectedJudges.map((judge) => judge.value);

          const assignmentData = {
            judgeIds,
            projectIds,
          };

          const response = await axios.post(`${backendURL}/admin/assignProjects`, assignmentData, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          if (response.status === 200) {
            Swal.fire('Assigned!', 'Projects have been successfully assigned to judges.', 'success');
          }
        } catch (error) {
          Swal.fire('Error', error.response?.data?.error || 'An error occurred while assigning projects.', 'error');
        }
      }
    });
  };

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1 className="welcome-title">Assign Projects to Judges</h1>
            <p className="welcome-subtitle">Select judges and projects to create assignments</p>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="admin-page-container">
          <ModernContainer>
            <StatsContainer>
              <StatCard>
                <StatNumber>{judges.length}</StatNumber>
                <StatLabel>Total Judges</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{projects.length}</StatNumber>
                <StatLabel>Total Projects</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{selectedJudges.length}</StatNumber>
                <StatLabel>Selected Judges</StatLabel>
              </StatCard>
              <StatCard>
                <StatNumber>{selectedProjects.length}</StatNumber>
                <StatLabel>Selected Projects</StatLabel>
              </StatCard>
            </StatsContainer>

            <SelectContainer>
              <SectionTitle>Select Judges</SectionTitle>
              <Select
                isMulti
                options={judges}
                placeholder="Choose judges to assign projects to..."
                onChange={setSelectedJudges}
                value={selectedJudges}
                closeMenuOnSelect={false}
                styles={customSelectStyles}
                menuPortalTarget={document.body}
              />
            </SelectContainer>

            <div style={{ width: '100%', maxWidth: '1000px' }}>
              <SectionTitle>Select Projects</SectionTitle>
              <ProjectsGrid>
                {projects.map((project) => (
                  <ProjectCard
                    key={project.value}
                    className={selectedProjects.some((p) => p.value === project.value) ? 'selected' : ''}
                    onClick={() => {
                      setSelectedProjects((prevSelected) =>
                        prevSelected.some((p) => p.value === project.value)
                          ? prevSelected.filter((p) => p.value !== project.value)
                          : [...prevSelected, project]
                      );
                    }}
                  >
                    {project.label || 'Untitled Project'}
                  </ProjectCard>
                ))}
              </ProjectsGrid>
            </div>

            <ModernButton onClick={handleAssignClick}>
              Assign Projects to Judges
            </ModernButton>
          </ModernContainer>
        </div>
      </div>
      <AdminButtons />
    </div>
  );
};

export default AssignProjectsToJudges;
