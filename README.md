# Internship Application Tracker – Redis Extension

## Overview
This project extends the Internship Application Tracker by adding a Redis-based in-memory component for managing active applications.

The Redis extension supports fast access to a student’s active internship applications and allows users to create, read, update, and delete application records efficiently.

## Redis Functionality
The selected Redis functionality is an **Active Application Dashboard**.

This feature allows the system to:
- store active applications for each student in memory,
- retrieve one application quickly,
- retrieve all applications for a student,
- update the current application status,
- delete an application from the active application tracker.

## Redis Data Structures Used
The system uses the following Redis data structures:

### 1. Hash
Used to store one individual application.

Example key:
`application:1001`

### 2. Sorted Set
Used to store all applications for one student ordered by submission date.

Example key:
`student:1:applications`

### 3. Set
Used to group applications by current status.

Example key:
`student:1:status:applied`

## Technologies Used
- Node.js
- Express
- Redis

## Routes Implemented

### Create Application
`POST /applications`

### Get One Application
`GET /applications/:app_id`

### Get All Applications for One Student
`GET /students/:student_id/applications`

### Update Application Status
`PUT /applications/:app_id/status`

### Delete Application
`DELETE /applications/:app_id`

## How to Run the Project

### 1. Install dependencies
```bash
npm install