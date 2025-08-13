//V
// JudgeHome.js
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { storages } from '../../stores';
import JudgeButtons from './JudgeButtons';
import Feed from '../../utils/Feed';
import axios from 'axios';
import { backendURL } from '../../config';
import { getAvatarUrl } from '../../utils/avatarUtils';
import { 
  FaUserShield, 
  FaClipboardList, 
  FaChartBar, 
  FaSignOutAlt,
  FaGavel,
  FaCheckCircle
} from 'react-icons/fa';
import './JudgeHome.css';

const JudgeHome = observer(() => {
    const navigate = useNavigate();
    const { userStorage } = storages;
    const user = userStorage.user;
    const [stats, setStats] = useState({
        assignedProjects: 0,
        gradedProjects: 0,
        pendingProjects: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem('token');
                
                // Use the correct endpoint that provides totalAssigned and totalGraded
                const response = await axios.get(`${backendURL}/judge/counts`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
                const { totalAssigned, totalGraded } = response.data;
                const pendingProjects = totalAssigned - totalGraded;
                
                setStats({
                    assignedProjects: totalAssigned,
                    gradedProjects: totalGraded,
                    pendingProjects: pendingProjects
                });
                
                console.log('Judge stats:', { totalAssigned, totalGraded, pendingProjects });
            } catch (error) {
                console.error('Error fetching judge stats:', error);
                // Set default values if API call fails
                setStats({
                    assignedProjects: 0,
                    gradedProjects: 0,
                    pendingProjects: 0
                });
            }
        };

        // Refresh user data from database to ensure avatar is up to date
        const refreshUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${backendURL}/current-judge`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                
                // Update userStorage with fresh data
                userStorage.user.email = data.email || '';
                userStorage.user.name = data.name || '';
                userStorage.user.avatar = data.avatar || 'default';
            } catch (error) {
                console.error('Error refreshing user data:', error);
            }
        };

        fetchStats();
        refreshUserData();
    }, []);

    const quickActions = [
        {
            title: 'Profile Setup',
            icon: <FaUserShield />,
            description: 'Update your profile information',
            color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            route: '/judge/profile-setup'
        },
        {
            title: 'Grade Projects',
            icon: <FaGavel />,
            description: 'Review and grade assigned projects',
            color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            route: '/judge/grade-projects'
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
                                alt="Judge Avatar" 
                                className="judge-avatar"
                            />
                        </div>
                        <div className="welcome-text">
                            <h1 className="welcome-title">
                                Welcome back, <span className="admin-name">{user?.name}</span>!
                            </h1>
                            <p className="welcome-subtitle">Here's your grading dashboard overview</p>
                        </div>
                    </div>
                </div>
            </header>

            {/* Stats Cards */}
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon judges">
                            <FaUserShield />
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-number">{stats.assignedProjects}</h3>
                            <p className="stat-label">Assigned Projects</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon projects">
                            <FaGavel />
                        </div>
                        <div className="stat-content">
                            <h3 className="stat-number">{stats.gradedProjects}</h3>
                            <p className="stat-label">Graded Projects</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon graded">
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
            <JudgeButtons />
        </div>
    );
});

export default JudgeHome;