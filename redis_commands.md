Redis Commands for CRUD Operations

This section describes the Redis commands used to support CRUD operations for the Active Application Dashboard.

The system uses the following Redis structures:
- Hash for detailed application data
- Sorted Set for ordered application lists per student
- Set for grouping applications by current status

Initialization

To start with a clean database during testing:

FLUSHALL


Create Operations

Use case: Create a new active application for student 1.

1. Store the application details in a Hash:

HSET application:1001 \
app_id 1001 \
student_id 1 \
job_id 501 \
company_name "Google" \
job_title "Software Engineering Intern" \
submission_date "2026-04-19" \
current_status "applied"

2. Add the application id to the student’s Sorted Set using a timestamp score:

ZADD student:1:applications 1776556800 1001

3. Add the application id to the Set for its current status:

SADD student:1:status:applied 1001


Read Operations

Use case: Retrieve all active applications for student 1 ordered by submission date.

1. Get all application ids for the student:

ZRANGE student:1:applications 0 -1

2. Get all application ids in reverse order (most recent first):

ZREVRANGE student:1:applications 0 -1

3. Retrieve one specific application’s details:

HGETALL application:1001

4. Retrieve a specific field from an application:

HGET application:1001 current_status

5. Retrieve all applications with status "applied" for student 1:

SMEMBERS student:1:status:applied


Update Operations

Use case: Update application 1001 from "applied" to "interviewing".

1. Remove the application id from the old status Set:

SREM student:1:status:applied 1001

2. Add the application id to the new status Set:

SADD student:1:status:interviewing 1001

3. Update the current status field in the Hash:

HSET application:1001 current_status "interviewing"

Use case: Update the job title for application 1001.

HSET application:1001 job_title "Backend Engineering Intern"

Use case: Update the submission date and its ordering score.

1. Update the field in the Hash:

HSET application:1001 submission_date "2026-04-20"

2. Update the score in the Sorted Set:

ZADD student:1:applications 1776643200 1001


Delete Operations

Use case: Delete application 1001 completely from the active application tracker.

1. Remove the application id from the student’s Sorted Set:

ZREM student:1:applications 1001

2. Remove the application id from its status Set:

SREM student:1:status:interviewing 1001

3. Delete the Hash storing the application details:

DEL application:1001


Additional Useful Commands

Check whether a specific application exists:

EXISTS application:1001

Check whether an application belongs to a status group:

SISMEMBER student:1:status:interviewing 1001

Count how many active applications a student has:

ZCARD student:1:applications

Count how many applications are in a specific status:

SCARD student:1:status:interviewing