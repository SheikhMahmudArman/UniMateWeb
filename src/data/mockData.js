// src/data/mockData.js

export const user = {
    id: '2023-12345',
    name: 'Student User',
    email: 'student@austmate.com',
    role: 'student',
};

export const dailyRoutine = [
    { id: 1, time: '9:00 AM', course: 'CSE 2103', name: 'Data Structures', room: 'Room 301', notify: false },
    { id: 2, time: '11:00 AM', course: 'CSE 2105', name: 'Algorithms', room: 'Room 302', notify: false },
    { id: 3, time: '2:00 PM', course: 'CSE 2107', name: 'Database Systems', room: 'Room 303', notify: false },
];

export const courses = [
    {
        id: 1,
        code: 'CSE 2103',
        name: 'Data Structures',
        topics: ['Arrays', 'Linked Lists', 'Stacks', 'Queues', 'Trees', 'Graphs'],
    },
    {
        id: 2,
        code: 'CSE 2105',
        name: 'Algorithms',
        topics: ['Sorting', 'Searching', 'Dynamic Programming', 'Greedy', 'Graph Algorithms'],
    },
    {
        id: 3,
        code: 'CSE 2107',
        name: 'Database Systems',
        topics: ['ER Diagrams', 'SQL', 'Normalization', 'Transactions', 'Indexing'],
    },
];

export const quickStats = {
    upcomingQuizzes: 2,
    pendingAssignments: 3,
    currentCGPA: 3.67,
};

