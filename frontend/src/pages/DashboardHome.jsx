
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faClock, 
    faCalendarCheck, 
    faBookOpen, 
    faChartLine,
    faBullhorn,
    faBook,
    faUser,
    faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { dailyRoutine, courses, quickStats } from '../data/mockData';
import './DashboardHome.css';

const DashboardHome = () => {
    // --- Existing states ---
    const [routine, setRoutine] = useState(dailyRoutine);
    const [doneTopics, setDoneTopics] = useState(
        courses.reduce((acc, course) => {
            acc[course.id] = new Array(course.topics.length).fill(false);
            return acc;
        }, {})
    );

    // --- New states for Notices, Attendance, Library ---
    const [notices, setNotices] = useState([]);
    const [attendance, setAttendance] = useState([]);
    const [books, setBooks] = useState([]);

    useEffect(() => {
        // Load notices from localStorage or default
        const storedNotices = localStorage.getItem('notices');
        if (storedNotices) {
            setNotices(JSON.parse(storedNotices));
        } else {
            setNotices([
                { id: 1, title: 'Midterm Exam Schedule', content: 'Midterm exams will start from 15th August.', date: '2026-08-10', type: 'exam' },
                { id: 2, title: 'Library Renovation', content: 'The library will remain closed from 20th to 25th August.', date: '2026-08-08', type: 'general' },
            ]);
        }

        // Mock Attendance data
        setAttendance([
            { id: 1, course: 'CSE 1101', date: '2026-08-01', status: 'present' },
            { id: 2, course: 'CSE 1101', date: '2026-08-03', status: 'present' },
            { id: 3, course: 'CSE 1101', date: '2026-08-05', status: 'absent' },
            { id: 4, course: 'CSE 1103', date: '2026-08-02', status: 'present' },
        ]);

        // Mock Library data
        setBooks([
            { id: 1, title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', status: 'available' },
            { id: 2, title: 'Clean Code', author: 'Robert C. Martin', status: 'available' },
            { id: 3, title: 'Design Patterns', author: 'Erich Gamma', status: 'issued' },
        ]);
    }, []);

    // --- Existing functions ---
    const toggleNotify = (id) => {
        setRoutine(routine.map(item =>
            item.id === id ? { ...item, notify: !item.notify } : item
        ));
    };

    const handleTopicToggle = (courseId, topicIndex) => {
        setDoneTopics(prev => {
            const newDone = { ...prev };
            newDone[courseId] = [...newDone[courseId]];
            newDone[courseId][topicIndex] = !newDone[courseId][topicIndex];
            return newDone;
        });
    };

    const getProgress = (courseId) => {
        const done = doneTopics[courseId] || [];
        const total = courses.find(c => c.id === courseId)?.topics.length || 0;
        if (total === 0) return 0;
        return Math.round((done.filter(Boolean).length / total) * 100);
    };

    // --- New calculations ---
    const totalClasses = attendance.length;
    const presentClasses = attendance.filter(a => a.status === 'present').length;
    const attendancePercentage = totalClasses > 0 ? Math.round((presentClasses / totalClasses) * 100) : 0;
    const availableBooks = books.filter(b => b.status === 'available').length;

    return (
        <Container fluid className="dashboard-home">
            {/* Header */}
            <Row>
                <Col>
                    <h2 className="page-title">Dashboard</h2>
                    <p className="text-muted">Welcome back! Here's your academic overview.</p>
                </Col>
            </Row>

            {/* Quick Stats (Existing) */}
            <Row className="stats-row">
                <Col md={4} className="mb-3">
                    <Card className="stat-card">
                        <Card.Body>
                            <div className="stat-icon"><FontAwesomeIcon icon={faCalendarCheck} /></div>
                            <h5>Upcoming Quizzes</h5>
                            <h2>{quickStats.upcomingQuizzes}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="stat-card">
                        <Card.Body>
                            <div className="stat-icon"><FontAwesomeIcon icon={faBookOpen} /></div>
                            <h5>Pending Assignments</h5>
                            <h2>{quickStats.pendingAssignments}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="stat-card">
                        <Card.Body>
                            <div className="stat-icon"><FontAwesomeIcon icon={faChartLine} /></div>
                            <h5>Current CGPA</h5>
                            <h2>{quickStats.currentCGPA}</h2>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* New Features Summary Cards */}
            <Row className="mb-4">
                <Col md={4} className="mb-3">
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body className="text-center">
                            <div style={{ fontSize: '2.5rem', color: '#0B4F6C', marginBottom: '10px' }}>
                                <FontAwesomeIcon icon={faBullhorn} />
                            </div>
                            <h5>New Notices</h5>
                            <h2 className="fw-bold">{notices.length}</h2>
                            <Link to="/dashboard/notice-board" className="btn btn-outline-primary btn-sm mt-2">
                                View All <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-3">
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body className="text-center">
                            <div style={{ fontSize: '2.5rem', color: '#1A759F', marginBottom: '10px' }}>
                                <FontAwesomeIcon icon={faCalendarCheck} />
                            </div>
                            <h5>Attendance</h5>
                            <h2 className="fw-bold">
                                <span className={attendancePercentage >= 75 ? "text-success" : "text-danger"}>
                                    {attendancePercentage}%
                                </span>
                            </h2>
                            <Link to="/dashboard/attendance" className="btn btn-outline-primary btn-sm mt-2">
                                View Details <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-3">
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body className="text-center">
                            <div style={{ fontSize: '2.5rem', color: '#F4A261', marginBottom: '10px' }}>
                                <FontAwesomeIcon icon={faBook} />
                            </div>
                            <h5>Library</h5>
                            <h2 className="fw-bold">{availableBooks} Available</h2>
                            <Link to="/dashboard/library" className="btn btn-outline-primary btn-sm mt-2">
                                Browse Books <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Quick Drive Link (Existing) */}
            <Row className="mt-3">
                <Col>
                    <Card className="quick-drive-card">
                        <Card.Body className="d-flex align-items-center justify-content-between flex-wrap">
                            <div>
                                <h5>📁 Access Your Semester Documents</h5>
                                <p className="text-muted mb-0">Browse all your course materials organized by semester.</p>
                            </div>
                            <Link to="/dashboard/folders" className="btn btn-primary mt-2 mt-sm-0">
                                Go to Drive →
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Profile Link */}
            <Row className="mt-3">
                <Col>
                    <Card className="shadow-sm border-0">
                        <Card.Body className="d-flex align-items-center justify-content-between flex-wrap">
                            <div>
                                <h5><FontAwesomeIcon icon={faUser} className="me-2" /> Update Your Profile</h5>
                                <p className="text-muted mb-0">View and edit your personal information.</p>
                            </div>
                            <Link to="/dashboard/profile" className="btn btn-outline-secondary mt-2 mt-sm-0">
                                Go to Profile <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Daily Routine + Topic Progress (Existing) */}
            <Row className="mt-4">
                <Col lg={7}>
                    <Card className="routine-card">
                        <Card.Header>
                            <h5><FontAwesomeIcon icon={faClock} className="me-2" /> Daily Routine</h5>
                        </Card.Header>
                        <Card.Body>
                            {routine.map(item => (
                                <div key={item.id} className="routine-item">
                                    <div className="routine-time">{item.time}</div>
                                    <div className="routine-details">
                                        <strong>{item.course}</strong> – {item.name}
                                        <br />
                                        <small className="text-muted">{item.room}</small>
                                    </div>
                                    <Form.Check
                                        type="switch"
                                        label="Notify"
                                        checked={item.notify}
                                        onChange={() => toggleNotify(item.id)}
                                        className="routine-notify"
                                    />
                                </div>
                            ))}
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={5}>
                    <Card className="progress-card">
                        <Card.Header>
                            <h5>📊 Topic Progress</h5>
                        </Card.Header>
                        <Card.Body>
                            {courses.map(course => {
                                const progress = getProgress(course.id);
                                return (
                                    <div key={course.id} className="course-progress mb-4">
                                        <div className="d-flex align-items-center gap-3">
                                            <div style={{ width: 70, height: 70 }}>
                                                <CircularProgressbar
                                                    value={progress}
                                                    text={`${progress}%`}
                                                    styles={buildStyles({
                                                        textColor: '#0B4F6C',
                                                        pathColor: '#0B4F6C',
                                                        trailColor: '#e6e6e6',
                                                    })}
                                                />
                                            </div>
                                            <div>
                                                <h6>{course.code}</h6>
                                                <p className="text-muted small">{course.name}</p>
                                            </div>
                                        </div>
                                        <div className="topic-list mt-2">
                                            {course.topics.map((topic, idx) => (
                                                <Form.Check
                                                    key={idx}
                                                    type="checkbox"
                                                    label={topic}
                                                    checked={doneTopics[course.id]?.[idx] || false}
                                                    onChange={() => handleTopicToggle(course.id, idx)}
                                                    className="topic-check"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardHome;