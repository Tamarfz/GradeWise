const express = require('express');
const router = express.Router();
const { usersSerivce } = require('./users.service');
const { getCollections } = require('../../DB/index');
const Grade = require('../../DB/entities/grade.entity'); // Adjust the path based on your folder structure
const projectsDB = require('../../DB/entities/project.entity')

getCollections()
  .then((collections) => {
    // Remove selected IDs from the database
    router.post('/judges/remove-ids', async (req, res) => {
      const { ids } = req.body;

      try {
          const result = await collections.potential_users.deleteMany({ ID: { $in: ids } });
          res.json(result);
      } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ error: 'An error occurred' });
      }
  });

    // Remove selected users from the database
    router.post('/judges/remove-users', async (req, res) => {
      const { users } = req.body;
      try {
        const result = await collections.users.deleteMany({ ID: { $in: users } });
        res.json(result);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred' });
      }
    });

    router.get('/judges/judgesList', async (req, res) => {
      try {
        const judges = await collections.users.find({}, { projection: { name: 1, ID: 1} }).toArray();
        res.json(judges);
      } catch (error) {
        console.error('Error fetching judges:', error);
        res.status(500).json({ error: 'An error occurred while fetching judges' });
      }
    });

    router.get('/judges/potentialJudgesList', async (req, res) => {
      try {
        const potentialJudges = await collections.potential_users.find({}).toArray();
        res.json(potentialJudges);
      } catch (error) {
        console.error('Error fetching potential judges:', error);
        res.status(500).json({ error: 'An error occurred while fetching potential judges' });
      }
    });

    router.post('/judges/add-potential-judge', async (req, res) => {
      const { ID } = req.body;
      try {
          const result = await collections.potential_users.insertOne({ ID });
          res.json(result);
      } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ error: 'An error occurred' });
      }
  });

  router.get('/projects/projectsList', async (req, res) => {
    try {
        const { search, searchField } = req.query;
        let query = {};

        if (search && searchField) {
            // Construct the query dynamically based on the selected searchField
            query = {
                [searchField]: { $regex: search, $options: 'i' }
            };
        } else if (search) {
            // Fallback to the existing logic if only search term is provided without a specific field
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { Title: { $regex: search, $options: 'i' } },
                    { ProjectYear: { $regex: search, $options: 'i' } },
                    { WorkshopName: { $regex: search, $options: 'i' } },
                    { ProjectOwners: { $regex: search, $options: 'i' } },
                    { Lecturer: { $regex: search, $options: 'i' } },
                    { StudentName: { $regex: search, $options: 'i' } },
                    { StudentEmail: { $regex: search, $options: 'i' } },
                    { StudentPhone: { $regex: search, $options: 'i' } }
                ]
            };
        }

        router.get('/projects/getById', async (req, res) => {
          try {
            const { projectNumber } = req.query;
            const project = await collections.project_schemas.findOne({ ProjectNumber: projectNumber });
      
              if (!project) {
                console.log('Project not found')
                  return res.status(404).json({ error: 'Project not found' });
              }
      
              res.json(project);
          } catch (error) {
              console.error('Error fetching project:', error);
              res.status(500).json({ error: 'Failed to fetch project: ',error });
          }
      });

        const projects = await collections.project_schemas.find(query).toArray();
        res.json(projects);
    } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'An error occurred while fetching projects' });
    }
});

router.put('/projects/update', async (req, res) => {
  try {
      const { projectNumber } = req.query; //original project number
      console.log(projectNumber);
      console.log(req.body);
      console.log(req.query);
      const {
          ProjectNumber, // New project number 
          Title,
          ProjectOwners,
          ProjectInfo,
          ProjectImage,
          GithubLink,
          CourseOfStudy,
          StudentName,
          StudentEmail,
          StudentPhone,
      } = req.body; 

      // Update the project with the new data, including the new ProjectNumber
      await collections.project_schemas.updateOne(
          { ProjectNumber: projectNumber },
          {
              $set: {
                  ProjectNumber,
                  Title,
                  ProjectOwners,
                  ProjectInfo,
                  ProjectImage,
                  GithubLink,
                  CourseOfStudy,
                  StudentName,
                  StudentEmail,
                  StudentPhone,
              },
          }
      );

      res.json({ message: 'Project updated successfully' });
  } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Failed to update project' });
  }
});

