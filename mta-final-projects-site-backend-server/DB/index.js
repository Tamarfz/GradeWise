const mongoose = require('mongoose'); // Mongoose is an ODM (Object Data Mapper) that sits on top of MongoDB.

/*
process is a Node.js global object describing the running program.
process.env holds environment variables—configuration supplied from outside the source code.
The value goes into the uri variable. This keeps database credentials/configuration out of Git and source files.
*/
const uri = process.env.MONGODB_URI; // Environment variable used to store a MongoDB connection string required for an application to connect to a database.

if (!uri) {
  throw new Error(
    'Missing MONGODB_URI. Create mta-final-projects-site-backend-server/.env and set MONGODB_URI.'
  );
}

// Connect to MongoDB using Mongoose
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: mongoose.ServerApiVersion,
});

/*
Waits for the MongoDB connection to open, then retrieves all collections in the database. Returns them as a map.
() => { ... } creates an arrow function.
A Promise is a JavaScript object representing a result that will be available later. Promise has 3 possible states:
pending   → still waiting for MongoDB
fulfilled → succeeded; gives collections
resolve(collections) means -> The database is ready; finish successfully and give the caller this collections object.
getCollections() returns a Promise.
That Promise eventually resolves to an object containing collection references—not one collection directly.
*/
const getCollections = () => {
  return new Promise((resolve, reject) => {
    /*
    mongoose.connection is the Mongoose object representing the current database connection.
    It is an event emitter: an object that announces events when something happens.
    .on('error', callback) -> Whenever this connection emits an error event, run this callback.
    */
    mongoose.connection.on('error', (err) => {
      console.error('connection error:', err);
      // Changes the Promise created by getCollections() from pending to rejected.
      reject(err);
    });

    /*
    The first time the MongoDB connection opens successfully, run this async function.
    once -> the callback runs at most one time.
    */
    mongoose.connection.once('open', async function (ref) {
      const db = mongoose.connection.db; // Get a reference to the database

      try {
        const names = await db.listCollections().toArray();
        const collections = {};

        for (const { name } of names) {
          collections[name] = db.collection(name);
        }

        resolve(collections);
      } catch (err) {
        console.error('Error fetching collections:', err);
        reject(err);
      }
    });
  });
};

module.exports = { mongoose, getCollections };
