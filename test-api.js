// Automated Verification Test Suite for Student Management REST API
process.env.NODE_ENV = 'test';
const app = require('./app');

const PORT = 3001;

async function runTests() {
  const server = app.listen(PORT, async () => {
    console.log(`Starting Test Runner on port ${PORT}...`);

    const BASE_URL = `http://localhost:${PORT}`;
    let passed = 0;
    let failed = 0;

    async function test(name, fn) {
      try {
        await fn();
        console.log(`✅ PASS: ${name}`);
        passed++;
      } catch (err) {
        console.error(`❌ FAIL: ${name}`);
        console.error(`   ${err.message}`);
        failed++;
      }
    }

    try {
      // 1. GET Root /
      await test("GET / returns API info (Status 200)", async () => {
        const res = await fetch(`${BASE_URL}/`);
        if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
        const data = await res.json();
        if (!data.endpoints) throw new Error("Missing endpoints info");
      });

      // 2. GET All Students
      await test("GET /students returns list of students (Status 200)", async () => {
        const res = await fetch(`${BASE_URL}/students`);
        if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data.data) || data.data.length < 1) throw new Error("Expected array of students");
      });

      // 3. GET Student by ID (Found)
      await test("GET /students/1 returns student details (Status 200)", async () => {
        const res = await fetch(`${BASE_URL}/students/1`);
        if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
        const data = await res.json();
        if (data.data.id !== 1) throw new Error(`Expected ID 1, got ${data.data.id}`);
      });

      // 4. GET Student by ID (Not Found)
      await test("GET /students/999 returns 404 Not Found", async () => {
        const res = await fetch(`${BASE_URL}/students/999`);
        if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
      });

      // 5. GET Student with Invalid ID format
      await test("GET /students/invalid returns 400 Bad Request", async () => {
        const res = await fetch(`${BASE_URL}/students/invalid`);
        if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
      });

      // 6. POST Student (Validation Failure - missing fields)
      await test("POST /students without required fields returns 400 Bad Request", async () => {
        const res = await fetch(`${BASE_URL}/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: "Incomplete Student" })
        });
        if (res.status !== 400) throw new Error(`Expected 400, got ${res.status}`);
      });

      // 7. POST Student (Success)
      let createdId;
      await test("POST /students creates a new student (Status 201)", async () => {
        const newStudent = {
          name: "Diana Prince",
          age: 23,
          course: "Cybersecurity",
          email: "diana.prince@example.com"
        };
        const res = await fetch(`${BASE_URL}/students`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newStudent)
        });
        if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
        const json = await res.json();
        if (!json.data.id || json.data.name !== newStudent.name) throw new Error("Created student mismatch");
        createdId = json.data.id;
      });

      // 8. PUT Student (Success)
      await test(`PUT /students/${createdId} updates student record (Status 200)`, async () => {
        const updateData = {
          name: "Diana Prince - Updated",
          course: "Cloud Architecture"
        };
        const res = await fetch(`${BASE_URL}/students/${createdId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        });
        if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
        const json = await res.json();
        if (json.data.name !== updateData.name || json.data.course !== updateData.course) {
          throw new Error("Updated student field mismatch");
        }
      });

      // 9. PUT Student (Not Found)
      await test("PUT /students/999 returns 404 Not Found", async () => {
        const res = await fetch(`${BASE_URL}/students/999`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: "Ghost" })
        });
        if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
      });

      // 10. DELETE Student (Success)
      await test(`DELETE /students/${createdId} removes student record (Status 200)`, async () => {
        const res = await fetch(`${BASE_URL}/students/${createdId}`, {
          method: 'DELETE'
        });
        if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
      });

      // 11. DELETE Student (Not Found - already deleted)
      await test(`DELETE /students/${createdId} returns 404 when student no longer exists`, async () => {
        const res = await fetch(`${BASE_URL}/students/${createdId}`, {
          method: 'DELETE'
        });
        if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
      });

      // 12. Undefined Route (404)
      await test("GET /unknown-route triggers 404 handler", async () => {
        const res = await fetch(`${BASE_URL}/unknown-route`);
        if (res.status !== 404) throw new Error(`Expected 404, got ${res.status}`);
      });

    } finally {
      console.log(`\n===============================================`);
      console.log(` Test Summary: ${passed} Passed, ${failed} Failed`);
      console.log(`===============================================\n`);
      server.close();
    }
  });
}

runTests();