// ---- NEW: Semester folders and documents ----
export const semesters = ['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '4.1', '4.2'];

// Mock documents per semester
export const documents = {
    '1.1': {
        theory: [
            { id: 1, name: 'CSE 1101_Intro_to_Programming.pdf', type: 'pdf' },
            { id: 2, name: 'CSE 1103_Discrete_Math_Notes.pdf', type: 'pdf' },
            { id: 3, name: 'CSE 1105_Physics_Slides.pptx', type: 'ppt' },
        ],
        lab: [
            { id: 101, name: 'CSE 1102_Lab_Manual.pdf', type: 'pdf' },
            { id: 102, name: 'CSE 1104_Chemistry_Lab_Report.docx', type: 'docx' },
        ],
    },
    '1.2': {
        theory: [
            { id: 4, name: 'CSE 1201_Object_Oriented_Programming.pdf', type: 'pdf' },
            { id: 5, name: 'CSE 1203_Data_Structures_Notes.pdf', type: 'pdf' },
        ],
        lab: [
            { id: 103, name: 'CSE 1202_OOP_Lab_Manual.pdf', type: 'pdf' },
        ],
    },
    '2.1': {
        theory: [
            { id: 6, name: 'CSE 2101_Algorithms_Book.pdf', type: 'pdf' },
            { id: 7, name: 'CSE 2103_Database_Slides.pdf', type: 'pdf' },
        ],
        lab: [
            { id: 104, name: 'CSE 2102_Algorithms_Lab.pdf', type: 'pdf' },
        ],
    },
    '2.2': {
        theory: [
            { id: 8, name: 'CSE 2201_Software_Engineering_Notes.pdf', type: 'pdf' },
        ],
        lab: [
            { id: 105, name: 'CSE 2202_SE_Lab_Manual.pdf', type: 'pdf' },
        ],
    },
    '3.1': {
        theory: [
            { id: 9, name: 'CSE 3101_Networking_Fundamentals.pdf', type: 'pdf' },
            { id: 10, name: 'CSE 3103_OS_Concepts.pdf', type: 'pdf' },
        ],
        lab: [
            { id: 106, name: 'CSE 3102_Networking_Lab.pdf', type: 'pdf' },
        ],
    },
    '3.2': {
        theory: [
            { id: 11, name: 'CSE 3201_AI_Notes.pdf', type: 'pdf' },
        ],
        lab: [
            { id: 107, name: 'CSE 3202_AI_Lab.pdf', type: 'pdf' },
        ],
    },
    '4.1': {
        theory: [
            { id: 12, name: 'CSE 4101_Compiler_Design.pdf', type: 'pdf' },
            { id: 13, name: 'CSE 4103_Security_Basics.pdf', type: 'pdf' },
        ],
        lab: [
            { id: 108, name: 'CSE 4102_Compiler_Lab.pdf', type: 'pdf' },
        ],
    },
    '4.2': {
        theory: [
            { id: 14, name: 'CSE 4201_Distributed_Systems.pdf', type: 'pdf' },
        ],
        lab: [
            { id: 109, name: 'CSE 4202_Distributed_Lab.pdf', type: 'pdf' },
        ],
    },
};

// ---- Sidebar menu items (add Drive/Folders) ----
export const menuItems = [
    { id: 'home', label: 'Dashboard', icon: 'faHouse', path: '/dashboard' },
    { id: 'folders', label: 'Drive', icon: 'faFolderOpen', path: '/dashboard/folders' }, // NEW
    { id: 'quiz', label: 'Quiz', icon: 'faCalendarCheck', path: '/dashboard/quiz' },
    { id: 'mid', label: 'Mid', icon: 'faCalendarAlt', path: '/dashboard/mid' },
    { id: 'final', label: 'Final', icon: 'faFlag', path: '/dashboard/final' },
    { id: 'marks', label: 'Marks', icon: 'faChartSimple', path: '/dashboard/marks' },
    { id: 'cgpa', label: 'CGPA', icon: 'faPercent', path: '/dashboard/cgpa' },
    { id: 'faculty', label: 'Faculty', icon: 'faUserGraduate', path: '/dashboard/faculty' },
    { id: 'settings', label: 'Settings', icon: 'faGear', path: '/dashboard/settings' },
];
// ---- Marks & CGPA data ----
export const marksData = {
    '1.1': {
        courses: [
            { code: 'CSE 1101', name: 'Intro to Programming', credits: 3, marks: { quiz: 0, mid: 0, online: 0, final: 0 } },
            { code: 'CSE 1103', name: 'Discrete Math', credits: 3, marks: { quiz: 0, mid: 0, online: 0, final: 0 } },
            { code: 'CSE 1105', name: 'Physics', credits: 3, marks: { quiz: 0, mid: 0, online: 0, final: 0 } },
        ],
        cgpa: 0,
    },
    '1.2': {
        courses: [
            { code: 'CSE 1201', name: 'OOP', credits: 3, marks: { quiz: 0, mid: 0, online: 0, final: 0 } },
            { code: 'CSE 1203', name: 'Data Structures', credits: 3, marks: { quiz: 0, mid: 0, online: 0, final: 0 } },
        ],
        cgpa: 0,
    },
    '2.1': {
        courses: [
            { code: 'CSE 2101', name: 'Algorithms', credits: 3, marks: { quiz: 0, mid: 0, online: 0, final: 0 } },
            { code: 'CSE 2103', name: 'Database', credits: 3, marks: { quiz: 0, mid: 0, online: 0, final: 0 } },
        ],
        cgpa: 0,
    },
    // ... add more semesters if needed
};

export const semestersList = ['1.1', '1.2', '2.1', '2.2', '3.1', '3.2', '4.1', '4.2'];
// ---- Faculty data ----
export const facultyData = [
    {
        id: 1,
        name: 'Dr. Ahmed Hasan',
        department: 'CSE',
        designation: 'Professor & Head',
        email: 'ahmed.hasan@austmate.edu',
        room: 'Room 401',
        consultationHours: 'Mon/Wed 2:00 PM – 4:00 PM',
        avatar: 'AH',
    },
    {
        id: 2,
        name: 'Dr. Fatima Rahman',
        department: 'CSE',
        designation: 'Associate Professor',
        email: 'fatima.rahman@austmate.edu',
        room: 'Room 402',
        consultationHours: 'Tue/Thu 10:00 AM – 12:00 PM',
        avatar: 'FR',
    },
    {
        id: 3,
        name: 'Mr. Kamal Hossain',
        department: 'EEE',
        designation: 'Assistant Professor',
        email: 'kamal.hossain@austmate.edu',
        room: 'Room 501',
        consultationHours: 'Sun/Wed 3:00 PM – 5:00 PM',
        avatar: 'KH',
    },
    {
        id: 4,
        name: 'Ms. Sharmin Akter',
        department: 'CSE',
        designation: 'Senior Lecturer',
        email: 'sharmin.akter@austmate.edu',
        room: 'Room 403',
        consultationHours: 'Mon/Thu 11:00 AM – 1:00 PM',
        avatar: 'SA',
    },
    {
        id: 5,
        name: 'Dr. Rashed Khan',
        department: 'ME',
        designation: 'Professor',
        email: 'rashed.khan@austmate.edu',
        room: 'Room 601',
        consultationHours: 'Tue/Thu 2:00 PM – 4:00 PM',
        avatar: 'RK',
    },
    {
        id: 6,
        name: 'Ms. Nusrat Jahan',
        department: 'EEE',
        designation: 'Lecturer',
        email: 'nusrat.jahan@austmate.edu',
        room: 'Room 502',
        consultationHours: 'Sun/Wed 10:00 AM – 12:00 PM',
        avatar: 'NJ',
    },
    {
        id: 7,
        name: 'Dr. M. Shahidul Islam',
        department: 'CSE',
        designation: 'Professor',
        email: 'shahidul.islam@austmate.edu',
        room: 'Room 404',
        consultationHours: 'Mon/Wed 9:00 AM – 11:00 AM',
        avatar: 'MS',
    },
    {
        id: 8,
        name: 'Mr. Tanvir Ahmed',
        department: 'ME',
        designation: 'Assistant Professor',
        email: 'tanvir.ahmed@austmate.edu',
        room: 'Room 602',
        consultationHours: 'Tue/Thu 11:00 AM – 1:00 PM',
        avatar: 'TA',
    },
];

export const departments = ['All', 'CSE', 'EEE', 'ME'];