import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';  // <-- THIS WAS MISSING
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faCalendarCheck, faBookOpen, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { dailyRoutine, courses, quickStats } from '../data/mockData';
import './DashboardHome.css';

const DashboardHome = () => {
    const [routine, setRoutine] = useState(dailyRoutine);
    const [doneTopics, setDoneTopics] = useState(
        courses.reduce((acc, course) => {
            acc[course.id] = new Array(course.topics.length).fill(false);
            return acc;
        }, {})
    );

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

            {/* Quick Drive Link */}
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

            {/* Daily Routine + Progressive Cycle */}
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