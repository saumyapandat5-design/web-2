const express = require('express');
const router = express.Router();
const students = require('../data/students');

// 1. GET /students - Retrieve all students
// Status: 200 OK
router.get('/', (req, res) => {
  return res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

// 2. GET /students/:id - Retrieve a single student by ID
// Status: 200 OK or 404 Not Found
router.get('/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);

  if (isNaN(studentId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid student ID. ID must be an integer."
    });
  }

  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${studentId} not found.`
    });
  }

  return res.status(200).json({
    success: true,
    data: student
  });
});

// 3. POST /students - Create a new student
// Status: 201 Created or 400 Bad Request
router.post('/', (req, res) => {
  const { name, age, course, email } = req.body;

  // Input Validation
  if (!name || age === undefined || !course) {
    return res.status(400).json({
      success: false,
      message: "Validation Error: 'name', 'age', and 'course' are required fields."
    });
  }

  if (typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: "Validation Error: 'name' must be a non-empty string."
    });
  }

  const parsedAge = Number(age);
  if (isNaN(parsedAge) || parsedAge <= 0) {
    return res.status(400).json({
      success: false,
      message: "Validation Error: 'age' must be a positive number."
    });
  }

  // Generate unique ID (max existing ID + 1)
  const nextId = students.length > 0 
    ? Math.max(...students.map((s) => s.id)) + 1 
    : 1;

  const newStudent = {
    id: nextId,
    name: name.trim(),
    age: parsedAge,
    course: course.trim(),
    email: email ? email.trim() : `student${nextId}@example.com`
  };

  students.push(newStudent);

  return res.status(201).json({
    success: true,
    message: "Student created successfully.",
    data: newStudent
  });
});

// 4. PUT /students/:id - Update an existing student by ID
// Status: 200 OK, 400 Bad Request, or 404 Not Found
router.put('/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);

  if (isNaN(studentId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid student ID. ID must be an integer."
    });
  }

  const student = students.find((s) => s.id === studentId);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${studentId} not found.`
    });
  }

  const { name, age, course, email } = req.body;

  // Check if at least one field is provided for update
  if (!name && age === undefined && !course && !email) {
    return res.status(400).json({
      success: false,
      message: "Validation Error: Provide at least one field to update ('name', 'age', 'course', or 'email')."
    });
  }

  if (name !== undefined) {
    if (typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Validation Error: 'name' must be a non-empty string."
      });
    }
    student.name = name.trim();
  }

  if (age !== undefined) {
    const parsedAge = Number(age);
    if (isNaN(parsedAge) || parsedAge <= 0) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: 'age' must be a positive number."
      });
    }
    student.age = parsedAge;
  }

  if (course !== undefined) {
    if (typeof course !== 'string' || course.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Validation Error: 'course' must be a non-empty string."
      });
    }
    student.course = course.trim();
  }

  if (email !== undefined) {
    if (typeof email !== 'string' || email.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Validation Error: 'email' must be a non-empty string."
      });
    }
    student.email = email.trim();
  }

  return res.status(200).json({
    success: true,
    message: `Student with ID ${studentId} updated successfully.`,
    data: student
  });
});

// 5. DELETE /students/:id - Delete a student by ID
// Status: 200 OK, 400 Bad Request, or 404 Not Found
router.delete('/:id', (req, res) => {
  const studentId = parseInt(req.params.id, 10);

  if (isNaN(studentId)) {
    return res.status(400).json({
      success: false,
      message: "Invalid student ID. ID must be an integer."
    });
  }

  const studentIndex = students.findIndex((s) => s.id === studentId);

  if (studentIndex === -1) {
    return res.status(404).json({
      success: false,
      message: `Student with ID ${studentId} not found.`
    });
  }

  const deletedStudent = students.splice(studentIndex, 1)[0];

  return res.status(200).json({
    success: true,
    message: `Student with ID ${studentId} deleted successfully.`,
    data: deletedStudent
  });
});

module.exports = router;
