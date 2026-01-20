const potentialUserDB = require("../../DB/entities/potential_users.entity");
const UserDB = require("../../DB/entities/user.entity");
const bcrypt = require('bcryptjs');
const availablePreferencesDB = require("../../DB/entities/available_preferences.entity");
const { generateToken } = require("../middleware/auth");

const FAILED_RESULT = {
  success: false,
};

class UsersService {
  checkLoginDetails = async (userID, password) => {
    try {
      const user = await UserDB.findOne({ ID: userID }).lean();
      if (!user) {
        return {
          success: false,
          error: "User not found"
        };
      }
      
      // Check if password matches (supports both hashed and plaintext for migration)
      const isPasswordValid = user.password.startsWith('$2') 
        ? await bcrypt.compare(password, user.password)
        : user.password === password;
      
      if (!isPasswordValid) {
        return {
          success: false,
          error: "Invalid password"
        };
      }
      const token = generateToken({
        id: user.ID,
        name: user.name,
        email: user.email,
        type: user.type,
        avatar: user.avatar || 'default'
      });
      return {
        success: true,
        token,
        user: {
          type: user.type,
          name: user.name,
          email: user.email,
          avatar: user.avatar || 'default'
        }
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        error: "Unknown server error - login"
      };
    }
  }

  // Note: Token verification should now be done via auth middleware
  // This method is kept for backward compatibility but will be deprecated
  async checkToken(token) {
    const { verifyToken } = require("../middleware/auth");
    return verifyToken(token);
  }

  // Deprecated: This method should be replaced with auth middleware in routers
  // Kept for backward compatibility during migration
  addId(path, token, ID) {
    const { verifyToken } = require("../middleware/auth");
    const user = verifyToken(token);
    
    if (!user) {
      return {
        success: false,
        error: "unauthorized"
      };
    }

    // Path-based authorization (legacy - should use middleware instead)
    const pathSecurity = {
      "/add-id": "admin",
      "/add-points": "judge"
    };
    
    const requiredPermissionType = pathSecurity[path];
    if (requiredPermissionType && user.type !== requiredPermissionType) {
      return {
        success: false,
        error: "unauthorized"
      };
    }

    return { success: true };
  }

  async checkIfUserExistsInPotentialUsers(userID) {
    try {
      const user = await potentialUserDB.findOne({ ID: userID }).lean();
      return !!user;
    } catch (error) {
      console.error('Error checking user existence in potential users:', error);
      throw error;
    }
  }
  
  async registerNewUserWithFullDetails(userID, fullName, email, type, password) {
    try {
      const userExistsInPotentialUsers = await this.checkIfUserExistsInPotentialUsers(userID);
      if (!userExistsInPotentialUsers) {
        console.log('User ID does not exist in potential users. Registration not allowed.');
        return { success: false, error: 'User ID not found in potential users' };
      }

      const userExists = await this.checkIfUserExists(userID);
      if (userExists) {
        console.log('User ID already exists. Registration not allowed.');
        return { success: false, error: 'User ID already exists' };
      }

      // Hash password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const newUser = new UserDB({
        ID: userID,
        name: fullName,
        email: email,
        password: hashedPassword,
        type: type,
      });

      await newUser.save();
      console.log('User added successfully!');
      return { success: true };
    } catch (error) {
      console.error('Error adding user:', error);
      return { success: false };
    }
  }

  async checkIfUserExists(userID) {
    try {
      const user = await UserDB.findOne({ ID: userID }).lean();
      return !!user;
    } catch (error) {
      console.error('Error checking user existence:', error);
      throw error;
    }
  }

  async getPreferences() {
    try {
      const preferences = await availablePreferencesDB.find({}, 'ID');
      return preferences;
    } catch (error) {
      console.error('Error fetching preferences:', error);
      throw error;
    }
  }

  async savePreferences(userID, selectedPreferences) {
    try {
      const user = await UserDB.findOne({ ID: userID });
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      user.selected_preferences = selectedPreferences;
      await user.save();
      return { success: true };
    } catch (error) {
      console.error('Error saving preferences:', error);
      return { success: false, error: 'Failed to save preferences' };
    }
  }

  async getUserPreferences(userID) {
    try {
      const user = await UserDB.findOne({ ID: userID });
      if (!user) {
        return [];
      }
      return user.selected_preferences;
    } catch (error) {
      console.error('Error fetching user preferences:', error);
      throw error;
    }
  }

  async addPreference(userID, preferenceId) {
    try {
      const user = await UserDB.findOne({ ID: userID });
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      if (!user.selected_preferences.includes(preferenceId)) {
        user.selected_preferences.push(preferenceId);
        await user.save();
      }
      return { success: true };
    } catch (error) {
      console.error('Error adding preference:', error);
      return { success: false, error: 'Failed to add preference' };
    }
  }

  async removePreference(userID, preferenceId) {
    try {
      const user = await UserDB.findOne({ ID: userID });
      if (!user) {
        return { success: false, error: 'User not found' };
      }
      user.selected_preferences = user.selected_preferences.filter(id => id !== preferenceId);
      await user.save();
      return { success: true };
    } catch (error) {
      console.error('Error removing preference:', error);
      return { success: false, error: 'Failed to remove preference' };
    }
  }

  async updateUserField(userID, field, newValue) {
    try {
      const user = await UserDB.findOne({ ID: userID });
      if (!user) {
        return { success: false, error: 'User not found' };
      }

      if (field === 'password') {
        // Hash password before updating
        const hashedPassword = await bcrypt.hash(newValue, 10);
        user.password = hashedPassword;
        await user.save();
      } else if (field === 'name') {
        user.name = newValue;
        await user.save();
      } else if (field === 'email'){
        console.log("reached email"); 
        user.email = newValue;
        await user.save();
      } else if (field === 'avatar') {
        user.avatar = newValue;
        await user.save();
      } else {
        return { success: false, error: 'Invalid field' };
      }

      await user.save();
      return { success: true };
    } catch (error) {
      console.error('Error updating user field:', error);
      return { success: false, error: 'Failed to update user field' };
    }
  }
}

const usersService = new UsersService();

module.exports = { usersService };
