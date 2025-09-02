//V
import { observer } from 'mobx-react-lite';
import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import ReactDOM from 'react-dom/client';
import { FaUsers, FaProjectDiagram, FaTrash, FaEdit, FaPlus, FaEye, FaCog, FaUserPlus } from 'react-icons/fa';

import AdminButtons from './AdminButtons';
import { backendURL } from '../../config';
import './Administration.css';

const Administration = observer(() => {
    const [judges, setJudges] = useState([]);
    const [potentialJudges, setPotentialJudges] = useState([]);
    const [projects, setProjects] = useState([]);
    const [activeTab, setActiveTab] = useState('projects');
    const [loading, setLoading] = useState(false);

    // Fetch data functions
    const fetchJudges = () => {
        fetch(`${backendURL}/admin/judges/judgesList`)
            .then(response => response.json())
            .then(data => setJudges(data))
            .catch(error => console.error('Error:', error));
    };

    const fetchPotentialJudges = () => {
        fetch(`${backendURL}/admin/judges/potentialJudgesList`)
            .then(response => response.json())
            .then(data => setPotentialJudges(data))
            .catch(error => console.error('Error:', error));
    };

    const fetchProjects = () => {
        fetch(`${backendURL}/admin/projects/projectsList`)
            .then(response => response.json())
            .then(data => setProjects(data))
            .catch(error => console.error('Error:', error));
    };

    useEffect(() => {
        fetchJudges();
        fetchPotentialJudges();
        fetchProjects();
    }, []);

    // Project Management Functions
    const handleAddNewProject = async () => {
        const fetchWorkshops = async () => {
            try {
                const response = await fetch(`${backendURL}/admin/projects/workshops`);
                if (response.ok) {
                    return await response.json();
                }
            } catch (error) {
                console.error('Error fetching workshops:', error);
            }
            return [];
        };
    
        const workshops = await fetchWorkshops();
    
        const { value: newProject } = await Swal.fire({
            title: '<div style="text-align: center; margin-bottom: 20px;"><span style="font-size: 1.5rem; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Add New Project</span></div>',
            html: `
                <div style="max-width: 600px; margin: 0 auto;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div style="display: flex; flex-direction: column;">
                            <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Project Number</label>
                            <input id="projectNumber" style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 2px solid #e2e8f0;
                                border-radius: 12px;
                                font-size: 1rem;
                                background: #f8fafc;
                                color: #1a202c;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                            " placeholder="Enter Project Number" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Project Title</label>
                            <input id="title" style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 2px solid #e2e8f0;
                                border-radius: 12px;
                                font-size: 1rem;
                                background: #f8fafc;
                                color: #1a202c;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                            " placeholder="Enter Project Title" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div style="display: flex; flex-direction: column;">
                            <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Project Owners</label>
                            <input id="projectOwners" style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 2px solid #e2e8f0;
                                border-radius: 12px;
                                font-size: 1rem;
                                background: #f8fafc;
                                color: #1a202c;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                            " placeholder="Enter Project Owners" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Student Name</label>
                            <input id="studentName" style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 2px solid #e2e8f0;
                                border-radius: 12px;
                                font-size: 1rem;
                                background: #f8fafc;
                                color: #1a202c;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                            " placeholder="Enter Student Name" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div style="display: flex; flex-direction: column;">
                            <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Student Email</label>
                            <input id="studentEmail" type="email" style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 2px solid #e2e8f0;
                                border-radius: 12px;
                                font-size: 1rem;
                                background: #f8fafc;
                                color: #1a202c;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                            " placeholder="Enter Student Email" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Student Phone</label>
                            <input id="studentPhone" style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 2px solid #e2e8f0;
                                border-radius: 12px;
                                font-size: 1rem;
                                background: #f8fafc;
                                color: #1a202c;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                            " placeholder="Enter Student Phone" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div style="display: flex; flex-direction: column;">
                            <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Course Of Study</label>
                            <input id="courseOfStudy" style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 2px solid #e2e8f0;
                                border-radius: 12px;
                                font-size: 1rem;
                                background: #f8fafc;
                                color: #1a202c;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                            " placeholder="Enter Course Of Study" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Lecturer</label>
                            <input id="lecturer" style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 2px solid #e2e8f0;
                                border-radius: 12px;
                                font-size: 1rem;
                                background: #f8fafc;
                                color: #1a202c;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                            " placeholder="Enter Lecturer" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div style="display: flex; flex-direction: column;">
                            <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Project Information</label>
                            <input id="projectInfo" style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 2px solid #e2e8f0;
                                border-radius: 12px;
                                font-size: 1rem;
                                background: #f8fafc;
                                color: #1a202c;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                            " placeholder="Enter Project Information" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Github Link</label>
                            <input id="githubLink" style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 2px solid #e2e8f0;
                                border-radius: 12px;
                                font-size: 1rem;
                                background: #f8fafc;
                                color: #1a202c;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                            " placeholder="Enter Github Link" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                        </div>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; margin-bottom: 20px;">
                        <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Project Image</label>
                        <input id="projectImage" style="
                            width: 100%;
                            padding: 12px 16px;
                            border: 2px solid #e2e8f0;
                            border-radius: 12px;
                            font-size: 1rem;
                            background: #f8fafc;
                            color: #1a202c;
                            transition: all 0.3s ease;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                        " placeholder="Enter Project Image URL" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                    </div>
                    
                    <div style="display: flex; flex-direction: column; margin-bottom: 20px;">
                        <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Select Workshop</label>
                        <select id="workshopIdSelect" style="
                            width: 100%;
                            padding: 12px 16px;
                            border: 2px solid #e2e8f0;
                            border-radius: 12px;
                            font-size: 1rem;
                            background: #f8fafc;
                            color: #1a202c;
                            transition: all 0.3s ease;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                            cursor: pointer;
                        " onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'">
                            <option value="" disabled selected style="color: #a0aec0;">Select Workshop</option>
                            ${workshops.map(workshop => `<option value="${workshop.WorkshopId}|${workshop.WorkshopName}">${workshop.WorkshopId} (${workshop.WorkshopName})</option>`).join('')}
                            <option value="new">New Workshop</option>
                        </select>
                    </div>
                    
                    <div id="newWorkshopFields" style="display: none; margin-bottom: 20px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                            <div style="display: flex; flex-direction: column;">
                                <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">New Workshop ID</label>
                                <input id="newWorkshopId" style="
                                    width: 100%;
                                    padding: 12px 16px;
                                    border: 2px solid #e2e8f0;
                                    border-radius: 12px;
                                    font-size: 1rem;
                                    background: #f8fafc;
                                    color: #1a202c;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                " placeholder="Enter New Workshop ID" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">New Workshop Name</label>
                                <input id="newWorkshopName" style="
                                    width: 100%;
                                    padding: 12px 16px;
                                    border: 2px solid #e2e8f0;
                                    border-radius: 12px;
                                    font-size: 1rem;
                                    background: #f8fafc;
                                    color: #1a202c;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                " placeholder="Enter New Workshop Name" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                            </div>
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 12px; padding: 16px; border-left: 4px solid #667eea;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="color: white; font-size: 12px; font-weight: bold;">ℹ️</span>
                            </div>
                            <div>
                                <div style="font-weight: 600; color: #2d3748; font-size: 0.9rem; margin-bottom: 4px;">Add New Project</div>
                                <div style="color: #4a5568; font-size: 0.85rem; line-height: 1.4;">Fill in all required fields to create a new project. You can select an existing workshop or create a new one.</div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            customClass: { 
                popup: 'modern-swal-popup',
                confirmButton: 'modern-confirm-button',
                cancelButton: 'modern-cancel-button'
            },
            width: '700px',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: '<span style="font-weight: 600;">Add Project</span>',
            cancelButtonText: '<span style="font-weight: 600;">Cancel</span>',
            didOpen: () => {
                const workshopSelect = document.getElementById('workshopIdSelect');
                const newWorkshopFields = document.getElementById('newWorkshopFields');
    
                workshopSelect.addEventListener('change', (event) => {
                    if (event.target.value === 'new') {
                        newWorkshopFields.style.display = 'block';
                    } else {
                        newWorkshopFields.style.display = 'none';
                    }
                });
            },
            preConfirm: () => {
                const projectNumber = document.getElementById('projectNumber').value;
                const title = document.getElementById('title').value;
                const projectOwners = document.getElementById('projectOwners').value;
                const projectInfo = document.getElementById('projectInfo').value;
                const projectImage = document.getElementById('projectImage').value;
                const githubLink = document.getElementById('githubLink').value;
                const courseOfStudy = document.getElementById('courseOfStudy').value;
                const studentName = document.getElementById('studentName').value;
                const studentEmail = document.getElementById('studentEmail').value;
                const studentPhone = document.getElementById('studentPhone').value;
                const workshopSelectValue = document.getElementById('workshopIdSelect').value;
                const lecturer = document.getElementById('lecturer').value;
                const year = new Date().getFullYear().toString();
    
                if (!projectNumber || !title || !projectOwners || !studentName || !studentEmail || !studentPhone || !workshopSelectValue) {
                    Swal.showValidationMessage('Please fill out all required fields');
                    return false;
                }
    
                let newWorkshop = {};
                let workshopId, workshopName;
    
                if (workshopSelectValue === 'new') {
                    workshopId = document.getElementById('newWorkshopId').value;
                    workshopName = document.getElementById('newWorkshopName').value;
    
                    if (!workshopId || !workshopName) {
                        Swal.showValidationMessage('Please fill out new workshop details');
                        return false;
                    }
    
                    newWorkshop = { WorkshopId: workshopId, WorkshopName: workshopName };
                } else {
                    [workshopId, workshopName] = workshopSelectValue.split('|');
                }
    
                return {
                    ProjectNumber: projectNumber,
                    Title: title,
                    ProjectOwners: projectOwners,
                    projectInfo: projectInfo,
                    ProjectImage: projectImage,
                    GithubLink: githubLink,
                    StudentName: studentName,
                    StudentEmail: studentEmail,
                    StudentPhone: studentPhone,
                    CourseOfStudy: courseOfStudy,
                    ProjectYear: year,
                    Lecturer: lecturer,
                    WorkshopId: workshopId,
                    WorkshopName: workshopName,
                    ...newWorkshop
                };
            }
        });
    
        if (newProject) {
            try {
                const response = await fetch(`${backendURL}/admin/projects/add`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newProject),
                });
    
                if (response.ok) {
                    Swal.fire('Success', 'Project added successfully!', 'success');
                    fetchProjects();
                } else {
                    Swal.fire('Error', 'Failed to add project', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'An error occurred while adding the project', 'error');
            }
        }
    };

    const handleRemoveProject = async () => {
        try {
            const response = await fetch(`${backendURL}/admin/projects/projectsList`);
            if (!response.ok) throw new Error('Failed to fetch projects');
            const projects = await response.json();

            const projectsListHTML = `
                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Mozilla+Headline:wght@200..700&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
                <div style="height: 100%; overflow-y: auto; padding: 0;">
                    <div class="projects-grid">
                        ${projects.map((project, index) => `
                            <div class="project-card" style="
                                display: flex; 
                                justify-content: space-between; 
                                align-items: center; 
                                padding: 20px; 
                                border: none; 
                                border-radius: 16px; 
                                background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%);
                                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                                backdrop-filter: blur(10px);
                                transition: all 0.3s ease;
                                position: relative;
                                overflow: hidden;
                                animation: slideInUp 0.3s ease forwards;
                                animation-delay: ${index * 0.1}s;
                            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 30px rgba(0, 0, 0, 0.15)'" 
                               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='0 4px 20px rgba(0, 0, 0, 0.08)'">
                                
                                <div style="flex: 1; margin-right: 20px;">
                                    <div style="
                                        font-family: 'Mozilla Headline', sans-serif;
                                        font-optical-sizing: auto;
                                        font-weight: 700;
                                        font-style: normal;
                                        font-variation-settings: 'wdth' 100;
                                        color: #1a202c; 
                                        font-size: 16px; 
                                        margin-bottom: 8px;
                                        line-height: 1.3;
                                    ">${project.Title || 'Untitled Project'}</div>
                                    
                                    <div style="
                                        display: flex; 
                                        gap: 15px; 
                                        align-items: center; 
                                        margin-bottom: 6px;
                                    ">
                                        <span style="
                                            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                                            color: white;
                                            padding: 4px 12px;
                                            border-radius: 20px;
                                            font-size: 11px;
                                            font-weight: 600;
                                            text-transform: uppercase;
                                            letter-spacing: 0.5px;
                                        ">#${project.ProjectNumber}</span>
                                        
                                        <span style="
                                            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
                                            color: white;
                                            padding: 4px 12px;
                                            border-radius: 20px;
                                            font-size: 11px;
                                            font-weight: 600;
                                            text-transform: uppercase;
                                            letter-spacing: 0.5px;
                                        ">Active</span>
                                    </div>
                                    
                                    <div style="
                                        font-size: 13px; 
                                        color: #718096; 
                                        font-weight: 500;
                                        display: flex;
                                        align-items: center;
                                        gap: 6px;
                                    ">
                                        <span style="font-size: 14px;">👥</span>
                                        ${project.ProjectOwners || 'No owners specified'}
                                    </div>
                                </div>
                                
                                <button 
                                    onclick="deleteProject('${project.ProjectNumber}')" 
                                    style="
                                        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
                                        color: white; 
                                        border: none; 
                                        border-radius: 50%; 
                                        width: 45px; 
                                        height: 45px; 
                                        cursor: pointer; 
                                        display: flex; 
                                        align-items: center; 
                                        justify-content: center; 
                                        font-size: 16px;
                                        transition: all 0.3s ease;
                                        box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
                                        position: relative;
                                        overflow: hidden;
                                    "
                                    onmouseover="this.style.transform='scale(1.1)'; this.style.boxShadow='0 6px 20px rgba(255, 107, 107, 0.4)'"
                                    onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px rgba(255, 107, 107, 0.3)'"
                                    title="Delete Project"
                                >
                                    <i class="fas fa-trash-alt" style="color: white; font-size: 14px;"></i>
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <style>
                    @keyframes slideInUp {
                        from { opacity: 0; transform: translateY(20px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    .projects-grid {
                        display: grid;
                        gap: 14px;
                        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    }
                    @media (max-width: 768px) {
                        .projects-grid { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); }
                    }
                    @media (max-width: 480px) {
                        .projects-grid { grid-template-columns: 1fr; gap: 10px; }
                        .project-card { padding: 12px !important; border-radius: 12px !important; }
                        .project-card button { width: 40px !important; height: 40px !important; }
                        .project-card span { font-size: 10px !important; }
                    }
                </style>
            `;

            window.deleteProject = async (projectNumber) => {
                try {
                    const deleteResponse = await fetch(`${backendURL}/admin/projects/remove`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ projectNumber: projectNumber }),
                    });

                    if (deleteResponse.ok) {
                        Swal.fire('Success', 'Project deleted successfully!', 'success');
                        handleRemoveProject();
                    } else {
                        Swal.fire('Error', 'Failed to delete project', 'error');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    Swal.fire('Error', 'An error occurred while deleting the project', 'error');
                }
            };

            await Swal.fire({
                title: '<span style="font-size: 75%; color: #175a94;">Remove Projects</span>',
                html: projectsListHTML,
                customClass: { popup: 'responsive-swal-popup fullscreen-modal' },
                showCancelButton: true,
                confirmButtonText: '<span style="font-size: 75%;">Close</span>',
                cancelButtonText: '<span style="font-size: 75%;">Cancel</span>',
                width: '100%',
                height: '100%',
                showConfirmButton: false,
                showCloseButton: true,
                allowOutsideClick: false,
                backdrop: true,
            });

        } catch (error) {
            console.error('Error fetching projects:', error);
            Swal.fire('Error', 'Failed to load projects list', 'error');
        }
    };

    const handleEditProjectCard = async (project) => {
        try {
            const { value: editedProject } = await Swal.fire({
                title: '<div style="text-align: center; margin-bottom: 20px;"><span style="font-size: 1.5rem; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Edit Project</span></div>',
                html: `
                    <div style="max-width: 600px; margin: 0 auto;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div style="display: flex; flex-direction: column;">
                                <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Project Number</label>
                                <input id="projectNumber" value="${project.ProjectNumber}" readonly style="
                                    width: 100%;
                                    padding: 12px 16px;
                                    border: 2px solid #e2e8f0;
                                    border-radius: 12px;
                                    font-size: 1rem;
                                    background: #f1f5f9;
                                    color: #64748b;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                " />
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Project Title</label>
                                <input id="title" value="${project.Title || ''}" style="
                                    width: 100%;
                                    padding: 12px 16px;
                                    border: 2px solid #e2e8f0;
                                    border-radius: 12px;
                                    font-size: 1rem;
                                    background: #f8fafc;
                                    color: #1a202c;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                " placeholder="Enter Project Title" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div style="display: flex; flex-direction: column;">
                                <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Project Owners</label>
                                <input id="projectOwners" value="${project.ProjectOwners || ''}" style="
                                    width: 100%;
                                    padding: 12px 16px;
                                    border: 2px solid #e2e8f0;
                                    border-radius: 12px;
                                    font-size: 1rem;
                                    background: #f8fafc;
                                    color: #1a202c;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                " placeholder="Enter Project Owners" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Student Name</label>
                                <input id="studentName" value="${project.StudentName || ''}" style="
                                    width: 100%;
                                    padding: 12px 16px;
                                    border: 2px solid #e2e8f0;
                                    border-radius: 12px;
                                    font-size: 1rem;
                                    background: #f8fafc;
                                    color: #1a202c;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                " placeholder="Enter Student Name" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div style="display: flex; flex-direction: column;">
                                <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Student Email</label>
                                <input id="studentEmail" type="email" value="${project.StudentEmail || ''}" style="
                                    width: 100%;
                                    padding: 12px 16px;
                                    border: 2px solid #e2e8f0;
                                    border-radius: 12px;
                                    font-size: 1rem;
                                    background: #f8fafc;
                                    color: #1a202c;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                " placeholder="Enter Student Email" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Student Phone</label>
                                <input id="studentPhone" value="${project.StudentPhone || ''}" style="
                                    width: 100%;
                                    padding: 12px 16px;
                                    border: 2px solid #e2e8f0;
                                    border-radius: 12px;
                                    font-size: 1rem;
                                    background: #f8fafc;
                                    color: #1a202c;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                " placeholder="Enter Student Phone" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div style="display: flex; flex-direction: column;">
                                <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Course Of Study</label>
                                <input id="courseOfStudy" value="${project.CourseOfStudy || ''}" style="
                                    width: 100%;
                                    padding: 12px 16px;
                                    border: 2px solid #e2e8f0;
                                    border-radius: 12px;
                                    font-size: 1rem;
                                    background: #f8fafc;
                                    color: #1a202c;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                " placeholder="Enter Course Of Study" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Lecturer</label>
                                <input id="lecturer" value="${project.Lecturer || ''}" style="
                                    width: 100%;
                                    padding: 12px 16px;
                                    border: 2px solid #e2e8f0;
                                    border-radius: 12px;
                                    font-size: 1rem;
                                    background: #f8fafc;
                                    color: #1a202c;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                " placeholder="Enter Lecturer" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                            </div>
                        </div>
                        
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                            <div style="display: flex; flex-direction: column;">
                                <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Project Information</label>
                                <input id="projectInfo" value="${project.ProjectInfo || ''}" style="
                                    width: 100%;
                                    padding: 12px 16px;
                                    border: 2px solid #e2e8f0;
                                    border-radius: 12px;
                                    font-size: 1rem;
                                    background: #f8fafc;
                                    color: #1a202c;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                " placeholder="Enter Project Information" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                            </div>
                            <div style="display: flex; flex-direction: column;">
                                <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Github Link</label>
                                <input id="githubLink" value="${project.GithubLink || ''}" style="
                                    width: 100%;
                                    padding: 12px 16px;
                                    border: 2px solid #e2e8f0;
                                    border-radius: 12px;
                                    font-size: 1rem;
                                    background: #f8fafc;
                                    color: #1a202c;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                " placeholder="Enter Github Link" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                            </div>
                        </div>
                        
                        <div style="display: flex; flex-direction: column; margin-bottom: 20px;">
                            <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Project Image</label>
                            <input id="projectImage" value="${project.ProjectImage || ''}" style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 2px solid #e2e8f0;
                                border-radius: 12px;
                                font-size: 1rem;
                                background: #f8fafc;
                                color: #1a202c;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                            " placeholder="Enter Project Image URL" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                        </div>
                        
                        <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 12px; padding: 16px; border-left: 4px solid #667eea;">
                            <div style="display: flex; align-items: center; gap: 12px;">
                                <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                    <span style="color: white; font-size: 12px; font-weight: bold;">ℹ️</span>
                                </div>
                                <div>
                                    <div style="font-weight: 600; color: #2d3748; font-size: 0.9rem; margin-bottom: 4px;">Edit Project Information</div>
                                    <div style="color: #4a5568; font-size: 0.85rem; line-height: 1.4;">Update project details. Project Number cannot be changed.</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `,
                customClass: { 
                    popup: 'modern-swal-popup',
                    confirmButton: 'modern-confirm-button',
                    cancelButton: 'modern-cancel-button'
                },
                width: '700px',
                focusConfirm: false,
                showCancelButton: true,
                confirmButtonText: '<span style="font-weight: 600;">Update Project</span>',
                cancelButtonText: '<span style="font-weight: 600;">Cancel</span>',
                preConfirm: () => {
                    const title = document.getElementById('title').value;
                    const projectOwners = document.getElementById('projectOwners').value;
                    const studentName = document.getElementById('studentName').value;
                    const studentEmail = document.getElementById('studentEmail').value;
                    const studentPhone = document.getElementById('studentPhone').value;

                    if (!title || !projectOwners || !studentName || !studentEmail || !studentPhone) {
                        Swal.showValidationMessage('Please fill out all required fields');
                        return false;
                    }

                    return {
                        ProjectNumber: project.ProjectNumber,
                        Title: title,
                        ProjectOwners: projectOwners,
                        ProjectInfo: document.getElementById('projectInfo').value,
                        ProjectImage: document.getElementById('projectImage').value,
                        GithubLink: document.getElementById('githubLink').value,
                        CourseOfStudy: document.getElementById('courseOfStudy').value,
                        StudentName: studentName,
                        StudentEmail: studentEmail,
                        StudentPhone: studentPhone,
                        Lecturer: document.getElementById('lecturer').value
                    };
                }
            });

            if (editedProject) {
                try {
                    const query = `?projectNumber=${encodeURIComponent(project.ProjectNumber)}`;
                    const response = await fetch(`${backendURL}/admin/projects/update${query}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(editedProject),
                    });

                    if (response.ok) {
                        Swal.fire('Success', 'Project updated successfully!', 'success');
                        fetchProjects();
                    } else {
                        Swal.fire('Error', 'Failed to update project', 'error');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    Swal.fire('Error', 'An error occurred while updating the project', 'error');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire('Error', 'An error occurred while editing the project', 'error');
        }
    };

    const handleDeleteProjectCard = async (projectNumber) => {
        const result = await Swal.fire({
            title: 'Delete Project',
            text: `Are you sure you want to delete project #${projectNumber}? This action cannot be undone.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel',
            customClass: { 
                popup: 'modern-swal-popup',
                confirmButton: 'modern-confirm-button',
                cancelButton: 'modern-cancel-button'
            }
        });

        if (result.isConfirmed) {
            try {
                const response = await fetch(`${backendURL}/admin/projects/remove`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ projectNumber: projectNumber }),
                });

                if (response.ok) {
                    Swal.fire('Deleted!', 'Project has been deleted successfully.', 'success');
                    fetchProjects();
                } else {
                    Swal.fire('Error', 'Failed to delete project', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'An error occurred while deleting the project', 'error');
            }
        }
    };

    // Judge Management Functions
    const openJudgesListModal = () => {
        Swal.fire({
            title: '<span style="font-size: 75%; color: var(--text-primary);">Registered Judges</span>',
            html: '<div id="judgesListContainer" style="font-size: 75%; color: var(--text-primary);"></div>',
            showCancelButton: true,
            confirmButtonText: '<span style="font-size: 75%; color: var(--text-primary);">Remove Selected Judges</span>',
            cancelButtonText: '<span style="font-size: 75%; color: var(--text-primary);">Close</span>',
            preConfirm: () => {
                const selectedJudges = JSON.parse(localStorage.getItem('selectedJudges')) || [];
                removeSelectedJudges(selectedJudges);
            },
            didOpen: () => {
                renderJudgesList();
            },
        });
    };

    const renderJudgesList = () => {
        const judgesListContainer = document.getElementById('judgesListContainer');
        if (judgesListContainer) {
            const root = ReactDOM.createRoot(judgesListContainer);
            root.render(<JudgesList />);
        }
    };

    const JudgesList = () => {
        const [filterText, setFilterText] = React.useState('');
        const [selectedJudges, setSelectedJudges] = React.useState([]);
        const [sortField, setSortField] = React.useState('name');
        const [sortDirection, setSortDirection] = React.useState('asc');
      
        React.useEffect(() => {
            localStorage.setItem('selectedJudges', JSON.stringify(selectedJudges));
        }, [selectedJudges]);
      
        const toggleSelection = (id) => {
            setSelectedJudges((prevSelectedJudges) =>
                prevSelectedJudges.includes(id)
                    ? prevSelectedJudges.filter((judgeId) => judgeId !== id)
                    : [...prevSelectedJudges, id]
            );
        };

        const handleSort = (field) => {
            if (sortField === field) {
                setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
            } else {
                setSortField(field);
                setSortDirection('asc');
            }
        };

        const renderSortButton = (field, label) => (
            <button
                onClick={() => handleSort(field)}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    fontWeight: 'bold',
                    padding: '2px 5px',
                    margin: '0 5px'
                }}
            >
                {label} {sortField === field ? (sortDirection === 'asc' ? '▲' : '▼') : '↕'}
            </button>
        );

        const sortedJudges = [...judges]
            .filter(
                (judge) =>
                    judge.name.toLowerCase().includes(filterText.toLowerCase()) ||
                    judge.ID.toString().includes(filterText)
            )
            .sort((a, b) => {
                let aValue, bValue;
                
                if (sortField === 'name') {
                    aValue = a.name.toLowerCase();
                    bValue = b.name.toLowerCase();
                } else if (sortField === 'id') {
                    aValue = parseInt(a.ID);
                    bValue = parseInt(b.ID);
                }
                
                if (sortDirection === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
      
        return (
            <div>
                <input
                    type="text"
                    id="filterInput"
                    placeholder="Filter by name or ID"
                    onChange={(e) => setFilterText(e.target.value)}
                    style={{ 
                        marginBottom: '10px', 
                        width: '100%', 
                        padding: '5px',
                        backgroundColor: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        color: 'var(--text-primary)'
                    }}
                />
                <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
                    {renderSortButton('name', 'Name')}
                    {renderSortButton('id', 'ID')}
                </div>
                <ul id="judgesList" style={{ listStyleType: 'none', padding: 0 }}>
                    {sortedJudges.map((judge, index) => (
                        <li key={judge.ID} style={{ marginBottom: '10px' }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                justifyContent: 'flex-start',
                                border: '1px solid var(--border-color)',
                                padding: '10px',
                                backgroundColor: 'var(--card-bg)',
                                color: 'var(--text-primary)'
                            }}>
                                <input
                                    type="checkbox"
                                    id={`judge-${index}`}
                                    style={{ marginLeft: '20px', marginRight: '10px' }}
                                    checked={selectedJudges.includes(judge.ID.toString())}
                                    onChange={() => toggleSelection(judge.ID.toString())}
                                />
                                <label
                                    htmlFor={`judge-${index}`}
                                    style={{
                                        flex: 1,
                                        whiteSpace: 'nowrap',
                                        textOverflow: 'ellipsis',
                                        marginRight: '200px',
                                        color: 'var(--text-primary)'
                                    }}
                                >
                                    {judge.name} (ID: {judge.ID})
                                </label>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    const removeSelectedJudges = (selectedJudges) => {
        const userIds = selectedJudges;
        fetch(`${backendURL}/admin/judges/remove-users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ users: userIds }),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                fetchJudges();
            })
            .catch(error => console.error('Error:', error));
    };



         const addNewPotentialJudge = (newId, callback) => {
         fetch(`${backendURL}/admin/judges/add-potential-judge`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({ ID: newId }),
         })
             .then(response => response.json())
             .then(data => {
                 console.log('Success:', data);
                 if (data.error) {
                     // Handle backend validation errors
                     Swal.fire({
                         title: 'Error',
                         text: data.error,
                         icon: 'error',
                         confirmButtonColor: '#d33',
                         confirmButtonText: 'OK',
                         customClass: { 
                             popup: 'modern-swal-popup',
                             confirmButton: 'modern-confirm-button'
                         }
                     });
                 } else {
                     if (callback) callback();
                 }
             })
             .catch(error => {
                 console.error('Error:', error);
                 Swal.fire({
                     title: 'Network Error',
                     text: 'Failed to add potential judge. Please try again.',
                     icon: 'error',
                     confirmButtonColor: '#d33',
                     confirmButtonText: 'OK',
                     customClass: { 
                         popup: 'modern-swal-popup',
                         confirmButton: 'modern-confirm-button'
                     }
                 });
             });
     };

     const addNewPotentialJudgeFromPage = () => {
         const newIdInput = document.getElementById('newIdInput');
         const newId = newIdInput.value.trim();
         if (newId) {
             // Check if ID already exists in potential judges
             const existingPotentialJudge = potentialJudges.find(judge => judge.ID === newId);
             if (existingPotentialJudge) {
                 Swal.fire({
                     title: 'Duplicate ID',
                     text: `Potential judge with ID "${newId}" already exists!`,
                     icon: 'warning',
                     confirmButtonColor: '#3085d6',
                     confirmButtonText: 'OK',
                     customClass: { 
                         popup: 'modern-swal-popup',
                         confirmButton: 'modern-confirm-button'
                     }
                 });
                 return;
             }

             // Check if ID already exists in regular judges
             const existingJudge = judges.find(judge => judge.ID === newId);
             if (existingJudge) {
                 Swal.fire({
                     title: 'Judge Already Exists',
                     text: `A judge with ID "${newId}" already exists in the system!`,
                     icon: 'warning',
                     confirmButtonColor: '#3085d6',
                     confirmButtonText: 'OK',
                     customClass: { 
                         popup: 'modern-swal-popup',
                         confirmButton: 'modern-confirm-button'
                     }
                 });
                 return;
             }

             addNewPotentialJudge(newId, () => {
                 newIdInput.value = '';
                 fetchPotentialJudges();
                 Swal.fire({
                     title: 'Success!',
                     text: `Potential judge with ID "${newId}" has been added successfully!`,
                     icon: 'success',
                     confirmButtonColor: '#28a745',
                     confirmButtonText: 'Great!',
                     customClass: { 
                         popup: 'modern-swal-popup',
                         confirmButton: 'modern-confirm-button'
                     }
                 });
             });
         } else {
             Swal.fire({
                 title: 'Invalid Input',
                 text: 'Please enter a valid judge ID!',
                 icon: 'error',
                 confirmButtonColor: '#d33',
                 confirmButtonText: 'OK',
                 customClass: { 
                     popup: 'modern-swal-popup',
                     confirmButton: 'modern-confirm-button'
                 }
             });
         }
     };

     const handleRemovePotentialJudge = async (judgeId) => {
         const result = await Swal.fire({
             title: 'Remove Potential Judge',
             text: `Are you sure you want to remove potential judge #${judgeId}?`,
             icon: 'warning',
             showCancelButton: true,
             confirmButtonColor: '#d33',
             cancelButtonColor: '#3085d6',
             confirmButtonText: 'Yes, remove it!',
             cancelButtonText: 'Cancel',
             customClass: { 
                 popup: 'modern-swal-popup',
                 confirmButton: 'modern-confirm-button',
                 cancelButton: 'modern-cancel-button'
             }
         });

         if (result.isConfirmed) {
             try {
                 const response = await fetch(`${backendURL}/admin/judges/remove-ids`, {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ ids: [judgeId.toString()] }),
                 });

                 if (response.ok) {
                     Swal.fire('Removed!', 'Potential judge has been removed successfully.', 'success');
                     fetchPotentialJudges();
                 } else {
                     Swal.fire('Error', 'Failed to remove potential judge', 'error');
                 }
             } catch (error) {
                 console.error('Error:', error);
                 Swal.fire('Error', 'An error occurred while removing the potential judge', 'error');
             }
         }
     };

    const handleAddNewJudge = async () => {
        const { value: newJudge } = await Swal.fire({
            title: '<div style="text-align: center; margin-bottom: 20px;"><span style="font-size: 1.5rem; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Add New Judge</span></div>',
            html: `
                <div style="max-width: 600px; margin: 0 auto;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div style="display: flex; flex-direction: column;">
                            <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Judge ID</label>
                            <input id="judgeId" style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 2px solid #e2e8f0;
                                border-radius: 12px;
                                font-size: 1rem;
                                background: #f8fafc;
                                color: #1a202c;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                            " placeholder="Enter Judge ID" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Judge Name</label>
                            <input id="judgeName" style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 2px solid #e2e8f0;
                                border-radius: 12px;
                                font-size: 1rem;
                                background: #f8fafc;
                                color: #1a202c;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                            " placeholder="Enter Judge Name" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                        </div>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                        <div style="display: flex; flex-direction: column;">
                            <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Email Address</label>
                            <input id="judgeEmail" type="email" style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 2px solid #e2e8f0;
                                border-radius: 12px;
                                font-size: 1rem;
                                background: #f8fafc;
                                color: #1a202c;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                            " placeholder="Enter Email Address" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                        </div>
                        <div style="display: flex; flex-direction: column;">
                            <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Password</label>
                            <input id="judgePassword" type="password" style="
                                width: 100%;
                                padding: 12px 16px;
                                border: 2px solid #e2e8f0;
                                border-radius: 12px;
                                font-size: 1rem;
                                background: #f8fafc;
                                color: #1a202c;
                                transition: all 0.3s ease;
                                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                            " placeholder="Enter Password" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                        </div>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; margin-bottom: 20px;">
                        <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Select Avatar</label>
                        <select id="judgeAvatar" style="
                            width: 100%;
                            padding: 12px 16px;
                            border: 2px solid #e2e8f0;
                            border-radius: 12px;
                            font-size: 1rem;
                            background: #f8fafc;
                            color: #1a202c;
                            transition: all 0.3s ease;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                            cursor: pointer;
                        " onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'">
                            <option value="" disabled selected style="color: #a0aec0;">Choose an avatar...</option>
                            <option value="default">👤 Default</option>
                            <option value="mario">🍄 Mario</option>
                            <option value="ohad-avidar">👨‍💼 Ohad Avidar</option>
                            <option value="trump">👔 Trump</option>
                            <option value="harry-potter">⚡ Harry Potter</option>
                            <option value="the-rock">💪 The Rock</option>
                            <option value="jimmy-hendrix">🎸 Jimmy Hendrix</option>
                            <option value="cristiano-ronaldo">⚽ Cristiano Ronaldo</option>
                            <option value="spongebob">🧽 Spongebob</option>
                            <option value="pikachu">⚡ Pikachu</option>
                            <option value="spiderman">🕷️ Spiderman</option>
                            <option value="batman">🦇 Batman</option>
                            <option value="voldemort">🐍 Voldemort</option>
                            <option value="aladdin">🧞 Aladdin</option>
                            <option value="mufasa">🦁 Mufasa</option>
                            <option value="smurf">🔵 Smurf</option>
                        </select>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 12px; padding: 16px; border-left: 4px solid #667eea;">
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                <span style="color: white; font-size: 12px; font-weight: bold;">ℹ️</span>
                            </div>
                            <div>
                                <div style="font-weight: 600; color: #2d3748; font-size: 0.9rem; margin-bottom: 4px;">Important Note</div>
                                <div style="color: #4a5568; font-size: 0.85rem; line-height: 1.4;">All fields are required. The judge will be able to log in immediately after creation using their ID and password.</div>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            customClass: { 
                popup: 'modern-swal-popup',
                confirmButton: 'modern-confirm-button',
                cancelButton: 'modern-cancel-button'
            },
            width: '700px',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: '<span style="font-weight: 600;">Add Judge</span>',
            cancelButtonText: '<span style="font-weight: 600;">Cancel</span>',
            preConfirm: () => {
                const judgeId = document.getElementById('judgeId').value;
                const judgeName = document.getElementById('judgeName').value;
                const judgeEmail = document.getElementById('judgeEmail').value;
                const judgePassword = document.getElementById('judgePassword').value;
                const judgeAvatar = document.getElementById('judgeAvatar').value;

                if (!judgeId || !judgeName || !judgeEmail || !judgePassword || !judgeAvatar) {
                    Swal.showValidationMessage('Please fill out all required fields');
                    return false;
                }

                return {
                    ID: judgeId,
                    name: judgeName,
                    email: judgeEmail,
                    password: judgePassword,
                    avatar: judgeAvatar
                };
            }
        });

        if (newJudge) {
            try {
                const response = await fetch(`${backendURL}/admin/judges/add-judge`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newJudge),
                });

                if (response.ok) {
                    Swal.fire('Success', 'Judge added successfully!', 'success');
                    fetchJudges();
                } else {
                    const errorData = await response.json();
                    Swal.fire('Error', errorData.message || 'Failed to add judge', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'An error occurred while adding the judge', 'error');
            }
        }
    };

         const handleEditJudgeById = async (judgeId) => {
         try {
             // Fetch judge data
             const response = await fetch(`${backendURL}/admin/judges/get-judge/${judgeId}`);
             if (!response.ok) {
                 Swal.fire('Error', 'Judge not found', 'error');
                 return;
             }

             const judge = await response.json();

             // Show edit form with current data
             const { value: editedJudge } = await Swal.fire({
                 title: '<div style="text-align: center; margin-bottom: 20px;"><span style="font-size: 1.5rem; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Edit Judge</span></div>',
                 html: `
                     <div style="max-width: 600px; margin: 0 auto;">
                         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                             <div style="display: flex; flex-direction: column;">
                                 <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Judge ID</label>
                                 <input id="judgeId" value="${judge.ID}" readonly style="
                                     width: 100%;
                                     padding: 12px 16px;
                                     border: 2px solid #e2e8f0;
                                     border-radius: 12px;
                                     font-size: 1rem;
                                     background: #f1f5f9;
                                     color: #64748b;
                                     transition: all 0.3s ease;
                                     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                 " />
                             </div>
                             <div style="display: flex; flex-direction: column;">
                                 <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Judge Name</label>
                                 <input id="judgeName" value="${judge.name}" style="
                                     width: 100%;
                                     padding: 12px 16px;
                                     border: 2px solid #e2e8f0;
                                     border-radius: 12px;
                                     font-size: 1rem;
                                     background: #f8fafc;
                                     color: #1a202c;
                                     transition: all 0.3s ease;
                                     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                 " placeholder="Enter Judge Name" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                             </div>
                         </div>
                         
                         <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                             <div style="display: flex; flex-direction: column;">
                                 <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Email Address</label>
                                 <input id="judgeEmail" type="email" value="${judge.email}" style="
                                     width: 100%;
                                     padding: 12px 16px;
                                     border: 2px solid #e2e8f0;
                                     border-radius: 12px;
                                     font-size: 1rem;
                                     background: #f8fafc;
                                     color: #1a202c;
                                     transition: all 0.3s ease;
                                     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                 " placeholder="Enter Email Address" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                             </div>
                             <div style="display: flex; flex-direction: column;">
                                 <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Password (leave blank to keep current)</label>
                                 <input id="judgePassword" type="password" style="
                                     width: 100%;
                                     padding: 12px 16px;
                                     border: 2px solid #e2e8f0;
                                     border-radius: 12px;
                                     font-size: 1rem;
                                     background: #f8fafc;
                                     color: #1a202c;
                                     transition: all 0.3s ease;
                                     box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                 " placeholder="Enter new password (optional)" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                             </div>
                         </div>
                         
                         <div style="display: flex; flex-direction: column; margin-bottom: 20px;">
                             <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Select Avatar</label>
                             <select id="judgeAvatar" style="
                                 width: 100%;
                                 padding: 12px 16px;
                                 border: 2px solid #e2e8f0;
                                 border-radius: 12px;
                                 font-size: 1rem;
                                 background: #f8fafc;
                                 color: #1a202c;
                                 transition: all 0.3s ease;
                                 box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                 cursor: pointer;
                             " onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'">
                                 <option value="default" ${judge.avatar === 'default' ? 'selected' : ''}>👤 Default</option>
                                 <option value="mario" ${judge.avatar === 'mario' ? 'selected' : ''}>🍄 Mario</option>
                                 <option value="ohad-avidar" ${judge.avatar === 'ohad-avidar' ? 'selected' : ''}>👨‍💼 Ohad Avidar</option>
                                 <option value="trump" ${judge.avatar === 'trump' ? 'selected' : ''}>👔 Trump</option>
                                 <option value="harry-potter" ${judge.avatar === 'harry-potter' ? 'selected' : ''}>⚡ Harry Potter</option>
                                 <option value="the-rock" ${judge.avatar === 'the-rock' ? 'selected' : ''}>💪 The Rock</option>
                                 <option value="jimmy-hendrix" ${judge.avatar === 'jimmy-hendrix' ? 'selected' : ''}>🎸 Jimmy Hendrix</option>
                                 <option value="cristiano-ronaldo" ${judge.avatar === 'cristiano-ronaldo' ? 'selected' : ''}>⚽ Cristiano Ronaldo</option>
                                 <option value="spongebob" ${judge.avatar === 'spongebob' ? 'selected' : ''}>🧽 Spongebob</option>
                                 <option value="pikachu" ${judge.avatar === 'pikachu' ? 'selected' : ''}>⚡ Pikachu</option>
                                 <option value="spiderman" ${judge.avatar === 'spiderman' ? 'selected' : ''}>🕷️ Spiderman</option>
                                 <option value="batman" ${judge.avatar === 'batman' ? 'selected' : ''}>🦇 Batman</option>
                                 <option value="voldemort" ${judge.avatar === 'voldemort' ? 'selected' : ''}>🐍 Voldemort</option>
                                 <option value="aladdin" ${judge.avatar === 'aladdin' ? 'selected' : ''}>🧞 Aladdin</option>
                                 <option value="mufasa" ${judge.avatar === 'mufasa' ? 'selected' : ''}>🦁 Mufasa</option>
                                 <option value="smurf" ${judge.avatar === 'smurf' ? 'selected' : ''}>🔵 Smurf</option>
                             </select>
                         </div>
                         
                         <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 12px; padding: 16px; border-left: 4px solid #667eea;">
                             <div style="display: flex; align-items: center; gap: 12px;">
                                 <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                     <span style="color: white; font-size: 12px; font-weight: bold;">ℹ️</span>
                                 </div>
                                 <div>
                                     <div style="font-weight: 600; color: #2d3748; font-size: 0.9rem; margin-bottom: 4px;">Edit Information</div>
                                     <div style="color: #4a5568; font-size: 0.85rem; line-height: 1.4;">Update judge information. Leave password blank to keep the current password. Judge ID cannot be changed.</div>
                                 </div>
                             </div>
                         </div>
                     </div>
                 `,
                 customClass: { 
                     popup: 'modern-swal-popup',
                     confirmButton: 'modern-confirm-button',
                     cancelButton: 'modern-cancel-button'
                 },
                 width: '700px',
                 focusConfirm: false,
                 showCancelButton: true,
                 confirmButtonText: '<span style="font-weight: 600;">Update Judge</span>',
                 cancelButtonText: '<span style="font-weight: 600;">Cancel</span>',
                 preConfirm: () => {
                     const judgeName = document.getElementById('judgeName').value;
                     const judgeEmail = document.getElementById('judgeEmail').value;
                     const judgePassword = document.getElementById('judgePassword').value;
                     const judgeAvatar = document.getElementById('judgeAvatar').value;

                     if (!judgeName || !judgeEmail || !judgeAvatar) {
                         Swal.showValidationMessage('Please fill out all required fields');
                         return false;
                     }

                     return {
                         ID: judge.ID,
                         name: judgeName,
                         email: judgeEmail,
                         password: judgePassword || undefined, // Only include if provided
                         avatar: judgeAvatar
                     };
                 }
             });

             if (editedJudge) {
                 try {
                     const updateResponse = await fetch(`${backendURL}/admin/judges/update-judge`, {
                         method: 'PUT',
                         headers: { 'Content-Type': 'application/json' },
                         body: JSON.stringify(editedJudge),
                     });

                     if (updateResponse.ok) {
                         Swal.fire('Success', 'Judge updated successfully!', 'success');
                         fetchJudges();
                     } else {
                         const errorData = await updateResponse.json();
                         Swal.fire('Error', errorData.message || 'Failed to update judge', 'error');
                     }
                 } catch (error) {
                     console.error('Error:', error);
                     Swal.fire('Error', 'An error occurred while updating the judge', 'error');
                 }
             }
         } catch (error) {
             console.error('Error:', error);
             Swal.fire('Error', 'An error occurred while fetching judge data', 'error');
         }
     };

     const handleDeleteJudge = async (judgeId) => {
         const result = await Swal.fire({
             title: 'Delete Judge',
             text: `Are you sure you want to delete judge #${judgeId}? This action cannot be undone.`,
             icon: 'warning',
             showCancelButton: true,
             confirmButtonColor: '#d33',
             cancelButtonColor: '#3085d6',
             confirmButtonText: 'Yes, delete it!',
             cancelButtonText: 'Cancel',
             customClass: { 
                 popup: 'modern-swal-popup',
                 confirmButton: 'modern-confirm-button',
                 cancelButton: 'modern-cancel-button'
             }
         });

         if (result.isConfirmed) {
             try {
                 const response = await fetch(`${backendURL}/admin/judges/remove-users`, {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({ users: [judgeId.toString()] }),
                 });

                 if (response.ok) {
                     Swal.fire('Deleted!', 'Judge has been deleted successfully.', 'success');
                     fetchJudges();
                 } else {
                     Swal.fire('Error', 'Failed to delete judge', 'error');
                 }
             } catch (error) {
                 console.error('Error:', error);
                 Swal.fire('Error', 'An error occurred while deleting the judge', 'error');
             }
         }
     };

     const handleEditJudge = async () => {
         // First, get the judge ID
         const { value: judgeId } = await Swal.fire({
            title: '<div style="text-align: center; margin-bottom: 20px;"><span style="font-size: 1.5rem; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Edit Judge</span></div>',
            html: `
                <div style="max-width: 400px; margin: 0 auto;">
                    <div style="display: flex; flex-direction: column;">
                        <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Judge ID</label>
                        <input id="judgeIdInput" style="
                            width: 100%;
                            padding: 12px 16px;
                            border: 2px solid #e2e8f0;
                            border-radius: 12px;
                            font-size: 1rem;
                            background: #f8fafc;
                            color: #1a202c;
                            transition: all 0.3s ease;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                        " placeholder="Enter Judge ID to edit" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                    </div>
                </div>
            `,
            customClass: { 
                popup: 'modern-swal-popup',
                confirmButton: 'modern-confirm-button',
                cancelButton: 'modern-cancel-button'
            },
            width: '500px',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: '<span style="font-weight: 600;">Next</span>',
            cancelButtonText: '<span style="font-weight: 600;">Cancel</span>',
            preConfirm: () => {
                const judgeId = document.getElementById('judgeIdInput').value;
                if (!judgeId) {
                    Swal.showValidationMessage('Please enter a Judge ID');
                    return false;
                }
                return judgeId;
            }
        });

        if (judgeId) {
            try {
                // Fetch judge data
                const response = await fetch(`${backendURL}/admin/judges/get-judge/${judgeId}`);
                if (!response.ok) {
                    Swal.fire('Error', 'Judge not found', 'error');
                    return;
                }

                const judge = await response.json();

                // Show edit form with current data
                const { value: editedJudge } = await Swal.fire({
                    title: '<div style="text-align: center; margin-bottom: 20px;"><span style="font-size: 1.5rem; font-weight: 700; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Edit Judge</span></div>',
                    html: `
                        <div style="max-width: 600px; margin: 0 auto;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                                <div style="display: flex; flex-direction: column;">
                                    <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Judge ID</label>
                                    <input id="judgeId" value="${judge.ID}" readonly style="
                                        width: 100%;
                                        padding: 12px 16px;
                                        border: 2px solid #e2e8f0;
                                        border-radius: 12px;
                                        font-size: 1rem;
                                        background: #f1f5f9;
                                        color: #64748b;
                                        transition: all 0.3s ease;
                                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                    " />
                                </div>
                                <div style="display: flex; flex-direction: column;">
                                    <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Judge Name</label>
                                    <input id="judgeName" value="${judge.name}" style="
                                        width: 100%;
                                        padding: 12px 16px;
                                        border: 2px solid #e2e8f0;
                                        border-radius: 12px;
                                        font-size: 1rem;
                                        background: #f8fafc;
                                        color: #1a202c;
                                        transition: all 0.3s ease;
                                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                    " placeholder="Enter Judge Name" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                                </div>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                                <div style="display: flex; flex-direction: column;">
                                    <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Email Address</label>
                                    <input id="judgeEmail" type="email" value="${judge.email}" style="
                                        width: 100%;
                                        padding: 12px 16px;
                                        border: 2px solid #e2e8f0;
                                        border-radius: 12px;
                                        font-size: 1rem;
                                        background: #f8fafc;
                                        color: #1a202c;
                                        transition: all 0.3s ease;
                                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                    " placeholder="Enter Email Address" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                                </div>
                                <div style="display: flex; flex-direction: column;">
                                    <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Password (leave blank to keep current)</label>
                                    <input id="judgePassword" type="password" style="
                                        width: 100%;
                                        padding: 12px 16px;
                                        border: 2px solid #e2e8f0;
                                        border-radius: 12px;
                                        font-size: 1rem;
                                        background: #f8fafc;
                                        color: #1a202c;
                                        transition: all 0.3s ease;
                                        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                    " placeholder="Enter new password (optional)" onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'" />
                                </div>
                            </div>
                            
                            <div style="display: flex; flex-direction: column; margin-bottom: 20px;">
                                <label style="font-weight: 600; color: #4a5568; margin-bottom: 8px; font-size: 0.9rem;">Select Avatar</label>
                                <select id="judgeAvatar" style="
                                    width: 100%;
                                    padding: 12px 16px;
                                    border: 2px solid #e2e8f0;
                                    border-radius: 12px;
                                    font-size: 1rem;
                                    background: #f8fafc;
                                    color: #1a202c;
                                    transition: all 0.3s ease;
                                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
                                    cursor: pointer;
                                " onfocus="this.style.borderColor='#667eea'; this.style.boxShadow='0 0 0 3px rgba(102, 126, 234, 0.1)'" onblur="this.style.borderColor='#e2e8f0'; this.style.boxShadow='0 2px 4px rgba(0, 0, 0, 0.05)'">
                                    <option value="default" ${judge.avatar === 'default' ? 'selected' : ''}>👤 Default</option>
                                    <option value="mario" ${judge.avatar === 'mario' ? 'selected' : ''}>🍄 Mario</option>
                                    <option value="ohad-avidar" ${judge.avatar === 'ohad-avidar' ? 'selected' : ''}>👨‍💼 Ohad Avidar</option>
                                    <option value="trump" ${judge.avatar === 'trump' ? 'selected' : ''}>👔 Trump</option>
                                    <option value="harry-potter" ${judge.avatar === 'harry-potter' ? 'selected' : ''}>⚡ Harry Potter</option>
                                    <option value="the-rock" ${judge.avatar === 'the-rock' ? 'selected' : ''}>💪 The Rock</option>
                                    <option value="jimmy-hendrix" ${judge.avatar === 'jimmy-hendrix' ? 'selected' : ''}>🎸 Jimmy Hendrix</option>
                                    <option value="cristiano-ronaldo" ${judge.avatar === 'cristiano-ronaldo' ? 'selected' : ''}>⚽ Cristiano Ronaldo</option>
                                    <option value="spongebob" ${judge.avatar === 'spongebob' ? 'selected' : ''}>🧽 Spongebob</option>
                                    <option value="pikachu" ${judge.avatar === 'pikachu' ? 'selected' : ''}>⚡ Pikachu</option>
                                    <option value="spiderman" ${judge.avatar === 'spiderman' ? 'selected' : ''}>🕷️ Spiderman</option>
                                    <option value="batman" ${judge.avatar === 'batman' ? 'selected' : ''}>🦇 Batman</option>
                                    <option value="voldemort" ${judge.avatar === 'voldemort' ? 'selected' : ''}>🐍 Voldemort</option>
                                    <option value="aladdin" ${judge.avatar === 'aladdin' ? 'selected' : ''}>🧞 Aladdin</option>
                                    <option value="mufasa" ${judge.avatar === 'mufasa' ? 'selected' : ''}>🦁 Mufasa</option>
                                    <option value="smurf" ${judge.avatar === 'smurf' ? 'selected' : ''}>🔵 Smurf</option>
                                </select>
                            </div>
                            
                            <div style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 12px; padding: 16px; border-left: 4px solid #667eea;">
                                <div style="display: flex; align-items: center; gap: 12px;">
                                    <div style="width: 24px; height: 24px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                        <span style="color: white; font-size: 12px; font-weight: bold;">ℹ️</span>
                                    </div>
                                    <div>
                                        <div style="font-weight: 600; color: #2d3748; font-size: 0.9rem; margin-bottom: 4px;">Edit Information</div>
                                        <div style="color: #4a5568; font-size: 0.85rem; line-height: 1.4;">Update judge information. Leave password blank to keep the current password. Judge ID cannot be changed.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `,
                    customClass: { 
                        popup: 'modern-swal-popup',
                        confirmButton: 'modern-confirm-button',
                        cancelButton: 'modern-cancel-button'
                    },
                    width: '700px',
                    focusConfirm: false,
                    showCancelButton: true,
                    confirmButtonText: '<span style="font-weight: 600;">Update Judge</span>',
                    cancelButtonText: '<span style="font-weight: 600;">Cancel</span>',
                    preConfirm: () => {
                        const judgeName = document.getElementById('judgeName').value;
                        const judgeEmail = document.getElementById('judgeEmail').value;
                        const judgePassword = document.getElementById('judgePassword').value;
                        const judgeAvatar = document.getElementById('judgeAvatar').value;

                        if (!judgeName || !judgeEmail || !judgeAvatar) {
                            Swal.showValidationMessage('Please fill out all required fields');
                            return false;
                        }

                        return {
                            ID: judge.ID,
                            name: judgeName,
                            email: judgeEmail,
                            password: judgePassword || undefined, // Only include if provided
                            avatar: judgeAvatar
                        };
                    }
                });

                if (editedJudge) {
                    try {
                        const updateResponse = await fetch(`${backendURL}/admin/judges/update-judge`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(editedJudge),
                        });

                        if (updateResponse.ok) {
                            Swal.fire('Success', 'Judge updated successfully!', 'success');
                            fetchJudges();
                        } else {
                            const errorData = await updateResponse.json();
                            Swal.fire('Error', errorData.message || 'Failed to update judge', 'error');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        Swal.fire('Error', 'An error occurred while updating the judge', 'error');
                    }
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'An error occurred while fetching judge data', 'error');
            }
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <div className="header-content">
                    <div className="welcome-section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <h1 className="welcome-title">Administration Center</h1>
                        <p className="welcome-subtitle">Comprehensive management for projects and judges</p>
                    </div>
                </div>
            </div>

            <div className="administration-container">
                                     <div className="tab-navigation">
                         <button 
                             className={`tab-button ${activeTab === 'projects' ? 'active' : ''}`}
                             onClick={() => setActiveTab('projects')}
                         >
                             <FaProjectDiagram />
                             <span>Projects</span>
                         </button>
                         <button 
                             className={`tab-button ${activeTab === 'judges' ? 'active' : ''}`}
                             onClick={() => setActiveTab('judges')}
                         >
                             <FaUsers />
                             <span>Judges</span>
                         </button>
                         <button 
                             className={`tab-button ${activeTab === 'potential-judges' ? 'active' : ''}`}
                             onClick={() => setActiveTab('potential-judges')}
                         >
                             <FaUserPlus />
                             <span>Potential Judges</span>
                         </button>
                     </div>

                <div className="tab-content">
                                         {activeTab === 'projects' && (
                         <div className="projects-section">
                             <div className="section-header">
                                 <h2>Project Management</h2>
                                 <p>Manage all projects in the system</p>
                             </div>
                             
                             <div className="projects-header">
                                 <div className="projects-stats">
                                     <div className="stat-item">
                                         <span className="stat-number">{projects.length}</span>
                                         <span className="stat-label">Total Projects</span>
                                     </div>
                                 </div>
                                 <button className="add-project-button" onClick={handleAddNewProject}>
                                     <FaPlus />
                                     <span>Add New Project</span>
                                 </button>
                             </div>
 
                             <div className="projects-grid">
                                 {projects.map((project, index) => (
                                     <div key={project.ProjectNumber} className="project-card">
                                         <div className="project-header">
                                             <div className="project-number">#{project.ProjectNumber}</div>
                                                                                           <div className="project-actions">
                                                  <button 
                                                      className="action-btn edit-btn" 
                                                      onClick={() => handleEditProjectCard(project)}
                                                      title="Edit Project"
                                                  >
                                                      <FaEdit />
                                                      <span>Edit</span>
                                                  </button>
                                                  <button 
                                                      className="action-btn delete-btn" 
                                                      onClick={() => handleDeleteProjectCard(project.ProjectNumber)}
                                                      title="Delete Project"
                                                  >
                                                      <FaTrash />
                                                      <span>Remove</span>
                                                  </button>
                                              </div>
                                         </div>
                                         
                                         <div className="project-content">
                                             <h3 className="project-title">{project.Title || 'Untitled Project'}</h3>
                                             <div className="project-details">
                                                 <div className="detail-item">
                                                     <span className="detail-label">Owners:</span>
                                                     <span className="detail-value">{project.ProjectOwners || 'Not specified'}</span>
                                                 </div>
                                                 <div className="detail-item">
                                                     <span className="detail-label">Student:</span>
                                                     <span className="detail-value">{project.StudentName || 'Not specified'}</span>
                                                 </div>
                                                 <div className="detail-item">
                                                     <span className="detail-label">Email:</span>
                                                     <span className="detail-value">{project.StudentEmail || 'Not specified'}</span>
                                                 </div>
                                                 <div className="detail-item">
                                                     <span className="detail-label">Workshop:</span>
                                                     <span className="detail-value">{project.WorkshopName || 'Not specified'}</span>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                             
                             {projects.length === 0 && (
                                 <div className="empty-state">
                                     <div className="empty-icon">
                                         <FaProjectDiagram />
                                     </div>
                                     <h3>No Projects Found</h3>
                                     <p>Get started by adding your first project</p>
                                     <button className="add-project-button" onClick={handleAddNewProject}>
                                         <FaPlus />
                                         <span>Add New Project</span>
                                     </button>
                                 </div>
                             )}
                         </div>
                     )}

                     {activeTab === 'judges' && (
                         <div className="judges-section">
                             <div className="section-header">
                                 <h2>Judge Management</h2>
                                 <p>Manage registered and potential judges</p>
                             </div>
                             
                             <div className="projects-header">
                                 <div className="projects-stats">
                                     <div className="stat-item">
                                         <span className="stat-number">{judges.length}</span>
                                         <span className="stat-label">Registered Judges</span>
                                     </div>
                                     <div className="stat-item">
                                         <span className="stat-number">{potentialJudges.length}</span>
                                         <span className="stat-label">Potential Judges</span>
                                     </div>
                                 </div>
                                 <div className="judge-actions">
                                     <button className="add-project-button" onClick={handleAddNewJudge}>
                                         <FaPlus />
                                         <span>Add Judge</span>
                                     </button>
                                 </div>
                             </div>
 
                             <div className="projects-grid">
                                 {judges.map((judge, index) => (
                                     <div key={judge.ID} className="project-card">
                                         <div className="project-header">
                                             <div className="project-number">#{judge.ID}</div>
                                             <div className="project-actions">
                                                 <button 
                                                     className="action-btn edit-btn" 
                                                     onClick={() => handleEditJudgeById(judge.ID)}
                                                     title="Edit Judge"
                                                 >
                                                     <FaEdit />
                                                     <span>Edit</span>
                                                 </button>
                                                 <button 
                                                     className="action-btn delete-btn" 
                                                     onClick={() => handleDeleteJudge(judge.ID)}
                                                     title="Delete Judge"
                                                 >
                                                     <FaTrash />
                                                     <span>Remove</span>
                                                 </button>
                                             </div>
                                         </div>
                                         
                                         <div className="project-content">
                                             <h3 className="project-title">{judge.name || 'Unnamed Judge'}</h3>
                                             <div className="project-details">
                                                 <div className="detail-item">
                                                     <span className="detail-label">Email:</span>
                                                     <span className="detail-value">{judge.email || 'Not specified'}</span>
                                                 </div>
                                                 <div className="detail-item">
                                                     <span className="detail-label">Password:</span>
                                                     <span className="detail-value">
                                                         {judge.password || 'Not set'}
                                                     </span>
                                                 </div>
                                             </div>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                             
                             {judges.length === 0 && (
                                 <div className="empty-state">
                                     <div className="empty-icon">
                                         <FaUsers />
                                     </div>
                                     <h3>No Judges Found</h3>
                                     <p>Get started by adding your first judge</p>
                                     <button className="add-project-button" onClick={handleAddNewJudge}>
                                         <FaPlus />
                                         <span>Add New Judge</span>
                                     </button>
                                 </div>
                             )}
                         </div>
                     )}

                     {/* Potential Judges View */}
                     {activeTab === 'potential-judges' && (
                         <div className="tab-panel">
                             <div className="section-header">
                                 <div className="header-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                     <h2>Potential Judges Management</h2>
                                     <p>Manage potential judges who can be added to the system</p>
                                 </div>
                             </div>
                             
                             <div className="potential-judges-content">
                                 <div className="potential-judges-header">
                                     <div className="potential-judges-stats">
                                         <div className="stat-item">
                                             <span className="stat-number">{potentialJudges.length}</span>
                                             <span className="stat-label">Potential Judges</span>
                                         </div>
                                     </div>
                                     <div className="potential-judges-actions">
                                         <input 
                                             type="text" 
                                             id="newIdInput" 
                                             placeholder="Enter new potential judge ID" 
                                             className="potential-judge-input"
                                         />
                                         <button 
                                             onClick={addNewPotentialJudgeFromPage}
                                             className="add-project-button secondary"
                                         >
                                             <FaPlus />
                                             <span>Add Potential Judge</span>
                                         </button>
                                     </div>
                                 </div>
                                 
                                 <div className="potential-judges-grid">
                                     {potentialJudges.map((judge, index) => (
                                         <div key={judge.ID} className="potential-judge-card">
                                             <div className="potential-judge-header">
                                                 <div className="potential-judge-actions">
                                                     <button 
                                                         className="action-btn delete-btn" 
                                                         onClick={() => handleRemovePotentialJudge(judge.ID)}
                                                         title="Remove Potential Judge"
                                                     >
                                                         <FaTrash />
                                                         <span>Remove</span>
                                                     </button>
                                                 </div>
                                             </div>
                                             
                                             <div className="potential-judge-content">
                                                 <h3 className="potential-judge-title">ID: {judge.ID}</h3>
                                                 <div className="potential-judge-details">
                                                     <div className="detail-item">
                                                         <span className="detail-label">Status:</span>
                                                         <span className="detail-value">
                                                             <span style={{
                                                                 background: judges.find(j => j.ID === judge.ID) 
                                                                     ? 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' 
                                                                     : 'linear-gradient(135deg, #ffa726 0%, #ff7043 100%)',
                                                                 color: 'white',
                                                                 padding: '2px 8px',
                                                                 borderRadius: '12px',
                                                                 fontSize: '0.75rem',
                                                                 fontWeight: '600'
                                                             }}>
                                                                 {judges.find(j => j.ID === judge.ID) ? 'Active' : 'Pending'}
                                                             </span>
                                                         </span>
                                                     </div>
                                                 </div>
                                             </div>
                                         </div>
                                     ))}
                                 </div>
                                 
                                 {potentialJudges.length === 0 && (
                                     <div className="empty-state">
                                         <div className="empty-icon">
                                             <FaCog />
                                         </div>
                                         <h3>No Potential Judges Found</h3>
                                         <p>Add potential judges to the system</p>
                                         <div className="potential-judges-actions">
                                             <input 
                                                 type="text" 
                                                 id="newIdInput" 
                                                 placeholder="Enter new potential judge ID" 
                                                 className="potential-judge-input"
                                             />
                                             <button 
                                                 onClick={addNewPotentialJudgeFromPage}
                                                 className="add-project-button secondary"
                                             >
                                                 <FaPlus />
                                                 <span>Add Potential Judge</span>
                                             </button>
                                         </div>
                                     </div>
                                 )}
                             </div>
                         </div>
                     )}
                </div>
            </div>
            <AdminButtons />
        </div>
    );
});

export default Administration;
