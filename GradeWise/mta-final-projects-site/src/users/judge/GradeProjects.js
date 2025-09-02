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
import { fetchJudgeProjects, transformGradesToProjects } from '../../utils/judgeDataUtils';
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

  @media (max-width: 768px) {
    gap: 20px;
    padding: 15px;
  }

  @media (max-width: 480px) {
    gap: 15px;
    padding: 10px;
  }
`;

const SearchSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 800px;
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 8px 32px var(--shadow-light);
  border: 1px solid var(--card-border);

  @media (max-width: 768px) {
    padding: 20px;
    gap: 15px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 15px;
    gap: 12px;
    border-radius: 12px;
  }
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
    margin: 15px 0;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 15px;
    margin: 10px 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 20px 0;
  text-align: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;

  @media (max-width: 768px) {
    font-size: 20px;
    margin: 0 0 15px 0;
  }

  @media (max-width: 480px) {
    font-size: 18px;
    margin: 0 0 12px 0;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: var(--card-bg);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  box-shadow: 0 8px 32px var(--shadow-light);
  border: 1px solid var(--card-border);

  @media (max-width: 768px) {
    padding: 40px 15px;
    border-radius: 16px;
  }

  @media (max-width: 480px) {
    padding: 30px 10px;
    border-radius: 12px;
  }
`;

const EmptyIcon = styled.div`
  font-size: 48px;
  color: #667eea;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 40px;
    margin-bottom: 15px;
  }

  @media (max-width: 480px) {
    font-size: 32px;
    margin-bottom: 12px;
  }
`;

const EmptyText = styled.p`
  font-size: 18px;
  color: var(--text-secondary);
  font-weight: 500;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }

  @media (max-width: 480px) {
    font-size: 14px;
  }
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

  @media (max-width: 768px) {
    gap: 12px;
    margin-top: 20px;
    margin-bottom: 12px;
  }

  @media (max-width: 480px) {
    gap: 10px;
    margin-top: 16px;
    margin-bottom: 10px;
    flex-direction: column;
    align-items: center;
  }
`;

const GradeProjects = observer(() => {
  const { userStorage } = storages;
  const user = userStorage.user;
  const token = localStorage.getItem('token');

  const [allProjects, setAllProjects] = useState([]); // Store all projects for search/filtering
  const [projects, setProjects] = useState([]); // Store filtered projects
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
      
      // Get current judge ID from userStorage
      const currentJudgeId = userStorage.user.ID || userStorage.user.id;
      console.log('Current judge ID:', currentJudgeId);
      console.log('User storage data:', userStorage.user);
      
      // Use shared utility to fetch judge projects from the judge-specific endpoint
      const judgeProjects = await fetchJudgeProjects(token, currentJudgeId);
      console.log('Fetched judge projects:', judgeProjects);
      
      // Transform the projects data to the expected format using shared utility
      const projectsData = transformGradesToProjects(judgeProjects);
      console.log('Transformed projects data:', projectsData);
      
      // Store all projects and set filtered projects
      setAllProjects(projectsData);
      setProjects(projectsData);
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
    if (searchTerm || searchField) {
      // Filter projects locally since we now have all data
      const filteredProjects = allProjects.filter(project => {
        const matchesSearchTerm = !searchTerm || 
          project.Title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.ProjectNumber.toString().includes(searchTerm);
        
        const matchesSearchField = !searchField || 
          project[searchField]?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        
        return matchesSearchTerm && matchesSearchField;
      });
      
      setProjects(filteredProjects);
      setFiltersActive(true);
    } else {
      // Show all projects if no search criteria
      setProjects(allProjects);
      setFiltersActive(false);
    }
  };

  const handleClearFilters = (e) => {
    e.preventDefault();
    setSearchTerm('');
    setSearchField('');
    setFiltersActive(false);
    setProjects(allProjects); // Show all projects
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-content">
          <div className="welcome-section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
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
            background: 'var(--card-bg)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px var(--shadow-light)',
            border: '1px solid var(--card-border)',
            margin: '16px',
            maxWidth: 'calc(100% - 32px)',
            '@media (max-width: 768px)': {
              borderRadius: '16px',
              margin: '12px',
              maxWidth: 'calc(100% - 24px)',
            },
            '@media (max-width: 480px)': {
              borderRadius: '12px',
              margin: '8px',
              maxWidth: 'calc(100% - 16px)',
            }
          }
        }}
      >
        <DialogTitle>
          <h2 style={{ 
            color: 'var(--accent-primary)', 
            fontSize: '24px', 
            fontWeight: '700',
            margin: '0',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            '@media (max-width: 768px)': {
              fontSize: '20px',
            },
            '@media (max-width: 480px)': {
              fontSize: '18px',
            }
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
