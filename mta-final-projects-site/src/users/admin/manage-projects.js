//V
import { observer } from 'mobx-react-lite';
import React from 'react';

import AdminButtons from './AdminButtons';
import { backendURL } from '../../config';
import Swal from 'sweetalert2';
import './ManageProjects.css';

const ManageProjects = observer(() => {
    const handleRemoveProject = async () => {
        // Fetch all projects first
        try {
            const response = await fetch(`${backendURL}/admin/projects/projectsList`);
            if (!response.ok) {
                throw new Error('Failed to fetch projects');
            }
            const projects = await response.json();

            // Create the HTML for the projects list with delete icons
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
                                
                                <!-- Project Info -->
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
                                
                                <!-- Delete Button -->
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
                        from {
                            opacity: 0;
                            transform: translateY(20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                    /* Responsive grid for project items */
                    .projects-grid {
                        display: grid;
                        gap: 14px;
                        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    }
                    @media (max-width: 768px) {
                        .projects-grid {
                            grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                        }
                    }
                    @media (max-width: 480px) {
                        .projects-grid {
                            grid-template-columns: 1fr;
                            gap: 10px;
                        }
                        .project-card {
                            padding: 12px !important;
                            border-radius: 12px !important;
                        }
                        .project-card button {
                            width: 40px !important;
                            height: 40px !important;
                        }
                        .project-card span {
                            font-size: 10px !important;
                        }
                    }
                    
                    .fullscreen-modal {
                        position: fixed !important;
                        top: 0 !important;
                        left: 0 !important;
                        width: 100vw !important;
                        height: 100vh !important;
                        max-width: 100vw !important;
                        max-height: 100vh !important;
                        margin: 0 !important;
                        border-radius: 0 !important;
                        box-shadow: none !important;
                        display: flex !important;
                        flex-direction: column !important;
                    }
                    
                    .fullscreen-modal .swal2-header {
                        padding: 30px 40px 20px 40px !important;
                        border-bottom: 1px solid rgba(102, 126, 234, 0.1) !important;
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%) !important;
                        backdrop-filter: blur(10px) !important;
                    }
                    
                    .fullscreen-modal .swal2-title {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                        -webkit-background-clip: text !important;
                        -webkit-text-fill-color: transparent !important;
                        background-clip: text !important;
                        font-weight: 700 !important;
                        font-size: 2rem !important;
                        margin: 0 !important;
                    }
                    
                    .fullscreen-modal .swal2-html-container {
                        margin: 0 !important;
                        flex: 1 !important;
                        padding: 40px !important;
                        overflow-y: auto !important;
                        background: rgba(255, 255, 255, 0.8) !important;
                    }
                    
                    .fullscreen-modal .swal2-actions {
                        padding: 30px 40px !important;
                        margin: 0 !important;
                        border-top: 1px solid rgba(102, 126, 234, 0.1) !important;
                        background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(248, 250, 252, 0.95) 100%) !important;
                        backdrop-filter: blur(10px) !important;
                        display: flex !important;
                        justify-content: flex-end !important;
                        gap: 15px !important;
                    }
                    
                    .fullscreen-modal .swal2-confirm {
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                        border-radius: 12px !important;
                        font-weight: 600 !important;
                        box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3) !important;
                        padding: 12px 30px !important;
                        font-size: 16px !important;
                    }
                    
                    .fullscreen-modal .swal2-cancel {
                        background: linear-gradient(135deg, #718096 0%, #4a5568 100%) !important;
                        border-radius: 12px !important;
                        font-weight: 600 !important;
                        box-shadow: 0 4px 15px rgba(113, 128, 150, 0.3) !important;
                        padding: 12px 30px !important;
                        font-size: 16px !important;
                    }
                    
                    .fullscreen-modal .swal2-close {
                        position: absolute !important;
                        top: 30px !important;
                        right: 40px !important;
                        font-size: 24px !important;
                        color: #667eea !important;
                        background: none !important;
                        border: none !important;
                        cursor: pointer !important;
                        z-index: 1000 !important;
                    }
                    
                    .swal2-backdrop {
                        backdrop-filter: blur(8px) !important;
                        background: rgba(0, 0, 0, 0.3) !important;
                    }
                </style>
            `;

            // Add the delete function to window object
            window.deleteProject = async (projectNumber) => {
                try {
                    const deleteResponse = await fetch(`${backendURL}/admin/projects/remove`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                        body: JSON.stringify({ projectNumber: projectNumber }),
                    });

                    if (deleteResponse.ok) {
                        Swal.fire('Success', 'Project deleted successfully!', 'success');
                        // Refresh the projects list
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
                customClass: {
                    popup: 'responsive-swal-popup fullscreen-modal',
                },
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

    const handleAddNewProject = async () => {
        const fetchWorkshops = async () => {
            try {
                const response = await fetch(`${backendURL}/admin/projects/workshops`);
                if (response.ok) {
                    const workshops = await response.json();
                    return workshops;
                }
            } catch (error) {
                console.error('Error fetching workshops:', error);
            }
            return [];
        };
    
        const workshops = await fetchWorkshops();
    
        const { value: newProject } = await Swal.fire({
            title: '<span style="font-size: 75%; color: #175a94;">Add New Project</span>',
            html: `
                <select id="workshopIdSelect" class="swal2-input custom-modal-input">
                    <option value="" disabled selected>Select Workshop</option>
                    ${workshops.map(workshop => `<option value="${workshop.WorkshopId}|${workshop.WorkshopName}">${workshop.WorkshopId} (${workshop.WorkshopName})</option>`).join('')}
                    <option value="new">New Workshop</option>
                </select>
                <input id="projectNumber" class="swal2-input custom-modal-input" placeholder="Project Number" />
                <input id="title" class="swal2-input custom-modal-input" placeholder="Project Title" />
                <input id="projectOwners" class="swal2-input custom-modal-input" placeholder="Project Owners" />
                <input id="projectInfo" class="swal2-input custom-modal-input" placeholder="Project Information" />
                <input id="projectImage" class="swal2-input custom-modal-input" placeholder="Project Image" />
                <input id="githubLink" class="swal2-input custom-modal-input" placeholder="Github link" />
                <input id="courseOfStudy" class="swal2-input custom-modal-input" placeholder="Course Of Study" />
                <input id="studentName" class="swal2-input custom-modal-input" placeholder="Student Name" />
                <input id="studentEmail" class="swal2-input custom-modal-input" placeholder="Student Email" />
                <input id="studentPhone" class="swal2-input custom-modal-input" placeholder="Student Phone" />
                <input id="lecturer" class="swal2-input custom-modal-input" placeholder="Lecturer" />
                
                <div id="newWorkshopFields" style="display: none;">
                    <input id="newWorkshopId" class="swal2-input custom-modal-input" placeholder="New Workshop ID" />
                    <input id="newWorkshopName" class="swal2-input custom-modal-input" placeholder="New Workshop Name" />
                </div>
            `,
            customClass: {
                popup: 'responsive-swal-popup', // Add this custom class
            },
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: '<span style="font-size: 75%;">Save</span>',
            cancelButtonText: '<span style="font-size: 75%;">Cancel</span>',
            didOpen: () => {
                const workshopSelect = document.getElementById('workshopIdSelect');
                const newWorkshopFields = document.getElementById('newWorkshopFields');
    
                // Show or hide new workshop fields based on selection
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
                    // New workshop selected
                    workshopId = document.getElementById('newWorkshopId').value;
                    workshopName = document.getElementById('newWorkshopName').value;
    
                    if (!workshopId || !workshopName) {
                        Swal.showValidationMessage('Please fill out new workshop details');
                        return false;
                    }
    
                    newWorkshop = { WorkshopId: workshopId, WorkshopName: workshopName };
                } else {
                    // Existing workshop selected
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
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(newProject),
                });
    
                if (response.ok) {
                    Swal.fire('Success', 'Project added successfully!', 'success');
                } else {
                    Swal.fire('Error', 'Failed to add project', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'An error occurred while adding the project', 'error');
            }
        }
    };
    

    const handleEditProject = async () => {
        // Step 1: Ask for Project ID
        const { value: projectId } = await Swal.fire({
            title: 'Edit Project',
            input: 'text',
            inputLabel: 'Project ID',
            inputPlaceholder: 'Enter the project ID',
            showCancelButton: true,
            confirmButtonText: 'Next',
            cancelButtonText: 'Cancel',
            inputValidator: (value) => {
                if (!value) {
                    return 'Please enter a project ID!';
                }
            },
        });
    
        if (projectId) {
            try {
                const query = `?projectNumber=${encodeURIComponent(projectId)}`;
                console.log(query);
                const response = await fetch(`${backendURL}/admin/projects/getById${query}`);
                
                if (response.ok) {
                    const project = await response.json();
                    
                    const { value: editedProject } = await Swal.fire({
                        title: 'Edit Project',
                        html: `
                            <label>Project Number</label>
                            <input id="projectNumber" class="swal2-input" value="${project.ProjectNumber}" />
                            
                            <label>Title</label>
                            <input id="title" class="swal2-input" value="${project.Title}" />
                            
                            <label>Project Owners</label>
                            <input id="projectOwners" class="swal2-input" value="${project.ProjectOwners}" />
                            
                            <label>Project Information</label>
                            <input id="projectInfo" class="swal2-input" value="${project.ProjectInfo}" />
                            
                            <label>Project Image</label>
                            <input id="projectImage" class="swal2-input" value="${project.ProjectImage}" />
                            
                            <label>Github Link</label>
                            <input id="githubLink" class="swal2-input" value="${project.GithubLink}" />
                            
                            <label>Course Of Study</label>
                            <input id="courseOfStudy" class="swal2-input" value="${project.CourseOfStudy}" />
                            
                            <label>Student Name</label>
                            <input id="studentName" class="swal2-input" value="${project.StudentName}" />
                            
                            <label>Student Email</label>
                            <input id="studentEmail" class="swal2-input" value="${project.StudentEmail}" />
                            
                            <label>Student Phone</label>
                            <input id="studentPhone" class="swal2-input" value="${project.StudentPhone}" />
                        `,
                        focusConfirm: false,
                        showCancelButton: true,
                        confirmButtonText: 'Save',
                        cancelButtonText: 'Cancel',
                    });
        
                    if (editedProject) {
                        // Step 5: Submit the Changes
                        try {
                            const updatedProject = {
                                ProjectNumber: document.getElementById('projectNumber').value,
                                Title: document.getElementById('title').value,
                                ProjectOwners: document.getElementById('projectOwners').value,
                                ProjectInfo: document.getElementById('projectInfo').value,
                                ProjectImage: document.getElementById('projectImage').value,
                                GithubLink: document.getElementById('githubLink').value,
                                CourseOfStudy: document.getElementById('courseOfStudy').value,
                                StudentName: document.getElementById('studentName').value,
                                StudentEmail: document.getElementById('studentEmail').value,
                                StudentPhone: document.getElementById('studentPhone').value,
                            };
        
                            const response = await fetch(`${backendURL}/admin/projects/update${query}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(updatedProject),
                            });
        
                            if (response.ok) {
                                Swal.fire('Success', 'Project updated successfully!', 'success');
                            } else {
                                Swal.fire('Error', 'Failed to update project', 'error');
                            }
                        } catch (error) {
                            console.error('Error:', error);
                            Swal.fire('Error', 'An error occurred while updating the project', 'error');
                        }
                    }
                } else {
                    Swal.fire('Error', 'Failed to fetch project data', 'error');
                }
            } catch (error) {
                console.error('Error:', error);
                Swal.fire('Error', 'An error occurred while fetching the project data', 'error');
            }
        }
    };

    

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <div className="header-content">
                    <div className="welcome-section" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        <h1 className="welcome-title">Manage Projects</h1>
                        <p className="welcome-subtitle">Add, edit, and remove project data</p>
                    </div>
                </div>
            </div>

            <div className="stats-section">
                <div className="admin-page-container">
                    <div className="admin-header">
                        <div className="admin-buttons">
                            <button className='admin-button' onClick={handleAddNewProject}>Add Project</button>
                            <button className='admin-button' onClick={handleRemoveProject}>Remove Project</button>
                            <button className='admin-button' onClick={handleEditProject}>Edit Project</button>
                        </div>
                    </div>
                </div>
            </div>
            <AdminButtons />
        </div>
    );
});

export default ManageProjects;
