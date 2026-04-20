Redis Conceptual Model Addition

Entities

1. Student
- student_id
- name
- email

2. ActiveApplication
- app_id
- student_id
- job_id
- company_name
- job_title
- submission_date
- current_status

Relationship

- One Student can have many ActiveApplication records.
- Each ActiveApplication belongs to one Student.

Description

This conceptual addition represents the Redis-based in-memory component of the Internship Application Tracker. The purpose of this component is to support fast dashboard access for active applications that are frequently read and updated.

The ActiveApplication entity is not intended to replace the full persistent application record stored in the main database. Instead, it stores a simplified view of application data needed for fast operations such as create, display, update, and delete.