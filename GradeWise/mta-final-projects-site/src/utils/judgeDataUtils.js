import { backendURL } from '../config';

/**
 * Shared utility functions for judge components to use the same data source as admin analytics
 * This ensures consistency between what judges see and what admins see
 */

/**
 * Fetch projects data for a specific judge using the judge-specific endpoint
 * @param {string} token - JWT token for authentication
 * @param {string} judgeId - ID of the judge
 * @returns {Promise<Array>} - Projects data for the judge
 */
export const fetchJudgeProjects = async (token, judgeId) => {
  try {
    console.log('fetchJudgeProjects called with judgeId:', judgeId);
    
    // Use the judge-specific endpoint instead of admin endpoint
    const response = await fetch(`${backendURL}/projectsForJudge/projectList`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch projects data');
    }

    const data = await response.json();
    console.log('Raw projects data from judge endpoint:', data);
    console.log('Total projects found:', data.projects?.length || 0);
    
    // Return the projects data directly since this endpoint already returns judge-specific projects
    return data.projects || [];
  } catch (error) {
    console.error('Error fetching judge projects:', error);
    throw error;
  }
};

/**
 * Transform judge projects data to the format expected by GradeProjects component
 * @param {Array} judgeProjects - Array of project objects for a judge
 * @returns {Array} - Transformed projects data
 */
export const transformGradesToProjects = (judgeProjects) => {
  return judgeProjects.map(project => ({
    ProjectNumber: project.ProjectNumber,
    Title: project.Title,
    // Since we don't have grades data from this endpoint, we'll set default values
    complexity: NaN,
    usability: NaN,
    innovation: NaN,
    presentation: NaN,
    proficiency: NaN,
    grade: NaN,
    additionalComment: '',
    createdAt: project.createdAt || new Date(),
    updatedAt: project.updatedAt || new Date()
  }));
};

/**
 * Calculate judge statistics from grades data
 * @param {Array} judgeGrades - Array of grade objects for a judge
 * @returns {Object} - Statistics object with counts
 */
export const calculateJudgeStats = (judgeGrades) => {
  // Count total assigned projects
  const totalAssigned = judgeGrades.length;
  
  // Count graded projects (projects with valid scores, not NaN)
  const totalGraded = judgeGrades.filter(grade => {
    const complexity = parseFloat(grade.complexity);
    const usability = parseFloat(grade.usability);
    const innovation = parseFloat(grade.innovation);
    const presentation = parseFloat(grade.presentation);
    const proficiency = parseFloat(grade.proficiency);
    
    // Check if all scores are valid numbers (not NaN)
    return !(isNaN(complexity) || isNaN(usability) || isNaN(innovation) || 
             isNaN(presentation) || isNaN(proficiency));
  }).length;
  
  const pendingProjects = totalAssigned - totalGraded;
  
  return {
    assignedProjects: totalAssigned,
    gradedProjects: totalGraded,
    pendingProjects: pendingProjects
  };
};

/**
 * Check if a project is graded (has valid scores)
 * @param {Object} grade - Grade object
 * @returns {boolean} - True if project is graded
 */
export const isProjectGraded = (grade) => {
  const complexity = parseFloat(grade.complexity);
  const usability = parseFloat(grade.usability);
  const innovation = parseFloat(grade.innovation);
  const presentation = parseFloat(grade.presentation);
  const proficiency = parseFloat(grade.proficiency);
  
  // Check if all scores are valid numbers (not NaN)
  return !(isNaN(complexity) || isNaN(usability) || isNaN(innovation) || 
           isNaN(presentation) || isNaN(proficiency));
};
