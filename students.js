// In-memory student records stored as an array of JSON objects
// Restrictions applied: No Database, No Mongoose, Array and JSON data only

let students = [
  {
    id: 1,
    name: "Vishal",
    age: 20,
    course: "Computer Science",
    email: "vishal@example.com"
  },
  {
    id: 2,
    name: "Rohan",
    age: 21,
    course: "Information Technology",
    email: "rohan@example.com"
  },
  {
    id: 3,
    name: "Vikram",
    age: 22,
    course: "Software Engineering",
    email: "vikram@example.com"
  },
  {
    id: 4,
    name: "Leo",
    age: 20,
    course: "Data Science",
    email: "leo@example.com"
  }
];

module.exports = students;
