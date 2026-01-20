const express = require('express');
const { usersService } = require('../../services/user');
const router = express.Router();
const { getCollections } = require('../../DB/index');
const Grade = require('../../DB/entities/grade.entity'); // Ensure this is the correct path
const { authenticateToken, authorizeAdmin, authorizeJudge, authorizeTypes } = require('../../middleware/auth');
const { login, registerFullInfo, checkToken } = require('../../controllers/auth');
const { updateUserField } = require('../../controllers/user');


router.post('/login', login);

router.post('/add-id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { ID } = req.body;
    // User is already authenticated and authorized as admin via middleware
    // Add your logic here to handle ID addition
    res.json({ success: true, message: 'ID added successfully' });
  } catch (error) {
    console.error('Add ID error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.post('/registerFullInfo', registerFullInfo);

router.post("/example-guarded-data", authenticateToken, authorizeTypes('admin', 'judge'), async (req, res) => {
  const user = req.user; // User is already authenticated via middleware
  if (user.type === "admin") {
    // admin logic
  } else if (user.type === "judge") {
    // judge logic
  }
  res.json({ success: true });
})

router.post('/check-token', checkToken);

router.get('/preferences/user', authenticateToken, async (req, res) => {
  try {
    const userPreferences = await usersService.getUserPreferences(req.user.id);
    res.json(userPreferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.get('/preferences', getPreferences);

router.post('/preferences/add', authenticateToken, async (req, res) => {
  try {
    const { preferenceId } = req.body;
    const result = await usersService.addPreference(req.user.id, preferenceId);

    if (result.success) {
      res.json({ success: true, message: 'Preference added successfully' });
    } else {
      res.json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error adding preference:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.post('/preferences/remove', authenticateToken, removePreference);

router.post('/preferences/save', authenticateToken, savePreferences);


router.post('/user/updateField', authenticateToken, updateUserField);

getCollections()
  .then((collections) => {
    router.get('/projects/:projectId/grade', authenticateToken, async (req, res) => {
      try {
        // Use the judge's ID (from the verified token) and the provided project ID
        const judge_id = req.user.id;
        const projectId = req.params.projectId;

        // Look up the grade document for this project and judge
        const grade = await collections.grades.findOne({ project_id: projectId.toString(), judge_id: judge_id.toString() });
        if (!grade) {
          return res.status(404).json({ error: 'Grade not found for this project.' });
        }

        // Return the grade info
        res.status(200).json({ gradeInfo: grade });
      } catch (error) {
        console.error('Error retrieving grade:', error);
        res.status(500).json({ error: 'An error occurred while retrieving the grade.' });
      }
    });

  })

// Assuming getCollections is defined elsewhere and returns a promise with the collections

getCollections()
  .then((collections) => {
    router.get('/projectsForJudge/projectList', authenticateToken, async (req, res) => {
      try {
        const queryForGroups = { judge_ids: { $in: [req.user.id] } };
        const cursor = await collections.projects_judges_groups.find(queryForGroups);
        const matchingProjectGroups = await cursor.toArray();
    
        // Extract distinct project IDs
        const projectIds = [];
        matchingProjectGroups.forEach((group) => {
          if (group.project_ids && Array.isArray(group.project_ids)) {
            group.project_ids.forEach((pId) => {
              if (!projectIds.includes(pId)) {
                projectIds.push(pId);
              }
            });
          }
        });
    
        console.log('projectIds:', projectIds);
    
        // Base filter: projects that match the judge's allowed projects
        const filter = { ProjectNumber: { $in: projectIds } };
        // Check for search params and add filtering if provided
        const { searchTerm, searchField } = req.query;
        if (searchTerm && searchField) {
          filter[searchField] = { $regex: searchTerm, $options: 'i' }; // case-insensitive regex match
        }
    
        // Find projects matching the filter
        const projectsCursor = await collections.project_schemas.find(filter);
        const projects = await projectsCursor.toArray();
    
        res.json({ projects });
      } catch (error) {
        console.error('Error fetching projects:', error);
        res.status(500).json({ error: 'An error occurred while fetching projects' });
      }
    });
  })
  .catch((error) => {
    console.error('Error setting up routes:', error);
  });

  getCollections()
  .then((collections) => {
    router.post('/gradeProject', authenticateToken, authorizeJudge, async (req, res) => {
      try {
        const judge_id = req.user.id; // Extract the judge's ID from the authenticated user
        const grades = req.body; // Get the grades from the request body
        const projectId = req.query.projectId || req.body.project_id; // Get the project ID from the query string

        if (!projectId) {
          return res.status(400).json({ error: 'Project ID is required.' });
        }

        // Check if the grade already exists for this judge and project
        const existingGrade = await collections.grades.findOne({ judge_id: judge_id.toString(), project_id: projectId.toString() });
        
        // Calculate the total grade
        const totalGrade = grades.complexity + grades.usability + grades.innovation + grades.presentation + grades.proficiency;

        if (existingGrade) {
          // Update existing grade document
          await collections.grades.updateOne(
            { judge_id: judge_id.toString(), project_id: projectId.toString() },
            { $set: {
                complexity: grades.complexity,
                usability: grades.usability,
                innovation: grades.innovation,
                presentation: grades.presentation,
                proficiency: grades.proficiency,
                additionalComment: grades.additionalComment || '',
                grade: totalGrade,
                updatedAt: new Date()
              }
            }
          );
        } else {
          // Create a new grade document
          const newGrade = {
            project_id: projectId.toString(),
            judge_id: judge_id.toString(),
            complexity: grades.complexity,
            usability: grades.usability,
            innovation: grades.innovation,
            presentation: grades.presentation,
            proficiency: grades.proficiency,
            additionalComment: grades.additionalComment || '',
            grade: totalGrade,
            createdAt: new Date(),
            updatedAt: new Date(),
          };

          await collections.grades.insertOne(newGrade);
        }
        res.status(201).json({ message: 'Grade submitted successfully.' });
      } catch (error) {
        console.error('Error submitting grade:', error);
        res.status(500).json({ error: 'An error occurred while submitting the grade.' });
      }
    });
  })
  .catch((error) => {
    console.error('Error setting up routes:', error);
  });


  getCollections()
  .then((collections) => {
    router.put('/gradeProject', authenticateToken, authorizeJudge, async (req, res) => {
      try {
        const judge_id = req.user.id; // Extract the judge's ID from the authenticated user
        const grades = req.body;    // Get the grades from the request body
        const projectId = req.query.projectId || req.body.project_id; // Get the project ID from the query string

        if (!projectId) {
          return res.status(400).json({ error: 'Project ID is required.' });
        }

        // Calculate the new total grade
        const totalGrade =
          grades.complexity +
          grades.usability +
          grades.innovation +
          grades.presentation +
          grades.proficiency;

        // Update the existing grade document
        const updateResult = await collections.grades.updateOne(
          { project_id: projectId.toString(), judge_id: judge_id.toString() },
          { $set: {
              complexity: grades.complexity,
              usability: grades.usability,
              innovation: grades.innovation,
              presentation: grades.presentation,
              proficiency: grades.proficiency,
              additionalComment: grades.additionalComment || '',
              grade: totalGrade,
              updatedAt: new Date()
            }
          }
        );

        if (updateResult.matchedCount === 0) {
          return res.status(404).json({ error: 'Grade not found for this project.' });
        }

        res.status(200).json({ message: 'Grade updated successfully.' });
      } catch (error) {
        console.error('Error updating grade:', error);
        res.status(500).json({ error: 'An error occurred while updating the grade.' });
      }
    });
  })
  .catch((error) => {
    console.error('Error setting up routes:', error);
  });

  // Combined endpoint to get both assigned and graded counts for the judge
getCollections()
.then((collections) => {
  router.get('/judge/counts', authenticateToken, authorizeJudge, async (req, res) => {
    try {
      // Get total assigned projects count
      const query = { judge_ids: { $in: [req.user.id] } };
      const cursor = await collections.projects_judges_groups.find(query);
      const groups = await cursor.toArray();
      const projectIds = [];
      groups.forEach((group) => {
        if (group.project_ids && Array.isArray(group.project_ids)) {
          group.project_ids.forEach((pid) => {
            if (!projectIds.includes(pid)) {
              projectIds.push(pid);
            }
          });
        }
      });
      const totalAssigned = projectIds.length;

      // Get total graded projects count (only where all criteria are non-null)
      const totalGraded = await collections.grades.countDocuments({
        judge_id: req.user.id.toString(),
        complexity: { $ne: null },
        usability: { $ne: null },
        innovation: { $ne: null },
        presentation: { $ne: null },
        proficiency: { $ne: null }
      });

      res.status(200).json({ totalAssigned, totalGraded });
    } catch (error) {
      console.error('Error retrieving judge counts:', error);
      res.status(500).json({ error: 'An error occurred while retrieving judge counts.' });
    }
  });
})
.catch((error) => {
  console.error('Error setting up judge counts route:', error);
});

getCollections()
  .then((collections) => {
    router.get('/current-judge', authenticateToken, authorizeJudge, async (req, res) => {
      try {
        // Search for the judge record in the users collection.
        // Adjust the query fields to match your database (e.g. "ID" vs. "id" or the _id)
        const judgeData = await collections.users.findOne({
          $or: [
            { ID: req.user.ID },
            { ID: req.user.id },
            { _id: req.user._id }
          ]
        });

        if (!judgeData) {
          return res.status(404).json({ error: 'Judge not found in the database.' });
        }

        res.status(200).json(judgeData);
      } catch (error) {
        console.error('Error retrieving judge data:', error);
        res.status(500).json({ error: 'An error occurred while retrieving judge data.' });
      }
    });
  })
  .catch((error) => {
    console.error('Error setting up /current-judge route:', error);
  });

module.exports = router;