//const { google } = require('googleapis'); // Not used ATM.
//const UserDB = require('./DB/entities/user.entity'); Not used ATM.

require('dotenv').config();/* require ->Node.js searches for the package inside node_modules/dotenv,
                                        loads it, and returns whatever it exports.
                              
                             config read the file .env and stores its variables in process.env
                             'process' is a built-in global variable that holds info about the running program.
                           */
                       
const express = require('express');//returned value is a function.
const bodyParser = require('body-parser');//Loads the npm package called 'body-parser' stored in var bodyParser.
const cors = require('cors');//Cross-Origin Resource Sharing, allows requests from another permitted origin to access server.
                            //Node loads the cors package, retrieves whatever it exports (a function), and stores that function in the variable cors.
const userRouter = require("./Routers/users/users.router");
const uploadRouter = require('./Routers/upload_csv');
const adminRouter = require('./Routers/users/admin.router');
const app = express();//The variable 'express' contains the function that was exported by the Express package.
                     //Calling it creates a new Express application

const port = process.env.PORT || 3001; // OR operator returns the first truthly value.

/*
If CORS_ORIGINS exists, convert its comma-separated string into a clean array.
Otherwise, allow only http://localhost:3000.
These are the frontend origins that the backend is willing to accept requests from.
- Ternary operator -> condition ? valueIfTrue : valueIfFalse
- split() divides a string and returns an array.
- map() creates a new array by running a function on every element.
 -trim() removes whitespace from the beginning and end of a string.
*/
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000']; 



/*
creates an object with 4 properties and stores a reference to it in 'corsOptions'.
contains configuration settings for the CORS middleware.
'origin' is a property of corsOptions, its value is an anonymous funcion.
'callback' is a variable that contains a function, a callback function.
*/
const corsOptions = {
  origin: function (requestedOrigin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!requestedOrigin) return callback(null, true);//No error occured, origin is allowed.
    
    if (allowedOrigins.indexOf(requestedOrigin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies/authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};



/*
'cors' holds whatever the CORS package exports(a function)
cors(corsOptions) -> Calls the CORS factory function with a configuration object (corsOptions).
Registers the returned middleware function with Express.
configure the CORS middleware once, and the returned middleware function is reused for every incoming request.
*/
app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Use the user routes
app.use(userRouter);

// Mount the admin router
app.use('/admin', adminRouter);

// Use the upload router
app.use('/upload', uploadRouter);

/*
Start the HTTP server.
`express` is the factory function, and `app` is the Express application
instance created by calling express().
*/
app.listen(port, '0.0.0.0', async () => {
  console.log(`Server is running on port ${port}`);
});