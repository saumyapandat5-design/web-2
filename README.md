# Lab Assignment 2 – Student Management REST API
**Course**: Web Dev III (Node.js & Express Backend)  
**Unit**: 2 | **Marks**: 2.5 | **In-Class Lab**

## Project Overview
This project is an in-memory Student Management REST API built using **Node.js** and **Express.js**. It performs complete CRUD operations on student records using in-memory arrays and JSON data (strictly adhering to the no-database / no-Mongoose constraint).

---

## Project Structure
```
├── app.js                   # Main application entry point & Express server configuration
├── package.json             # Project metadata and dependencies
├── data/
│   └── students.js          # In-memory array of student JSON records
├── middleware/
│   └── logger.js            # Custom request logging middleware ([timestamp] METHOD URL)
├── routes/
│   └── studentRoutes.js     # Modular Express Router for student CRUD operations
├── test-api.js              # Automated test runner verifying all 12 test cases
└── postman_collection.json  # Ready-to-import Postman Collection
```

---

## How to Run the Server

### 1. Start Server Normally
```bash
npm start
```
or
```bash
node app.js
```
The server will run at: `http://localhost:3000`

### 2. Start in Watch Mode (Auto-restart on code changes)
```bash
npm run dev
```

---

## API Endpoints Reference

| Method | Endpoint | Description | Expected Status Codes |
|---|---|---|---|
| **GET** | `/` | API Information & available routes | `200 OK` |
| **GET** | `/students` | Get all student records | `200 OK` |
| **GET** | `/students/:id` | Get student by ID | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **POST** | `/students` | Create new student record | `201 Created`, `400 Bad Request` |
| **PUT** | `/students/:id` | Update existing student record | `200 OK`, `400 Bad Request`, `404 Not Found` |
| **DELETE**| `/students/:id` | Delete student record by ID | `200 OK`, `400 Bad Request`, `404 Not Found` |

---

## Sample Request Payloads

### 1. Add Student (`POST /students`)
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "name": "Michael Scott",
  "age": 21,
  "course": "Business Management",
  "email": "michael.scott@example.com"
}
```

### 2. Update Student (`PUT /students/:id`)
- **Headers**: `Content-Type: application/json`
- **Body**:
```json
{
  "name": "John Doe Updated",
  "course": "Cybersecurity"
}
```

---

## How to Test

### Automated Testing
Run the comprehensive automated test suite (tests all 12 scenarios including 200, 201, 400, and 404 responses):
```bash
npm test
```

### Testing with Postman
1. Open **Postman**.
2. Click **Import** (top left).
3. Select the file `postman_collection.json` located in this directory.
4. Run requests against `http://localhost:3000`.
