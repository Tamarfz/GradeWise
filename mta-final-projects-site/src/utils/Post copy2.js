import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaGithub, FaCheck } from 'react-icons/fa'; // Import GitHub and Check icons
import { MdGrading } from "react-icons/md";
import { convertWixImageUrl } from './Utils';
import { backendURL } from '../config';  // Adjust path as needed


const PostContainer = styled.div`
    position: relative;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 16px;
    background-color: #F5F5F5;
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    
    &:hover {
        transform: translateY(-5px);
        box-shadow: 4px 8px 16px rgba(0, 0, 0, 0.15);
    }
`;

const Title = styled.h2`
    margin: 0 0 10px;
    font-size: 24px;
    color: #333;
`;

const Content = styled.p`
    margin: 0 0 10px;
    font-size: 16px;
    color: #555;
`;

const Image = styled.img`
    width: 50%; /* Reduced the image size by 50% */
    height: auto;
    border-radius: 8px;
    margin-bottom: 16px;
`;

const ExpandableInfo = styled.div`
    margin-top: 10px;
`;

const ShowInfoButton = styled.button`
    padding: 10px 20px;
    background-color: #175a94; /* Match the GradeButton color */
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    margin-top: 10px;

    &:hover {
        background-color: #0e3f6d; /* Darker color on hover */
    }
`;

const GithubLink = styled.a`
    display: inline-flex;
    align-items: center;
    color: #333;
    text-decoration: none;
    margin-top: 10px;

    &:hover {
        color: #000;
    }

    svg {
        margin-right: 8px;
    }
`;

const GradeButton = styled.button`
    position: absolute;
    top: 16px;
    right: 16px;
    background-color: #175a94;
    color: white;
    border: none;
    border-radius: 50%;
    width: 60px;
    height: 60px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 2px 4px 8px rgba(0, 0, 0, 0.1);
    
    &:hover {
        background-color: #0e3f6d;
        transform: scale(1.1);
    }

    &:hover::after {
        content: 'Click to grade the project';
        position: absolute;
        top: -40px;
        right: 0;
        background-color: #333;
        color: #fff;
        padding: 5px;
        border-radius: 3px;
        font-size: 12px;
        white-space: nowrap;
        opacity: 0.9;
    }

    svg {
        margin: 0;
    }
`;

// Add an icon to the finished badge.
const FinishedBadge = styled.div`
    position: absolute;
    top: 8px;
    left: 8px;
    background-color:rgb(242, 245, 242);
    color: white;
    padding: 10px 10px;
    border-radius: 4px;
    font-weight: bold;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
`;


const Post = ({ project, onGrade, showGradeButton, reloadGrade }) => {
    const [isInfoExpanded, setIsInfoExpanded] = useState(false);
    const [gradeInfo, setGradeInfo] = useState(null);
    const imageUrl = convertWixImageUrl(project.ProjectImage);
    const token = localStorage.getItem('token');

    // Fetch grade info for this project for the current judge.
    useEffect(() => {
        const fetchGradeInfo = async () => {
            try {
                const response = await fetch(`${backendURL}/projects/${project.ProjectNumber}/grade`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    if (data.gradeInfo) {
                        setGradeInfo(data.gradeInfo);
                    } else {
                        setGradeInfo(null);
                    }
                }
            } catch (error) {
                console.error('Error fetching grade info:', error);
            }
        };

        fetchGradeInfo();
    }, [project.ProjectNumber, token, reloadGrade]); // Added reloadGrade here

    // Use the existence of gradeInfo to determine if the project is graded.
    const isGraded = Boolean(gradeInfo);

    return (
        <PostContainer>
            {isGraded && (
                <FinishedBadge>
                    <img
                        src={process.env.PUBLIC_URL + "/Assets/icons/check.png"}
                        alt="Finished"
                        style={{ width: '45px', height: '45px', marginRight: '4px' }}
                    />
                </FinishedBadge>
            )}
            <Title>{project.Title}</Title>
            <Image src={imageUrl} alt={project.Title} />
            <Content><strong>Workshop Name:</strong> {project.WorkshopName}</Content>
            <Content><strong>Project Owners:</strong> {project.ProjectOwners}</Content>
            <Content><strong>Lecturer:</strong> {project.Lecturer}</Content>
            <Content><strong>Info:</strong> {project.ProjectInfo}</Content>
           
            
            <ExpandableInfo>
                <ShowInfoButton onClick={() => setIsInfoExpanded(!isInfoExpanded)}>
                    {isInfoExpanded ? 'Hide extra details' : 'Show more details'}
                </ShowInfoButton>
                {isInfoExpanded && (
                    <div>
                        
                        <Content><strong>Workshop ID:</strong> {project.WorkshopId}</Content>
                        <Content><strong>Year:</strong> {project.ProjectYear}</Content>
                        <Content><strong>Phone:</strong> {project.StudentPhone}</Content>
                        <Content><strong>Email:</strong> {project.StudentEmail}</Content>
                        <Content><strong>Project ID:</strong> {project.ProjectNumber}</Content>
                    </div>
                )}
            </ExpandableInfo>
            {project.GitHubLink && (
                <GithubLink href={project.GitHubLink} target="_blank">
                    <FaGithub size={20} />
                    View on GitHub
                </GithubLink>
            )}
            {showGradeButton && (
                <GradeButton onClick={onGrade}>
                    <MdGrading size={28} />
                </GradeButton>
            )}
        </PostContainer>
    );
};

export default Post;
