const express = require('express');
const { usersService } = require('../../services/user');
const router = express.Router();
const { getCollections } = require('../../DB/index');
const Grade = require('../../DB/entities/grade.entity'); // Ensure this is the correct path
const { authenticateToken, authorizeAdmin, authorizeJudge, authorizeTypes } = require('../../middleware/auth');
const { login, registerFullInfo, checkToken } = require('../../controllers/auth');
const { updateUserField } = require('../../controllers/user');
const { getProjectGrade, getProjectsForJudge, submitGrade, updateGrade, getJudgeCounts, getCurrentJudge } = require('../../controllers/grade');


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
    router.get(
      '/projects/:projectId/grade',
      authenticateToken,
      getProjectGrade(collections)
    );
  })

// Assuming getCollections is defined elsewhere and returns a promise with the collections

getCollections()
  .then((collections) => {
    router.get(
      '/projectsForJudge/projectList',
      authenticateToken,
      getProjectsForJudge(collections)
    );
  })
  .catch((error) => {
    console.error('Error setting up routes:', error);
  });

  getCollections()
  .then((collections) => {
    router.post(
      '/gradeProject',
      authenticateToken,
      authorizeJudge,
      submitGrade(collections)
    );
  })
  .catch((error) => {
    console.error('Error setting up routes:', error);
  });


  getCollections()
  .then((collections) => {
    router.put(
      '/gradeProject',
      authenticateToken,
      authorizeJudge,
      updateGrade(collections)
    );
  })
  .catch((error) => {
    console.error('Error setting up routes:', error);
  });

  // Combined endpoint to get both assigned and graded counts for the judge
getCollections()
.then((collections) => {
  router.get(
    '/judge/counts',
    authenticateToken,
    authorizeJudge,
    getJudgeCounts(collections)
  );
})
.catch((error) => {
  console.error('Error setting up judge counts route:', error);
});

getCollections()
  .then((collections) => {
    router.get(
      '/current-judge',
      authenticateToken,
      authorizeJudge,
      getCurrentJudge(collections)
    );
  })
  .catch((error) => {
    console.error('Error setting up /current-judge route:', error);
  });

module.exports = router;