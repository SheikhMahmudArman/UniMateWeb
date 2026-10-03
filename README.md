# UniMate / AUSTMATE

React frontend (frontend) and Laravel API (backend). The live deployment uses PHP/Nginx. The GitHub deployment workflow builds React into backend/public/app and uploads the Laravel release to ~/laravel.

## Academic management

Sign in with a server-side admin account, then open **Admin Panel → Manage System** or **Administration** in the sidebar.

- **Semester Drives:** create semester folders, edit names, and attach an optional shared-drive URL. This registers an existing external drive link; it does not provision a Google Drive account or folder. Use **Manage Documents** to upload files or links within a semester. Semester codes stay fixed after creation; folders containing records cannot be deleted.
- **Routine:** add/edit/delete and filter classes by semester. Students see their current semester. The upgrade infers legacy semesters from matching course codes. Unmatched classes remain visible to admins as **Unassigned** and need manual assignment.
- **Attendance:** select a semester, student, course, date and status. Saving the same student/course/day updates the record. Courses must match the student's current semester. Students see only their own attendance.
- **Quizzes:** add dated quizzes, marks, room and optional campus-local time. Students see their semester's schedule. The dashboard counts quizzes dated today or later.
- **Assignments:** add due dates, descriptions, marks and PDF/DOC/DOCX/ZIP attachments (5 MB). Students can download attachments and mark work complete. Pending includes overdue, incomplete work. This is a personal checklist, not online submission or grading.
- **Topics:** manage ordered course topics. Each student's completion is saved separately. Existing course topic arrays are copied into the topic table during upgrade.
- **Library:** add/edit/delete title, author, ISBN, availability and quantity. Library browsing links admins to inventory management.
- **Midterm / Final:** show recorded marks and published exam notices instead of placeholder text. Use the existing admin notice/mark forms to supply these.

Course, student and document semester selectors use the database. Existing authentication, profiles, faculty, marks and notices remain available. Automatic reminder delivery is still not implemented; the Notifications page explicitly states this.

## Root causes

Quiz, assignment and topic components referenced nonexistent APIs and missing stylesheets and had no application routes. Their database tables/controllers were absent. Routines had no semester field. Library and semester endpoints had no admin editing interface. The sidebar omitted routine and attendance management. Dashboard routines/progress were hard-coded samples; quiz/assignment counts were always null. The old backend tests targeted unused starter-kit web authentication routes rather than this application's token-authenticated API.

## Verification

From the repository root:

~~~sh
npm ci
npm run lint --workspace frontend
npm run build --workspace frontend
cd backend
composer install
php artisan test
~~~

PHP tests use SQLite in memory via phpunit.xml, not the production database. PHP needs pdo_sqlite, mbstring, dom, XML and fileinfo. The suite covers authentication, authorization, semester isolation, attendance upserts, personal progress, attachment handling, validation and legacy-data migration.

Obsolete starter-kit email-verification/password-reset/password-confirmation tests were removed because those routes are not registered. Authentication, profile and password tests now exercise the actual API. Both CI and deployment run frontend lint/build and the full API suite before release upload.

Local checks cannot guarantee that VPS permissions, extensions and database state match the test environment. See [VPS update instructions](deployment/VPS_UPDATE.md). Do not run migrate:fresh, db:wipe or demo seeders on the live database.
