import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaGithub, FaCheck, FaEye, FaInfoCircle, FaTrophy, FaStar, FaCheckCircle } from 'react-icons/fa'; // Import additional icons
import { MdGrading } from "react-icons/md";
import { convertWixImageUrl } from './Utils';
import { backendURL } from '../config';  // Adjust path as needed

// Modern Graded Badge Component
const GradedBadge = styled.div`
    position: absolute;
    top: 15px;
    right: 15px;
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    color: white;
    border-radius: 50px;
    padding: 8px 12px;
    font-size: 0.75rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 15px rgba(67, 233, 123, 0.4);
    border: 2px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    z-index: 10;
    animation: badgePulse 2s ease-in-out infinite;
    
    @keyframes badgePulse {
        0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(67, 233, 123, 0.4);
        }
        50% {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(67, 233, 123, 0.6);
        }
    }
    
    &:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 25px rgba(67, 233, 123, 0.5);
    }
`;

const ScoreBadge = styled.div`
    position: absolute;
    top: 15px;
    left: 15px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 50px;
    padding: 10px 16px;
    font-size: 0.8rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    border: 2px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    z-index: 25;
    min-width: 90px;
    animation: scoreBadgePulse 2s ease-in-out infinite;
    
    @keyframes scoreBadgePulse {
        0%, 100% {
            transform: scale(1);
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }
        50% {
            transform: scale(1.05);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }
    }
    
    &:hover {
        transform: scale(1.1);
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.5);
    }
`;

const BadgeIcon = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    backdrop-filter: blur(5px);
`;

const ScoreValue = styled.span`
    font-size: 1rem;
    font-weight: 800;
    background: rgba(255, 255, 255, 0.2);
    padding: 3px 8px;
    border-radius: 10px;
    backdrop-filter: blur(5px);
    min-width: 30px;
    text-align: center;
`;

// Judge Graded Badge - similar to GradedNotice from ProjectGradingForm
const JudgeGradedBadge = styled.div`
    position: absolute;
    top: 15px;
    left: 15px;
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    color: white;
    padding: 8px 12px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
    box-shadow: 0 4px 15px rgba(67, 233, 123, 0.3);
    z-index: 20;
    border: 2px solid rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    
    &:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 20px rgba(67, 233, 123, 0.4);
    }
`;

const PostContainer = styled.div`
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    background: var(--card-bg);
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px var(--shadow-light);
    transition: all 0.3s ease;
    border: 1px solid var(--card-border);
    height: 420px;
    cursor: ${props => props.showGradeButton ? 'pointer' : 'default'};
    
    &:hover {
        transform: translateY(-8px);
        box-shadow: 0 12px 40px var(--shadow-medium);
        border-color: var(--accent-primary);
    }
    
    ${props => props.showGradeButton && `
        &:hover::after {
            content: 'Click to Grade';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--accent-primary);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.8rem;
            font-weight: 600;
            z-index: 20;
            pointer-events: none;
        }
    `}
`;

const ImageContainer = styled.div`
    position: relative;
    width: 100%;
    height: 220px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: var(--bg-secondary);
    transition: transform 0.3s ease;
    
    ${PostContainer}:hover & {
        transform: scale(1.05);
    }
`;

const ImageOverlay = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--card-bg);
    opacity: 0;
    transition: opacity 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    
    ${PostContainer}:hover & {
        opacity: 1;
    }
`;

const OverlayContent = styled.div`
    color: var(--text-primary);
    text-align: center;
    padding: 1rem;
`;

const OverlayTitle = styled.h3`
    font-size: 1.3rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
`;

const OverlaySubtitle = styled.p`
    font-size: 1rem;
    margin: 0;
    color: var(--text-secondary);
    font-weight: 500;
`;

const ContentSection = styled.div`
    padding: 1.2rem;
    height: 200px;
    display: flex;
    flex-direction: column;
`;

const Title = styled.h2`
    margin: 0 0 0.5rem 0;
    font-size: 1.21rem;
    font-weight: 700;
    color: var(--text-primary);
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

const Content = styled.p`
    margin: 0 0 0.5rem 0;
    font-size: 0.935rem;
    color: var(--text-secondary);
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex: 1;
`;

const CardActions = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 0.5rem;
    height: 40px;
`;

const ActionButtons = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: nowrap;
`;

const ActionButton = styled.button`
    padding: 5px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    height: 40px;
    width: 40px;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
    text-decoration: none;
    box-sizing: border-box;
    min-width: 40px;
    min-height: 40px;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        color: white;
        text-decoration: none;
    }
`;

const ActionLink = styled.a`
    padding: 5px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.9rem;
    height: 40px;
    width: 40px;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
    text-decoration: none;
    box-sizing: border-box;
    min-width: 40px;
    min-height: 40px;

    &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
        color: white;
        text-decoration: none;
    }
`;

const GithubLink = styled.a`
    display: flex;
    align-items: center;
    color: var(--accent-primary);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
    font-size: 0.8rem;

    &:hover {
        color: var(--accent-secondary);
        transform: translateX(3px);
    }

    svg {
        margin-right: 0.3rem;
        font-size: 0.9rem;
    }