router.post('/projects/remove', async (req, res) => {
  const { projectNumber } = req.body;

  if (!projectNumber) {
    return res.status(400).json({ message: 'Project number is required' });
  }

  try {
    // 1. Delete the project from the project_schemas collection
    const deletedProject = await collections.project_schemas.findOneAndDelete({ ProjectNumber: projectNumber });

    // 2. Delete any associated grade records
    await collections.grades.deleteMany({ project_id: projectNumber });

    // 3. Update or remove from projects_judges_groups
    const groupsWithProject = await collections.projects_judges_groups.find({
      project_ids: projectNumber
    }).toArray();

    for (const group of groupsWithProject) {
      const updatedProjectIds = group.project_ids.filter(id => id !== projectNumber);

      if (updatedProjectIds.length === 0) {
        // If no more projects left, delete the whole record
        await collections.projects_judges_groups.deleteOne({ _id: group._id });
      } else {
        // Otherwise, just update the project_ids array
        await collections.projects_judges_groups.updateOne(
          { _id: group._id },
          { $set: { project_ids: updatedProjectIds } }
        );
      }
    }

    if (deletedProject) {
      res.status(200).json({ message: `Project ${projectNumber} deleted successfully.` });
    } else {
      res.status(404).json({ message: `Project ${projectNumber} not found.` });
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'An error occurred while deleting the project.' });
  }
});

router.post('/projects/add', async (req, res) => {
  console.log('Reached add project');
  console.log(req.body);
  const newProject  = req.body;

  if (!newProject.ProjectNumber || !newProject.Title || !newProject.WorkshopName || !newProject.StudentName) {
    return res.status(400).json({ message: 'Please provide all required fields.' });
  }

  try {
    const result = await collections.project_schemas.insertOne(newProject);
    res.status(201).json({ message: 'Project added successfully!', projectId: result.insertedId });
  } catch (error) {
      console.error('Error adding project:', error);
      res.status(500).json({ message: 'An error occurred while adding project' });
  }
});

router.get('/projects/workshops', async (req, res) => {
  try {
    console.log('Reached workshops');
    const workshops = await collections.project_schemas.aggregate([
      {
        $group: {
          _id: { WorkshopId: '$WorkshopId', WorkshopName: '$WorkshopName' }
        }
      },
      { 
        $project: {
          _id: 0,
          WorkshopId: '$_id.WorkshopId',
          WorkshopName: '$_id.WorkshopName'
        }
      }
    ]).toArray();

    console.log(workshops);

    res.status(200).json(workshops);
  } catch (error) {
    console.error('Error fetching workshops:', error);
    res.status(500).json({ error: 'An error occurred while fetching workshops' });
  }
});



// Route to get all preferences

