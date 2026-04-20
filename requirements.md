Internship Application Tracker – Redis Extension Requirements

Overview
This project extends the Internship Application Tracker system by adding a Redis-based in-memory component. The goal of this extension is to support fast access to a student’s active internship applications.

In the original system, students can track companies, job postings, applications, interview rounds, offers, contacts, tags, and status history. In this Redis extension, the focus is on the active applications that a student frequently checks and updates.

Selected Redis Functionality
The functionality selected for Redis is an Active Application Dashboard for students.

This feature allows the system to:
- store active applications for each student in memory,
- display a student’s active applications ordered by submission date,
- retrieve the details of a specific application quickly,
- update the current status of an application,
- remove an application from the active dashboard when it is no longer needed.

Problem Requirements
The system must support the following requirements for the Redis component:

1. A student can have multiple active applications.
2. Each active application should store the main information needed for quick access, including:
   - application id
   - student id
   - job id
   - company name
   - job title
   - submission date
   - current status
3. The system must allow creating a new active application entry.
4. The system must allow displaying all active applications for a student.
5. The system must allow retrieving one specific application.
6. The system must allow updating an application status.
7. The system must allow deleting an application from the active application tracker.
8. The Redis addition should improve performance for dashboard-style operations that require frequent reads and updates.

Conceptual Model Update
The conceptual model from the previous project is reused as the base design. For the Redis addition, the system includes an in-memory representation of active applications.

A Student can be associated with many ActiveApplication records. Each ActiveApplication contains the core information needed for quick dashboard access, without replacing the main persistent database records.

This Redis component complements the existing database design by supporting high-speed access to frequently used application data.