/*
handle authentication-related HTTP requests.
It acts as a bridge:
Frontend request
→ Express route
→ auth controller
→ usersService business logic/database work
→ HTTP JSON response back to frontend

the backend uses require(...), while the React frontend mostly uses import.
equivalent to:
const userModule = require('../services/user');
const usersService = userModule.usersService;
destructuring, extracts the property from the exported object
const importedValue = require('../services/user') would be an object like:
{
  usersService: <UsersService instance>
}
*/
const { usersService } = require('../services/user');

/**
 * Handle user login
 * POST /login
 */
const login = async (req, res) => {
  try {
    /* object destructuring, req.body is the request body sent by the frontend and parsed by Express’s
    JSON middleware. Afterward, this controller has two local variables: userID, password.
    */
    const { userID, password } = req.body;
    /*
    asynchronous because it needs database access, returns a Promise.
    await waits for that Promise to settle, without blocking the Node.js server.
    This await runs on the backend server
    */
    const userRes = await usersService.checkLoginDetails(userID, password);

    if (userRes.success) {
      res.json(userRes);
    } else {
      res.json({ success: false, error: userRes.error });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * Handle user registration with full details
 * POST /registerFullInfo
 */
const registerFullInfo = async (req, res) => {
  const { userID, fullName, email, type, password } = req.body;
  try {
    const result = await usersService.registerNewUserWithFullDetails(userID, fullName, email, type, password);
    if (result.success) {
      res.json({ success: true, message: 'Registration successful' });
    } else {
      res.json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * Check if a token is valid
 * POST /check-token
 */
const checkToken = async (req, res) => {
  try {
    const { token } = req.body;
    const user = await usersService.checkToken(token); // Uses verifyToken internally
    if (!user) {
      return res.json({
        success: false,
        error: "Failed to auth"
      });
    }
    const userToReturn = { type: user.type, name: user.name, avatar: user.avatar || 'default' };
    res.json({ success: true, user: userToReturn });
  } catch (error) {
    console.error('Check token error:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = {
  login,
  registerFullInfo,
  checkToken,
};
