// ---- Admin credentials ----
export const adminCredentials = {
    id: 'ADMIN-001',
    email: 'admin@austmate.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
};

// ---- Student credentials ----
export const studentCredentials = {
    id: '2023-12345',
    email: 'student@austmate.com',
    password: 'student123',
    name: 'Student User',
    role: 'student',
};

// ---- Daily Routine ----
export const dailyRoutine = [
    { id: 1, time: '9:00 AM', course: 'CSE 2103', name: 'Data Structures', room: 'Room 301', notify: false },
    { id: 2, time: '11:00 AM', course: 'CSE 2105', name: 'Algorithms', room: 'Room 302', notify: false },
    { id: 3, time: '2:00 PM', course: 'CSE 2107', name: 'Database Systems', room: 'Room 303', notify: false },
];

// ---- Courses ----
export const courses = [
    { id: 1, code: 'CSE 2103', name: 'Data Structures', topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs'] },
    { id: 2, code: 'CSE 2105', name: 'Algorithms', topics: ['Sorting', 'Searching', 'Dynamic Programming', 'Greedy', 'Graph Algorithms'] },
    { id: 3, code: 'CSE 2107', name: 'Database Systems', topics: ['ER Diagrams', 'SQL', 'Normalization', 'Transactions', 'Indexing'] },
];

// ---- Quick Stats ----
export const quickStats = { upcomingQuizzes: 2, pendingAssignments: 3, currentCGPA: 3.67 };

// ---- Semesters ----
export const semesters = ['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '4.1', '4.2'];
export const semestersList = ['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '4.1', '4.2'];

// ---- Documents ----
export const documents = {
    '1.1': {
        theory: [
            { id: 1, name: 'CSE 1101_Intro_to_Programming.pdf', type: 'pdf' },
            { id: 2, name: 'CSE 1103_Discrete_Math_Notes.pdf', type: 'pdf' },
        ],
        lab: [
            { id: 101, name: 'CSE 1102_Lab_Manual.pdf', type: 'pdf' },
        ],
    },
    '1.2': {
        theory: [
            { id: 3, name: 'CSE 1201_OOP_Notes.pdf', type: 'pdf' },
        ],
        lab: [
            { id: 102, name: 'CSE 1202_OOP_Lab.pdf', type: 'pdf' },
        ],
    },
};

// ---- Marks Data (for MarksPage) ----
export const marksData = {
    '1.1': {
        courses: [
            { code: 'CSE 1101', name: 'Intro to Programming', credits: 3, marks: { quiz: 0, mid: 0, online: 0, final: 0 } },
            { code: 'CSE 1103', name: 'Discrete Math', credits: 3, marks: { quiz: 0, mid: 0, online: 0, final: 0 } },
        ],
        cgpa: 0,
    },
    '1.2': {
        courses: [
            { code: 'CSE 1201', name: 'OOP', credits: 3, marks: { quiz: 0, mid: 0, online: 0, final: 0 } },
        ],
        cgpa: 0,
    },
    '2.1': {
        courses: [
            { code: 'CSE 2101', name: 'Algorithms', credits: 3, marks: { quiz: 0, mid: 0, online: 0, final: 0 } },
        ],
        cgpa: 0,
    },
};

// ---- Students ----
export const allStudents = [
    { id: '2023-12345', name: 'Student User', email: 'student@austmate.com', semester: '1.1', cgpa: 3.67 },
    { id: '2023-67890', name: 'Jane Smith', email: 'jane@austmate.com', semester: '2.1', cgpa: 3.45 },
    { id: '2024-11111', name: 'Bob Johnson', email: 'bob@austmate.com', semester: '1.2', cgpa: 3.12 },
];

// ---- Faculty ----
export const facultyData = [
    { id: 1, name: 'Dr. Ahmed Hasan', department: 'CSE', designation: 'Professor & Head', email: 'ahmed.hasan@austmate.edu', room: 'Room 401', consultationHours: 'Mon/Wed 2:00 PM – 4:00 PM', avatar: 'AH' },
    { id: 2, name: 'Dr. Fatima Rahman', department: 'CSE', designation: 'Associate Professor', email: 'fatima.rahman@austmate.edu', room: 'Room 402', consultationHours: 'Tue/Thu 10:00 AM – 12:00 PM', avatar: 'FR' },
];
export const departments = ['All', 'CSE', 'EEE', 'ME'];

// ---- Notifications ----
export const notifications = [
    { id: 1, title: 'Quiz 1', course: 'CSE 2103', description: 'Quiz on Arrays', date: '2026-08-05T10:00:00', read: false, type: 'quiz' },
    { id: 2, title: 'Midterm Exam', course: 'CSE 2105', description: 'Midterm on Algorithms', date: '2026-08-12T14:00:00', read: false, type: 'mid' },
];

// ---- Menu Items ----

export const menuItems = [
    { id: 'home', label: 'Dashboard', icon: 'faHouse', path: '/dashboard', roles: ['student', 'admin'] },
    { id: 'notice-board', label: 'Notice Board', icon: 'faBullhorn', path: '/dashboard/notice-board', roles: ['student', 'admin'] }, // নতুন
    { id: 'attendance', label: 'Attendance', icon: 'faCalendarCheck', path: '/dashboard/attendance', roles: ['student', 'admin'] }, // নতুন
    { id: 'folders', label: 'Drive', icon: 'faFolderOpen', path: '/dashboard/folders', roles: ['student', 'admin'] },
    { id: 'quiz', label: 'Quiz', icon: 'faCalendarCheck', path: '/dashboard/quiz', roles: ['student', 'admin'] },
    { id: 'mid', label: 'Mid', icon: 'faCalendarAlt', path: '/dashboard/mid', roles: ['student', 'admin'] },
    { id: 'final', label: 'Final', icon: 'faFlag', path: '/dashboard/final', roles: ['student', 'admin'] },
    { id: 'marks', label: 'Marks', icon: 'faChartSimple', path: '/dashboard/marks', roles: ['student', 'admin'] },
    { id: 'cgpa', label: 'CGPA', icon: 'faPercent', path: '/dashboard/cgpa', roles: ['student', 'admin'] },
    { id: 'faculty', label: 'Faculty', icon: 'faUserGraduate', path: '/dashboard/faculty', roles: ['student', 'admin'] },
    { id: 'library', label: 'Library', icon: 'faBook', path: '/dashboard/library', roles: ['student', 'admin'] }, 
    { id: 'profile', label: 'Profile', icon: 'faUser', path: '/dashboard/profile', roles: ['student', 'admin'] }, 
    { id: 'settings', label: 'Settings', icon: 'faGear', path: '/dashboard/settings', roles: ['student', 'admin'] },
    // Admin-only
    { id: 'admin-dashboard', label: 'Admin Panel', icon: 'faShield', path: '/dashboard/admin', roles: ['admin'] },
    { id: 'manage-courses', label: 'Manage Courses', icon: 'faBook', path: '/dashboard/admin/courses', roles: ['admin'] },
    { id: 'manage-students', label: 'Manage Students', icon: 'faUserGroup', path: '/dashboard/admin/students', roles: ['admin'] },
    { id: 'manage-faculty', label: 'Manage Faculty', icon: 'faChalkboardUser', path: '/dashboard/admin/faculty', roles: ['admin'] },
    { id: 'manage-documents', label: 'Manage Documents', icon: 'faFile', path: '/dashboard/admin/documents', roles: ['admin'] },
    { id: 'manage-marks', label: 'Manage Marks', icon: 'faPen', path: '/dashboard/admin/marks', roles: ['admin'] },
    { id: 'manage-notices', label: 'Manage Notices', icon: 'faBullhorn', path: '/dashboard/admin/notices', roles: ['admin'] }, 
];