const { google } = require('googleapis');
const UserDB = require('./DB/entities/user.entity');
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRouter = require("./Routers/users/users.router");
const uploadRouter = require('./Routers/upload_csv');
const adminRouter = require('./Routers/users/admin.router');
const app = express();
const port = process.env.PORT || 3001; // Set the port for the server to listen on

// Configure CORS - restrict to allowed origins only
const allowedOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:3000']; // Default to localhost for development

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies/authorization headers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Use the user routesaaa
app.use(userRouter);

// Mount the admin router
app.use('/admin', adminRouter);

// Use the upload router
app.use('/upload', uploadRouter);

// Start and init the server
app.listen(port, '0.0.0.0', async () => {
  console.log(`Server is running on port ${port}`);
});