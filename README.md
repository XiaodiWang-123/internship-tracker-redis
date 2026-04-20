# Internship Application Tracker – Redis Extension

## Overview

This project extends the Internship Application Tracker by integrating Redis as an in-memory data store to efficiently manage active internship applications.

The system leverages Redis data structures to support fast read/write operations and real-time updates. It allows users to create, retrieve, update, and delete internship applications, as well as track applications by student and application status.

---

## Features

- Create internship applications
- Retrieve a specific application
- Retrieve all applications for a student
- Update application status
- Delete applications
- Efficient in-memory data handling using Redis

---

## Redis Data Structures Used

- **Hash**
  - Key: `application:{app_id}`
  - Stores all application details (student_id, job_id, company_name, etc.)

- **Sorted Set**
  - Key: `student:{student_id}:applications`
  - Stores application IDs ordered by submission time

- **Set**
  - Key: `student:{student_id}:status:{status}`
  - Groups applications by status (e.g., applied, interviewing)

---

## API Endpoints

### Create Application
POST /applications

### Get Application by ID
GET /applications/:app_id

### Get All Applications for a Student
GET /students/:student_id/applications

### Update Application Status
PUT /applications/:app_id/status

### Delete Application
DELETE /applications/:app_id

---

## Example Usage

### Create Application

curl -X POST http://localhost:3000/applications \
-H "Content-Type: application/json" \
-d '{"app_id":"1001","student_id":"1","job_id":"501","company_name":"Google","job_title":"Software Engineering Intern","submission_date":"2026-04-19","current_status":"applied"}'

---

### Get Application

curl http://localhost:3000/applications/1001

---

### Get Student Applications

curl http://localhost:3000/students/1/applications

---

### Update Status

curl -X PUT http://localhost:3000/applications/1001/status \
-H "Content-Type: application/json" \
-d '{"new_status":"interviewing"}'

---

### Delete Application

curl -X DELETE http://localhost:3000/applications/1001

---

## How to Run the Project

1. Install dependencies:
npm install

2. Start Redis server:
redis-server

3. Run the application:
node app.js

4. Server runs at:
http://localhost:3000

---

## Project Structure

app.js                  # Express server with Redis integration  
data_structures.md      # Explanation of Redis data structures  
redis_commands.md       # Redis commands used in the project  
requirements.md         # Functional requirements  
uml_redis_addition.md   # UML / conceptual model description  
redis_conceptual_model.png  # Diagram  

---

## Design Decisions

- Redis is used as the primary storage for active applications to enable fast access
- Hashes store detailed application data for easy retrieval
- Sorted Sets allow ordering applications by submission time
- Sets enable efficient grouping by application status
- The design minimizes lookup time and avoids complex joins

---

## Author

Xiaodi Wang

---

## AI Usage Disclosure

AI tools (ChatGPT) were used for guidance in:

- Understanding Redis data structures
- Designing API endpoints
- Debugging implementation issues

All final implementation and understanding were completed by the author.