`;

const GradeButton = styled.button`
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
    color: white;
    border: none;
    border-radius: 50%;
    width: 45px;
    height: 45px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(67, 233, 123, 0.3);
    z-index: 10;
    
    &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 20px rgba(67, 233, 123, 0.4);
    }
`;

const ExpandableInfo = styled.div`
        position: absolute;
    top: 0;
    left: 0;
        right: 0;
    bottom: 0;
    background: var(--card-bg);
    backdrop-filter: blur(10px);
    border-radius: 20px;
    padding: 1.5rem;
    overflow-y: auto;
    z-index: 20;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    
    &.expanded {
        opacity: 1;
        visibility: visible;
    }
`;

const InfoHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
`;

const InfoTitle = styled.h3`
    font-size: 1.2rem;
    font-weight: 700;
    color: var(--text-primary);
        margin: 0;
`;

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 1.5rem;
    color: var(--text-secondary);
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
    transition: all 0.3s ease;
    
    &:hover {
        background: var(--bg-secondary);
        color: var(--accent-primary);
    }
`;

const ProjectInfo = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    margin-bottom: 1rem;
`;

const InfoItem = styled.div`
    padding: 0.75rem;
    background: var(--bg-secondary);
    border-radius: 8px;
    border: 1px solid var(--border-color);
`;

const InfoLabel = styled.span`
    font-weight: 600;
    color: var(--text-primary);
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: block;
    margin-bottom: 0.25rem;
`;

const InfoValue = styled.span`
    display: block;
    color: var(--text-secondary);
    font-size: 0.85rem;
    line-height: 1.4;
`;

const TagsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 1rem;
`;

const Tag = styled.span`
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 600;
`;

const ShowInfoButton = styled.button`
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;

    &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
