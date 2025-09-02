import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { backendURL } from '../../config';
import AdminButtons from './AdminButtons';
import './Analytics.css';

const Analytics = observer(() => {
  const [viewMode, setViewMode] = useState('judge'); // 'judge', 'project', or 'distribution'
  const [judges, setJudges] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedJudge, setSelectedJudge] = useState('');
  const [selectedProject, setSelectedProject] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [birdViewData, setBirdViewData] = useState([]);

  useEffect(() => {
    fetchJudgesAndProjects();
    // Automatically load distribution analytics when page loads
    fetchDistributionAnalytics();
  }, []);

  const fetchJudgesAndProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // Fetch judges
      const judgesResponse = await fetch(`${backendURL}/admin/judges/judgesList`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!judgesResponse.ok) {
        throw new Error('Failed to fetch judges');
      }

      const judgesData = await judgesResponse.json();
      setJudges(judgesData);

      // Fetch projects
      const projectsResponse = await fetch(`${backendURL}/admin/projects/projectsList`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!projectsResponse.ok) {
        throw new Error('Failed to fetch projects');
      }

      const projectsData = await projectsResponse.json();
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching judges and projects:', error);
    }
  };

  const fetchJudgeAnalytics = async (judgeId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Use the same endpoint as Manage Grades to get all grades data
      const response = await fetch(`${backendURL}/admin/grades`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch grades data');
      }

      const data = await response.json();
      
      // Filter grades to only show projects assigned to the selected judge
      // Convert judgeId to string for comparison since grades data might have string IDs
      const judgeGrades = data.grades.filter(grade => grade.judge_id.toString() === judgeId.toString());
      
      // Get judge name from the judges list
      const selectedJudge = judges.find(judge => judge.ID.toString() === judgeId.toString());
      const judgeName = selectedJudge ? selectedJudge.name : 'Unknown Judge';
      
              // Transform the data to match the expected format for the analytics table
        const projectsData = judgeGrades.map(grade => {
          // Get project name from the projects list
          const project = projects.find(p => p.ProjectNumber.toString() === grade.project_id.toString());
          const projectTitle = project ? project.Title : `Project ${grade.project_id}`;
        
        return {
          title: projectTitle,
          avgComplexity: grade.complexity,
          avgUsability: grade.usability,
          avgInnovation: grade.innovation,
          avgPresentation: grade.presentation,
          avgProficiency: grade.proficiency,
          avgTotal: grade.grade,
          projectId: grade.project_id
        };
      });
      
      setAnalyticsData({
        judgeName: judgeName,
        projects: projectsData
      });
    } catch (error) {
      console.error('Error fetching judge analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectAnalytics = async (projectId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Use the same endpoint as Manage Grades to get all grades data
      const response = await fetch(`${backendURL}/admin/grades`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch grades data');
      }

      const data = await response.json();
      
      // Filter grades to only show judges assigned to the selected project
      const projectGrades = data.grades.filter(grade => grade.project_id.toString() === projectId.toString());
      
      // Get project name from the projects list
      const selectedProject = projects.find(project => project.ProjectNumber.toString() === projectId.toString());
      const projectTitle = selectedProject ? selectedProject.Title : `Project ${projectId}`;
      
      // Transform the data to match the expected format for the analytics table
      const judgesData = projectGrades.map(grade => {
        // Get judge name from the judges list
        const judge = judges.find(j => j.ID.toString() === grade.judge_id.toString());
        const judgeName = judge ? judge.name : `Judge ${grade.judge_id}`;
        
        return {
          name: judgeName,
          complexity: grade.complexity,
          usability: grade.usability,
          innovation: grade.innovation,
          presentation: grade.presentation,
          proficiency: grade.proficiency,
          totalGrade: grade.grade,
          judgeId: grade.judge_id
        };
      });
      
      setAnalyticsData({
        projectTitle: projectTitle,
        judges: judgesData
      });
    } catch (error) {
      console.error('Error fetching project analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDistributionAnalytics = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${backendURL}/admin/analytics/distribution`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch distribution analytics');
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching distribution analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Old fetchBirdViewData function removed - replaced with updated version below
  // This function was causing duplicate declaration errors

  // Updated bird view function that uses the same data source as judge view
  const fetchBirdViewDataUpdated = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Use the same data source as fetchJudgeAnalytics
      const response = await fetch(`${backendURL}/admin/grades`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch grades data');
      }

      const data = await response.json();
      
      // Transform the data to match the same format as fetchJudgeAnalytics
      const birdViewArray = judges.map(judge => {
        // Filter grades to only show projects assigned to this judge
        const judgeGrades = data.grades.filter(grade => grade.judge_id.toString() === judge.ID.toString());
        
        // Transform projects data to match the same format
        const projectsData = judgeGrades.map(grade => {
          // Get project name from the projects list
          const project = projects.find(p => p.ProjectNumber.toString() === grade.project_id.toString());
          const projectTitle = project ? project.Title : `Project ${grade.project_id}`;
          
          return {
            title: projectTitle,
            avgComplexity: grade.complexity,
            avgUsability: grade.usability,
            avgInnovation: grade.innovation,
            avgPresentation: grade.presentation,
            avgProficiency: grade.proficiency,
            avgTotal: grade.grade,
            projectId: grade.project_id
          };
        });
        
        return {
          judgeId: judge.ID,
          judgeName: judge.name,
          projects: projectsData
        };
      });
      
      console.log('Bird view data prepared using same source as judge view:', birdViewArray);
      setBirdViewData(birdViewArray);
    } catch (error) {
      console.error('Error fetching bird view data:', error);
      setBirdViewData([]);
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
    if (mode === 'distribution') {
      fetchDistributionAnalytics();
    } else if (mode === 'bird-view') {
      fetchBirdViewDataUpdated();
    }
  };

  const calculateAverageGrades = () => {
    if (!analyticsData) return null;

    let validGrades = [];
    
    if (viewMode === 'judge' && analyticsData.projects) {
      // For judge view: filter projects with valid grades
      validGrades = analyticsData.projects.filter(project => {
        const complexity = parseFloat(project.avgComplexity);
        const usability = parseFloat(project.avgUsability);
        const innovation = parseFloat(project.avgInnovation);
        const presentation = parseFloat(project.avgPresentation);
        const proficiency = parseFloat(project.avgProficiency);
        
        // Check if all scores are valid numbers (default/not graded)
        return !(isNaN(complexity) || isNaN(usability) || isNaN(innovation) || 
                 isNaN(presentation) || isNaN(proficiency));
      });
    } else if (viewMode === 'project' && analyticsData.judges) {
      // For project view: filter judges with valid grades
      validGrades = analyticsData.judges.filter(judge => {
        const complexity = parseFloat(judge.complexity);
        const usability = parseFloat(judge.usability);
        const innovation = parseFloat(judge.innovation);
        const presentation = parseFloat(judge.presentation);
        const proficiency = parseFloat(judge.proficiency);
        
        // Check if all scores are valid numbers (default/not graded)
        return !(isNaN(complexity) || isNaN(usability) || isNaN(innovation) || 
                 isNaN(presentation) || isNaN(proficiency));
      });
    }

    if (validGrades.length === 0) {
      return null;
    }

    let sumComplexity, sumUsability, sumInnovation, sumPresentation, sumProficiency, sumTotal;

    if (viewMode === 'judge') {
      // Calculate averages for projects (judge view)
      sumComplexity = validGrades.reduce((sum, project) => sum + parseFloat(project.avgComplexity), 0);
      sumUsability = validGrades.reduce((sum, project) => sum + parseFloat(project.avgUsability), 0);
      sumInnovation = validGrades.reduce((sum, project) => sum + parseFloat(project.avgInnovation), 0);
      sumPresentation = validGrades.reduce((sum, project) => sum + parseFloat(project.avgPresentation), 0);
      sumProficiency = validGrades.reduce((sum, project) => sum + parseFloat(project.avgProficiency), 0);
      sumTotal = validGrades.reduce((sum, project) => sum + parseFloat(project.avgTotal), 0);
    } else {
      // Calculate averages for judges (project view)
      sumComplexity = validGrades.reduce((sum, judge) => sum + parseFloat(judge.complexity), 0);
      sumUsability = validGrades.reduce((sum, judge) => sum + parseFloat(judge.usability), 0);
      sumInnovation = validGrades.reduce((sum, judge) => sum + parseFloat(judge.innovation), 0);
      sumPresentation = validGrades.reduce((sum, judge) => sum + parseFloat(judge.presentation), 0);
      sumProficiency = validGrades.reduce((sum, judge) => sum + parseFloat(judge.proficiency), 0);
      sumTotal = validGrades.reduce((sum, judge) => sum + parseFloat(judge.totalGrade), 0);
    }

    return {
      complexity: (sumComplexity / validGrades.length).toFixed(2),
      usability: (sumUsability / validGrades.length).toFixed(2),
      innovation: (sumInnovation / validGrades.length).toFixed(2),
      presentation: (sumPresentation / validGrades.length).toFixed(2),
      proficiency: (sumProficiency / validGrades.length).toFixed(2),
      total: (sumTotal / validGrades.length).toFixed(2)
    };
  };

  const isNotGraded = (judge) => {
    const complexity = parseFloat(judge.complexity);
    const usability = parseFloat(judge.usability);
    const innovation = parseFloat(judge.innovation);
    const presentation = parseFloat(judge.presentation);
    const proficiency = parseFloat(judge.proficiency);
    
    // Check if all scores are NaN or invalid (default/not graded)
    return isNaN(complexity) || isNaN(usability) || isNaN(innovation) || 
           isNaN(presentation) || isNaN(proficiency);
  };

  const isProjectGraded = (project) => {
    // Check if any of the average scores are valid numbers (meaning it has been graded)
    // Handle both NaN values and undefined/null values
    const complexity = parseFloat(project.avgComplexity);
    const usability = parseFloat(project.avgUsability);
    const innovation = parseFloat(project.avgInnovation);
    const presentation = parseFloat(project.avgPresentation);
    const proficiency = parseFloat(project.avgProficiency);
    
    // Check if all scores are valid numbers (not graded)
    return !(isNaN(complexity) || isNaN(usability) || 
             isNaN(innovation) || isNaN(presentation) || 
             isNaN(proficiency));
  };

  const renderAnalyticsTable = () => {
    if (!analyticsData) return null;

    if (viewMode === 'judge') {
      return (
        <div className="analytics-table-container">
          <h3>Projects Assigned to Judge: {analyticsData.judgeName || 'Unknown'}</h3>
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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
                            {analyticsData.projects && analyticsData.projects.length > 0 ? (
                analyticsData.projects.map((project, index) => (
                  <tr key={index}>
                    <td>{project.title}</td>
                    <td>{project.avgComplexity?.toFixed(2) || 'N/A'}</td>
                    <td>{project.avgUsability?.toFixed(2) || 'N/A'}</td>
                    <td>{project.avgInnovation?.toFixed(2) || 'N/A'}</td>
                    <td>{project.avgPresentation?.toFixed(2) || 'N/A'}</td>
                    <td>{project.avgProficiency?.toFixed(2) || 'N/A'}</td>
                    <td>{project.avgTotal?.toFixed(2) || 'N/A'}</td>
                    <td>
                      {isProjectGraded(project) ? (
                        <span className="graded-badge">Graded</span>
                      ) : (
                        <span className="not-graded-badge">Not Graded</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                                 <tr>
                   <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                     No projects found for this judge
                   </td>
                 </tr>
               )}
            </tbody>
          </table>
          {renderJudgeAverageGradesBox()}
          {renderJudgeAssessmentSummary()}
        </div>
      );
    } else if (viewMode === 'project') {
      return (
        <div className="analytics-table-container">
          <h3>Judges Assigned to Project: {analyticsData.projectTitle || 'Unknown Project'}</h3>
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
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {analyticsData.judges && analyticsData.judges.length > 0 ? (
                analyticsData.judges.map((judge, index) => (
                <tr key={index}>
                  <td>{judge.name}</td>
                  <td>{judge.complexity || 'N/A'}</td>
                  <td>{judge.usability || 'N/A'}</td>
                  <td>{judge.innovation || 'N/A'}</td>
                  <td>{judge.presentation || 'N/A'}</td>
                  <td>{judge.proficiency || 'N/A'}</td>
                  <td>{judge.totalGrade || 'N/A'}</td>
                  <td>
                    {isNotGraded(judge) ? (
                      <span className="not-graded-badge">Not Graded</span>
                    ) : (
                      <span className="graded-badge">Graded</span>
                    )}
                  </td>
                </tr>
              ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '20px' }}>
                    No judges found for this project
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          {renderAverageGradesBox()}
          {renderAdditionalInfoBox()}
        </div>
      );
    } else if (viewMode === 'distribution') {
      return (
        <div className="analytics-table-container">
          <h3>Grade Distribution Overview</h3>
          <div className="distribution-content">
            <div className="distribution-header">
              <div className="header-card">
                <h4>System Overview</h4>
                <div className="header-stats">
                  <div className="header-stat">
                    <span className="header-stat-value">{projects.length}</span>
                    <span className="header-stat-label">Total Projects</span>
                  </div>
                  <div className="header-stat">
                    <span className="header-stat-value">{judges.length}</span>
                    <span className="header-stat-label">Total Judges</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="distribution-stats">
              <div className="stat-card">
                <h4>Project Status Distribution</h4>
                <div className="stat-grid">
                  <div className="stat-item">
                    <span className="stat-label">Graded Projects</span>
                    <span className="stat-value">{analyticsData && analyticsData.uniqueGradedProjects ? analyticsData.uniqueGradedProjects : 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Ungraded Projects</span>
                    <span className="stat-value">{analyticsData && analyticsData.uniqueNotGradedProjects ? analyticsData.uniqueNotGradedProjects : 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Unassigned Projects</span>
                    <span className="stat-value">{analyticsData && analyticsData.notAssignedProjects ? analyticsData.notAssignedProjects : 0}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="grade-chart-section">
              <div className="chart-card">
                <h4>Grade Distribution (Total Grades)</h4>
                <div className="bar-chart">
                  {renderGradeBarChart()}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderAverageGradesBox = () => {
    const averages = calculateAverageGrades();
    
    if (!averages) {
      return null;
    }

    return (
      <div className="average-grades-box">
        <h4>Average Grades</h4>
        <div className="average-grades-grid">
          <div className="average-grade-item">
            <span className="grade-label">Complexity</span>
            <span className="grade-value">{averages.complexity}</span>
          </div>
          <div className="average-grade-item">
            <span className="grade-label">Usability</span>
            <span className="grade-value">{averages.usability}</span>
          </div>
          <div className="average-grade-item">
            <span className="grade-label">Innovation</span>
            <span className="grade-value">{averages.innovation}</span>
          </div>
          <div className="average-grade-item">
            <span className="grade-label">Presentation</span>
            <span className="grade-value">{averages.presentation}</span>
          </div>
          <div className="average-grade-item">
            <span className="grade-label">Proficiency</span>
            <span className="grade-value">{averages.proficiency}</span>
          </div>
          <div className="average-grade-item total-grade">
            <span className="grade-label">Total Average</span>
            <span className="grade-value">{averages.total}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderJudgeAverageGradesBox = () => {
    const averages = calculateAverageGrades();
    
    if (!averages) {
      return null;
    }

    return (
      <div className="average-grades-box">
        <h4>Average Grades</h4>
        <div className="average-grades-grid">
          <div className="average-grade-item">
            <span className="grade-label">Complexity</span>
            <span className="grade-value">{averages.complexity}</span>
          </div>
          <div className="average-grade-item">
            <span className="grade-label">Usability</span>
            <span className="grade-value">{averages.usability}</span>
          </div>
          <div className="average-grade-item">
            <span className="grade-label">Innovation</span>
            <span className="grade-value">{averages.innovation}</span>
          </div>
          <div className="average-grade-item">
            <span className="grade-label">Presentation</span>
            <span className="grade-value">{averages.presentation}</span>
          </div>
          <div className="average-grade-item">
            <span className="grade-label">Proficiency</span>
            <span className="grade-value">{averages.proficiency}</span>
          </div>
          <div className="average-grade-item total-grade">
            <span className="grade-label">Total Average</span>
            <span className="grade-value">{averages.total}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderAdditionalInfoBox = () => {
    if (!analyticsData || !analyticsData.judges || analyticsData.judges.length === 0) {
      return null;
    }

    const totalJudges = analyticsData.judges.length;
    
    // Filter out judges with invalid scores - these are not graded
    const validGrades = analyticsData.judges.filter(judge => {
      const complexity = parseFloat(judge.complexity);
      const usability = parseFloat(judge.usability);
      const innovation = parseFloat(judge.innovation);
      const presentation = parseFloat(judge.presentation);
      const proficiency = parseFloat(judge.proficiency);
      
      // Check if all scores are valid numbers (default/not graded)
      return !(isNaN(complexity) || isNaN(usability) || isNaN(innovation) || 
               isNaN(presentation) || isNaN(proficiency));
    });
    
    const completedAssessments = validGrades.length;

    return (
      <div className="additional-info-box">
        <h4>Project Assessment Summary</h4>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-icon">👥</div>
            <div className="info-content">
              <span className="info-label">Total Judges Assigned</span>
              <span className="info-value">{totalJudges}</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">✅</div>
            <div className="info-content">
              <span className="info-label">Completed Assessments</span>
              <span className="info-value">{completedAssessments}</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">📊</div>
            <div className="info-content">
              <span className="info-label">Completion Rate</span>
              <span className="info-value">{totalJudges > 0 ? `${Math.round((completedAssessments / totalJudges) * 100)}%` : '0%'}</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">⭐</div>
            <div className="info-content">
              <span className="info-label">Average Total Score</span>
              <span className="info-value">
                {validGrades.length > 0 
                  ? (validGrades.reduce((sum, judge) => sum + parseFloat(judge.totalGrade), 0) / validGrades.length).toFixed(2)
                  : 'N/A'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderJudgeAssessmentSummary = () => {
    if (!analyticsData || !analyticsData.projects || analyticsData.projects.length === 0) {
      return null;
    }

    const totalProjects = analyticsData.projects.length;
    
    // Filter out projects with invalid scores - these are not graded
    const validGrades = analyticsData.projects.filter(project => {
      const complexity = parseFloat(project.avgComplexity);
      const usability = parseFloat(project.avgUsability);
      const innovation = parseFloat(project.avgInnovation);
      const presentation = parseFloat(project.avgPresentation);
      const proficiency = parseFloat(project.avgProficiency);
      
      // Check if all scores are valid numbers (default/not graded)
      return !(isNaN(complexity) || isNaN(usability) || isNaN(innovation) || 
               isNaN(presentation) || isNaN(proficiency));
    });
    
    const completedAssessments = validGrades.length;

    return (
      <div className="additional-info-box">
        <h4>Project Assessment Summary</h4>
        <div className="info-grid">
          <div className="info-item">
            <div className="info-icon">👥</div>
            <div className="info-content">
              <span className="info-label">Total Projects Assigned</span>
              <span className="info-value">{totalProjects}</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">✅</div>
            <div className="info-content">
              <span className="info-label">Completed Assessments</span>
              <span className="info-value">{completedAssessments}</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">📊</div>
            <div className="info-content">
              <span className="info-label">Completion Rate</span>
              <span className="info-value">{totalProjects > 0 ? `${Math.round((completedAssessments / totalProjects) * 100)}%` : '0%'}</span>
            </div>
          </div>
          <div className="info-item">
            <div className="info-icon">⭐</div>
            <div className="info-content">
              <span className="info-label">Average Total Score</span>
              <span className="info-value">
                {validGrades.length > 0 
                  ? (validGrades.reduce((sum, project) => sum + parseFloat(project.avgTotal), 0) / validGrades.length).toFixed(2)
                  : 'N/A'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGradeBarChart = () => {
    if (!analyticsData || !analyticsData.gradeDistribution) {
      return <div className="no-data-message">No grade data available</div>;
    }

    const gradeData = analyticsData.gradeDistribution;
    const maxCount = Math.max(...Object.values(gradeData));
    
    return (
      <div className="bar-chart-container">
        <div className="chart-bars">
          {Object.entries(gradeData).map(([grade, count]) => {
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            const barHeight = Math.max(percentage, 2); // Minimum 2% height for visibility
            
            return (
              <div key={grade} className="bar-item">
                <div className="bar-wrapper">
                  <div 
                    className="bar" 
                    style={{ 
                      height: `${barHeight}%`,
                      backgroundColor: count > 0 ? '#175a94' : '#e9ecef'
                    }}
                  >
                    {count > 0 && <span className="bar-count">{count}</span>}
                  </div>
                </div>
                <span className="bar-label">{grade}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderBirdView = () => {
    if (!birdViewData || birdViewData.length === 0) {
      return <div className="no-data-message">No bird view data available</div>;
    }

    return (
      <div className="bird-view-container">
        {birdViewData.map((judge) => (
          <div key={judge.judgeId} className="judge-card">
            <div className="judge-header">
              <h3 className="judge-name">{judge.judgeName}</h3>
              <span className="project-count">
                {judge.projects.length} project{judge.projects.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="projects-grid">
              {judge.projects.length > 0 ? (
                judge.projects.map((project) => (
                  <div 
                    key={project.projectId} 
                    className={`project-card ${project.isGraded ? 'graded' : 'not-graded'}`}
                  >
                    <div className="project-title">{project.projectTitle}</div>
                    <div className="project-status">
                      {project.isGraded ? (
                        <span className="status-graded">
                          ✅ Graded ({project.grade}/50)
                        </span>
                      ) : (
                        <span className="status-not-graded">
                          ❌ Not Graded
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-projects">
                  <p>No projects assigned to this judge</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
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
          <button
            className={`mode-button ${viewMode === 'distribution' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('distribution')}
          >
            View by Distribution
          </button>
          <button
            className={`mode-button ${viewMode === 'bird-view' ? 'active' : ''}`}
            onClick={() => handleViewModeChange('bird-view')}
          >
            Bird View
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
          ) : viewMode === 'project' ? (
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
          ) : null}
        </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading analytics data...</p>
          </div>
        )}

        {!loading && analyticsData && renderAnalyticsTable()}

        {!loading && viewMode === 'bird-view' && renderBirdView()}

        {!loading && !analyticsData && viewMode === 'distribution' && (
          <div className="no-data-message">
            <p>No distribution data available. Please check if the backend server is running.</p>
          </div>
        )}

        {!loading && !analyticsData && viewMode !== 'distribution' && (selectedJudge || selectedProject) && (
          <div className="no-data-message">
            <p>No analytics data available for the selected {viewMode === 'judge' ? 'judge' : 'project'}.</p>
          </div>
        )}

        {!loading && !analyticsData && viewMode !== 'distribution' && !selectedJudge && !selectedProject && (
          <div className="no-data-message">
            <p>Please select a {viewMode === 'judge' ? 'judge' : 'project'} to view analytics data.</p>
          </div>
        )}
      </div>
      
      <AdminButtons />
    </div>
  );
});

export default Analytics;