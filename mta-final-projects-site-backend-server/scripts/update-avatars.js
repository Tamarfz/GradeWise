const mongoose = require('mongoose');
const UserDB = require('../DB/entities/user.entity');

// Connect to MongoDB (adjust the connection string as needed)
mongoose.connect('mongodb://localhost:27017/your-database-name', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateExistingUsers() {
  try {
    console.log('Updating existing users with default avatar...');
    
    // Update all users that don't have an avatar field
    const result = await UserDB.updateMany(
      { avatar: { $exists: false } },
      { $set: { avatar: 'default' } }
    );
    
    console.log(`Updated ${result.modifiedCount} users with default avatar`);
    
    // Verify the update
    const usersWithoutAvatar = await UserDB.find({ avatar: { $exists: false } });
    console.log(`Users still without avatar: ${usersWithoutAvatar.length}`);
    
    mongoose.connection.close();
  } catch (error) {
    console.error('Error updating users:', error);
    mongoose.connection.close();
  }
}

updateExistingUsers();
