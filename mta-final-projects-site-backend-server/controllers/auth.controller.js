const { usersService } = require('../Routers/users/users.service');

/**
 * Handle user login
 * POST /login
 */
const login = async (req, res) => {
  try {
    const { userID, password } = req.body;
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
