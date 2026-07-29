const express = require('express');
//const { usersService } = require('../../services/user'); not used ATM.
const router = express.Router();//'router' is an instance created by the Router() factory function(prop of express)
const { getCollections } = require('../../DB/index');
const Grade = require('../../DB/entities/grade.entity'); // Ensure this is the correct path
const { authenticateToken, authorizeAdmin, authorizeJudge, authorizeTypes } = require('../../middleware/auth');
const { login, registerFullInfo, checkToken } = require('../../controllers/auth');
const { updateUserField } = require('../../controllers/user');
const { getUserPreferences, getPreferences, addPreference, removePreference, savePreferences } = require('../../controllers/preferences');
const { getProjectGrade, getProjectsForJudge, submitGrade, updateGrade, getJudgeCounts, getCurrentJudge } = require('../../controllers/grade');


router.post('/login', login);
/*
When a POST /add-id request arrives, Express runs them in this order:
authenticateToken -> authorizeAdmin -> final async handler
Each middleware calls next();
Without await, async doesn't do much.
req  -> Everything the client sent.
res  -> Everything we'll send back.
Client -> Express receives request -> Middleware -> Route handler -> res.json(...) -> Response sent back to client
*/
router.post('/add-id', authenticateToken, authorizeAdmin, async (req, res) => {
  try {
    const { ID } = req.body;
    res.json({ success: true, message: 'ID added successfully' });
  } catch (error) {
    /*
    The server does two different things:
    1.Log the detailed error
    2.Send a generic message (for the client)
    */
    console.error('Add ID route failed:', error);
    res.status(500).json({ success: false, error: 'Server error' });//500 is Internal Server Error.

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
router.get('/preferences/user', authenticateToken, getUserPreferences);
router.get('/preferences', getPreferences);
router.post('/preferences/add', authenticateToken, addPreference);
router.post('/preferences/remove', authenticateToken, removePreference);
router.post('/preferences/save', authenticateToken, savePreferences);
router.post('/user/updateField', authenticateToken, updateUserField);

/*
getCollections() returns a Promise.
Only after the collections are available, it registers the route.

*/
getCollections()
  .then((collections) => {
    router.get(
      '/projects/:projectId/grade',
      authenticateToken,
      getProjectGrade(collections)
    );
  })

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


/*
Exports the configured router object, then another file can import it and mount it.
*/
module.exports = router;