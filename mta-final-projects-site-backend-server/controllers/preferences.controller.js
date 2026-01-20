const { usersService } = require('../Routers/users/users.service');

/**
 * Get user's preferences
 * GET /preferences/user
 * Requires authentication
 */
const getUserPreferences = async (req, res) => {
  try {
    const userPreferences = await usersService.getUserPreferences(req.user.id);
    res.json(userPreferences);
  } catch (error) {
    console.error('Error fetching user preferences:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * Get all available preferences
 * GET /preferences
 */
const getPreferences = async (req, res) => {
  try {
    const preferences = await usersService.getPreferences();
    res.json(preferences);
  } catch (error) {
    console.error('Error fetching preferences:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * Add a preference to user's preferences
 * POST /preferences/add
 * Requires authentication
 */
const addPreference = async (req, res) => {
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
};

/**
 * Remove a preference from user's preferences
 * POST /preferences/remove
 * Requires authentication
 */
const removePreference = async (req, res) => {
  try {
    const { preferenceId } = req.body;
    const result = await usersService.removePreference(req.user.id, preferenceId);

    if (result.success) {
      res.json({ success: true, message: 'Preference removed successfully' });
    } else {
      res.json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error removing preference:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

/**
 * Save user's preferences (replace all)
 * POST /preferences/save
 * Requires authentication
 */
const savePreferences = async (req, res) => {
  try {
    const { preferences } = req.body;
    const result = await usersService.savePreferences(req.user.id, preferences);

    if (result.success) {
      res.json({ success: true, message: 'Preferences saved successfully' });
    } else {
      res.json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error saving preferences:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = {
  getUserPreferences,
  getPreferences,
  addPreference,
  removePreference,
  savePreferences,
};
