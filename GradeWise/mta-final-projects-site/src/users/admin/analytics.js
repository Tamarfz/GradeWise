import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import axios from 'axios';
import { backendURL } from '../../config';
import './Analytics.css';

const Analytics = observer(() => {
  const [viewMode, setViewMode] = useState('judge'); // 'judge' or 'project'
  const [judges, setJudges] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedJudge, setSelectedJudge] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJudgesAndProjects();
  }, []);

  const fetchJudgesAndProjects = async () => {
    try {
      // Fetch judges
      const judgesResponse = await axios.get(`${backendURL}/admin/judges/judgesList`);
      setJudges(judgesResponse.data);

      // Fetch projects
      const projectsResponse = await axios.get(`${backendURL}/admin/projects/projectsList`);
      setProjects(projectsResponse.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchJudgeAnalytics = async (judgeId) => {
    setLoading(true);
    try {
      console.log('Fetching:', `${backendURL}/admin/analytics/judge/${judgeId}`);
      const response = await axios.get(`${backendURL}/admin/analytics/judge/${judgeId}`);
      
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching judge analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectAnalytics = async (projectId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendURL}/admin/analytics/project/${projectId}`);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching project analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJudgeChange = (e) => {
    const judgeId = Number(e.target.value);
    setSelectedJudge(judgeId);
    if (judgeId) {
      fetchJudgeAnalytics(judgeId);
    } else {
      setAnalyticsData(null);
    }
  };

  const handleProjectChange = (e) => {
    const projectId = e.target.value;
    setSelectedProject(projectId);
    if (projectId) {
      fetchProjectAnalytics(projectId);
    } else {
      setAnalyticsData(null);
    }
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setSelectedJudge('');
    setSelectedProject('');
    setAnalyticsData(null);
  };

  const renderAnalyticsTable = () => {
    if (!analyticsData) return null;

    if (viewMode === 'judge') {
      return (
        <div className="analytics-table-container">
          <h3>Projects Assigned to Judge: {analyticsData.judgeName}</h3>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Complexity</th>
                <th>Usability</th>
                <th>Innovation</th>
                <th>Presentation</th>
                <th>Proficiency</th>
                <th>Total Grade</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.projects.map((project, index) => (
                <tr key={index}>
                  <td>{project.title}</td>
                  <td>{project.avgComplexity?.toFixed(2) || 'N/A'}</td>
                  <td>{project.avgUsability?.toFixed(2) || 'N/A'}</td>
                  <td>{project.avgInnovation?.toFixed(2) || 'N/A'}</td>
                  <td>{project.avgPresentation?.toFixed(2) || 'N/A'}</td>
                  <td>{project.avgProficiency?.toFixed(2) || 'N/A'}</td>
                  <td>{project.avgTotal?.toFixed(2) || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return (
        <div className="analytics-table-container">
          <h3>Judges Assigned to Project: {projects.find(p => p.ProjectNumber === parseInt(selectedProject))?.Title}</h3>
          <table className="analytics-table">
            <thead>
              <tr>
                <th>Judge</th>
                <th>Complexity</th>
                <th>Usability</th>
                <th>Innovation</th>
                <th>Presentation</th>
                <th>Proficiency</th>
                <th>Total Grade</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.judges.map((judge, index) => (
                <tr key={index}>
                  <td>{judge.name}</td>
                  <td>{judge.complexity || 'N/A'}</td>
                  <td>{judge.usability || 'N/A'}</td>
                  <td>{judge.innovation || 'N/A'}</td>
                  <td>{judge.presentation || 'N/A'}</td>
                  <td>{judge.proficiency || 'N/A'}</td>
                  <td>{judge.totalGrade || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  };

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2>Analytics Dashboard</h2>
        <div className="view-mode-selector">
          <button
            className={`mode-button ${viewMode === 'judge' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('judge')}
          >
            View by Judge
          </button>
          <button
            className={`mode-button ${viewMode === 'project' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('project')}
          >
            View by Project
          </button>
        </div>
      </div>

      <div className="analytics-content">
        <div className="selector-container">
          {viewMode === 'judge' ? (
            <div className="select-wrapper">
              <label htmlFor="judge-select">Select Judge:</label>
              <select
                id="judge-select"
                value={selectedJudge}
                onChange={handleJudgeChange}
                className="analytics-select"
              >
                <option value="">Choose a judge...</option>
                {judges.map((judge) => (
                  <option key={judge.ID} value={judge.ID}>
                    {judge.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="select-wrapper">
              <label htmlFor="project-select">Select Project:</label>
              <select
                id="project-select"
                value={selectedProject}
                onChange={handleProjectChange}
                className="analytics-select"
              >
                <option value="">Choose a project...</option>
                {projects.map((project) => (
                  <option key={project.ProjectNumber} value={project.ProjectNumber}>
                    {project.Title}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading analytics data...</p>
          </div>
        )}

        {!loading && analyticsData && renderAnalyticsTable()}

        {!loading && !analyticsData && (selectedJudge || selectedProject) && (
          <div className="no-data-message">
            <p>No analytics data available for the selected {viewMode === 'judge' ? 'judge' : 'project'}.</p>
          </div>
        )}
      </div>
    </div>
  );
});

export default Analytics;