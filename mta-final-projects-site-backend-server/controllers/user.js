const { usersService } = require('../services/user');

/**
 * Update a single user field (name, email, password, avatar)
 * POST /user/updateField
 * Requires authentication (relies on req.user.id from auth middleware)
 */
const updateUserField = async (req, res) => {
  try {
    const { field, newValue } = req.body;
    const result = await usersService.updateUserField(req.user.id, field, newValue);

    if (result.success) {
      res.json({ success: true, message: 'saved successfully' });
    } else {
      res.json({ success: false, error: result.error });
    }
  } catch (error) {
    console.error('Error saving field:', error);
    res.status(500).json({ success: false, error: 'Server error' });
  }
};

module.exports = {
  updateUserField,
};