`;

const Post = ({ project, onGrade, showGradeButton, reloadGrade }) => {
    const [showInfo, setShowInfo] = useState(false);
    const [gradeInfo, setGradeInfo] = useState(null);
    const [judgeGraded, setJudgeGraded] = useState(false);

    useEffect(() => {
        const fetchGradeInfo = async () => {
            try {
                const response = await fetch(`${backendURL}/admin/projects/${project._id}/gradeInfo`);
                const data = await response.json();
                console.log('Grade info for project:', project._id, data); // Debug log
                console.log('Grade info structure:', {
                    hasGradeInfo: !!data,
                    hasGradedBy: !!(data && data.gradedBy),
                    gradedByLength: data?.gradedBy?.length,
                    hasAverageScore: !!(data && data.averageScore),
                    averageScore: data?.averageScore,
                    gradedByData: data?.gradedBy
                });
                setGradeInfo(data);
            } catch (error) {
                console.error('Error fetching grade info:', error);
            }
        };

        const checkJudgeGraded = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${backendURL}/projects/${project.ProjectNumber || project._id}/grade`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setJudgeGraded(!!(data && data.gradeInfo));
                }
            } catch (error) {
                console.error('Error checking judge grade:', error);
            }
        };

        if (project._id) {
            fetchGradeInfo();
            if (showGradeButton) {
                checkJudgeGraded();
            }
        }
    }, [project._id, reloadGrade, showGradeButton]);

    const handleGradeClick = () => {
        if (onGrade) {
            onGrade(project);
        }
    };

    const handleShowInfo = () => {
        setShowInfo(!showInfo);
    };

    const handleCloseInfo = () => {
        setShowInfo(false);
    };

    // Fix: Use ProjectImage instead of Image, and handle multiple possible field names
    const imageUrl = project.ProjectImage || project.Image || project.projectImage || project.image 
        ? convertWixImageUrl(project.ProjectImage || project.Image || project.projectImage || project.image)
        : 'https://via.placeholder.com/400x250/667eea/ffffff?text=No+Image';

    return (
        <PostContainer 
            showGradeButton={showGradeButton}
            onClick={showGradeButton ? handleGradeClick : undefined}
        >
            {/* Modern Graded Badge */}
            {gradeInfo && gradeInfo.gradedBy && gradeInfo.gradedBy.length > 0 && (
                <GradedBadge>
                    <BadgeIcon>
                        <FaTrophy size={10} />
                    </BadgeIcon>
                    GRADED
                </GradedBadge>
            )}

            {/* Score Badge - Show for any project that has been graded */}
            {gradeInfo && (gradeInfo.gradedBy?.length > 0 || gradeInfo.averageScore) && (
                <ScoreBadge>
                    <BadgeIcon>
                        <FaStar size={12} />
                    </BadgeIcon>
                    <span>Score:</span>
                    <ScoreValue>
                        {(() => {
                            // Calculate score based on available data
                            if (gradeInfo.gradedBy && gradeInfo.gradedBy.length > 0) {
                                const totalScore = gradeInfo.gradedBy.reduce((sum, grade) => {
                                    const gradeValue = grade.grade || grade.score || 0;
                                    return sum + gradeValue;
                                }, 0);
                                return Math.round(totalScore / gradeInfo.gradedBy.length);
                            } else if (gradeInfo.averageScore) {
                                return Math.round(gradeInfo.averageScore);
                            } else if (gradeInfo.totalScore && gradeInfo.gradedBy?.length) {
                                return Math.round(gradeInfo.totalScore / gradeInfo.gradedBy.length);
                            } else {
                                return 'N/A';
                            }
                        })()}
                    </ScoreValue>
                </ScoreBadge>
            )}



            {/* Image Section */}
            <ImageContainer>
                <Image src={imageUrl} alt={project.Title || project.name} />
                
                {/* Judge Graded Badge - shows when current judge has graded this project */}
                {judgeGraded && (
                    <JudgeGradedBadge>
                        <FaCheckCircle size={12} />
                        GRADED
                    </JudgeGradedBadge>
                )}
                
                <ImageOverlay>
                    <OverlayContent>
                        <OverlayTitle>{project.Title || project.name}</OverlayTitle>
                        <OverlaySubtitle>
                            {project.ProjectYear && `${project.ProjectYear} • `}
                            {project.WorkshopName || project.workshopName}
                        </OverlaySubtitle>
                    </OverlayContent>
                </ImageOverlay>
            </ImageContainer>

            {/* Content Section */}
            <ContentSection>
                    <div>
                    <Title>{project.Title || project.name}</Title>
                    <Content>
                        {project.ProjectOwners || project.projectOwners || 
                         project.StudentName || project.studentName || 
                         project.Lecturer || project.lecturer}
                    </Content>
                </div>

                <CardActions>
                    <ActionButtons>
                        <ActionButton onClick={(e) => {
                            e.stopPropagation();
                            handleShowInfo();
                        }}>
                            <FaInfoCircle size={30} />
                        </ActionButton>
                        {(project.GithubLink || project.GitHubLink) && (
                            <ActionLink 
                                href={project.GithubLink || project.GitHubLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <FaGithub size={30} />
                            </ActionLink>
                        )}
                    </ActionButtons>
                    
                    {gradeInfo && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FaCheck size={12} style={{ color: '#43e97b' }} />
                            <span style={{ fontSize: '0.8rem', color: '#718096' }}>
                                {gradeInfo.gradedBy?.length || 0} judges
                            </span>
                        </div>
                    )}
                </CardActions>
            </ContentSection>

            {/* Expandable Info Overlay */}
            <ExpandableInfo className={showInfo ? 'expanded' : ''}>
                <InfoHeader>
                    <InfoTitle>Project Details</InfoTitle>
                    <CloseButton onClick={handleCloseInfo}>×</CloseButton>
                </InfoHeader>
                
                <ProjectInfo>
                    {project.Title && (
                        <InfoItem>
                            <InfoLabel>Title</InfoLabel>
                            <InfoValue>{project.Title}</InfoValue>
                        </InfoItem>
                    )}
                    {project.ProjectYear && (
                        <InfoItem>
                            <InfoLabel>Year</InfoLabel>
                            <InfoValue>{project.ProjectYear}</InfoValue>
                        </InfoItem>
                    )}
                    {project.WorkshopName && (
                        <InfoItem>
                            <InfoLabel>Workshop</InfoLabel>
                            <InfoValue>{project.WorkshopName}</InfoValue>
                        </InfoItem>
                    )}
                    {project.ProjectOwners && (
                        <InfoItem>
                            <InfoLabel>Owners</InfoLabel>
                            <InfoValue>{project.ProjectOwners}</InfoValue>
                        </InfoItem>
                    )}
                    {project.Lecturer && (
                        <InfoItem>
                            <InfoLabel>Lecturer</InfoLabel>
                            <InfoValue>{project.Lecturer}</InfoValue>
                        </InfoItem>
                    )}
                    {project.StudentName && (
                        <InfoItem>
                            <InfoLabel>Student</InfoLabel>
                            <InfoValue>{project.StudentName}</InfoValue>
                        </InfoItem>
                    )}
                    {project.StudentEmail && (
                        <InfoItem>
                            <InfoLabel>Email</InfoLabel>
                            <InfoValue>{project.StudentEmail}</InfoValue>
                        </InfoItem>
                    )}
                    {project.StudentPhone && (
                        <InfoItem>
                            <InfoLabel>Phone</InfoLabel>
                            <InfoValue>{project.StudentPhone}</InfoValue>
                        </InfoItem>
                    )}
                    {project.WorkshopId && (
                        <InfoItem>
                            <InfoLabel>Workshop ID</InfoLabel>
                            <InfoValue>{project.WorkshopId}</InfoValue>
                        </InfoItem>
                    )}
                </ProjectInfo>

                {(project.GithubLink || project.GitHubLink) && (
                    <GithubLink href={project.GithubLink || project.GitHubLink} target="_blank" rel="noopener noreferrer">
                        <FaGithub />
                        View on GitHub
                    </GithubLink>
                )}

                {gradeInfo && (
                    <div style={{ marginTop: '1rem' }}>
                        <InfoLabel>Grading Status</InfoLabel>
                        <InfoValue>
                            {gradeInfo.gradedBy?.length || 0} judges have graded this project
                        </InfoValue>
                    </div>
                )}
            </ExpandableInfo>
        </PostContainer>
    );
};

export default Post;
