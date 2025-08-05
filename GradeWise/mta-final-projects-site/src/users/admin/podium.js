//V
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { apiUrl } from '../../config';
import './Podium.css';

const Podium = () => {
  const [topProjects, setTopProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTopProjects();
  }, []);

  const fetchTopProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/admin/podium`);
      setTopProjects(response.data.topProjects);
      setError(null);
    } catch (err) {
      console.error('Error fetching top projects:', err);
      setError('Failed to load podium data');
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (position) => {
    switch (position) {
      case 1:
        return '🥇';
      case 2:
        return '🥈';
      case 3:
        return '🥉';
      default:
        return '🏅';
    }
  };

  const getPositionClass = (position) => {
    switch (position) {
      case 1:
        return 'first-place';
      case 2:
        return 'second-place';
      case 3:
        return 'third-place';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <div className="podium-container">
        <div className="podium-header">
          <h1>🏆 Project Podium</h1>
          <p>Celebrating the top performers</p>
        </div>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading podium data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="podium-container">
        <div className="podium-header">
          <h1>🏆 Project Podium</h1>
          <p>Celebrating the top performers</p>
        </div>
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <p>{error}</p>
          <button onClick={fetchTopProjects} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="podium-container">
      <div className="podium-header">
        <h1>🏆 Project Podium</h1>
        <p>Celebrating the top performers</p>
      </div>

      {topProjects.length === 0 ? (
        <div className="no-data-container">
          <div className="no-data-icon">📊</div>
          <h3>No Projects Available</h3>
          <p>There are no graded projects to display on the podium.</p>
        </div>
      ) : (
        <div className="podium-content">
          <div className="podium-stage">
            {/* Second Place */}
            {topProjects[1] && (
              <div className={`podium-position second-place ${getPositionClass(2)}`}>
                <div className="medal-icon">{getMedalIcon(2)}</div>
                <div className="position-number">2</div>
                <div className="project-info">
                  <h3>{topProjects[1].projectTitle}</h3>
                  <div className="score-details">
                    <div className="total-score">
                      <span className="score-label">Total Score</span>
                      <span className="score-value">{topProjects[1].averageTotal.toFixed(2)}</span>
                    </div>
                    <div className="score-breakdown">
                      <div className="score-item">
                        <span>Complexity</span>
                        <span>{topProjects[1].avgComplexity.toFixed(2)}</span>
                      </div>
                      <div className="score-item">
                        <span>Usability</span>
                        <span>{topProjects[1].avgUsability.toFixed(2)}</span>
                      </div>
                      <div className="score-item">
                        <span>Innovation</span>
                        <span>{topProjects[1].avgInnovation.toFixed(2)}</span>
                      </div>
                      <div className="score-item">
                        <span>Presentation</span>
                        <span>{topProjects[1].avgPresentation.toFixed(2)}</span>
                      </div>
                      <div className="score-item">
                        <span>Proficiency</span>
                        <span>{topProjects[1].avgProficiency.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* First Place */}
            {topProjects[0] && (
              <div className={`podium-position first-place ${getPositionClass(1)}`}>
                <div className="medal-icon">{getMedalIcon(1)}</div>
                <div className="position-number">1</div>
                <div className="project-info">
                  <h3>{topProjects[0].projectTitle}</h3>
                  <div className="score-details">
                    <div className="total-score">
                      <span className="score-label">Total Score</span>
                      <span className="score-value">{topProjects[0].averageTotal.toFixed(2)}</span>
                    </div>
                    <div className="score-breakdown">
                      <div className="score-item">
                        <span>Complexity</span>
                        <span>{topProjects[0].avgComplexity.toFixed(2)}</span>
                      </div>
                      <div className="score-item">
                        <span>Usability</span>
                        <span>{topProjects[0].avgUsability.toFixed(2)}</span>
                      </div>
                      <div className="score-item">
                        <span>Innovation</span>
                        <span>{topProjects[0].avgInnovation.toFixed(2)}</span>
                      </div>
                      <div className="score-item">
                        <span>Presentation</span>
                        <span>{topProjects[0].avgPresentation.toFixed(2)}</span>
                      </div>
                      <div className="score-item">
                        <span>Proficiency</span>
                        <span>{topProjects[0].avgProficiency.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Third Place */}
            {topProjects[2] && (
              <div className={`podium-position third-place ${getPositionClass(3)}`}>
                <div className="medal-icon">{getMedalIcon(3)}</div>
                <div className="position-number">3</div>
                <div className="project-info">
                  <h3>{topProjects[2].projectTitle}</h3>
                  <div className="score-details">
                    <div className="total-score">
                      <span className="score-label">Total Score</span>
                      <span className="score-value">{topProjects[2].averageTotal.toFixed(2)}</span>
                    </div>
                    <div className="score-breakdown">
                      <div className="score-item">
                        <span>Complexity</span>
                        <span>{topProjects[2].avgComplexity.toFixed(2)}</span>
                      </div>
                      <div className="score-item">
                        <span>Usability</span>
                        <span>{topProjects[2].avgUsability.toFixed(2)}</span>
                      </div>
                      <div className="score-item">
                        <span>Innovation</span>
                        <span>{topProjects[2].avgInnovation.toFixed(2)}</span>
                      </div>
                      <div className="score-item">
                        <span>Presentation</span>
                        <span>{topProjects[2].avgPresentation.toFixed(2)}</span>
                      </div>
                      <div className="score-item">
                        <span>Proficiency</span>
                        <span>{topProjects[2].avgProficiency.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="podium-stats">
            <div className="stats-card">
              <h4>🏆 Competition Stats</h4>
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">{topProjects.length}</span>
                  <span className="stat-label">Top Projects</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {topProjects.length > 0 ? topProjects[0].averageTotal.toFixed(2) : '0.00'}
                  </span>
                  <span className="stat-label">Highest Score</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {topProjects.length > 0 ? 
                      (topProjects.reduce((sum, project) => sum + project.averageTotal, 0) / topProjects.length).toFixed(2) : '0.00'
                    }
                  </span>
                  <span className="stat-label">Average Score</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Podium;
