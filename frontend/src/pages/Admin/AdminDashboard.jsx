import React, { useContext, useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
    faBook, faUserGroup, faChalkboardUser, faFile, 
    faPen, faBullhorn, faCalendarAlt, faClock, 
    faTasks, faClipboardList, faChartLine, faCheckDouble,
    faGraduationCap, faListCheck, faUser
} from '@fortawesome/free-solid-svg-icons';
import api from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [stats, setStats] = useState({
        students: 0,
        courses: 0,
        faculty: 0,
        documents: 0,
        notices: 0,
        routines: 0,
        quizzes: 0,
        assignments: 0,
        topics: 0,
        attendance: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [
                students, courses, faculty, documents, 
                notices, routines, quizzes, assignments, 
                topics, attendance
            ] = await Promise.all([
                api.get('/students'),
                api.get('/courses'),
                api.get('/faculty'),
                api.get('/documents'),
                api.get('/notices'),
                api.get('/routines'),
                api.get('/quizzes'),
                api.get('/assignments'),
                api.get('/topics'),
                api.get('/attendance'),
            ]);
            setStats({
                students: students.data.data?.length || 0,
                courses: courses.data.data?.length || 0,
                faculty: faculty.data.data?.length || 0,
                documents: documents.data.data?.length || 0,
                notices: notices.data.data?.length || 0,
                routines: routines.data.data?.length || 0,
                quizzes: quizzes.data.data?.length || 0,
                assignments: assignments.data.data?.length || 0,
                topics: topics.data.data?.length || 0,
                attendance: attendance.data.data?.length || 0,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const adminCards = [
        { title: 'Manage Courses', icon: faBook, path: '/dashboard/admin/courses', color: '#0B4F6C', count: stats.courses },
        { title: 'Manage Students', icon: faUserGroup, path: '/dashboard/admin/students', color: '#1A759F', count: stats.students },
        { title: 'Manage Faculty', icon: faChalkboardUser, path: '/dashboard/admin/faculty', color: '#F4A261', count: stats.faculty },
        { title: 'Manage Documents', icon: faFile, path: '/dashboard/admin/documents', color: '#E76F51', count: stats.documents },
        { title: 'Manage Marks', icon: faPen, path: '/dashboard/admin/marks', color: '#2A9D8F' },
        { title: 'Manage Notices', icon: faBullhorn, path: '/dashboard/admin/notices', color: '#6c757d', count: stats.notices },
        { title: 'Manage Routine', icon: faCalendarAlt, path: '/dashboard/admin/routine', color: '#E63946', count: stats.routines },
        { title: 'Manage Quizzes', icon: faClock, path: '/dashboard/admin/quizzes', color: '#FF6B6B', count: stats.quizzes },
        { title: 'Manage Assignments', icon: faTasks, path: '/dashboard/admin/assignments', color: '#4ECDC4', count: stats.assignments },
        { title: 'Manage Topics', icon: faListCheck, path: '/dashboard/admin/topics', color: '#45B7D1', count: stats.topics },
        { title: 'Manage Attendance', icon: faCheckDouble, path: '/dashboard/admin/attendance', color: '#96CEB4', count: stats.attendance },
        { title: 'Student CGPA', icon: faGraduationCap, path: '/dashboard/admin/cgpa', color: '#DDA0DD' },
    ];

    return (
        <Container fluid className="admin-dashboard">
            <h2 className="page-title">👑 Admin Panel</h2>
            <p className="text-muted">Welcome, {user?.name}. Manage all aspects of the system.</p>
            
            {/* Stats Summary Row */}
            <Row className="mt-4 mb-4">
                <Col md={3} sm={6} className="mb-3">
                    <Card className="stat-card text-center">
                        <Card.Body>
                            <h3 className="stat-number">{stats.students}</h3>
                            <p className="stat-label">Total Students</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} sm={6} className="mb-3">
                    <Card className="stat-card text-center">
                        <Card.Body>
                            <h3 className="stat-number">{stats.courses}</h3>
                            <p className="stat-label">Total Courses</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} sm={6} className="mb-3">
                    <Card className="stat-card text-center">
                        <Card.Body>
                            <h3 className="stat-number">{stats.faculty}</h3>
                            <p className="stat-label">Total Faculty</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={3} sm={6} className="mb-3">
                    <Card className="stat-card text-center">
                        <Card.Body>
                            <h3 className="stat-number">{stats.documents}</h3>
                            <p className="stat-label">Total Documents</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                {adminCards.map((card, idx) => (
                    <Col key={idx} md={4} lg={3} className="mb-4">
                        <Link to={card.path} className="admin-card-link">
                            <Card className="admin-card" style={{ borderTop: `4px solid ${card.color}` }}>
                                <Card.Body className="text-center">
                                    <FontAwesomeIcon icon={card.icon} className="admin-card-icon" style={{ color: card.color }} />
                                    <h5>{card.title}</h5>
                                    {card.count !== undefined && (
                                        <span className="badge bg-secondary">{card.count}</span>
                                    )}
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default AdminDashboard;