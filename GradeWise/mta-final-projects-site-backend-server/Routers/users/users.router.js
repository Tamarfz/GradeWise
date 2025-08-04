const express = require('express');
const { usersSerivce } = require('./users.service');
const router = express.Router();
const { getCollections } = require('../../DB/index');
const Grade = require('../../DB/entities/grade.entity'); // Ensure this is the correct path


router.post('/login', async (req, res) => {
  try {
    const { userID, password } = req.body;
    const userRes = await usersSerivce.checkLoginDetails(userID, password);

    if (userRes.success) {
      res.json(userRes);
    } else {
      res.json({ success: false, error: userRes.error });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.post('/add-id', async (req, res) => {
  try {
    const { token, ID } = req.body;
    const userRes = usersSerivce.addId("/add-id", token, ID);

    // More sophisticated logic can be added here to handle login
    res.json(userRes);
  } catch (error) {
    console.log(error);
  }
});

router.post('/registerFullInfo', async (req, res) => {
  const { userID, fullName, email, type, password } = req.body;
  try {
    const result = await usersSerivce.registerNewUserWithFullDetails(userID, fullName, email, type, password);
    if (result.success) {
      res.json({ success: true, message: 'Registration successful' });
    } else {
      res.json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.post("/example-guarded-data", async (req, res) => {
  const { token } = req.body;
  const user = await usersSerivce.checkToken(token);
  if (user?.type === "admin") {
    // admin logic
  } else if (user?.type === "judge") {
    // judge logic
  }
  // kick them out
})

router.post('/check-token', async (req, res) => {
  try {
    const { token } = req.body;
    const user = await usersSerivce.checkToken(token);
    if (!user) {
      return res.json({
        success: false,
        error: "Failed to auth"
      });
    }
    const userToReturn =  { type: user.type, name: user.name };
    res.json({ success: true, user: userToReturn });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.get('/preferences/user', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = await usersSerivce.checkToken(token);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const userPreferences = await usersSerivce.getUserPreferences(user.id);
    res.json(userPreferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.get('/preferences', async (req, res) => {
  try {
    const preferences = await usersSerivce.getPreferences();
    res.json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.post('/preferences/add', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = await usersSerivce.checkToken(token);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const { preferenceId } = req.body;
    const result = await usersSerivce.addPreference(user.id, preferenceId);

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

router.post('/preferences/remove', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = await usersSerivce.checkToken(token);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const { preferenceId } = req.body;
    const result = await usersSerivce.removePreference(user.id, preferenceId);

    if (result.success) {
      res.json({ success: true, message: 'Preference removed successfully' });
    } else {
      res.json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error removing preference:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

router.post('/preferences/save', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = await usersSerivce.checkToken(token);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const { preferences } = req.body;
    const result = await usersSerivce.savePreferences(user.id, preferences);

    if (result.success) {
      res.json({ success: true, message: 'Preferences saved successfully' });
    } else {
      res.json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});


router.post('/user/updateField', async (req, res) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const user = await usersSerivce.checkToken(token);

    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const { field,newValue } = req.body;
    const result = await usersSerivce.updateUserField(user.id, field,newValue);

    if (result.success) {
      res.json({ success: true, message: 'saved successfully' });
    } else {
      res.json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error saving field:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

getCollections()
  .then((collections) => {
    router.get('/projects/:projectId/grade', async (req, res) => {
      try {
        // Extract token from the Authorization header
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
          return res.status(401).json({ error: 'Unauthorized: No token provided.' });
        }

        // Verify the token and get user info
        const user = await usersSerivce.checkToken(token);
        if (!user) {
          return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
        }

        // Use the judge's ID (from the verified token) and the provided project ID
        const judge_id = user.id;
        const projectId = req.params.projectId;

        // Look up the grade document for this project and judge
        const grade = await collections.grades.findOne({ project_id: projectId, judge_id });
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
    router.get('/projectsForJudge/projectList', async (req, res) => {
      try {
        const token = req.headers.authorization.split(' ')[1];
        const user = await usersSerivce.checkToken(token);
    
        if (!user) {
          return res.status(401).json({ error: 'Unauthorized' });
        }
    
        console.log('Fetching from projectsJudgesGroups for judge id:', user.id);
        const queryForGroups = { judge_ids: { $in: [user.id] } };
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
    router.post('/gradeProject', async (req, res) => {
      try {
        // Verify the token and get the user info
        console.log(req);
        console.log(req.headers.authorization);
        const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
        if (!token) {
          return res.status(401).json({ error: 'Unauthorized: No token provided.' });
        }

        const user = await usersSerivce.checkToken(token);
        if (!user) {
          return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
        }

        const judge_id = user.id; // Extract the judge's ID from the user object
        const grades = req.body; // Get the grades from the request body
        const projectId = req.query.projectId || req.body.project_id; // Get the project ID from the query string

        if (!projectId) {
          return res.status(400).json({ error: 'Project ID is required.' });
        }

        // Check if the grade already exists for this judge and project
        // const existingGrade = await collections.grades.findOne({ judge_id, project_id: projectId });
        // if (existingGrade) {
        //   return res.status(400).json({ error: 'Grade for this project already exists for this judge.' });
        // }

        // Calculate the total grade
        const totalGrade = grades.complexity + grades.usability + grades.innovation + grades.presentation + grades.proficiency;

        // Create a new grade document
        const newGrade = {
          project_id: projectId,
          judge_id: judge_id,
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
    router.put('/gradeProject', async (req, res) => {
      try {
        // Verify the token and get the user info
        console.log(req);
        console.log(req.headers.authorization);
        const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
        if (!token) {
          return res.status(401).json({ error: 'Unauthorized: No token provided.' });
        }

        const user = await usersSerivce.checkToken(token);
        if (!user) {
          return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
        }

        const judge_id = user.id; // Extract the judge's ID from the user object
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
          { project_id: projectId, judge_id },
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
  router.get('/judge/counts', async (req, res) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided.' });
      }
      const user = await usersSerivce.checkToken(token);
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
      }

      // Get total assigned projects count
      const query = { judge_ids: { $in: [user.id] } };
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

      // Get total graded projects count
      const totalGraded = await collections.grades.countDocuments({ judge_id: user.id });

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
    router.get('/current-judge', async (req, res) => {
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

        // Ensure that the current user is a judge
        if (userFromToken.type !== 'judge') {
          return res.status(403).json({ error: 'Forbidden: Current user is not a judge.' });
        }

        // Log the token payload for debugging (optional)
        console.log('userFromToken:', userFromToken);

        // Search for the judge record in the users collection.
        // Adjust the query fields to match your database (e.g. "ID" vs. "id" or the _id)
        const judgeData = await collections.users.findOne({
          $or: [
            { ID: userFromToken.ID },
            { ID: userFromToken.id },
            { _id: userFromToken._id }
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