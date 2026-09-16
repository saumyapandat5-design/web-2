// Lab Assignment 2 – Student Management REST API
// Web Dev III (Node.js & Express Backend)

const express = require('express');
const logger = require('./middleware/logger');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Built-in middleware to parse JSON request bodies
app.use(express.json());

// Custom Logger Middleware
app.use(logger);

// Welcome / Root route
app.get('/', (req, res) => {
  res.status(200).json({
    message: "Welcome to the Student Management REST API",
    endpoints: {
      "GET /students": "Get all student records",
      "GET /students/:id": "Get a student record by ID",
      "POST /students": "Add a new student record",
      "PUT /students/:id": "Update an existing student record by ID",
      "DELETE /students/:id": "Delete a student record by ID"
    }
  });
});

// Modular routing for students
app.use('/students', studentRoutes);

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route '${req.originalUrl}' not found.`
  });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Start the Express server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(` Student Management REST API is running!`);
    console.log(` Server URL: http://localhost:${PORT}`);
    console.log(` Time: ${new Date().toLocaleString()}`);
    console.log(`===============================================`);
  });
}

module.exports = app;
