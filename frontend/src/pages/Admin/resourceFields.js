const course = { name: 'course_id', label: 'Course' };
const title = { name: 'title', label: 'Title' };
const description = { name: 'description', label: 'Description', type: 'textarea', optional: true };
const marks = { name: 'total_marks', label: 'Total marks', type: 'number', min: 1, max: 10000, default: 10 };

export const quizFields = [course, title, description, { name: 'date', label: 'Date', type: 'date' },
    { name: 'time', label: 'Time (campus local time)', type: 'time', optional: true },
    { name: 'room', label: 'Room', optional: true }, marks];
export const assignmentFields = [course, title, description, { name: 'due_date', label: 'Due date', type: 'date' }, marks];
export const topicFields = [course, title, description, { name: 'order', label: 'Order', type: 'number', min: 1, max: 10000, default: 1 }];
export const libraryFields = [title, { name: 'author', label: 'Author' }, { name: 'isbn', label: 'ISBN' },
    { name: 'status', label: 'Status', options: ['available', 'issued'], default: 'available' },
    { name: 'quantity', label: 'Quantity', type: 'number', min: 1, max: 100000, default: 1 }];
export const semesterFields = [{ name: 'code', label: 'Semester code (e.g. 1.1)' }, { name: 'name', label: 'Name' },
    { name: 'drive_url', label: 'Shared drive URL', type: 'url', optional: true }];