router.get('/preferences', async (req, res) => {
  try {
    const preferences = await collections.available_preferences.find({}).toArray();
    res.json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ error: 'An error occurred while fetching preferences' });
  }
});
  // Route to add a new preference
  router.post('/preferences/add', async (req, res) => {
    const { preference } = req.body;
    try {
      const result = await collections.available_preferences.insertOne({ ID: preference });
      res.json(result);
    } catch (error) {
      console.error('Error adding preference:', error);
      res.status(500).json({ error: 'An error occurred while adding the preference' });
    }
  });


  // Route to remove preferences
  router.post('/preferences/remove', async (req, res) => {
    const { preferences } = req.body;
    try {
      const result = await collections.available_preferences.deleteMany({ ID: { $in: preferences } });
      res.json(result);
    } catch (error) {s
      console.error('Error removing preferences:', error);
      res.status(500).json({ error: 'An error occurred while removing the preferences' });
    }
  });


  router.get('/grades', async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const user = await usersSerivce.checkToken(token); 
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const gradesList = await collections.grades.find({}).toArray();
        res.json({'grades': gradesList});
    } catch (error) {
        console.error('Error fetching grades:', error);
        res.status(500).json({ error: 'An error occurred while fetching grades' });
    }
  });

  const ProjectsJudgesGroup = require('../../DB/entities/projects_judges_group.entity'); // Path to your model

  router.post('/assignProjects', async (req, res) => {
    try {
      console.log('Starting project assignment...');
      // Extract token and verify the user
      const token = req.headers.authorization.split(' ')[1];
      const user = await usersSerivce.checkToken(token);
      
      if (!user || user.type !== 'admin') {
        return res.status(401).json({ error: 'Unauthorized' });
      }
  
      // Extract judgeIds and projectIds from request body
      const { judgeIds, projectIds } = req.body;
      console.log('Received judgeIds:', judgeIds);
      console.log('Received projectIds:', projectIds);

      if (!judgeIds || !projectIds || judgeIds.length === 0 || projectIds.length === 0) {
        return res.status(400).json({ error: 'Both judges and projects must be selected.' });
      }

      // Check for existing assignments to prevent duplicates
      const existingAssignments = await collections.projects_judges_groups.find({}).toArray();
      
      for (const judgeId of judgeIds) {
        for (const projectId of projectIds) {
          // Check if this judge-project combination already exists
          const isDuplicate = existingAssignments.some(assignment => 
            assignment.judge_ids.includes(judgeId) && assignment.project_ids.includes(projectId)
          );
          
          if (isDuplicate) {
            // Fetch project and judge names for better error message
            // Convert to string for ProjectNumber since it's stored as string in schema
            const project = await collections.project_schemas.findOne({ ProjectNumber: projectId.toString() });
            // Convert to string for ID since it's stored as string in schema
            const judge = await collections.users.findOne({ ID: judgeId.toString() });
            
            const projectName = project ? project.Title : `Project ${projectId}`;
            const judgeName = judge ? judge.name : `Judge ${judgeId}`;
            
            return res.status(400).json({ 
              error: `${projectName} is already assigned to ${judgeName}. Cannot assign the same project to the same judge twice.` 
            });
          }
        }
      }
  
      // Create a new entry in projects_judges_group
      const newAssignment = new ProjectsJudgesGroup({
        judge_ids: judgeIds,
        project_ids: projectIds
      });
  
      console.log('Saving new assignment...');
      await newAssignment.save(); // Save the new assignment to MongoDB
      console.log('Assignment saved successfully');

      // Create default grade entries for each judge-project combination
      const defaultGrades = [];
      for (const judgeId of judgeIds) {
        for (const projectId of projectIds) {
          // Check if grade already exists for this judge-project combination
          const existingGrade = await collections.grades.findOne({
            project_id: projectId.toString(),
            judge_id: judgeId.toString()
          });
          
          if (existingGrade) {
            // Fetch project and judge names for better error message
            // Convert to string for ProjectNumber since it's stored as string in schema
            const project = await collections.project_schemas.findOne({ ProjectNumber: projectId.toString() });
            // Convert to string for ID since it's stored as string in schema
            const judge = await collections.users.findOne({ ID: judgeId.toString() });
            
            const projectName = project ? project.Title : `Project ${projectId}`;
            const judgeName = judge ? judge.name : `Judge ${judgeId}`;
            
            return res.status(400).json({ 
              error: `Grade already exists for ${projectName} and ${judgeName}. Cannot assign the same project to the same judge twice.` 
            });
          }
          
          defaultGrades.push({
            project_id: projectId.toString(),
            judge_id: judgeId.toString(),
            complexity: 1,
            usability: 1,
            innovation: 1,
            presentation: 1,
            proficiency: 1,
            additionalComment: 'Not yet scored',
            grade: 10,
            createdAt: new Date(),
            updatedAt: new Date()
          });
        }
      }

      console.log('Created default grades:', defaultGrades);

      // Insert all default grades
      if (defaultGrades.length > 0) {
        console.log('Inserting default grades...');
        await collections.grades.insertMany(defaultGrades);
        console.log('Default grades inserted successfully');
      }
  
      // Return success response
      console.log('Sending success response');
      res.status(200).json({ message: 'Projects successfully assigned to judges and default grades created.' });
    } catch (error) {
      console.error('Error assigning projects:', error);
      res.status(500).json({ error: 'An error occurred while assigning projects.' });
    }
  });

  router.get('/judgesProjectsMaps', async (req, res) => {
    try {
        // Fetch all users of type 'judge'
        const judges = await collections.users.find({ 'type': 'judge' }).toArray();

        // Create the judge_id: judge_name dictionary
        const judgeDict = {};
        judges.forEach(judge => {
            judgeDict[judge.ID] = judge.name;
        });

        // Fetch all projects
        const projects = await collections.project_schemas.find({}).toArray();

        // Create the project_id: project_name dictionary
        const projectDict = {};
        projects.forEach(project => {
            projectDict[project.ProjectNumber] = project.Title;
        });

        // Return both dictionaries in the response
        res.json({ judges: judgeDict, projects: projectDict });
    } catch (error) {
        console.error('Error fetching judge and project maps:', error);
        res.status(500).json({ error: 'An error occurred while fetching data' });
    }
  });

  // Get current admin user data
  router.get('/current-admin', async (req, res) => {
    try {
      // Extract Bearer token from the Authorization header
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided.' });
      }

      // Verify the token to get the user object from token payload
      const userFromToken = await usersSerivce.checkToken(token);
      if (!userFromToken) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
      }

      // Ensure that the current user is an admin
      if (userFromToken.type !== 'admin') {
        return res.status(403).json({ error: 'Forbidden: Current user is not an admin.' });
      }

      // Log the token payload for debugging (optional)
      console.log('userFromToken:', userFromToken);

      // Search for the admin record in the users collection.
      const adminData = await collections.users.findOne({
        $or: [
          { ID: userFromToken.ID },
          { ID: userFromToken.id },
          { _id: userFromToken._id }
        ]
      });

      if (!adminData) {
        return res.status(404).json({ error: 'Admin not found in the database.' });
      }

      res.status(200).json(adminData);
    } catch (error) {
      console.error('Error retrieving admin data:', error);
      res.status(500).json({ error: 'An error occurred while retrieving admin data.' });
    }
  });

  // Get grade information for a specific project
  router.get('/projects/:projectId/gradeInfo', async (req, res) => {
    try {
      const projectId = req.params.projectId;
      
      // Get all grades for this project
      const projectGrades = await collections.grades.find({ project_id: projectId.toString() }).toArray();
      
      if (projectGrades.length === 0) {
        return res.json({
          gradedBy: [],
          averageScore: null,
          totalScore: 0
        });
      }

      // Filter out default grades (all scores = 1)
      const validGrades = projectGrades.filter(grade => 
        !(grade.complexity === 1 && grade.usability === 1 && 
          grade.innovation === 1 && grade.presentation === 1 && 
          grade.proficiency === 1)
      );

      // Get judge names for valid grades
      const judgeIds = [...new Set(validGrades.map(grade => grade.judge_id))];
      const judges = await collections.users.find({ 
        ID: { $in: judgeIds.map(id => id.toString()) } 
      }).toArray();
      
      const judgeMap = {};
      judges.forEach(judge => {
        judgeMap[judge.ID] = judge.name;
      });

      // Create gradedBy array with judge names
      const gradedBy = validGrades.map(grade => ({
        judge_id: grade.judge_id,
        judge_name: judgeMap[grade.judge_id] || `Judge ${grade.judge_id}`,
        complexity: grade.complexity,
        usability: grade.usability,
        innovation: grade.innovation,
        presentation: grade.presentation,
        proficiency: grade.proficiency,
        grade: grade.grade,
        additionalComment: grade.additionalComment
      }));

      // Calculate average score
      const totalScore = validGrades.reduce((sum, grade) => sum + grade.grade, 0);
      const averageScore = validGrades.length > 0 ? totalScore / validGrades.length : null;

      res.json({
        gradedBy: gradedBy,
        averageScore: averageScore,
        totalScore: totalScore,
        totalJudges: validGrades.length
      });
    } catch (error) {
      console.error('Error fetching grade info:', error);
      res.status(500).json({ error: 'An error occurred while fetching grade information.' });
    }
  });

  // Migration route to convert numeric IDs to strings
  router.post('/migrate-grade-ids', async (req, res) => {
    try {
      const { migrateGradeIds } = require('./migration');
      await migrateGradeIds();
      res.json({ message: 'Migration completed successfully' });
    } catch (error) {
      console.error('Migration error:', error);
      res.status(500).json({ error: 'Migration failed' });
    }
  });

  // Get top 3 projects for podium
  router.get('/podium', async (req, res) => {
    try {
      console.log('Fetching top 3 projects for podium...');
      
      // Get all grades that are not default scores (exclude all "1" grades)
      const grades = await collections.grades.find({
        $or: [
          { complexity: { $ne: 1 } },
          { usability: { $ne: 1 } },
          { innovation: { $ne: 1 } },
          { presentation: { $ne: 1 } },
          { proficiency: { $ne: 1 } }
        ]
      }).toArray();

      console.log(`Found ${grades.length} valid grades`);

      if (grades.length === 0) {
        return res.json({ topProjects: [] });
      }

      // Group grades by project_id and calculate averages
      const projectGrades = {};
      
      grades.forEach(grade => {
        const projectId = grade.project_id;
        
        if (!projectGrades[projectId]) {
          projectGrades[projectId] = {
            projectId: projectId,
            grades: [],
            totalComplexity: 0,
            totalUsability: 0,
            totalInnovation: 0,
            totalPresentation: 0,
            totalProficiency: 0,
            count: 0
          };
        }
        
        projectGrades[projectId].grades.push(grade);
        projectGrades[projectId].totalComplexity += grade.complexity;
        projectGrades[projectId].totalUsability += grade.usability;
        projectGrades[projectId].totalInnovation += grade.innovation;
        projectGrades[projectId].totalPresentation += grade.presentation;
        projectGrades[projectId].totalProficiency += grade.proficiency;
        projectGrades[projectId].count++;
      });

      // Calculate averages and total scores
      const projectsWithAverages = Object.values(projectGrades).map(project => {
        const avgComplexity = project.totalComplexity / project.count;
        const avgUsability = project.totalUsability / project.count;
        const avgInnovation = project.totalInnovation / project.count;
        const avgPresentation = project.totalPresentation / project.count;
        const avgProficiency = project.totalProficiency / project.count;
        const averageTotal = avgComplexity + avgUsability + avgInnovation + avgPresentation + avgProficiency;
        
        return {
          projectId: project.projectId,
          avgComplexity,
          avgUsability,
          avgInnovation,
          avgPresentation,
          avgProficiency,
          averageTotal,
          gradeCount: project.count
        };
      });

      // Sort by average total score (descending) and get top 3
      const topProjects = projectsWithAverages
        .sort((a, b) => b.averageTotal - a.averageTotal)
        .slice(0, 3);

      console.log(`Top 3 projects found: ${topProjects.length}`);

      // Get project titles for the top projects
      const projectIds = topProjects.map(p => p.projectId.toString());
      console.log('Looking for projects with IDs:', projectIds);
      
      const projects = await collections.project_schemas.find({
        ProjectNumber: { $in: projectIds }
      }).toArray();

      console.log('Found projects:', projects.map(p => ({
        ProjectNumber: p.ProjectNumber,
        Title: p.Title
      })));

      // Create a map of project numbers to titles
      const projectMap = {};
      projects.forEach(project => {
        projectMap[project.ProjectNumber] = project.Title;
      });

      console.log('Project map:', projectMap);

      // Add project titles to top projects
      const topProjectsWithTitles = topProjects.map(project => ({
        ...project,
        projectTitle: projectMap[project.projectId.toString()] || `Project ${project.projectId}`
      }));

      console.log('Top projects with titles:', topProjectsWithTitles.map(p => ({
        title: p.projectTitle,
        score: p.averageTotal
      })));

      res.json({ topProjects: topProjectsWithTitles });
    } catch (error) {
      console.error('Error fetching podium data:', error);
      res.status(500).json({ error: 'Failed to fetch podium data' });
    }
  });

  // Get top 3 projects for podium (old format with categories)
  router.get('/podium2', async (req, res) => {
    try {
      console.log('Fetching podium data for old format...');
      
      // Get all grades that are not default scores (exclude all "1" grades)
      const grades = await collections.grades.find({
        $or: [
          { complexity: { $ne: 1 } },
          { usability: { $ne: 1 } },
          { innovation: { $ne: 1 } },
          { presentation: { $ne: 1 } },
          { proficiency: { $ne: 1 } }
        ]
      }).toArray();

      console.log(`Found ${grades.length} valid grades`);

      if (grades.length === 0) {
        return res.json({
          topOverallProjects: [],
          topComplexity: [],
          topUsability: [],
          topInnovation: [],
          topPresentation: [],
          topProficiency: []
        });
      }

      // Group grades by project_id and calculate averages
      const projectGrades = {};
      
      grades.forEach(grade => {
        const projectId = grade.project_id;
        
        if (!projectGrades[projectId]) {
          projectGrades[projectId] = {
            projectId: projectId,
            grades: [],
            totalComplexity: 0,
            totalUsability: 0,
            totalInnovation: 0,
            totalPresentation: 0,
            totalProficiency: 0,
            count: 0
          };
        }
        
        projectGrades[projectId].grades.push(grade);
        projectGrades[projectId].totalComplexity += grade.complexity;
        projectGrades[projectId].totalUsability += grade.usability;
        projectGrades[projectId].totalInnovation += grade.innovation;
        projectGrades[projectId].totalPresentation += grade.presentation;
        projectGrades[projectId].totalProficiency += grade.proficiency;
        projectGrades[projectId].count++;
      });

      // Calculate averages and total scores
      const projectsWithAverages = Object.values(projectGrades).map(project => {
        const avgComplexity = project.totalComplexity / project.count;
        const avgUsability = project.totalUsability / project.count;
        const avgInnovation = project.totalInnovation / project.count;
        const avgPresentation = project.totalPresentation / project.count;
        const avgProficiency = project.totalProficiency / project.count;
        const avgTotal = avgComplexity + avgUsability + avgInnovation + avgPresentation + avgProficiency;
        
        return {
          projectId: project.projectId,
          avgComplexity,
          avgUsability,
          avgInnovation,
          avgPresentation,
          avgProficiency,
          avgTotal,
          gradeCount: project.count
        };
      });

      // Get project details for all projects
      const projectIds = projectsWithAverages.map(p => p.projectId.toString());
      const projects = await collections.project_schemas.find({
        ProjectNumber: { $in: projectIds }
      }).toArray();

      // Create a map of project numbers to project details
      const projectMap = {};
      projects.forEach(project => {
        projectMap[project.ProjectNumber] = {
          title: project.ProjectTitle,
          image: project.ProjectImage || '/Assets/icons/project-default.png'
        };
      });

      // Add project details to projects with averages
      const projectsWithDetails = projectsWithAverages.map(project => ({
        ...project,
        title: projectMap[project.projectId.toString()]?.title || `Project ${project.projectId}`,
        image: projectMap[project.projectId.toString()]?.image || '/Assets/icons/project-default.png'
      }));

      // Sort by different categories and get top 3 for each
      const topOverallProjects = [...projectsWithDetails]
        .sort((a, b) => b.avgTotal - a.avgTotal)
        .slice(0, 3);

      const topComplexity = [...projectsWithDetails]
        .sort((a, b) => b.avgComplexity - a.avgComplexity)
        .slice(0, 3);

      const topUsability = [...projectsWithDetails]
        .sort((a, b) => b.avgUsability - a.avgUsability)
        .slice(0, 3);

      const topInnovation = [...projectsWithDetails]
        .sort((a, b) => b.avgInnovation - a.avgInnovation)
        .slice(0, 3);

      const topPresentation = [...projectsWithDetails]
        .sort((a, b) => b.avgPresentation - a.avgPresentation)
        .slice(0, 3);

      const topProficiency = [...projectsWithDetails]
        .sort((a, b) => b.avgProficiency - a.avgProficiency)
        .slice(0, 3);

      console.log('Podium data prepared for old format');

      res.json({
        topOverallProjects,
        topComplexity,
        topUsability,
        topInnovation,
        topPresentation,
        topProficiency
      });
    } catch (error) {
      console.error('Error fetching podium2 data:', error);
      res.status(500).json({ error: 'Failed to fetch podium2 data' });
    }
  });

  // Analytics endpoint for judge view
  router.get('/analytics/judge/:judgeId', async (req, res) => {
  try {
    const judgeId = parseInt(req.params.judgeId);

    // Get the judge's name from the users collection
    const judge = await collections.users.findOne({ ID: judgeId });
    const judgeName = judge ? judge.name : '';

    // Get all grades for this judge
    const judgeGrades = await collections.grades.find({ judge_id: judgeId }).toArray();

    if (judgeGrades.length === 0) {
      return res.json({ projects: [], judgeName });
    }

          // Get unique project IDs for this judge
      const projectIds = [...new Set(judgeGrades.map(grade => grade.project_id))];
      
      // Get project details
      const projects = await collections.project_schemas.find({
        ProjectNumber: { $in: projectIds }
      }).toArray();

      // Create a map of project details
      const projectMap = {};
      projects.forEach(project => {
        projectMap[project.ProjectNumber] = project.Title;
      });

          // Calculate averages for each project
      const projectAnalytics = projectIds.map(projectId => {
        const projectGrades = judgeGrades.filter(grade => grade.project_id === projectId);

        if (projectGrades.length === 0) return null;

        const avgComplexity = projectGrades.reduce((sum, grade) => sum + grade.complexity, 0) / projectGrades.length;
        const avgUsability = projectGrades.reduce((sum, grade) => sum + grade.usability, 0) / projectGrades.length;
        const avgInnovation = projectGrades.reduce((sum, grade) => sum + grade.innovation, 0) / projectGrades.length;
        const avgPresentation = projectGrades.reduce((sum, grade) => sum + grade.presentation, 0) / projectGrades.length;
        const avgProficiency = projectGrades.reduce((sum, grade) => sum + grade.proficiency, 0) / projectGrades.length;
        const avgTotal = projectGrades.reduce((sum, grade) => sum + grade.grade, 0) / projectGrades.length;

        return {
          projectId,
          title: projectMap[projectId] || '',
        avgComplexity,
        avgUsability,
        avgInnovation,
        avgPresentation,
        avgProficiency,
        avgTotal
      };
    }).filter(project => project !== null);

    res.json({ projects: projectAnalytics, judgeName });
  } catch (error) {
    console.error('Error fetching judge analytics:', error);
    res.status(500).json({ error: 'An error occurred while fetching judge analytics' });
  }
});

  // Analytics endpoint for project view
  router.get('/analytics/project/:projectId', async (req, res) => {
    try {
      const projectId = req.params.projectId; // Keep as string to match ProjectNumber
      
      // First, get the project to verify it exists
      const project = await collections.project_schemas.findOne({ ProjectNumber: projectId });
      
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      
      // Convert projectId to number for grades collection query
      const projectIdNumber = parseInt(projectId);
      
      // Get all grades for this project
      const projectGrades = await collections.grades.find({ project_id: projectIdNumber }).toArray();
      
      if (projectGrades.length === 0) {
        return res.json({ judges: [] });
      }

      // Get unique judge IDs for this project
      const judgeIds = [...new Set(projectGrades.map(grade => grade.judge_id))];
      console.log('Judge IDs from grades:', judgeIds);
      
      // Get all judges from users collection
      const allJudges = await collections.users.find({}).toArray();
      
      // Create judge map using string matching
      const judgeMap = {};
      judgeIds.forEach(judgeId => {
        const judge = allJudges.find(u => u.ID === judgeId.toString());
        if (judge) {
          judgeMap[judgeId] = judge.name;
          console.log(`Found judge ${judgeId} -> ${judge.name}`);
        }
      });
      
      // Strategy 3: Look for judges with type 'judge' and numeric match
      judgeIds.forEach(judgeId => {
        if (!judgeMap[judgeId]) {
          const judge = allJudges.find(u => {
            if (u.type !== 'judge') return false;
            const userIDNum = parseInt(u.ID);
            const judgeIDNum = parseInt(judgeId);
            return userIDNum === judgeIDNum;
          });
          if (judge) {
            judgeMap[judgeId] = judge.name;
            console.log(`Strategy 3 - Found judge ${judgeId} -> ${judge.name}`);
          }
        }
      });
      
      // Strategy 4: Try exact string match for judge type
      judgeIds.forEach(judgeId => {
        if (!judgeMap[judgeId]) {
          const judge = allJudges.find(u => {
            if (u.type !== 'judge') return false;
            return u.ID === judgeId.toString();
          });
          if (judge) {
            judgeMap[judgeId] = judge.name;
            console.log(`Strategy 4 - Found judge ${judgeId} -> ${judge.name}`);
          }
        }
      });
      
      console.log('Final judge map:', judgeMap);

      // Get individual grades for each judge
      const judgeAnalytics = judgeIds.map(judgeId => {
        const judgeGrade = projectGrades.find(grade => grade.judge_id === judgeId);
        
        if (!judgeGrade) return null;

        const judgeName = judgeMap[judgeId];
        console.log(`Judge ID ${judgeId} (${typeof judgeId}) -> Name: ${judgeName}`);

        return {
          judgeId: judgeId,
          name: judgeName || `Judge ${judgeId} (Not Found)`,
          complexity: judgeGrade.complexity,
          usability: judgeGrade.usability,
          innovation: judgeGrade.innovation,
          presentation: judgeGrade.presentation,
          proficiency: judgeGrade.proficiency,
          totalGrade: judgeGrade.grade
        };
      }).filter(judge => judge !== null);

      res.json({ judges: judgeAnalytics });
    } catch (error) {
      console.error('Error fetching project analytics:', error);
      res.status(500).json({ error: 'An error occurred while fetching project analytics' });
    }
  });

  // Analytics endpoint for grade distribution
  router.get('/analytics/distribution', async (req, res) => {
    try {
      // Get all grades from the database
      const allGrades = await collections.grades.find({}).toArray();
      
      // Filter out default grades (all scores = 1)
      const validGrades = allGrades.filter(grade => {
        return !(grade.complexity === 1 && grade.usability === 1 && 
                grade.innovation === 1 && grade.presentation === 1 && 
                grade.proficiency === 1);
      });

      // Calculate total counts
      const totalGrades = allGrades.length;
      const gradedCount = validGrades.length;
      const pendingCount = totalGrades - gradedCount;

      // Get unique project IDs from grades
      const gradedProjectIds = [...new Set(validGrades.map(grade => parseInt(grade.project_id)))];
      const allGradedProjectIds = [...new Set(allGrades.map(grade => parseInt(grade.project_id)))];
      
      // Get all projects from project_schemas
      const allProjects = await collections.project_schemas.find({}).toArray();
      const allProjectIds = allProjects.map(project => parseInt(project.ProjectNumber));
      
      // Calculate unique project statistics
      const uniqueGradedProjects = gradedProjectIds.length;
      const uniqueNotGradedProjects = allGradedProjectIds.length - uniqueGradedProjects;
      const notAssignedProjects = allProjectIds.filter(projectId => !allGradedProjectIds.includes(projectId)).length;

      // Calculate grade distribution in ranges of 5 (10-14, 15-19, etc.)
      const gradeDistribution = {};
      for (let i = 10; i <= 50; i += 5) {
        const rangeStart = i;
        const rangeEnd = i + 4;
        const rangeKey = `${rangeStart}-${rangeEnd}`;
        gradeDistribution[rangeKey] = 0;
      }

      // Count grades in each range, rounding appropriately
      validGrades.forEach(grade => {
        let totalGrade = grade.grade;
        
        // Round the grade: floor if < 0.5, ceiling if >= 0.5
        if (totalGrade % 1 !== 0) {
          const decimal = totalGrade % 1;
          if (decimal < 0.5) {
            totalGrade = Math.floor(totalGrade);
          } else {
            totalGrade = Math.ceil(totalGrade);
          }
        }
        
        // Assign to appropriate range (10-14, 15-19, etc.)
        if (totalGrade >= 10 && totalGrade <= 54) {
          const rangeStart = Math.floor((totalGrade - 10) / 5) * 5 + 10;
          const rangeEnd = rangeStart + 4;
          const rangeKey = `${rangeStart}-${rangeEnd}`;
          gradeDistribution[rangeKey]++;
        }
      });

      // Get total projects and judges counts
      const totalProjects = await collections.project_schemas.countDocuments({});
      const totalJudges = await collections.users.countDocuments({ type: 'judge' });

      // Debug logging
      console.log('Distribution Analytics Debug:');
      console.log('Total projects in system:', totalProjects);
      console.log('All project IDs:', allProjectIds);
      console.log('All graded project IDs (including defaults):', allGradedProjectIds);
      console.log('Graded project IDs (valid grades only):', gradedProjectIds);
      console.log('Unique graded projects:', uniqueGradedProjects);
      console.log('Unique not graded projects:', uniqueNotGradedProjects);
      console.log('Not assigned projects:', notAssignedProjects);
      console.log('Sum check:', uniqueGradedProjects + uniqueNotGradedProjects + notAssignedProjects);
      console.log('Grade distribution:', gradeDistribution);

      res.json({
        totalProjects,
        totalJudges,
        gradedCount,
        pendingCount,
        uniqueGradedProjects,
        uniqueNotGradedProjects,
        notAssignedProjects,
        gradeDistribution
      });
    } catch (error) {
      console.error('Error fetching distribution analytics:', error);
      res.status(500).json({ error: 'An error occurred while fetching distribution analytics' });
    }
  });

  // Get assignment status for all projects
  router.get('/projects/assignmentStatus', async (req, res) => {
    try {
      // Get all projects
      const allProjects = await collections.project_schemas.find({}).toArray();
      
      // Get all assignments from projects_judges_groups
      const allAssignments = await collections.projects_judges_groups.find({}).toArray();
      
      // Create a set of assigned project IDs
      const assignedProjectIds = new Set();
      allAssignments.forEach(assignment => {
        assignment.project_ids.forEach(projectId => {
          assignedProjectIds.add(projectId);
        });
      });
      
      // Map projects with assignment status
      const projectsWithStatus = allProjects.map(project => ({
        projectId: project.ProjectNumber,
        title: project.Title,
        isAssigned: assignedProjectIds.has(project.ProjectNumber.toString())
      }));
      
      res.json(projectsWithStatus);
    } catch (error) {
      console.error('Error fetching project assignment status:', error);
      res.status(500).json({ error: 'An error occurred while fetching project assignment status' });
    }
  });

  })
  .catch((err) => {
    console.error('Error getting collections:', err);
  });


module.exports = router;
