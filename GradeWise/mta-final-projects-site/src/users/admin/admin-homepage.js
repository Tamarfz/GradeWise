//V
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { storages } from '../../stores';
import AdminButtons from './AdminButtons';
import Feed from '../../utils/Feed';
import axios from 'axios';
import { backendURL } from '../../config';
import { getAvatarUrl } from '../../utils/avatarUtils';
import { 
  FaUsers, 
  FaProjectDiagram, 
  FaChartBar, 
  FaTrophy, 
  FaCog, 
  FaUserShield,
  FaClipboardList
} from 'react-icons/fa';

const AdminHome = observer(() => {
    const navigate = useNavigate();
    const { userStorage } = storages;
    const user = userStorage.user;
    const [judgeMap, setJudgeMap] = useState({});
    const [projectMap, setProjectMap] = useState({});
    const [stats, setStats] = useState({
        totalJudges: 0,
        totalProjects: 0,
        gradedProjects: 0,
        pendingProjects: 0
    });

    const fetchJudgeAndProjectMaps = async () => {
        try {
            const response = await fetch(`${backendURL}/admin/judgesProjectsMaps`, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            // Optionally, store the data in localStorage for future sessions
            localStorage.setItem('judgeMap', JSON.stringify(data.judges));
            localStorage.setItem('projectMap', JSON.stringify(data.projects));
        } catch (error) {
            console.error('Error fetching judge and project maps:', error);
        }
    };

    const fetchStats = async () => {
        try {
            console.log('Fetching stats...');
            const token = localStorage.getItem('token');
            
            const [judgesResponse, projectsResponse, gradesResponse] = await Promise.all([
                axios.get(`${backendURL}/admin/judges/judgesList`),
                axios.get(`${backendURL}/admin/projects/projectsList`),
                axios.get(`${backendURL}/admin/grades`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                })
            ]);
            
            const totalJudges = judgesResponse.data.length;
            const totalProjects = projectsResponse.data.length;
            
            console.log('Basic counts:', { totalJudges, totalProjects });
            
            // Calculate real grading statistics
            const gradesData = gradesResponse.data.grades;
            console.log('Grades data received:', gradesData ? gradesData.length : 'No grades data');
            
            let gradedProjects = 0;
            let pendingProjects = 0;
            
            if (gradesData && gradesData.length > 0) {
                // Group grades by project to count unique graded projects
                const projectGrades = {};
                
                gradesData.forEach(grade => {
                    const projectId = grade.project_id.toString();
                    if (!projectGrades[projectId]) {
                        projectGrades[projectId] = [];
                    }
                    projectGrades[projectId].push(grade);
                });
                
                console.log('Project grades grouped:', Object.keys(projectGrades).length, 'unique projects');
                
                // Count projects that have been graded (not just default scores)
                Object.values(projectGrades).forEach(projectGradeList => {
                    const hasValidGrade = projectGradeList.some(grade => 
                        !(grade.complexity === 1 && grade.usability === 1 && 
                          grade.innovation === 1 && grade.presentation === 1 && 
                          grade.proficiency === 1)
                    );
                    
                    if (hasValidGrade) {
                        gradedProjects++;
                    } else {
                        pendingProjects++;
                    }
                });
                
                console.log('Grading calculation:', { gradedProjects, pendingProjects });
            }
            
            const finalStats = {
                totalJudges,
                totalProjects,
                gradedProjects,
                pendingProjects
            };
            
            console.log('Final stats being set:', finalStats);
            setStats(finalStats);
            
        } catch (error) {
            console.error('Error fetching stats:', error);
            // Fallback to basic stats if grades fetch fails
            try {
                const [judgesResponse, projectsResponse] = await Promise.all([
                    axios.get(`${backendURL}/admin/judges/judgesList`),
                    axios.get(`${backendURL}/admin/projects/projectsList`)
                ]);
                
                const fallbackStats = {
                    totalJudges: judgesResponse.data.length,
                    totalProjects: projectsResponse.data.length,
                    gradedProjects: 0,
                    pendingProjects: 0
                };
                
                console.log('Setting fallback stats:', fallbackStats);
                setStats(fallbackStats);
            } catch (fallbackError) {
                console.error('Error fetching fallback stats:', fallbackError);
            }
        }
    };

    useEffect(() => {
        fetchJudgeAndProjectMaps();
        fetchStats();
    }, []);

    const quickActions = [
        {
            title: 'Manage Judges',
            icon: <FaUsers />,
            description: 'Add, edit, or remove judges',
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            route: '/admin/manage-judges'
        },
        {
            title: 'Manage Projects',
            icon: <FaProjectDiagram />,
            description: 'Upload and manage project data',
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            route: '/admin/manage-projects'
        },
        {
            title: 'Assign Projects',
            icon: <FaClipboardList />,
            description: 'Assign projects to judges',
            color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            route: '/admin/assign-projects'
        },
        {
            title: 'Manage Grades',
            icon: <FaChartBar />,
            description: 'Review and manage project grades',
            color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            route: '/admin/manage-projects-grades'
        },
        {
            title: 'Analytics',
            icon: <FaCog />,
            description: 'View detailed analytics and reports',
            color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
            route: '/admin/analytics'
        },
        {
            title: 'Podium',
            icon: <FaTrophy />,
            description: 'View competition results',
            color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            route: '/admin/podium'
        }
    ];

    return (
        <div className="admin-dashboard">
            {/* Header */}
            <header className="admin-header">
                <div className="header-content">
                    <div className="welcome-section">
                        <div className="welcome-avatar">
                            <img 
                                src={getAvatarUrl(user?.avatar)} 
                                alt="Admin Avatar" 
                                className="admin-avatar"
                            />
                        </div>
                        <div className="welcome-text">
                            <h1 className="welcome-title">
                                Welcome back, <span className="admin-name">{user?.name}</span>!
                            </h1>
                            <p className="welcome-subtitle">Here's what's happening with your competition today</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Cards */}
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon judges">
                            <FaUsers />
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-number">{stats.totalJudges}</h3>
                            <p className="stat-label">Total Judges</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon projects">
                            <FaProjectDiagram />
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-number">{stats.totalProjects}</h3>
                            <p className="stat-label">Total Projects</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon graded">
                            <FaChartBar />
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-number">{stats.gradedProjects}</h3>
                            <p className="stat-label">Graded Projects</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon pending">
                            <FaClipboardList />
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-number">{stats.pendingProjects}</h3>
                            <p className="stat-label">Pending Projects</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quick Actions */}
            <section className="quick-actions-section">
                <div className="actions-grid">
                    {quickActions.map((action, index) => (
                        <div 
                            key={index}
                            className="action-card"
                            style={{ background: action.color }}
                            onClick={() => navigate(action.route)}
                        >
                            <div className="action-icon">
                                {action.icon}
                            </div>
                            <div className="action-content">
                                <h3 className="action-title">{action.title}</h3>
                                <p className="action-description">{action.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Projects Feed */}
            <section className="projects-section">
                <div className="feed-container">
                    <Feed />
                </div>
            </section>

            {/* Sidebar Navigation */}
            <AdminButtons />
        </div>
    );
});

export { AdminHome };
