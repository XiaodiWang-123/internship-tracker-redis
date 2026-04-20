Redis Data Structures Description

To support the Active Application Dashboard functionality, the system uses multiple Redis data structures to efficiently store and manage application data in memory.

The design focuses on fast read and write operations, as well as supporting complete CRUD functionality.

1. Hash: Storing Individual Application Data

Each active application is stored as a Redis Hash. This allows storing structured data with multiple fields and enables efficient access to individual attributes.

Key format:
application:{app_id}

Example:
application:1001

Fields stored in the hash:
- app_id
- student_id
- job_id
- company_name
- job_title
- submission_date
- current_status

Justification:
Redis Hashes are suitable for representing objects with multiple attributes. They provide fast access to specific fields and allow partial updates without modifying the entire object.


2. Sorted Set: Storing Applications Ordered by Submission Date

To support displaying applications in order, a Redis Sorted Set is used for each student. The score represents the submission date, allowing efficient sorting.

Key format:
student:{student_id}:applications

Example:
student:1:applications

Members:
- app_id

Score:
- submission_date (timestamp)

Justification:
Sorted Sets are ideal for maintaining ordered collections. This structure allows retrieving applications in chronological order, which is important for dashboard views.


3. Set: Grouping Applications by Status

To support filtering applications by status, Redis Sets are used.

Key format:
student:{student_id}:status:{status}

Examples:
student:1:status:applied
student:1:status:interviewing
student:1:status:offer
student:1:status:rejected

Members:
- app_id

Justification:
Sets are efficient for membership queries and allow grouping applications by their current status. This enables fast filtering and retrieval of applications based on status.


Overall Design Justification

The combination of Hash, Sorted Set, and Set provides a flexible and efficient in-memory design.

- Hashes store detailed application data
- Sorted Sets maintain ordering for dashboard display
- Sets support grouping and filtering by status

This design ensures that all CRUD operations can be implemented efficiently while supporting high-performance access patterns required by the application.