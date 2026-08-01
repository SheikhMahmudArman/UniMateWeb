import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Badge } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendarCheck, faBookOpen, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { dailyRoutine, courses, quickStats } from '../data/mockData';
import './DashboardHome.css';

const DashboardHome = () => {
    const [routine, setRoutine] = useState(dailyRoutine);
    const [courseProgress, setCourseProgress] = useState(courses);

    const toggleNotify = (id) => {
        setRoutine(routine.map(item =>
            item.id === id ? { ...item, notify: !item.notify } : item
        ));
    };

    const toggleTopic = (courseId, topicIndex) => {
        setCourseProgress(prev => prev.map(course => {
            if (course.id === courseId) {
                const newTopics = [...course.topics];
                // Toggle: if the topic is done, we mark it as done by some logic.
                // We'll store done topics in a separate array in state or derive from progress.
                // We'll implement a simple toggle: we'll keep a separate done array for each course.
                // For simplicity, we'll use a Set of done topics per course.
                // I'll refactor to keep doneTopics array.
                // Let's add a done property to each topic.
                // Since we didn't store done status, we'll add it now.
                // We'll assume all topics initially not done.
                // We'll maintain a doneTopics array in state.
                // For brevity, I'll implement a simple toggle based on index.
                // We'll use a local state per course.
            }
            return course;
        }));
    };

    // We'll implement proper state management with done topics.
    // Let's restructure: course has topics and done array.
    // I'll create a new state variable for done topics.

    const [doneTopics, setDoneTopics] = useState(
        courses.reduce((acc, course) => {
            acc[course.id] = new Array(course.topics.length).fill(false);
            return acc;
        }, {})
    );

    const handleTopicToggle = (courseId, topicIndex) => {
        setDoneTopics(prev => {
            const newDone = { ...prev };
            newDone[courseId] = [...newDone[courseId]];
            newDone[courseId][topicIndex] = !newDone[courseId][topicIndex];
            return newDone;
        });
    };

    // Calculate progress for each course
    const getProgress = (courseId) => {
        const done = doneTopics[courseId] || [];
        const total = courses.find(c => c.id === courseId)?.topics.length || 0;
        if (total === 0) return 0;
        return Math.round((done.filter(Boolean).length / total) * 100);
    };

    return (
        <Container fluid className="dashboard-home">
            <Row>
                <Col>
                    <h2 className="page-title">Dashboard</h2>
                    <p className="text-muted">Welcome back! Here's your academic overview.</p>
                </Col>
            </Row>

            {/* Quick Stats */}
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

            {/* Daily Routine */}
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

                {/* Progressive Cycle */}
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