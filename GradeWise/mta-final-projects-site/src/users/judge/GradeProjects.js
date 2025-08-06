import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import { storages } from '../../stores';
import Post from '../../utils/Post';
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
import { FaGavel, FaSearch, FaFilter } from 'react-icons/fa';
import './GradeProjects.css'; 

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
`;

const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 25px;
  width: 100%;
  max-width: 1200px;
  margin: 20px 0;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 20px 0;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  color: #667eea;
  margin-bottom: 20px;
`;

const EmptyText = styled.p`
  font-size: 18px;
  color: #718096;
  font-weight: 500;
  margin: 0;
`;

const StyledCancelButton = styled(Button)`
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%) !important;
  color: white !important;
  border-radius: 12px !important;
  padding: 12px 24px !important;
  font-weight: 600 !important;
  margin-top: 16px !important;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3) !important;
  
  &:hover {
    background: linear-gradient(135deg, #ff5252 0%, #e64a19 100%) !important;
    box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4) !important;
    transform: translateY(-2px) !important;
  }
`;

const StyledSubmitButton = styled(Button)`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
  color: white !important;
  border-radius: 12px !important;
  padding: 12px 24px !important;
  font-weight: 600 !important;
  margin-top: 16px !important;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3) !important;
  
  &:hover {
    background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%) !important;
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4) !important;
    transform: translateY(-2px) !important;
  }
`;

const DialogActionsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 24px;
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
      confirmButtonColor: '#ff6b6b',
      cancelButtonColor: '#667eea',
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
    fetchProjects();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-content">
          <div className="welcome-section">
            <h1 className="welcome-title">
              Grade Projects <FaGavel style={{ marginLeft: '10px' }} />
            </h1>
            <p className="welcome-subtitle">Review and grade your assigned projects</p>
          </div>
        </div>
      </div>

      <div className="stats-section">
        <div className="admin-page-container">
          <ModernContainer>
            <JudgeProjectStats reload={counterReload} />
            
            <SearchSection>
              <SectionTitle>Search & Filter Projects</SectionTitle>
              <SearchBar
                searchTerm={searchTerm}
                searchField={searchField}
                onSearchInputChange={(e) => setSearchTerm(e.target.value)}
                onSearchFieldChange={(e) => setSearchField(e.target.value)}
                onSearchButtonClick={handleSearch}
                onClearFilters={handleClearFilters}
                filtersActive={filtersActive}
              />
            </SearchSection>

            <div style={{ width: '100%' }}>
              <SectionTitle>Assigned Projects</SectionTitle>
              {projects.length > 0 ? (
                <ProjectsGrid>
                  {projects.map((project) => (
                    <Post
                      key={project._id}
                      project={project}
                      onGrade={() => handleOpenDialog(project)}
                      showGradeButton={true}
                      reloadGrade={counterReload}
                    />
                  ))}
                </ProjectsGrid>
              ) : (
                <EmptyState>
                  <EmptyIcon>
                    <FaGavel />
                  </EmptyIcon>
                  <EmptyText>No projects assigned to you at the moment.</EmptyText>
                </EmptyState>
              )}
            </div>
          </ModernContainer>
        </div>
      </div>

      <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        fullWidth 
        maxWidth="md"
        PaperProps={{
          style: {
            borderRadius: '20px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <DialogTitle>
          <h2 style={{ 
            color: '#667eea', 
            fontSize: '24px', 
            fontWeight: '700',
            margin: '0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Grading: {selectedProject?.Title}
          </h2>
        </DialogTitle>
        <DialogContent>
          <ProjectGradingForm
            projectId={selectedProject?.ProjectNumber}
            onSubmit={handleSubmit}
            onCancel={handleCancelClick}
          />
        </DialogContent>
      </Dialog>

      <JudgeButtons />
    </div>
  );
});

export default GradeProjects;
