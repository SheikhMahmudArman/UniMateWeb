import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faClock,
    faCalendarCheck,
    faBookOpen,
    faChartLine,
    faUser,
    faBullhorn,
    faBook,
    faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import './DashboardHome.css';

const DashboardHome = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        stats: { upcoming_quizzes: 0, pending_assignments: 0, current_cgpa: 0 },
        notices: [],
        routine: [],
        courses: [],
        attendance: { percentage: 0, total: 0, present: 0 },
        library: { available_books: 0 }
    });
    const [doneTopics, setDoneTopics] = useState({});

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await api.get('/dashboard');
            if (response.data.success) {
                setDashboardData(response.data.data);
                // Initialize topic progress
                const topics = {};
                response.data.data.courses.forEach(course => {
                    topics[course.id] = new Array(course.topics?.length || 0).fill(false);
                });
                setDoneTopics(topics);
            }
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
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
        const course = dashboardData.courses.find(c => c.id === courseId);
        const total = course?.topics?.length || 0;
        if (total === 0) return 0;
        return Math.round((done.filter(Boolean).length / total) * 100);
    };

    if (loading) {
        return <div className="text-center py-5">Loading...</div>;
    }

    return (
        <Container fluid className="dashboard-home">
            {/* Header */}
            <Row>
                <Col>
                    <h2 className="page-title">Dashboard</h2>
                    <p className="text-muted">Welcome back, {user?.name}! Here's your academic overview.</p>
                </Col>
            </Row>

            {/* Quick Stats */}
            <Row className="stats-row">
                <Col md={4} className="mb-3">
                    <Card className="stat-card">
                        <Card.Body>
                            <div className="stat-icon"><FontAwesomeIcon icon={faCalendarCheck} /></div>
                            <h5>Upcoming Quizzes</h5>
                            <h2>{dashboardData.stats.upcoming_quizzes}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="stat-card">
                        <Card.Body>
                            <div className="stat-icon"><FontAwesomeIcon icon={faBookOpen} /></div>
                            <h5>Pending Assignments</h5>
                            <h2>{dashboardData.stats.pending_assignments}</h2>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={4} className="mb-3">
                    <Card className="stat-card">
                        <Card.Body>
                            <div className="stat-icon"><FontAwesomeIcon icon={faChartLine} /></div>
                            <h5>Current CGPA</h5>
                            <h2>{dashboardData.stats.current_cgpa}</h2>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Feature Summary Cards */}
            <Row className="mb-4">
                <Col md={4} className="mb-3">
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body className="text-center">
                            <div style={{ fontSize: '2rem', color: '#0B4F6C', marginBottom: '10px' }}>
                                <FontAwesomeIcon icon={faBullhorn} />
                            </div>
                            <h5>New Notices</h5>
                            <h2 className="fw-bold">{dashboardData.notices.length}</h2>
                            <Link to="/dashboard/notice-board" className="btn btn-outline-primary btn-sm mt-2">
                                View All <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>

                <Col md={4} className="mb-3">
                    <Card className="shadow-sm border-0 h-100">
                        <Card.Body className="text-center">
                            <div style={{ fontSize: '2rem', color: '#0B4F6C', marginBottom: '10px' }}>
                                <FontAwesomeIcon icon={faCalendarCheck} />
                            </div>
                            <h5>Attendance</h5>
                            <h2 className="fw-bold">
                                <span className={dashboardData.attendance.percentage}>
                                    {dashboardData.attendance.percentage}%
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
                            <div style={{ fontSize: '2rem', color: '#0B4F6C', marginBottom: '10px' }}>
                                <FontAwesomeIcon icon={faBookOpen} />
                            </div>
                            <h5>Library</h5>
                            <h3 className="fw-bold">{dashboardData.library.available_books} Available</h3>
                            <Link to="/dashboard/library" className="btn btn-outline-primary btn-sm mt-2">
                                Browse Books <FontAwesomeIcon icon={faArrowRight} className="ms-1" />
                            </Link>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Daily Routine + Topic Progress */}
            <Row className="mt-4">
                <Col lg={7}>
                    <Card className="routine-card">
                        <Card.Header>
                            <h5><FontAwesomeIcon icon={faClock} className="me-2" /> Daily Routine</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="routine-item">
                                <div>
                                    <strong>08:00 AM </strong>
                                    <span>Data Structures </span>
                                </div>
                                <span className="routine-status completed"> Completed</span>
                            </div>

                            <div className="routine-item">
                                <div>
                                    <strong>10:00 AM </strong>
                                    <span>Database Systems </span>
                                </div>
                                <span className="routine-status upcoming"> Upcoming</span>
                            </div>

                            <div className="routine-item">
                                <div>
                                    <strong>02:00 PM </strong>
                                    <span>Computer Networks </span>
                                </div>
                                <span className="routine-status upcoming"> Upcoming</span>
                            </div>

                            <div className="routine-item">
                                <div>
                                    <strong>04:00 PM </strong>
                                    <span>Web Engineering </span>
                                </div>
                                <span className="routine-status upcoming"> Upcoming</span>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={5}>
                    <Card className="progress-card">
                        <Card.Header>
                            <h5>Topic Progress</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="topic-progress-item">
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Data Structures</span>
                                    <strong>85%</strong>
                                </div>
                                <ProgressBar now={85} />
                            </div>

                            <div className="topic-progress-item">
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Database Systems</span>
                                    <strong>70%</strong>
                                </div>
                                <ProgressBar now={70} />
                            </div>

                            <div className="topic-progress-item">
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Computer Networks</span>
                                    <strong>60%</strong>
                                </div>
                                <ProgressBar now={60} />
                            </div>

                            <div className="topic-progress-item">
                                <div className="d-flex justify-content-between mb-1">
                                    <span>Web Engineering</span>
                                    <strong>90%</strong>
                                </div>
                                <ProgressBar now={90} />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardHome;