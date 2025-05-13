import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import { AiOutlineMenu } from 'react-icons/ai'; // import the menu icon
import Swal from 'sweetalert2';
import { storages } from '../../stores';
import Post from '../../utils/Post';
import BackButton from '../../utils/BackButton';
import SearchBar from '../../utils/SearchBar';
import ProjectGradingForm from './ProjectGradingForm';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import Button from '@mui/material/Button';
import JudgeProjectStats from './JudgeProjectStats';
import { backendURL } from '../../config';
import Loading from '../../utils/Loader';
import JudgeButtons from './JudgeButtons';
import './GradeProjects.css';

const FeedContainer = styled.div`
  background-color: #f0f8ff;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  margin-top: 80px; /* Avoid overlap with fixed header */
  @media (max-width: 768px) {
    padding: 15px;
    max-width: 100%;
  }
`;

const FixedHeader = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 20px;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
`;

const GradeProjects = observer(() => {
  const { userStorage } = storages;
  const user = userStorage.user;
  const token = localStorage.getItem('token');

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filtersActive, setFiltersActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [counterReload, setCounterReload] = useState(0);
  const [isJudgeButtonsOpen, setIsJudgeButtonsOpen] = useState(false);

  const toggleJudgeButtons = () => {
    setIsJudgeButtonsOpen(!isJudgeButtonsOpen);
  };

  const fetchProjects = async (query = '') => {
    try {
      setLoading(true);
      const response = await fetch(`${backendURL}/projectsForJudge/projectList${query}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data.projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      Swal.fire('Error', 'Failed to fetch projects. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [token]);

  const handleSearch = (e) => {
    e.preventDefault();
    let query = '';
    if (searchTerm || searchField) {
      const params = [];
      if (searchTerm) {
        params.push(`searchTerm=${encodeURIComponent(searchTerm)}`);
      }
      if (searchField) {
        params.push(`searchField=${encodeURIComponent(searchField)}`);
      }
      query = '?' + params.join('&');
      setFiltersActive(true);
    } else {
      setFiltersActive(false);
    }
    fetchProjects(query);
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchTerm('');
    setSearchField('');
    setFiltersActive(false);
    fetchProjects();
  };

  const handleOpenDialog = (project) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedProject(null);
    setDialogOpen(false);
  };

  const handleSubmit = () => {
    setDialogOpen(false);
    setCounterReload((prev) => prev + 1);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {/* Fixed Header with Menu Icon */}
      <FixedHeader>
        <HeaderLeft>
          {/* Menu icon that toggles JudgeButtons */}
          <div style={{ cursor: 'pointer' }} onClick={toggleJudgeButtons}>
            <AiOutlineMenu size={30} color="#175a94" />
          </div>
          <BackButton route="/judge" />
          <h3 style={{ margin: 0, color: '#175a94' }}>Let's grade some projects!</h3>
        </HeaderLeft>
        <HeaderRight>
          <SearchBar
            searchTerm={searchTerm}
            searchField={searchField}
            onSearchInputChange={(e) => setSearchTerm(e.target.value)}
            onSearchFieldChange={(e) => setSearchField(e.target.value)}
            onSearchButtonClick={handleSearch}
            onClearFilters={handleClearFilters}
            filtersActive={filtersActive}
          />
        </HeaderRight>
      </FixedHeader>

      {/* Judge Buttons (side menu) */}
      {isJudgeButtonsOpen && (
        <JudgeButtons hideMenuIcon={true} toggleFunction={toggleJudgeButtons} />
      )}

      {/* Main Content */}
      <FeedContainer>
        <JudgeProjectStats reload={counterReload} />
        <div className="projects-list">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Post
                key={project._id}
                project={project}
                onGrade={() => handleOpenDialog(project)}
                showGradeButton={true}
                reloadGrade={counterReload}
              />
            ))
          ) : (
            <p>No projects assigned to you at the moment.</p>
          )}
        </div>
      </FeedContainer>

      {/* Dialog for Grading */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>
          <h2 className="boldonse-regular">Grading: {selectedProject?.Title}</h2>
        </DialogTitle>
        <DialogContent>
          <ProjectGradingForm
            projectId={selectedProject?.ProjectNumber}
            onSubmit={handleSubmit}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </>
  );
});

export default GradeProjects;
