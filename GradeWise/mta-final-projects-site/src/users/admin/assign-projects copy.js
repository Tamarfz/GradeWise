//V
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import styled from 'styled-components';
import axios from 'axios'; 
import AdminButtons from './AdminButtons';
import { backendURL } from '../../config';
import BackButton from '../../utils/BackButton';


// Styled components for layout and button
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  gap: 20px;
  width: 100%; /* Increase width */
  max-width: 1600px; /* Double the max width */
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #175a94;
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  font-size: 16px;
  &:hover {
    background-color: #0e3f6d;
  }
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-width: 40%;
  max-width: 70%;
`;

// Add this styled component for the grid
const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 items per row */
  gap: 20px;
  width: 100%;
  max-width: 70%;
`;

const ProjectCard = styled.div`
  padding: 15px;
  background-color: rgba(240, 248, 255, 0.9);
  border: 1px solid #175a94;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s ease, background-color 0.3s ease;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.05);
    background-color: #e0f7ff;
  }

  &.selected {
    background-color: #175a94;
    color: white;
  }
`;

// Main component
const AssignProjectsToJudges = () => {
  const [judges, setJudges] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedJudges, setSelectedJudges] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve the token for authorization

        // Fetch judges and projects from the backend
        const [judgeResponse, projectResponse] = await Promise.all([
          axios.get(`${backendURL}/admin/judges/judgesList`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendURL}/admin/projects/projectsList`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        // Process judge data
        const judgeOptions = judgeResponse.data.map((judge) => ({
          value: judge.ID,
          label: judge.name,
        }));

        // Process and sort project data alphabetically by title
        const projectOptions = projectResponse.data
          .sort((a, b) => a.Title.localeCompare(b.Title)) // Sort alphabetically
          .map((project) => ({
            value: project.ProjectNumber,
            label: project.Title,
          }));

        // Update state with the fetched data
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
      confirmButtonColor: '#3085d6',
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
    <div className="admin-page-container">
      <Container>
        <div className="admin-header">
          <h2>Assign Projects to Judges</h2>
        </div>

        <SelectContainer>
          <Select
            isMulti
            options={judges}
            placeholder="Select Judges"
            onChange={setSelectedJudges}
            value={selectedJudges}
            closeMenuOnSelect={false}
          />
        </SelectContainer>

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

        <Button onClick={handleAssignClick}>Assign Projects</Button>
        <AdminButtons />
        <div>
          <BackButton route="/admin" />
        </div>
      </Container>
    </div>
  );
};

export default AssignProjectsToJudges;
