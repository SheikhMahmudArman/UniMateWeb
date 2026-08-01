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
        progress: 0, // not used now but kept for future
    },
    {
        id: 2,
        code: 'CSE 2105',
        name: 'Algorithms',
        topics: ['Sorting', 'Searching', 'Dynamic Programming', 'Greedy', 'Graph Algorithms'],
        progress: 0,
    },
    {
        id: 3,
        code: 'CSE 2107',
        name: 'Database Systems',
        topics: ['ER Diagrams', 'SQL', 'Normalization', 'Transactions', 'Indexing'],
        progress: 0,
    },
];

export const quickStats = {
    upcomingQuizzes: 2,
    pendingAssignments: 3,
    currentCGPA: 3.67,
};

export const menuItems = [
    { id: 'home', label: 'Dashboard', icon: 'faHouse', path: '/dashboard' },
    { id: 'quiz', label: 'Quiz', icon: 'faCalendarCheck', path: '/dashboard/quiz' },
    { id: 'mid', label: 'Mid', icon: 'faCalendarAlt', path: '/dashboard/mid' },
    { id: 'final', label: 'Final', icon: 'faFlag', path: '/dashboard/final' },
    { id: 'marks', label: 'Marks', icon: 'faChartSimple', path: '/dashboard/marks' },
    { id: 'cgpa', label: 'CGPA', icon: 'faPercent', path: '/dashboard/cgpa' },
    { id: 'faculty', label: 'Faculty', icon: 'faUserGraduate', path: '/dashboard/faculty' },
    { id: 'settings', label: 'Settings', icon: 'faGear', path: '/dashboard/settings' },
];