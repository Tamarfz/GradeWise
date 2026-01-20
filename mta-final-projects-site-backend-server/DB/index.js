//Mongoose is an ODM (Object Data Mapper) that sits on top of MongoDB.
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error(
    'Missing MONGODB_URI. Create mta-final-projects-site-backend-server/.env and set MONGODB_URI.'
  );
}

// Connect to MongoDB using Mongoose
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: mongoose.ServerApiVersion
});

/*
Waits for the MongoDB connection to open, then retrieves all collections in the database.
Returns them as a map.
*/
const getCollections = () => {
  return new Promise((resolve, reject) => {
    mongoose.connection.on('error', (err) => {
      console.error('connection error:', err);
      reject(err);
    });

    mongoose.connection.once('open', async function(ref) {
      const db = mongoose.connection.db; // Get a reference to the database

      try {
        const names = await db.listCollections().toArray(); 
        const collections = {};

        for (const { name } of names) {
          collections[name] = db.collection(name);
        }

        resolve(collections);
      } catch (err) {
        console.error("Error fetching collections:", err);
        reject(err);
      }
    });
  });
};

module.exports = { mongoose, getCollections };