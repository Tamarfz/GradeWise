import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
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
import JudgeButtons from './JudgeButtons';
import { backendURL } from '../../config';
import Loading from '../../utils/Loader';
import JudgeProjectStats from './JudgeProjectStats';

const FeedContainer = styled.div`
  background-color: #f0f8ff;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  @media (max-width: 768px) {
    padding: 15px;
    max-width: 100%;
  }
`;

const EndMessage = styled.p`
  color: #555;
  text-align: center;
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const StyledCancelButton = styled(Button)`
  background-color: #d33 !important;
  color: white !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
  font-weight: bold !important;
  margin-top: 8px !important;
  &:hover {
    background-color: #c82333 !important;
  }
`;

const StyledSubmitButton = styled(Button)`
  background-color: #175a94 !important;
  color: white !important;
  border-radius: 8px !important;
  padding: 8px 16px !important;
  font-weight: bold !important;
  margin-top: 8px !important;
  &:hover {
    background-color: #0e3f6d !important;
  }
`;

const DialogActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
  margin-bottom: 16px;
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

  const handleCancelClick = () => {
    setDialogOpen(false);
    Swal.fire({
      title: 'Are you sure?',
      text: "You will lose all the unsaved changes.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!',
      cancelButtonText: 'No, keep it',
    }).then((result) => {
      if (!result.isConfirmed) {
        setDialogOpen(true);
      }
    });
  };

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
    fetchProjects(); // Fetch projects without query to reset the list
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <FeedContainer>
      <header className="mt- 10 py-6 bg-white text-center border-b border-gray-200">
        <h3 className="text-blue-700 text-lg">
          Welcome, {user?.name}! Let's grade some projects.
        </h3>
        <JudgeButtons />
      </header>
      <BackButton route="/judge" />
      <JudgeProjectStats reload={counterReload} />
      <SearchBar
        searchTerm={searchTerm}
        searchField={searchField}
        onSearchInputChange={(e) => setSearchTerm(e.target.value)}
        onSearchFieldChange={(e) => setSearchField(e.target.value)}
        onSearchButtonClick={handleSearch}
        onClearFilters={handleClearFilters}
        filtersActive={filtersActive}
      />

      <div className="projects-list">
        <h3>Select a Project to Grade:</h3>
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
          <EndMessage>No projects assigned to you at the moment.</EndMessage>
        )}
      </div>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="md">
        <DialogTitle>
          <h2 className="boldonse-regular">Grading: {selectedProject?.Title}</h2>
        </DialogTitle>
        <DialogContent>
          <ProjectGradingForm
            projectId={selectedProject?.ProjectNumber}
            onSubmit={handleSubmit}
            onCancel={handleCancelClick}
          />
        </DialogContent>
      </Dialog>
    </FeedContainer>
  );
});

export default GradeProjects;
